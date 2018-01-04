import methods from './methods';

describe('method', () => {
  const url = 'myapi.com';
  const payload = 'key1=value1&key2=value2';
  const callback = jest.fn();
  let result: any;

  afterEach(() => {
    callback.mockClear();
    result = undefined;
  });

  describe('beacon', () => {
    describe('when is not supported', () => {
      beforeEach(() => {
        delete window.navigator.sendBeacon;
        result = methods.beacon(url, payload, callback);
      });

      test('will return false', () => {
        expect(result).toBe(false);
      });
      test('will not call callback', () => {
        expect(callback).not.toBeCalled();
      });
    });

    describe('when is supported but fails', () => {
      beforeEach(() => {
        window.navigator.sendBeacon = jest.fn(() => false);
        result = methods.beacon(url, payload, callback);
      });

      test('will make the call', () => {
        expect(window.navigator.sendBeacon).toBeCalledWith(url, payload);
      });
      test('will return false', () => {
        expect(result).toBe(false);
      });
      test('will not call callback', () => {
        expect(callback).not.toBeCalled();
      });
    });

    describe('when is supported and succeeds', () => {
      beforeEach(() => {
        window.navigator.sendBeacon = jest.fn(() => true);
        result = methods.beacon(url, payload, callback);
      });

      test('will make the call', () => {
        expect(window.navigator.sendBeacon).toBeCalledWith(url, payload);
      });
      test('will return true', () => {
        expect(result).toBe(true);
      });
      test('will call callback', () => {
        expect(callback).toBeCalled();
      });
    });
  });

  describe('img', () => {
    let mockImage: any;

    beforeEach(() => {
      mockImage = {
        src: '',
        onload: () => undefined,
        onerror: () => undefined,
      };
      document.createElement = jest.fn(el => (el === 'img' ? mockImage : {}));
      methods.img(url, payload, callback);
    });

    test('will not call callback inmediately', () => {
      expect(callback).not.toBeCalled();
    });
    test('will set the src', () => {
      expect(mockImage.src).toBe(`${url}?${payload}`);
    });

    describe('when loaded', () => {
      beforeEach(() => {
        mockImage.onload();
      });

      test('will call callback', () => {
        expect(callback).toBeCalled();
      });
      test('will remove function', () => {
        expect(mockImage.onload).toBeNull();
      });
    });
    describe('when given error', () => {
      beforeEach(() => {
        mockImage.onerror();
      });

      test('will call callback when gives error', () => {
        expect(callback).toBeCalled();
      });
      test('will remove function', () => {
        expect(mockImage.onerror).toBeNull();
      });
    });
  });

  describe('xhr', () => {
    describe('when is not supported', () => {
      beforeEach(() => {
        (window as any).XMLHttpRequest = undefined;
        result = methods.xhr(url, payload, callback);
      });
      test('will return false', () => {
        expect(result).toBe(false);
      });
      test('will not call callback', () => {
        expect(callback).not.toBeCalled();
      });
    });
    describe('when credentials is not supported', () => {
      beforeEach(() => {
        (window as any).XMLHttpRequest = () => ({});
        result = methods.xhr(url, payload, callback);
      });
      test('will return false', () => {
        expect(result).toBe(false);
      });
      test('will not call callback', () => {
        expect(callback).not.toBeCalled();
      });
    });
    describe('when is supported', () => {
      const mockXhr = {
        open: jest.fn(),
        readyState: -1,
        send: jest.fn(),
        onreadystatechange: () => undefined,
        setRequestHeader: jest.fn(),
        withCredentials: undefined,
      };

      beforeEach(() => {
        mockXhr.onreadystatechange = () => undefined;
        mockXhr.open.mockClear();
        mockXhr.send.mockClear();
        mockXhr.setRequestHeader.mockClear();
        mockXhr.readyState = -1;
        (window as any).XMLHttpRequest = jest.fn(() => mockXhr);
        result = methods.xhr(url, payload, callback);
      });

      test('will return true', () => {
        expect(result).toBe(true);
      });
      test('will open a post connection', () => {
        expect(mockXhr.open).toBeCalledWith('POST', url, true);
      });
      test('will set a plain text header', () => {
        expect(mockXhr.setRequestHeader).toBeCalledWith(
          'Content-Type',
          'text/plain'
        );
      });
      test('will set credentials', () => {
        expect(mockXhr.withCredentials).toBe(true);
      });
      test('will not call callback inmediately', () => {
        expect(callback).not.toBeCalled();
      });
      describe('and the state changes', () => {
        [0, 1, 2, 3].forEach(state => {
          test(`will not call callback if state is ${state}`, () => {
            mockXhr.readyState = state;
            mockXhr.onreadystatechange();

            expect(callback).not.toBeCalled();
          });
        });
        describe('to done', () => {
          beforeEach(() => {
            mockXhr.readyState = 4;
            mockXhr.onreadystatechange();
          });
          test('will call callback', () => {
            expect(callback).toBeCalled();
          });
          test('will remove listener', () => {
            expect(mockXhr.onreadystatechange).toBeNull();
          });
        });
      });
    });
  });
});
