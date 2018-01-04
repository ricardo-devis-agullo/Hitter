import { Callback } from './interfaces';

const supportsXHR = () =>
  (window as any).XMLHttpRequest &&
  'withCredentials' in new (window as any).XMLHttpRequest();
const supportsBeacon = () => 'sendBeacon' in window.navigator;

const beacon = (url: string, payload: string, callback: Callback) => {
  if (!supportsBeacon()) {
    return false;
  }
  if (window.navigator.sendBeacon(url, payload)) {
    callback();
    return true;
  }
  return false;
};

const img = (url: string, payload: string, callback: Callback) => {
  const request = document.createElement('img');
  request.src = url + (payload ? `?${payload}` : '');
  request.onload = request.onerror = () => {
    (request as any).onload = null;
    (request as any).onerror = null;
    callback();
  };
};

const xhr = (url: string, payload: string, callback: Callback) => {
  if (!supportsXHR()) {
    return false;
  }
  const request = new (window as any).XMLHttpRequest();
  request.open('POST', url, true);
  request.withCredentials = true;
  request.setRequestHeader('Content-Type', 'text/plain');
  request.onreadystatechange = () => {
    if (request.readyState === 4) {
      request.onreadystatechange = null;
      callback();
    }
  };
  request.send(payload);
  return true;
};

const methods = {
  beacon,
  img,
  xhr,
};

export default methods;
