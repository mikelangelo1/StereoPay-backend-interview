import { LoggerModuleOptions } from './logging/loggers/nestLogger/types/logger-module.types';
import { loggerUtils } from './logging/loggerUtils';
import { logLevelList } from './logging/logLevels';

export enum ServerMode {
  dev = 'dev',
  prod = 'prod',
}

export const appConfig = {
  mode: process.env.MODE as ServerMode,
  environment: process.env.ENVIRONMENT,
  appName: process.env.APP_NAME,

  get isDev() {
    return appConfig.mode === ServerMode.dev;
  },

  http: {
    port: +(process.env.HTTP_PORT ?? '5000'),
    cors: {
      whitelist: process.env.CORS_WHITELIST?.split(' ') ?? [],
      allowWithoutOrigin: process.env.CORS_ALLOW_WITHOUT_ORIGIN,
    },
    get fakeDelayTime() {
      if (appConfig.isDev) {
        return +(process.env.FAKE_DELAY_TIME ?? '0');
      }

      return 0;
    },
    fakeDelayOrigins: process.env.FAKE_DELAY_ORIGINS?.split(' ') ?? [],
    requestLimit: {
      windowMins: +(process.env.REQUEST_LIMIT_WINDOW_MINS ?? '15'),
      max: +(process.env.REQUEST_LIMIT_MAX ?? '0'),
    },
  },
  serverUrl: process.env.SERVER_URL,

  databaseUrl: process.env.DATABASE_URL,
  storage: {
    basePath: './storage',
    get tempPath() {
      return `${appConfig.storage.basePath}/temp`;
    },
  },

  spaces: {
    accessKey: process.env.SPACES_ACCESS_KEY,
    secretKey: process.env.SPACES_SECRET_KEY,
    originEndpoint: process.env.SPACES_ORIGIN_ENDPOINT ?? '',
    cdnEndpoint: process.env.SPACES_CDN_ENDPOINT ?? '',
    defaultBucket: process.env.SPACES_DEFAULT_BUCKET ?? '',
  },

  logging: {
    get options() {
      const options: LoggerModuleOptions = {
        logLevels: appConfig.isDev
          ? logLevelList
          : loggerUtils.getLogLevelsUpto('info'),
        appInfo: {
          id: 'stereopay-server',
          version: '1.0.0',
          environment: appConfig.environment ?? 'unknown',
        },
        newRelicApiClientOptions: !!appConfig.newRelic.browserKey
          ? {
              apiKey: appConfig.newRelic.browserKey,
            }
          : undefined,
        writeMessageOnly: appConfig.isDev,
      };
      return options;
    },
  },

  newRelic: {
    browserKey: process.env.NEW_RELIC_BROWSER_KEY ?? '',
  },
};
