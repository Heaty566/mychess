import * as supertest from 'supertest';

import { INestApplication } from '@nestjs/common';

//* Internal import

import { initTestModule } from '../../../test/initTest';
import { SupportDTO } from '../dto/aboutUsDto';

describe('commonController', () => {
      let app: INestApplication;

      beforeAll(async () => {
            const { getApp } = await initTestModule();
            app = getApp;
      });

      describe('POST /support', () => {
            let createUserData: SupportDTO;
            const reqApi = (input: SupportDTO) => supertest(app.getHttpServer()).post('/api/support').send(input);

            beforeEach(() => {
                  createUserData = {
                        email: 'hello@gmail.com',
                        message: 'hello world',
                        name: 'hello',
                  };
            });

            it('Pass', async () => {
                  const res = await reqApi(createUserData);

                  expect(res.status).toBe(201);
            });
      });

      describe('GET /users', () => {
            const reqApi = () => supertest(app.getHttpServer()).get('/api/users');

            it('Pass', async () => {
                  const res = await reqApi();
                  expect(res.body.data).toBeDefined();
                  expect(res.status).toBe(200);
            });
      });

      afterAll(async () => {
            await app.close();
      });
});
