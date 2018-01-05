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

const trimEndSlash = (uri = '') =>
  uri && uri[uri.length - 1] === '/' ? uri.slice(0, -1) : uri;

const trimSlashes = (uri = '') =>
  uri
    .split('/')
    .filter(Boolean)
    .join('/');

const createPath = (path: string[] | string = []) =>
  typeof path === 'string' ? trimSlashes(path) : path.join('/');

export const createUrl = (baseUrl: string, urlPath: string[] | string = '') => {
  const path = createPath(urlPath);
  const url = trimEndSlash(baseUrl);

  return path ? `${url}/${path}` : url;
};
