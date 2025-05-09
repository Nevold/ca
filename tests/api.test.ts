import request from 'supertest';
import { server } from '../src/server.js';

describe('CRUD API', () => {
  let createdItemId: string;

  afterAll(() => {
    server.close();
  });

  it('should create a new item', async () => {
    const response = await request(server)
      .post('/items')
      .send({ name: 'Test Item', description: 'Test Description' });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('id');
    expect(response.body.name).toBe('Test Item');
    createdItemId = response.body.id;
  });

  it('should get all items', async () => {
    const response = await request(server).get('/items');
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBeGreaterThan(0);
  });

  it('should get a specific item', async () => {
    const response = await request(server).get(`/items/${createdItemId}`);
    expect(response.status).toBe(200);
    expect(response.body.id).toBe(createdItemId);
  });

  it('should update an item', async () => {
    const response = await request(server)
      .put(`/items/${createdItemId}`)
      .send({ name: 'Updated Item' });

    expect(response.status).toBe(200);
    expect(response.body.name).toBe('Updated Item');
  });

  it('should delete an item', async () => {
    const response = await request(server).delete(`/items/${createdItemId}`);
    expect(response.status).toBe(204);

    const verifyResponse = await request(server).get(`/items/${createdItemId}`);
    expect(verifyResponse.status).toBe(404);
  });
});
