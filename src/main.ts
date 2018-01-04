import { Callback, IHitConfig } from './interfaces';
import methods from './methods';
import { createUrl, toQueryParams } from './utils';

const addDefaultConfig = (config: Partial<IHitConfig> = {}): IHitConfig => ({
  ...{
    force: '',
    maxImgLength: 2036,
    path: [],
    payload: '',
  },
  ...config,
});

const sanitizeParams = (
  configOrCallback: Partial<IHitConfig> | Callback = {},
  callbackOrNothing: Callback = () => undefined
) => ({
  callback:
    typeof configOrCallback === 'function'
      ? configOrCallback
      : callbackOrNothing,
  config:
    typeof configOrCallback === 'function'
      ? addDefaultConfig()
      : addDefaultConfig(configOrCallback),
});

export default function Hitter(baseUrl: string) {
  return (
    configOrCallback?: Partial<IHitConfig> | Callback,
    callbackOrNothing?: Callback
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
