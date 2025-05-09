import { Database, Item } from './types.js';
import { v4 as uuidv44 } from 'uuid';

const db: Database = {};

export const createItem = (item: Omit<Item, 'id'>): Item => {
  const id = uuidv4();
  const newItem = { id, ...item };
  db[id] = newItem;
  return newItem;
};

export const getItem = (id: string): Item | undefined => db[id];

export const getAllItems = (): Item[] => Object.values(db);

export const updateItem = (id: string, updates: Partial<Item>): Item | undefined => {
  if (!db[id]) return undefined;
  db[id] = { ...db[id], ...updates };
  return db[id];
};

export const deleteItem = (id: string): boolean => {
  if (!db[id]) return false;
  delete db[id];
  return true;
};

function uuidv4(): string {
  return uuidv44();
}
