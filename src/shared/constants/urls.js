import { canUseDOM } from 'fbjs/lib/ExecutionEnvironment';

export function apiUrl() {
  if (canUseDOM) {
    return window.__CONFIG__.apiUrl;
  } else {
    return require('../../server/config').apiUrl;
  }
}
