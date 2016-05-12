import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import createLogger from 'redux-logger';
import { routerMiddleware } from 'react-router-redux';
import { persistState } from 'redux-devtools';
import reducers from '../reducers';
import history from '../core/history';
import DevTools from '../containers/DevTools';
import { canUseDOM } from 'fbjs/lib/ExecutionEnvironment';
import api from '../middlewares/api';

function getDebugSessionKey(href) {
  const currentLocation = (href ? href : (canUseDOM ? window.location.href : ''));
  const matches = currentLocation.match(/[?&]debug_session=([^&]+)\b/);
  return (matches && matches.length > 0)? matches[1] : null;
}

export function configureStore(options) {
  const { initialState, href } = options;
  const reduxRouterMiddleware = routerMiddleware(history);
  const store = createStore(
    reducers,
    initialState,
    compose(
      applyMiddleware(reduxRouterMiddleware, thunk, api, createLogger({duration: true})),
      DevTools.instrument(),
      persistState(getDebugSessionKey(href))
    )
  );

  if (module.hot) {
    module.hot.accept('../reducers', () => {
      store.replaceReducer(require('../reducers').default)
    });
  }

  return store;
}
