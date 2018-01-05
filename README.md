# Hitter

[![npm version](https://img.shields.io/npm/v/hitter.svg?style=flat-square)](https://www.npmjs.org/package/hitter)
[![build status](https://img.shields.io/travis/ricardo-devis-agullo/Hitter.svg?style=flat-square)](https://travis-ci.org/ricardo-devis-agullo/Hitter)
[![Coverage Status](https://coveralls.io/repos/github/ricardo-devis-agullo/Hitter/badge.svg?branch=master)](https://coveralls.io/github/ricardo-devis-agullo/Hitter?branch=master)
[![npm downloads](https://img.shields.io/npm/dm/hitter.svg?style=flat-square)](http://npm-stat.com/charts.html?package=hitter)

A small library with zero dependencies for doing request hits (that is, requests in where you don't expect a response from the server). This library will try different methods, via Image, XHR or sendBeacon to get there, depending on availability and options passed.

### Why?

The main use for this is when you want to do hits to an analytics endpoint, where you just want a reliable and fast way to send something and you don't care about the response.

That's why this library will try first using a [Image](https://developer.mozilla.org/en-US/docs/Web/API/HTMLImageElement/Image) request, and if the payload is too long, then with [sendBeacon](https://developer.mozilla.org/en-US/docs/Web/API/Navigator/sendBeacon) and [XMLHttpRequest](https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest) (if supported).

Although with XMLHttpRequest and sendBeacon will use a POST method, it will still send the payload as a [query param](https://developer.mozilla.org/en-US/docs/Web/API/URLSearchParams) string on plain text.

## Installation

```
npm install hitter
```

## Support

It should work on IE11+. Only for browser.

## Example

Since this is thought to be a library to hit usually a unique endpoint, you pass a url to the constructor where you will get the hits. That way you can call many times the instance with different payloads.

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

## Creating an instance

##### Hitter(baseUrl)

What you get from the library is a constructor that will take a url as a parameter that will be the base of where to do the calls (can be expanded with paths on the config options later at the instance level).

It will return a function that can be called to do the hits.

## Using the instance

##### hit(config, callback?)

Will take a config object and an optional callback to do something after the hit (you won't get any parameters).

##### hit(callback?)

Optionally you can also call it with only an optional callback if you don't care about the config options.

## Config object

All parameters are optional.

### `Config.force`

Forces a specific method to call on. Possible values are `beacon`, `img` and `xhr`.

### `Config.path`

Takes an array of strings that will as a path to the base url.

### `Config.payload`

The payload to send along the request. It can be either a string or an object where the key/values will be translated to query parameters.

### `Config.maxImgLength`

The max length of the query params to do an Image request. Defaults to `2036`.
