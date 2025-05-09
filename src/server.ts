import 'dotenv/config';
import http from 'http';
import { URL } from 'url';
// import { findRouteHandler } from './router';
// import { sendResponse } from './utils';

const server = http.createServer(async (req, res) => {
  // try {
  //   const url = new URL(req.url || '', `http://${req.headers.host}`);
  //   const path = url.pathname;
  //   const method = req.method?.toUpperCase() || '';
  //   const route = findRouteHandler(method, path);
  //   if (route) {
  //     await route.handler(req, res, route.params);
  //   } else {
  //     sendResponse(res, 404, { error: 'Not Found' });
  //   }
  // } catch (error) {
  //   console.error('Server error:', error);
  //   sendResponse(res, 500, { error: 'Internal Server Error' });
  // }
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

process.on('SIGINT', () => {
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});
