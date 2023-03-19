import {
  BaseCustomLoggerApiClient,
  BaseCustomLoggerApiClientConfigs,
} from './BaseCustomLoggerApiClient';
import { LogData } from '../logging.types';

export type NewRelicWrappedLogData = {
  logData: Partial<LogData>;
};

export type NewRelicLoggerApiClientOptions = {
  apiKey: string;
};

export class NewRelicLoggerApiClient extends BaseCustomLoggerApiClient {
  private static readonly NEWRELIC_API_URL =
    'https://log-api.newrelic.com/log/v1';
  constructor(newRelicLoggerApiClientOptions: NewRelicLoggerApiClientOptions) {
    super({
      baseUrl: `${NewRelicLoggerApiClient.NEWRELIC_API_URL}`,
      axiosConfig: {
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json',
          'Content-Encoding': 'application/gzip',
          'Api-Key': `${newRelicLoggerApiClientOptions.apiKey}`,
          'Access-Control-Allow-Origin': '*',
        },
      },
    });
  }

  postLog(
    logData: Partial<LogData>,
    customConfigs?: Partial<BaseCustomLoggerApiClientConfigs>,
  ) {
    const wrappedLogData: NewRelicWrappedLogData = {
      logData: logData,
    };
    return this.getInstance(customConfigs).post(
      NewRelicLoggerApiClient.NEWRELIC_API_URL,
      JSON.stringify(wrappedLogData),
      customConfigs,
    );
  }
}
