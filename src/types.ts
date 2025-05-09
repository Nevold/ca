const { IncomingMessage, ServerResponse } = require('http');

interface Item {
  id: string;
  name?: string;
  description?: string;
  [key: string]: unknown;
}

interface Database {
  [key: string]: Item;
}

export type Handler = (
  req: typeof IncomingMessage,
  res: typeof ServerResponse,
  params?: Record<string, string>,
) => Promise<void> | void;

interface Route {
  [method: string]: Handler;
}

interface Router {
  [path: string]: Route;
}

export type { Router, Route, Database, Item };
