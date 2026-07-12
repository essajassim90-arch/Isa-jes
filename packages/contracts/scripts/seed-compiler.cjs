#!/usr/bin/env node
/**
 * Seed the Hardhat compiler cache from the locally installed `solc` npm package.
 * This avoids any network download from binaries.soliditylang.org, making
 * compilation work in sandboxed / air-gapped / CI environments.
 *
 * Hardhat tries the native platform binary first (e.g. linux-amd64), then falls
 * back to the WASM (solcjs) build.  We seed both:
 *
 *   <cache>/compilers-v2/linux-amd64/list.json            <- so lookup succeeds
 *   <cache>/compilers-v2/linux-amd64/<native-binary>      <- empty placeholder
 *   <cache>/compilers-v2/linux-amd64/<native-binary>.does.not.work  <- signals fallback
 *   <cache>/compilers-v2/wasm/list.json                   <- so WASM lookup succeeds
 *   <cache>/compilers-v2/wasm/soljson-v<longVer>.js       <- real compiler from npm
 */
'use strict'

const fs = require('fs')
const path = require('path')

// ── Resolve solc from the monorepo root node_modules ─────────────────────────
const solcPkgPath = require.resolve('solc/package.json')
const solcDir = path.dirname(solcPkgPath)
const soljsonSrc = path.join(solcDir, 'soljson.js')

const solcPkg = JSON.parse(fs.readFileSync(solcPkgPath, 'utf8'))
const shortVersion = solcPkg.version // e.g. "0.8.26"

// Load solc to get the full version string that includes the commit hash.
// eslint-disable-next-line @typescript-eslint/no-require-imports
const solc = require('solc')
const rawVersion = solc.version() // "0.8.26+commit.8a97fa7a.Emscripten.clang"
const longVersion = rawVersion.split('.Emscripten')[0].split('.emscripten')[0]
// longVersion => "0.8.26+commit.8a97fa7a"
const commitHash = longVersion.split('+commit.')[1] ?? '00000000'

// ── Resolve Hardhat cache dir the same way Hardhat itself does ────────────────
let cacheBase
try {
  const envPaths = require('env-paths')
  const paths = envPaths('hardhat')
  cacheBase = path.join(paths.cache, 'compilers-v2')
} catch {
  cacheBase = path.join(require('os').homedir(), '.cache', 'hardhat-nodejs', 'compilers-v2')
}

// ── Helpers ───────────────────────────────────────────────────────────────────
function ensureList(dir, buildPath) {
  fs.mkdirSync(dir, { recursive: true })
  const listPath = path.join(dir, 'list.json')
  let list = { builds: [], releases: {}, latestRelease: shortVersion }
  if (fs.existsSync(listPath)) {
    try { list = JSON.parse(fs.readFileSync(listPath, 'utf8')) } catch { /* corrupt – reset */ }
  }
  if (!Array.isArray(list.builds)) list.builds = []
  if (!list.releases) list.releases = {}

  const exists = list.builds.some((b) => b.longVersion === longVersion)
  if (!exists) {
    list.builds.push({
      path: buildPath,
      version: shortVersion,
      build: `commit.${commitHash}`,
      longVersion,
      // keccak256 is only verified by Hardhat's download path, not the cache-hit path.
      keccak256: '0x0000000000000000000000000000000000000000000000000000000000000000',
      sha256: '0x0000000000000000000000000000000000000000000000000000000000000000',
      urls: [],
    })
    list.releases[shortVersion] = buildPath
    list.latestRelease = shortVersion
    fs.writeFileSync(listPath, JSON.stringify(list, null, 2))
    console.log(`[seed-compiler] Updated ${listPath}`)
  }
}

// ── 1. Native platform (linux-amd64) ─────────────────────────────────────────
// Seed list.json + a placeholder binary + a .does.not.work marker so that
// Hardhat sees it as "downloaded but broken" and falls through to WASM.
const nativeDir = path.join(cacheBase, 'linux-amd64')
const nativeBuildPath = `solc-linux-amd64-v${longVersion}`
ensureList(nativeDir, nativeBuildPath)

const nativeBin = path.join(nativeDir, nativeBuildPath)
if (!fs.existsSync(nativeBin)) {
  fs.writeFileSync(nativeBin, '')
  console.log(`[seed-compiler] Created native placeholder: ${nativeBin}`)
}
const nativeDNW = `${nativeBin}.does.not.work`
if (!fs.existsSync(nativeDNW)) {
  fs.writeFileSync(nativeDNW, '')
  console.log(`[seed-compiler] Marked native as non-functional: ${nativeDNW}`)
}

// ── 2. WASM / solcjs ─────────────────────────────────────────────────────────
// Copy the real soljson.js from the npm solc package into the WASM cache dir.
const wasmDir = path.join(cacheBase, 'wasm')
const wasmBuildPath = `soljson-v${longVersion}.js`
ensureList(wasmDir, wasmBuildPath)

const wasmDest = path.join(wasmDir, wasmBuildPath)
if (!fs.existsSync(wasmDest)) {
  fs.copyFileSync(soljsonSrc, wasmDest)
  console.log(`[seed-compiler] Cached solcjs v${longVersion}`)
} else {
  console.log(`[seed-compiler] solcjs v${longVersion} already cached`)
}
