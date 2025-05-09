import { Handler, Item, Router } from './types.ts';
import { createItem, getItem, getAllItems, updateItem, deleteItem } from './database.ts';
import { parseJSONBody, parseUrlParams, sendResponse } from './utils.ts';

const routes: Router = {
  '/items': {
    POST: async (req, res) => {
      const data = await parseJSONBody<{ name: string; description?: string }>(req);
      if (!data?.name) {
        return sendResponse(res, 400, { error: 'Name is required' });
      }
      const newItem = createItem(data);
      sendResponse(res, 201, newItem);
    },
    GET: (_, res) => {
      const items = getAllItems();
      sendResponse(res, 200, items);
    },
  },
  '/items/:id': {
    GET: (_, res, params) => {
      const item = getItem(params!.id);
      if (!item) {
        return sendResponse(res, 404, { error: 'Item not found' });
      }
      sendResponse(res, 200, item);
    },
    PUT: async (req, res, params) => {
      const data = await parseJSONBody<Partial<Item>>(req);
      if (!data?.name) {
        return sendResponse(res, 400, { error: 'Name is required' });
      }
      const updatedItem = updateItem(params!.id, data);
      if (!updatedItem) {
        return sendResponse(res, 404, { error: 'Item not found' });
      }
      sendResponse(res, 200, updatedItem);
    },
    DELETE: (_, res, params) => {
      const success = deleteItem(params!.id);
      if (!success) {
        return sendResponse(res, 404, { error: 'Item not found' });
      }
      sendResponse(res, 204);
    },
  },
};

export const findRouteHandler = (
  method: string,
  path: string,
): { handler: Handler; params: Record<string, string> } | null => {
  for (const [routePath, route] of Object.entries(routes)) {
    const params = parseUrlParams(path, routePath);
    if (params !== null && route[method]) {
      return { handler: route[method], params };
    }
  }
  return null;
};
