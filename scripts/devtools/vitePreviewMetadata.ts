import type { Plugin } from 'vite';

/** Read-only development identity, absent from the production bundle/preview. */
export function previewMetadata(): Plugin {
  return { name: 'live-with-me-preview-identity', apply: 'serve', configureServer(server) {
    server.middlewares.use((req, res, next) => {
      if (req.url?.split('?')[0] !== '/__lwm_dev_info') return next();
      if (req.method !== 'GET') { res.statusCode = 405; res.end(); return; }
      res.setHeader('Content-Type', 'application/json; charset=utf-8');
      res.setHeader('Cache-Control', 'no-store');
      res.end(JSON.stringify({ app: 'live-with-me', root: server.config.root,
        mode: 'development', hmr: server.config.server.hmr !== false, port: server.config.server.port }));
    });
  } };
}
