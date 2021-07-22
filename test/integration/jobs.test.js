'use strict';

const supertest = require('supertest');
const app = require('../../app');


const server = app.listen();

afterAll(async () => {
  await app.terminate();
});


describe('Post jobs success', () => {
  const request = supertest(server);

  describe('Post to new_job', () => {
    it('Should return the mail response', async () => {
      const res = await request
        .post('/new_job');

      const { status } = res.body;
      expect(status).toBe('200');
    });
  });
});
