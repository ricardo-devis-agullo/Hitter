jest.mock('./methods');

import Hitter from './main';
import methods from './methods';

const url = 'url';

describe('constructor', () => {
  test('will return a function', () => {
    expect(Hitter(url)).toEqual(expect.any(Function));
  });
  test('throws when we do not pass anything', () => {
    expect(() => {
      (Hitter as any)();
    }).toThrowError(TypeError);
  });
  test('throws when we pass empty string', () => {
    expect(() => {
      (Hitter as any)('');
    }).toThrowError(TypeError);
  });
  (Object as any)
    .entries({
      array: [1],
      function: () => undefined,
      null: null,
      number: 1,
      object: { x: 1 },
    })
    .forEach(([type, value]: any) => {
      test(`throws when passing a type of ${type}`, () => {
        expect(() => {
          (Hitter as any)(value);
        }).toThrowError(TypeError);
      });
    });
});
describe('instance', () => {
  let instance: any;
  beforeEach(() => {
    instance = Hitter(url);
    (methods as any).beacon.mockClear();
    (methods as any).img.mockClear();
    (methods as any).xhr.mockClear();
  });

  test('will call via image by default', () => {
    instance();

    expect(methods.img).toBeCalledWith(url, '', expect.any(Function));
  });
});
