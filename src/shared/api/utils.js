import fetch from '../core/fetch';
import _ from 'lodash';

const DEFAULT_OPTIONS = {method: 'get', headers: {'Content-Type': 'application/json'}};

export function callApi(url, options = {}) {
  return fetch(url, _.defaultsDeep(options, DEFAULT_OPTIONS)).then((response) => {
    return response.json().then((json) => {
      if (response.status >= 400 || !response.ok) {
        throw new Error(`${response.statusText}: ${json.error}`);
      } else {
        return json;
      }
    });
  });
}
