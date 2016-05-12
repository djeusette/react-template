import Root from '../shared/containers/Root';
import Html from '../shared/containers/Html';
import { analytics, externalApiUrl } from './config';
import assets from './assets';
import Helmet from 'react-helmet';
import React from 'react';
import ReactDOM from 'react-dom/server';
import memoryHistory from '../shared/core/history';
import { syncHistoryWithStore } from 'react-router-redux';
import configureStore from '../shared/store/configureStore';
import { onAuthenticationSuccess } from '../shared/actions/session';
import { onErrorRaised } from '../shared/actions/errors';
import { match } from 'react-router';
import routes from '../shared/routes';
import PrettyError from 'pretty-error';

const isProduction = () => {
  return process.env.NODE_ENV === 'production';
};

const googleAnalyticsSetup = () => {
  return analytics.google.trackingId != 'UA-XXXXX-X';
};

const getInitialState = () => {
  return {};
};

const getData = (store) => {
  const data = {
    entry: assets.main.js,
    helmet: Helmet.rewind(),
    initialState: store && store.getState(),
    css: []
  };

  if (isProduction() && googleAnalyticsSetup()) {
    data.trackingId = analytics.google.trackingId;
  }

  return data;
};

const getConfig = () => {
  return {
    apiUrl: externalApiUrl
  }
};

const getContext = (data) => {
  return {
    insertCss: styles => data.css.push(styles._getCss())
  }
};

const getAppContainer = (store, data, renderProps) => {
  const config = getConfig();
  const context = getContext(data);
  const rootComponent = ReactDOM.renderToStaticMarkup(
    <Root store={store} context={context} renderProps={renderProps} />
  );
  return (
    <div
        id='app'
        data-initial-state={JSON.stringify(data.initialState)}
        data-config={JSON.stringify(config)}
        dangerouslySetInnerHTML={{ __html: rootComponent }}>
    </div>
  );
};

const renderPage = (data, store, renderProps) => {
  const appContainer = getAppContainer(store, data, renderProps);
  const html = ReactDOM.renderToStaticMarkup(
    <Html {...data}>
     {appContainer}
    </Html>
  );
  return `<!DOCTYPE html>${html}`;
};

const renderErrorPage = (error) => {
  const template = require('./views/error.jade');
  return template({
    title: 'Oops',
    message: error.message || 'Sorry, something went wrong.',
    stack: process.env.NODE_ENV === 'production' ? '' : error.stack
  });
};

const handleCookies = (req, res, store) => {
  const { session, error } = req.cookies;

  if (session) {
    store.dispatch(onAuthenticationSuccess(session));
  }

  if (error) {
    store.dispatch(onErrorRaised(error));
    res.clearCookie('error');
  }
};

export function render(req, res, next) {
  const location = req.url;

  const store = configureStore({href: location, initialState: getInitialState()});
  handleCookies(req, res, store);
  const data = getData(store);
  const history = syncHistoryWithStore(memoryHistory, store);

  match({ routes, history, location }, async (error, redirectLocation, renderProps) => {
    if (error) {
      const html = renderErrorPage(error);
      return res.status(500).end(html);
    }

    if (redirectLocation) {
      return res.redirect(302, redirectLocation.pathname + redirectLocation.search);
    }

    if (!renderProps) {
      const html = renderErrorPage({message: 'We didn\'t find this route'});
      return res.status(404).end(html);
    }

    try {
      const html = renderPage(data, store, renderProps);
      res.status(200).send(html);
    } catch (err) {
      next(err);
    }
  });
};

const pe = new PrettyError();
pe.skipNodeFiles();
pe.skipPackage('express');

export function renderError(err, req, res, next) { // eslint-disable-line no-unused-vars
  console.log(pe.render(err)); // eslint-disable-line no-console

  const html = renderErrorPage(err);
  const statusCode = err.status || 500;
  res.status(statusCode);
  res.send(html);
};
