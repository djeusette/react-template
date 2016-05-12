import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import { routerMiddleware } from 'react-router-redux';
import reducers from '../reducers';
import Location from '../core/Location';
import api from '../middlewares/api';

export function configureStore(options) {
  const { initialState, href } = options;
  const reduxRouterMiddleware = routerMiddleware(Location);
  const store = createStore(
    reducers,
    initialState,
    compose(
      applyMiddleware(reduxRouterMiddleware, thunk, api)
    )
  );

  return store;
}
