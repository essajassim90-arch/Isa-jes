# NAMA Testnet Deployment Runbook

## Purpose

This runbook completes the Phase 3A deployment-infrastructure work for the first VeChainThor Testnet deployment without changing product logic, contracts, or UI behavior.

---

## Deployment architecture

### Components

1. **Contracts deployer**
   - Runs from `packages/contracts`
   - Uses Hardhat Ignition against `vechain_testnet`
   - Requires `DEPLOYER_PRIVATE_KEY`

2. **Frontend**
   - Static build from `apps/web`
   - Reads `VITE_CONTRACT_DPP` and `VITE_CONTRACT_MARKETPLACE` at build time

3. **API**
   - Runs from `apps/api`
   - Serves REST endpoints and reads projection data from SQLite
   - Requires `JWT_SECRET`
   - Reads the projection database from `PROJECTION_DB_PATH`

4. **Indexer**
   - Runs from `apps/indexer`
   - Polls VeChainThor and writes the projection database
   - Requires `DPP_CONTRACT_ADDRESS` and `MARKETPLACE_CONTRACT_ADDRESS`
   - Writes to `DB_PATH`

5. **Shared SQLite projection database**
   - Single-writer database owned by the indexer
   - Read by the API in read-only mode

### Recommended topology

```text
VeChainThor Testnet
        │
        ▼
  apps/indexer  ───── writes ─────►  shared SQLite volume
        │                                  │
        │                                  ▼
        └──────────── status/logs      apps/api (read-only)
                                           │
                                           ▼
                                     reverse proxy / public HTTPS

apps/web build reads contract addresses from env at build time
packages/contracts deploys contracts and produces deployed addresses
```

---

## Co-location and shared-volume strategy

### Required rule

The API and indexer **must be co-located with the same persistent volume** because the API reads the same SQLite projection database file that the indexer writes.

### Supported strategy

- Run **one indexer process** and **one API process** on the **same VM**, **same Docker host**, or **same container task/pod**
- Mount a single persistent directory such as:
  - `/var/lib/nama/projections`
- Configure:
  - `DB_PATH=/var/lib/nama/projections/projections.db`
  - `CHECKPOINT_PATH=/var/lib/nama/projections/checkpoints.json`
  - `PROJECTION_DB_PATH=/var/lib/nama/projections/projections.db`

### Not recommended

- Separate hosts without a shared low-latency persistent volume
- Horizontal scaling of multiple indexer writers
- Serverless/stateless container platforms without persistent shared storage

SQLite is acceptable for first testnet deployment only when kept as a **single-writer, co-located deployment**.

---

## Hosting recommendations

| Option | Recommendation | Notes |
|--------|----------------|-------|
| VPS | **Best first testnet option** | Simplest way to co-locate API + indexer + shared volume |
| Docker on VPS | **Recommended** | Use one host, two containers, one bind mount or named volume |
| Managed container platform | **Conditional** | Only if both services run in one task/pod with a shared persistent volume |

### VPS recommendation

- Ubuntu 22.04+ VM
- 2 vCPU minimum
- 4 GB RAM minimum
- Persistent disk mounted at `/var/lib/nama/projections`
- `systemd` or Docker Compose for process supervision

### Docker recommendation

- One host
- Separate API and indexer containers
- Shared bind mount or named volume
- Reverse proxy in front of API if exposed publicly

### Container deployment recommendation

- Single ECS task, Nomad group, or Kubernetes pod
- Shared `ReadWriteOnce` persistent volume
- Indexer mounted read-write
- API mounted read-only where supported, otherwise same mounted path with app-level read-only access
- Do **not** scale the indexer replica count above 1

---

## Secret and environment handling

### `JWT_SECRET`

- Used only by `apps/api`
- Required in every non-development deployment
- Must be provided through environment variables or secret managers
- Must not be committed to the repository

Example:

```bash
JWT_SECRET=replace-with-strong-random-value
```

### `DEPLOYER_PRIVATE_KEY`

- Used only for contract deployment from `packages/contracts`
- Store only in local secure shell environment or CI secret storage
- Never place a real key in `.env.example`
- Use a dedicated VeChainThor Testnet wallet

Example:

```bash
DEPLOYER_PRIVATE_KEY=<testnet-only-private-key>
```

---

## Contract address propagation

After deployment, propagate the resulting addresses to all consumers:

1. **Shared constants**
   - Update `/home/runner/work/Isa-jes/Isa-jes/packages/shared/src/constants/vechain.ts`
   - Set:
     - `TESTNET_CONTRACT_ADDRESSES.DPP`
     - `TESTNET_CONTRACT_ADDRESSES.Marketplace`

2. **Frontend build**
   - Set:
     - `VITE_CONTRACT_DPP`
     - `VITE_CONTRACT_MARKETPLACE`

3. **Indexer runtime**
   - Set:
     - `DPP_CONTRACT_ADDRESS`
     - `MARKETPLACE_CONTRACT_ADDRESS`

The frontend and API consume shared constants, while the indexer uses runtime environment variables so it can be reconfigured without rebuilding.

---

## Deployment runbook

### 1. Validate the repository

Run from `/home/runner/work/Isa-jes/Isa-jes`:

```bash
VITE_WC_PROJECT_ID=dummy VITE_PRIVY_APP_ID=dummy VITE_PRIVY_CLIENT_ID=dummy npm run lint --workspace=@nama/web
npx tsc -p apps/web/tsconfig.app.json --noEmit
VITE_WC_PROJECT_ID=dummy VITE_PRIVY_APP_ID=dummy VITE_PRIVY_CLIENT_ID=dummy npm run build --workspace=@nama/web
npm run compile --workspace=@nama/contracts
npm run test --workspace=@nama/contracts
npm run lint --workspace=@nama/api
npx tsc --project apps/api/tsconfig.json
npm run lint --workspace=@nama/indexer
npm run type-check --workspace=@nama/indexer
npm run build --workspace=@nama/indexer
npm run build --workspace=@nama/iot-simulation
```

### 2. Prepare secrets and runtime directories

- Provision a funded VeChainThor Testnet deployer wallet
- Set `DEPLOYER_PRIVATE_KEY`
- Set `JWT_SECRET`
- Create the projection data directory:

```bash
sudo mkdir -p /var/lib/nama/projections
sudo chown -R "$USER":"$USER" /var/lib/nama/projections
```

### 3. Deploy contracts

Run from `/home/runner/work/Isa-jes/Isa-jes/packages/contracts`:

```bash
npm run ignition:validate
npx hardhat ignition deploy ignition/modules/DPP.ts --network vechain_testnet
npx hardhat ignition deploy ignition/modules/Marketplace.ts --network vechain_testnet
```

Record the deployed addresses from:

```text
ignition/deployments/<deployment-id>/deployed_addresses.json
```

### 4. Propagate contract addresses

- Update shared constants
- Set frontend env vars
- Set indexer env vars

### 5. Start the indexer

From `/home/runner/work/Isa-jes/Isa-jes`:

```bash
THOR_URL=https://testnet.vechain.org \
CHAIN_ID=39 \
DPP_CONTRACT_ADDRESS=0x... \
MARKETPLACE_CONTRACT_ADDRESS=0x... \
DB_PATH=/var/lib/nama/projections/projections.db \
CHECKPOINT_PATH=/var/lib/nama/projections/checkpoints.json \
npm run start --workspace=@nama/indexer
```

### 6. Start the API

From `/home/runner/work/Isa-jes/Isa-jes`:

```bash
JWT_SECRET=replace-with-strong-random-value \
PROJECTION_DB_PATH=/var/lib/nama/projections/projections.db \
node --import tsx/esm apps/api/src/index.ts
```

### 7. Verify runtime health

- Confirm the API health endpoint returns success:

```bash
curl http://localhost:3001/health
```

- Confirm the indexer logs show startup and polling
- Confirm the SQLite files exist in `/var/lib/nama/projections`
- Confirm API endpoints return projection-backed data after on-chain activity appears

---

## Remaining blockers after Phase 3A

1. Contracts still need an actual first testnet deployment
2. Real testnet addresses still need to be propagated after deployment
3. Production-grade secrets must still be provisioned in the chosen host or CI system
4. Final host provisioning is still required because this phase documents and validates infrastructure but does not execute deployment
