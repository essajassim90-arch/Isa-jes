#!/usr/bin/env bash
# validate-e2e.sh — End-to-end validation for NAMA Protocol on VeChainThor Testnet
#
# Usage:
#   API_URL=http://localhost:3001 \
#   DPP_CONTRACT_ADDRESS=0x... \
#   MARKETPLACE_CONTRACT_ADDRESS=0x... \
#   bash scripts/validate-e2e.sh
#
# Exit codes:
#   0  — all checks passed (NAMA is live and healthy)
#   1  — one or more checks failed

set -euo pipefail

API_URL="${API_URL:-http://localhost:3001}"
THOR_URL="${THOR_URL:-https://testnet.vechain.org}"
DPP_CONTRACT_ADDRESS="${DPP_CONTRACT_ADDRESS:-}"
MARKETPLACE_CONTRACT_ADDRESS="${MARKETPLACE_CONTRACT_ADDRESS:-}"

PASS=0
FAIL=0

ok()   { echo "  ✅ $*"; PASS=$((PASS + 1)); }
fail() { echo "  ❌ $*"; FAIL=$((FAIL + 1)); }

require_cmd() {
  command -v "$1" >/dev/null 2>&1 || { echo "ERROR: required command '$1' not found"; exit 1; }
}

require_cmd curl

echo ""
echo "════════════════════════════════════════════════"
echo "  NAMA Protocol — End-to-End Validation"
echo "  API:         $API_URL"
echo "  Thor:        $THOR_URL"
echo "════════════════════════════════════════════════"
echo ""

# ── 1. API health ──────────────────────────────────────────────────────────────

echo "── 1. API health"
HEALTH_RESP=$(curl -sf --max-time 10 "$API_URL/health" 2>&1) && \
  ok "GET /health → $HEALTH_RESP" || \
  fail "GET /health failed (is the API running at $API_URL?)"

# ── 2. DPP API endpoint ────────────────────────────────────────────────────────

echo ""
echo "── 2. DPP endpoint"
DPP_RESP=$(curl -sf --max-time 10 "$API_URL/dpp" 2>&1) && \
  ok "GET /dpp returned data" || \
  fail "GET /dpp failed"

# ── 3. Marketplace API endpoint ───────────────────────────────────────────────

echo ""
echo "── 3. Marketplace endpoint"
MP_RESP=$(curl -sf --max-time 10 "$API_URL/marketplace" 2>&1) && \
  ok "GET /marketplace returned data" || \
  fail "GET /marketplace failed"

# ── 4. VeChainThor node reachability ──────────────────────────────────────────

echo ""
echo "── 4. VeChainThor node reachability"
THOR_RESP=$(curl -sf --max-time 10 "$THOR_URL/blocks/best" 2>&1) && \
  ok "Thor node is reachable" || \
  fail "Thor node unreachable at $THOR_URL"

# ── 5. DPP contract on-chain ──────────────────────────────────────────────────

echo ""
echo "── 5. DPP contract on-chain"
if [ -z "$DPP_CONTRACT_ADDRESS" ]; then
  fail "DPP_CONTRACT_ADDRESS not set — skipping on-chain check"
else
  DPP_ONCHAIN=$(curl -sf --max-time 10 \
    "$THOR_URL/accounts/$DPP_CONTRACT_ADDRESS" 2>&1) && \
    ok "DPP contract exists at $DPP_CONTRACT_ADDRESS" || \
    fail "DPP contract not found at $DPP_CONTRACT_ADDRESS"
fi

# ── 6. Marketplace contract on-chain ──────────────────────────────────────────

echo ""
echo "── 6. Marketplace contract on-chain"
if [ -z "$MARKETPLACE_CONTRACT_ADDRESS" ]; then
  fail "MARKETPLACE_CONTRACT_ADDRESS not set — skipping on-chain check"
else
  MP_ONCHAIN=$(curl -sf --max-time 10 \
    "$THOR_URL/accounts/$MARKETPLACE_CONTRACT_ADDRESS" 2>&1) && \
    ok "Marketplace contract exists at $MARKETPLACE_CONTRACT_ADDRESS" || \
    fail "Marketplace contract not found at $MARKETPLACE_CONTRACT_ADDRESS"
fi

# ── Summary ───────────────────────────────────────────────────────────────────

echo ""
echo "════════════════════════════════════════════════"
echo "  Results: $PASS passed, $FAIL failed"
if [ "$FAIL" -eq 0 ]; then
  echo "  🎉 NAMA is live on VeChainThor Testnet!"
else
  echo "  ⚠️  $FAIL check(s) failed — review output above"
fi
echo "════════════════════════════════════════════════"
echo ""

exit "$FAIL"
