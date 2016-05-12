import types from '../constants/ActionTypes';

export function onErrorRaised(error) {
  return {
    type: types.ERROR_RAISED,
    error: error
  }
}

export function onErrorShown() {
  return {
    type: types.ERROR_SHOWN
  }
}
