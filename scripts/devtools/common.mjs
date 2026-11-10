import { fileURLToPath } from 'node:url';
import { dirname, isAbsolute, relative, resolve } from 'node:path';

export const root = resolve(dirname(fileURLToPath(import.meta.url)), '../..');
export const isMain = url => !!process.argv[1] && resolve(process.argv[1]) === fileURLToPath(url);
export function projectFile(file) {
  const absolute = resolve(root, file), local = relative(root, absolute);
  if (!local || local === '..' || local.startsWith('../') || local.startsWith('..\\') || isAbsolute(local))
    throw new Error(`Expected a file inside this project: ${file}`);
  return { absolute, local: local.replaceAll('\\', '/') };
}
export function previewURL(value = 'http://127.0.0.1:3000/') {
  const url = new URL(value);
  if (!['http:', 'https:'].includes(url.protocol) || !['localhost', '127.0.0.1', '[::1]'].includes(url.hostname))
    throw new Error('Use a local HTTP preview URL.');
  return url;
}
export const report = value => console.log(JSON.stringify(value, null, 2));
export async function cli(main) {
  try { await main(); } catch (error) { console.error(error.message); process.exitCode = 1; }
}
