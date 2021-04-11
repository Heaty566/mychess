import * as supertest from 'supertest';

import { INestApplication } from '@nestjs/common';

//* Internal import

import { initTestModule } from '../../../test/initTest';
import { AboutUsDTO } from '../dto/aboutUsDto';

describe('commonController', () => {
      let app: INestApplication;

      beforeAll(async () => {
            const { getApp } = await initTestModule();
            app = getApp;
      });

      describe('POST /about-us', () => {
            let createUserData: AboutUsDTO;
            const reqApi = (input: AboutUsDTO) => supertest(app.getHttpServer()).post('/api/about-us').send(input);

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

      afterAll(async () => {
            await app.close();
      });
});
