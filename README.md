# Hitter

** STILL IN PROGRESS **

A small library with zero dependencies for doing request hits (that is, requests in where you don't expect a response from the server). This library will try different methods, via Image, XHR or sendBeacon to get there, depending on availability and options passed.

## Installation

```
npm install hitter
```

## Example

```js
var Hitter = require('hitter');
var hit = Hitter('//myapi.com/data');
// or var hit = require('hitter')('//myapi.com/data');

hit(
  {
    payload: {
      data1: 'value1',
      data2: 2,
    },
  },
  function() {
    // Do something after the request is sent
  }
);
```

## Config object

### `Config.force`

Forces a specific method to call on. Possible values are `beacon`, `img` and `xhr`.

### `Config.path`

Takes an array of strings that will as a path to the base url.

### `Config.payload`

The payload to send along the request. It can be either a string or an object where the key/values will be translated to query parameters.

### `Config.maxImgLength`

The max length of the query params to do an Image request. Defaults to `2036`.
