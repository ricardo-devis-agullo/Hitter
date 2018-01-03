import { createUrl, toQueryParams } from './utils';

describe('toQueryParams', () => {
  test('given a string will return the string', () => {
    const str = '?key1=value1&key2=value2';
    expect(toQueryParams(str)).toBe(str);
  });
});
