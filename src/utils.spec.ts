import { createUrl, toQueryParams } from './utils';

describe('toQueryParams', () => {
  test('given a string will return the string', () => {
    const str = 'key1=value1&key2=value2';
    expect(toQueryParams(str)).toBe(str);
  });
  test('given an object will return the query param string', () => {
    const entry = {
      key1: 'value1',
      key2: 'value2',
    };
    const expected = 'key1=value1&key2=value2';

    expect(toQueryParams(entry)).toBe(expected);
  });
  test('will give empty string when no given parameter', () => {
    expect(toQueryParams()).toBe('');
  });
  test('will give empty string when given empty object', () => {
    expect(toQueryParams({})).toBe('');
  });
});

describe('createUrl', () => {
  const url = 'myapi.com';
  const path = ['get', 'data'];

  test('will append path to url', () => {
    expect(createUrl(url, path)).toBe('myapi.com/get/data');
  });
  test('will remove final slash from url', () => {
    expect(createUrl(`${url}/`, path)).toBe('myapi.com/get/data');
  });
  test('will append empty string when no path is given', () => {
    expect(createUrl(url)).toBe(url);
  });
  test('will append empty string when given empty array as second parameter', () => {
    expect(createUrl(url, [])).toBe(url);
  });
});
