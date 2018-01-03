import { Callback, IHitConfig } from './interfaces';
import methods from './methods';
import { createUrl, toQueryParams } from './utils';

const addDefaultConfig = (config: Partial<IHitConfig> = {}): IHitConfig => ({
  ...{
    force: '',
    path: [],
    payload: '',
    maxImgLength: 2036,
  },
  ...config,
});

const sanitizeParams = (
  configOrCallback: Partial<IHitConfig> | Callback = {},
  callbackOrNothing: Callback = () => undefined
) => ({
  config:
    typeof configOrCallback === 'function'
      ? addDefaultConfig()
      : addDefaultConfig(configOrCallback),
  callback:
    typeof configOrCallback === 'function'
      ? configOrCallback
      : callbackOrNothing,
});

export default function Hitter(baseUrl: string) {
  return (
    configOrCallback: Partial<IHitConfig> | Callback = {},
    callbackOrNothing: Callback = () => undefined
  ) => {
    const { config, callback } = sanitizeParams(
      configOrCallback,
      callbackOrNothing
    );
    const payload = toQueryParams(config.payload);
    const url = createUrl(baseUrl, config.path);

    if (config.force) {
      return methods[config.force](url, payload, callback);
    }

    if (payload.length <= config.maxImgLength) {
      methods.img(url, payload, callback);
    } else {
      // tslint:disable-next-line:no-unused-expression
      methods.beacon(url, payload, callback) ||
        methods.xhr(url, payload, callback) ||
        methods.img(url, payload, callback);
    }
  };
}
