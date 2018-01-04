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

export const createUrl = (baseUrl: string, urlPath: string[] | string = '') => {
  const path = typeof urlPath === 'string' ? urlPath : createPath(urlPath);
  const url =
    path && baseUrl[baseUrl.length - 1] !== '/' ? `${baseUrl}/` : baseUrl;

  return url + path;
};
