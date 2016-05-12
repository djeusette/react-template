import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';
import { error } from './error';

const rootReducer = combineReducers({
  error,
  routing: routerReducer
});

export default rootReducer;
