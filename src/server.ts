import 'dotenv/config';
import http from 'http';
import { URL } from 'url';
import { findRouteHandler } from './router.ts';
import { Utils } from './utils.ts';

export const server = http.createServer(async (req, res) => {
  try {
    const url = new URL(req.url || '', `http://${req.headers.host}`);
    const path = url.pathname;
    const method = req.method?.toUpperCase() || '';
    const route = findRouteHandler(method, path);
    if (route) {
      await route.handler(req, res, route.params);
    } else {
      Utils.sendResponse(res, 404, { error: 'Not Found' });
    }
  } catch (error) {
    console.error('Server error:', error);
    Utils.sendResponse(res, 500, { error: 'Internal Server Error' });
  }
});

const PORT = process.env.PORT || 3000;

server.listen(Number(PORT), 'localhost', (error?: Error) => {
  return error ? console.log(error) : console.log(`Server running on http://localhost:${PORT}`);
});

process.on('SIGINT', () => {
  console.log('Server closed');
  server.close(() => {
    process.exit(0);
  });
});
