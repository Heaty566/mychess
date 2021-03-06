import { Response, NextFunction, Request } from 'express';
import { INestApplication } from '@nestjs/common';
import * as swagger from 'swagger-ui-express';
import * as cookieParser from 'cookie-parser';
import * as compression from 'compression';
import * as morgan from 'morgan';
import * as helmet from 'helmet';
import * as I18n from 'i18n';

//* Internal import
import { NotFoundApiHandler } from './app/exception/notfound.exception';
import { RuntimeApiHandler } from './app/exception/runtime.exception';
import * as doc from '../swagger.json';

I18n.configure({
      locales: ['en', 'vi'],
      directory: `./src/utils/locales/dictionaries`,
      cookie: 'lang',
      defaultLocale: 'en',
});

export function router(app: INestApplication) {
      //common middleware
      app.use(I18n.init);
      app.setGlobalPrefix('/api');
      app.use(cookieParser());
      app.enableCors({ origin: process.env.CLIENT_URL, credentials: true });

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

      //allow document for frontend
      if (process.env.DOC === 'active') {
            app.use('/doc', swagger.serve, swagger.setup(doc));
      }

      //global exception handler
      //global interceptor handler

      //handle for multiple language
      app.use((req: Request, res: Response, next: NextFunction) => {
            //set header
            res.header('Access-Control-Allow-Origin', process.env.CLIENT_URL);
            res.header('Access-Control-Allow-Methods', '*');
            res.header('Access-Control-Allow-Headers', '*');

            const lang = req.cookies['lang'] || '';
            if (!lang) {
                  I18n.setLocale('en');
                  res.cookie('lang', 'en', { maxAge: 86400 * 30 });
            } else I18n.setLocale(lang);

            next();
      });
}
