import * as I18n from 'i18n';
import * as compression from 'compression';
import * as cookieParser from 'cookie-parser';
import * as doc from './app/public/doc.json';
import * as helmet from 'helmet';
import * as morgan from 'morgan';
import * as swagger from 'swagger-ui-express';

import { NextFunction, Request, Response } from 'express';

import { INestApplication } from '@nestjs/common';
import { NotFoundApiHandler } from './app/exception/notfound.exception';
import { RuntimeApiHandler } from './app/exception/runtime.exception';
import { SocketExceptionsFilter } from './app/exception/socket.exception';

I18n.configure({
      locales: ['en', 'vi'],
      directory: `./src/utils/locales/dictionaries`,
      cookie: 'lang',
      defaultLocale: 'en',
      missingKeyFn: (locale, value) => {
            console.log(locale);
            console.log(value);
            return value;
      },
});

export function router(app: INestApplication) {
      //common middleware
      app.use(I18n.init);
      app.setGlobalPrefix('/api');
      app.use(cookieParser());
      app.enableCors({ origin: [process.env.CLIENT_URL, process.env.ADMIN_URL], credentials: true });

      //global filter
      app.useGlobalFilters(new SocketExceptionsFilter());

      //for production
      if (process.env.NODE_ENV === 'production') {
            app.use(helmet());
            app.use(compression());
            app.useGlobalFilters(new NotFoundApiHandler());
            app.useGlobalFilters(new RuntimeApiHandler());
      }

      //for developer
      if (process.env.NODE_ENV === 'development') {
            app.use(morgan('dev'));
      }

      if (process.env.DOC === 'active') app.use('/doc', swagger.serve, swagger.setup(doc));

      //global exception handler
      //global interceptor handler

      //handle for multiple language
      app.use((req: Request, res: Response, next: NextFunction) => {
            //set header
            res.header('Access-Control-Allow-Methods', 'POST, GET, PUT');
            res.header('Access-Control-Allow-Headers', '*');

            const lang = req.cookies['lang'] || '';
            if (!lang) {
                  I18n.setLocale('en');
                  res.cookie('lang', 'en', { maxAge: 86400 * 30 });
            } else I18n.setLocale(lang);

            next();
      });
}
