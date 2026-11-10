import { parseArgs } from 'node:util';
import { readFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { resolve } from 'node:path';
import { root, isMain, projectFile, previewURL, cli, report } from './common.mjs';

const hash = text => createHash('sha256').update(text).digest('hex');
export function decodeRawModule(body) {
  const match = body.match(/^\s*export default\s+("(?:[^"\\]|\\.)*")\s*;?/);
  if (!match) throw new Error('The server did not return a Vite raw source module.');
  return JSON.parse(match[1]);
}
/** @param {{url?:string,source?:string,selector?:string,contains?:string,timeout?:number}} options */
export async function inspectPreview({ url, source, selector, contains, timeout = 15000 }) {
  const base = previewURL(url);
  const get = async path => {
    const response = await fetch(new URL(path, base), { signal: AbortSignal.timeout(timeout), cache: 'no-store' });
    if (!response.ok) throw new Error(`Preview request failed: ${path} (${response.status})`);
    return response;
  };
  const result = { url: base.href, reachable: false, identity: 'unverified', checks: [], warnings: [] };
  const home = await get(base.pathname + base.search);
  const html = await home.text(); result.reachable = true;
  result.viteClient = html.includes('/@vite/client');
  try {
    const response = await get('/__lwm_dev_info');
    const info = await response.json();
    if (info.app !== 'live-with-me' || typeof info.root !== 'string') throw new Error('Missing project identity.');
    const sameRoot = resolve(info.root).toLowerCase() === root.toLowerCase();
    result.identity = sameRoot ? 'verified' : 'wrong-project';
    result.server = info;
    if (!sameRoot) throw new Error(`This URL serves another project: ${info.root}`);
  } catch (error) {
    if (result.identity === 'wrong-project') throw error;
    result.warnings.push('Project root / HMR state could not be verified. Production preview has no dev metadata endpoint.');
  }
  if (result.server?.hmr === false) result.warnings.push('HMR is disabled; reloading alone does not guarantee fresh transformed modules.');
  if (source) {
    if (result.identity !== 'verified') throw new Error('Source freshness requires a verified development server.');
    const file = projectFile(source);
    const local = await readFile(file.absolute, 'utf8');
    const remote = decodeRawModule(await (await get('/' + file.local.split('/').map(encodeURIComponent).join('/') + '?raw')).text());
    const fresh = hash(local) === hash(remote);
    result.checks.push({ kind: 'source', file: file.local, fresh, localHash: hash(local), servedHash: hash(remote) });
    if (!fresh) throw new Error(`The server is returning stale source for ${file.local}.`);
  }
  if (contains && !selector) throw new Error('--contains requires --selector and checks the rendered target HTML.');
  if (selector) {
    if (result.identity === 'wrong-project') throw new Error('Refusing to inspect an unrelated project.');
    const { chromium } = await import('@playwright/test');
    const browser = await chromium.launch({ channel: 'msedge', headless: true });
    try {
      const page = await browser.newPage(); const errors = [];
      page.on('pageerror', error => errors.push(error.message));
      await page.goto(base.href, { waitUntil: 'domcontentloaded', timeout });
      const target = page.locator(selector); await target.first().waitFor({ state: 'visible', timeout });
      const count = await target.count(), marker = !contains || (await target.first().evaluate(el => el.outerHTML)).includes(contains);
      result.checks.push({ kind: 'dom', selector, count, contains: contains ?? null, markerFound: marker, errors });
      if (!marker || errors.length) throw new Error('The rendered marker is missing or the page reported runtime errors.');
    } finally { await browser.close(); }
  }
  return result;
}
export async function main(args = process.argv.slice(2)) {
  const { values } = parseArgs({ args, options: { url: { type: 'string' }, source: { type: 'string' },
    selector: { type: 'string' }, contains: { type: 'string' }, timeout: { type: 'string', default: '60000' }, help: { type: 'boolean' } } });
  if (values.help) return console.log('npm run dev:inspect -- [--url http://127.0.0.1:3000/] [--source src/path.tsx] [--selector "#asset"] [--contains marker]');
  const timeout = Number(values.timeout);
  if (!Number.isFinite(timeout) || timeout <= 0) throw new Error('Invalid timeout.');
  report(await inspectPreview({ ...values, timeout }));
}
if (isMain(import.meta.url)) await cli(main);
