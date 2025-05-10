import { IncomingMessage, ServerResponse } from 'http';

export interface Item {
  id: string;
  name: string;
  age: number;
  hobbies: Array<string>;
}

export interface Database {
  [key: string]: Item;
}

export type Handler = (
  req: IncomingMessage,
  res: ServerResponse,
  params?: Record<string, string>,
) => Promise<void> | void;

export interface Route {
  [method: string]: Handler;
}

export interface Router {
  [path: string]: Route;
}
