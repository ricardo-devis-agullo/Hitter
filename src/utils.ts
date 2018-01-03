import { Payload } from './interfaces';

const createParams = (params: any) =>
  Object.keys(params)
    .reduce(
      (values: string[], key: string) =>
        params[key] !== undefined
          ? values.concat(`${key}=${encodeURIComponent(params[key])}`)
          : values,
      []
    )
    .join('&');
export const toQueryParams = (params: Payload = '') =>
  typeof params === 'string' ? params : createParams(params);

const createPath = (path: string[] = []) => path.join('/');
export const createUrl = (url: string, path: string[]) =>
  url[url.length - 1] === '/'
    ? url.slice(0, -1) + createPath(path)
    : url + createPath(path);
