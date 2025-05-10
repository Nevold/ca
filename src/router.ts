import { Handler, Item, Router } from './types.ts';
import { createItem, getItem, getAllItems, updateItem, deleteItem } from './database.ts';
import { parseJSONBody, parseUrlParams, Utils } from './utils.ts';
import { validate as uuidValidate } from 'uuid';

const routes: Router = {
  '/users': {
    POST: async (req, res) => {
      const data = await parseJSONBody<Item>(req);
      if (!data) {
        return Utils.sendResponse(res, 400, { error: 'User fields are required' });
      }
      if (!data?.username) {
        return Utils.sendResponse(res, 400, { error: 'Username is required' });
      } else if (!data?.age) {
        return Utils.sendResponse(res, 400, { error: 'Age is required' });
      } else if (!data?.hobbies) {
        return Utils.sendResponse(res, 400, { error: 'Hobbies is required' });
      }
      const newItem = createItem(data);
      Utils.sendResponse(res, 201, newItem);
    },
    GET: (_, res) => {
      const items = getAllItems();
      Utils.sendResponse(res, 200, items);
    },
  },
  '/users/:id': {
    GET: (_, res, params) => {
      if (params) {
        if (!uuidValidate(params.id)) {
          return Utils.sendResponse(res, 400, { error: 'Invalid User ID' });
        }
        const user = getItem(params.id);
        if (!user) {
          return Utils.sendResponse(res, 404, { error: "User doesn't exist" });
        }
        Utils.sendResponse(res, 200, user);
      }
    },
    PUT: async (req, res, params) => {
      const data = await parseJSONBody<Partial<Item>>(req);
      if (!data?.username) {
        return Utils.sendResponse(res, 400, { error: 'Name is required' });
      }
      const updatedItem = updateItem(params!.id, data);
      if (!updatedItem) {
        return Utils.sendResponse(res, 404, { error: 'Item not found' });
      }
      Utils.sendResponse(res, 200, updatedItem);
    },
    DELETE: (_, res, params) => {
      const success = deleteItem(params!.id);
      if (!success) {
        return Utils.sendResponse(res, 404, { error: 'Item not found' });
      }
      Utils.sendResponse(res, 204);
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
