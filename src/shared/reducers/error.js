import types from '../constants/ActionTypes';

export function error(state = {
  content: null,
  shown: true
}, action) {
  switch (action.type) {
    case types.ERROR_RAISED:
      return Object.assign({}, state, {
        content: action.error,
        shown: false
      });

    case types.ERROR_SHOWN:
      return Object.assign({}, state, {
        shown: true
      });

    default:
      return state;
  }
}
