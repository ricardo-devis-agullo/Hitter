jest.mock('./methods');

import Hitter from './main';
import methods from './methods';

interface IMockMethods {
  beacon: jest.Mock;
  img: jest.Mock;
  xhr: jest.Mock;
  [key: string]: jest.Mock;
}

const mockMethods = methods as IMockMethods;

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
      Number: 1,
      Object: { x: 1 },
      null: null,
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
    jest.clearAllMocks();
  });

  test('will call via image by default', () => {
    hit();

    expect(mockMethods.img).toBeCalledWith(url, '', expect.any(Function));
  });
  test('can take callback as first parameter', () => {
    const firstCallback = () => undefined;

    hit(firstCallback);

    expect(mockMethods.img.mock.calls[0][2]).toBe(firstCallback);
  });
  test('can take callback as second parameter', () => {
    const secondCallback = () => undefined;

    hit({ payload: { callback: 'second' } }, secondCallback);

    expect(mockMethods.img).toBeCalledWith(
      url,
      'callback=second',
      secondCallback
    );
  });
  describe('when forcing', () => {
    ['beacon', 'xhr'].forEach(method => {
      test(`will force method ${method}`, () => {
        hit({
          force: method,
        });

        expect(mockMethods[method]).toBeCalled();
      });
    });
    test('will force img even when length exceeds max', () => {
      hit({
        force: 'img',
        payload: {
          key: createString(4000),
        },
      });

      expect(mockMethods.img).toBeCalled();
    });
    test('will call via image when passed empty string', () => {
      hit({
        force: '',
      });

      expect(mockMethods.img).toBeCalled();
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
      expect(mockMethods.img).toBeCalled();
    });
    test('will not call via img if it exceeds it', () => {
      hit({
        maxImgLength: 5,
        payload: {
          key: 'longerValue',
        },
      });
      expect(mockMethods.img).not.toBeCalled();
    });
  });
  describe('when configuring the path', () => {
    test('will add it to the url', () => {
      hit({
        path: ['some', 'path'],
      });

      expect(mockMethods.img.mock.calls[0][0]).toBe(`${url}/some/path`);
    });
    test('will add a string to the url if passed', () => {
      hit({
        path: '/some/path/',
      });

      expect(mockMethods.img.mock.calls[0][0]).toBe(`${url}/some/path`);
    });
  });
  describe('when length exceeds the image maximum', () => {
    const lengthConfig = {
      maxImgLength: 10,
      payload: createString(20),
    };

    test('will call via beacon first', () => {
      hit(lengthConfig);

      expect(mockMethods.beacon).toBeCalled();
    });
    test('will call via xhr if beacon failed', () => {
      mockMethods.beacon.mockReturnValueOnce(false);

      hit(lengthConfig);

      expect(mockMethods.xhr).toBeCalled();
    });
    test('will end calling via img if xhr and beacon failed', () => {
      mockMethods.beacon.mockReturnValueOnce(false);
      mockMethods.xhr.mockReturnValueOnce(false);

      hit(lengthConfig);

      expect(mockMethods.img).toBeCalled();
    });
  });
});
