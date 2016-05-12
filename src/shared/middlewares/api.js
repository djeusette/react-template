import { apiUrl } from '../constants/urls';
import { callApi } from '../api/utils';
import Promise from 'bluebird';
import actionTypes from '../constants/ActionTypes';
import _ from 'lodash';

function getTokenFromStore(store) {
  const state = store.getState();
  return state.session.token && state.session.token.value;
}

function getHttpConfig(options) {
  return new Promise((resolve, reject) => {
    const { authenticated, token, method, body } = options;
    const config = {
      method,
      headers: {
        'Content-Type': 'application/json',
      }
    };

    if (body) {
      config.body = JSON.stringify(body);
    }

    if (authenticated) {
      if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
      } else {
        reject(new Error("No token provided"));
      }
    }

    resolve(config);
  });
}

export const CALL_API = Symbol('Call API')

export default store => next => action => {

  const callAPI = action[CALL_API]

  if (typeof callAPI === 'undefined') {
    return next(action)
  }

  const { endpoint, method, body, types, authenticated, onSuccess, onFailure } = callAPI;
  let token = null;
  if (authenticated) {
    token = getTokenFromStore(store);
  }
  const [ requestType, successType, errorType ] = types;

  next({type: requestType});

  return getHttpConfig({ method, body, authenticated, token}).then((httpConfig) => {
    return callApi(`${apiUrl()}/${endpoint}`, httpConfig).then((json) => {
      next({
        json,
        authenticated: authenticated || false,
        type: successType
      });
      if (_.isFunction(onSuccess)) {
        onSuccess(store);
      }
    });
  }).catch((err) => {
    next({
      error: err.message,
      type: errorType
    });
    next({
      error: err.message,
      type: actionTypes.ERROR_RAISED
    });
    if (_.isFunction(onFailure)) {
      onFailure(store);
    }
  });
}
