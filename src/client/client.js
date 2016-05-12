import 'babel-polyfill';
import React from 'react';
import ReactDOM from 'react-dom';
import FastClick from 'fastclick';
import { syncHistoryWithStore } from 'react-router-redux';
import routes from '../shared/routes';
import { match } from 'react-router';
import browserHistory from '../shared/core/history';
import { addEventListener } from '../shared/core/DOMUtils';
import configureStore from '../shared/store/configureStore';
import Root from '../shared/containers/Root';

const appContainer = document.getElementById('app');
let cssContainer = document.getElementById('css');

function render(renderProps, store) {
  const context = getContext();
  const component = <Root store={store} context={context} renderProps={renderProps} />;

  ReactDOM.render(component, appContainer, () => {
    if (cssContainer) {
      cssContainer.parentNode.removeChild(cssContainer);
      cssContainer = null;
    }
  });
}

function initializeConfig() {
  window.__CONFIG__ = JSON.parse(appContainer.getAttribute('data-config'));
}

const getContext = () => {
  return {
    insertCss: styles => styles._insertCss()
  }
};

function run() {
  // Make taps on links and buttons work fast on mobiles
  FastClick.attach(document.body);

  initializeConfig();
  const initialState = JSON.parse(appContainer.getAttribute('data-initial-state'));
  const location = window.location;
  const store = configureStore({initialState});
  const history = syncHistoryWithStore(browserHistory, store);

  match({ history, routes, location }, (error, redirectLocation, renderProps) => {
    render(renderProps, store);
  });
}

// Run the application when both DOM is ready and page content is loaded
if (['complete', 'loaded', 'interactive'].includes(document.readyState) && document.body) {
  run();
} else {
  document.addEventListener('DOMContentLoaded', run, false);
}
