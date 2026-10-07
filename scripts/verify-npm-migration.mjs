import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

// Temporary migration gate; it deliberately rejects later dependency upgrades.
const root = fileURLToPath(new URL('../', import.meta.url));
const readJson = (path) => JSON.parse(readFileSync(resolve(root, path), 'utf8'));
const baseline = readJson('docs/architecture/npm-migration-baseline.json');
const lock = readJson('package-lock.json');
const manifestHash = createHash('sha256')
  .update(readFileSync(resolve(root, 'package.json'), 'utf8').replace(/\r\n/g, '\n')).digest('hex');

assert.equal(manifestHash, baseline.manifestNormalizedSha256, 'package.json changed during tooling migration');
assert.equal(lock.lockfileVersion, 3);
for (const [path, version] of Object.entries(baseline.installedVersions)) {
  assert.equal(lock.packages[path]?.version, version, `Dependency changed: ${path}`);
}
for (const [name, { version }] of Object.entries(baseline.direct)) {
  assert.equal(lock.packages[`node_modules/${name}`]?.version, version, `Direct dependency changed: ${name}`);
}

const entries = Object.entries(lock.packages).filter(([path]) => path !== '');
const additions = entries.filter(([path]) => !(path in baseline.installedVersions));
for (const [path, pkg] of entries) {
  assert.ok(pkg.version && pkg.resolved && pkg.integrity, `Incomplete package metadata: ${path}`);
  assert.ok(pkg.resolved.startsWith('https://registry.npmjs.org/'), `Unexpected package source: ${path}`);
}
for (const [path, pkg] of additions) {
  assert.equal(pkg.optional, true, `Unexpected non-optional addition: ${path}`);
}

// AI Studio's Linux installation needs the native alternatives, even on Windows.
for (const [parent, child] of [
  ['node_modules/esbuild', '@esbuild/linux-x64'],
  ['node_modules/tsx/node_modules/esbuild', '@esbuild/linux-x64'],
  ['node_modules/rollup', '@rollup/rollup-linux-x64-gnu'],
  ['node_modules/rollup', '@rollup/rollup-linux-x64-musl'],
  ['node_modules/@tailwindcss/oxide', '@tailwindcss/oxide-linux-x64-gnu'],
  ['node_modules/@tailwindcss/oxide', '@tailwindcss/oxide-linux-x64-musl'],
  ['node_modules/lightningcss', 'lightningcss-linux-x64-gnu'],
  ['node_modules/lightningcss', 'lightningcss-linux-x64-musl'],
]) {
  const dependencyVersion = lock.packages[parent]?.optionalDependencies?.[child];
  assert.ok(dependencyVersion, `Missing platform dependency declaration: ${parent} -> ${child}`);
  const nestedPath = `${parent}/node_modules/${child}`;
  const siblingPath = `${parent.slice(0, parent.lastIndexOf('node_modules/') + 'node_modules/'.length)}${child}`;
  const pkg = lock.packages[nestedPath] ?? lock.packages[siblingPath];
  assert.ok(pkg, `Missing platform package: ${child}`);
  assert.equal(pkg.version, dependencyVersion, `Platform binary version mismatch: ${child}`);
}

let installedCount;
if (process.argv[2]) {
  const installedRoot = resolve(process.argv[2]);
  const installed = JSON.parse(readFileSync(resolve(installedRoot, 'node_modules/.package-lock.json'), 'utf8'));
  for (const [path, version] of Object.entries(baseline.installedVersions)) {
    assert.equal(installed.packages[path]?.version, version, `Fresh installation differs: ${path}`);
    const actual = JSON.parse(readFileSync(resolve(installedRoot, path, 'package.json'), 'utf8'));
    assert.equal(actual.version, version, `Installed package differs: ${path}`);
  }
  installedCount = Object.keys(installed.packages).length;
}
console.log(JSON.stringify({
  status: 'passed', baseCommit: baseline.baseCommit,
  preservedDirectPackages: Object.keys(baseline.direct).length,
  preservedInstalledPackages: Object.keys(baseline.installedVersions).length,
  optionalAdditions: additions.length, lockPackages: entries.length,
  freshInstalledPackages: installedCount,
  platformRuntimeGate: 'AI Studio import and execution still pending',
}, null, 2));
