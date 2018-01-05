jest.mock('./methods');

import Hitter from './main';
import methods from './methods';

const url = 'url';
const createString = (size = 1) => ('-' as any).repeat(size);

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
      Array: [1],
      Function: () => undefined,
      null: null,
      Number: 1,
      Object: { x: 1 },
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
  let hit: any;
  beforeEach(() => {
    hit = Hitter(url);
    (methods as any).beacon.mockClear();
    (methods as any).img.mockClear();
    (methods as any).xhr.mockClear();
  });

  test('will call via image by default', () => {
    hit();

    expect(methods.img).toBeCalledWith(url, '', expect.any(Function));
  });
  describe('when forcing', () => {
    ['beacon', 'xhr'].forEach(method => {
      test(`will force method ${method}`, () => {
        hit({
          force: method,
        });

        expect((methods as any)[method]).toBeCalled();
      });
    });
    test('will force img even when length exceeds max', () => {
      hit({
        force: 'img',
        payload: {
          key: createString(4000),
        },
      });

      expect(methods.img).toBeCalled();
    });
    test('will call via image when passed empty string', () => {
      hit({
        force: '',
      });

      expect(methods.img).toBeCalled();
    });
    test('will throw if passing a different string', () => {
      expect(() => {
        hit({
          force: 'somethingElse',
        }).toThrow();
      });
    });
  });
  describe('when configuring max image length', () => {
    test('will still call via img if it does not exceed it', () => {
      hit({
        maxImgLength: 20,
        payload: {
          key: 'value',
        },
      });
      expect(methods.img).toBeCalled();
    });
    test('will not call via img if it exceeds it', () => {
      hit({
        maxImgLength: 5,
        payload: {
          key: 'longerValue',
        },
      });
      expect(methods.img).not.toBeCalled();
    });
  });
});
