import 'babel-polyfill';
import path from 'path';
import express from 'express';

import {
  port,
  cookieSecret,
  twitterConsumerKey,
  twitterConsumerSecret,
  movesClientId,
  movesClientSecret,
  host,
  internalApiUrl
} from './config';

import expressSession from 'express-session';
import OAuth from 'oauth';

import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';

import { callApi } from '../shared/api/utils';
import { authorizeTwitter } from '../shared/actions/users';
import { onAuthenticationSuccess } from '../shared/actions/session';
import { onErrorRaised } from '../shared/actions/errors';
import jwtDecode from 'jwt-decode';

import querystring from 'querystring';

import { render, renderError } from './render';

const server = global.server = express();
global.navigator = global.navigator || {};
global.navigator.userAgent = global.navigator.userAgent || 'all';

//
// Register Node.js middleware
// -----------------------------------------------------------------------------
server.use(express.static(path.join(__dirname, 'public')));

server.use(cookieParser(cookieSecret));
server.use(bodyParser.json());
server.use(bodyParser.urlencoded({ extended: true }));

// Only for twitter auth
server.use(expressSession({
  secret: cookieSecret,
  cookie: { httpOnly: true, secure: false },
}));

//
// Register API middleware
// -----------------------------------------------------------------------------
server.use('/api/content', require('./api/content').default);

//
// Register Error middleware
// -----------------------------------------------------------------------------
server.use(renderError);

//
// Register server-side rendering middlewares
// -----------------------------------------------------------------------------


function twitterConsumer() {
  const callbackUrl = `http://${host}/oauth/twitter/callback`;

  return new OAuth.OAuth(
    "https://twitter.com/oauth/request_token",
    "https://twitter.com/oauth/access_token",
    twitterConsumerKey,
    twitterConsumerSecret,
    "1.0A",
    callbackUrl,
    "HMAC-SHA1"
  );
}

server.get('/oauth/twitter', (req, res) => {
  const { session } = req.cookies;

  if (!session || !session.access_token || !session.data || !session.data.user || !session.data.user.id) {
    res.cookie('error', 'Authentication error');
    return res.redirect('/');
  }

  twitterConsumer().getOAuthRequestToken((err, requestToken, secretToken, result) => {
    if (err) {
      res.cookie('error', err.message);
      return res.redirect('/');
    }

    req.session.twitterRequestToken = requestToken;
    req.session.twitterSecretToken = secretToken;

    res.redirect(`https://twitter.com/oauth/authorize?oauth_token=${requestToken}`);
  });
});

server.get('/oauth/twitter/callback', (req, res) => {
  twitterConsumer().getOAuthAccessToken(req.session.twitterRequestToken, req.session.twitterSecretToken, req.query.oauth_verifier, (err, oauthAccessToken, oauthAccessTokenSecret, results) => {
    if (err) {
      res.cookie('error', err.message);
      return res.redirect('/profile');
    }

    const { session } = req.cookies;
    const userId = session.data.user.id;
    const geostoryAccessToken = session.access_token;

    return addTwitterTokensToUser(userId, oauthAccessToken, oauthAccessTokenSecret, geostoryAccessToken).then((json) => {
      session.data.user.authorized_twitter = true

      res.cookie('session', session, {httpOnly: true, secure: false, expires: getSessionExpiration(session)});
      res.redirect('/profile');
    }).catch((err) => {
      res.cookie('error', err.message);
      res.redirect('/profile');
    });
  });
});

function verifyTwitterCredentials(accessToken, secretToken, callback) {
  twitterConsumer().get("https://api.twitter.com/1.1/account/verify_credentials.json", accessToken, secretToken, (err, data, response) => {
    if (err) {
      return callback(err);
    }

    callback(null, data);
  });
}

function addTwitterTokensToUser(userId, accessToken, secretToken, geostoryAccessToken) {
  const url = `${internalApiUrl}/api/v1/users/${userId}`;
  const body = {twitter_access_token: accessToken, twitter_secret_token: secretToken};
  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${geostoryAccessToken}`
  };

  return callApi(url, {method: 'put', body: JSON.stringify(body), headers: headers});
}

function movesAuthorizeUrl() {
  const redirectUri = `http://${host}/oauth/moves/callback`;
  const query = {client_id: movesClientId, scope: 'location activity', response_type: 'code', redirect_uri: redirectUri};
  return `https://api.moves-app.com/oauth/v1/authorize?${querystring.stringify(query)}`;
}

function getMovesAccessToken(authorizationCode) {
  const movesUrl = 'https://api.moves-app.com/oauth/v1/access_token';
  const redirectUri = `http://${host}/oauth/moves/callback`;
  const body = {
    grant_type: "authorization_code",
    code: authorizationCode,
    client_id: movesClientId,
    client_secret: movesClientSecret,
    redirect_uri: redirectUri
  };
  const headers = {'Content-Type': 'application/json'};

  return callApi(movesUrl, {method: 'post', body: JSON.stringify(body), headers: headers});
}

function addMovesDataToUser(userId, data, geostoryAccessToken) {
  const url = `${internalApiUrl}/api/v1/users/${userId}`;
  const { access_token, refresh_token, expires_in, user_id } = data;

  const body = {
    moves_access_token: access_token,
    moves_refresh_token: refresh_token,
    moves_access_token_expires_at: (Date.now() / 1000) + expires_in,
    moves_redirect_uri: `http://${host}/oauth/moves/callback`,
    moves_user_id: user_id
  };
  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${geostoryAccessToken}`
  };

  return callApi(url, {method: 'put', body: JSON.stringify(body), headers: headers});
}

server.get('/oauth/moves', (req, res) => {
  res.redirect(movesAuthorizeUrl());
});

server.get('/oauth/moves/callback', (req, res) => {
  const { error, code } = req.query;

  if (error) {
    res.cookie('error', error);
    return res.redirect('/profile');
  }

  getMovesAccessToken(code).then((json) => {
    if (json.error) {
      res.cookie('error', json.error);
      return res.redirect('/profile');
    }

    const { session } = req.cookies;
    const userId = session.data.user.id;
    const geostoryAccessToken = session.access_token;

    return addMovesDataToUser(userId, json, geostoryAccessToken).then((json) => {
      session.data.user.authorized_moves = true

      res.cookie('session', session, {httpOnly: true, secure: false, expires: getSessionExpiration(session)});
      res.redirect('/profile');
    });
  }).catch((err) => {
    res.cookie('error', err.message);
    res.redirect('/profile');
  });
});

function getSessionExpiration(session) {
  const { created_at, expires_in } = session;
  return new Date((created_at + expires_in) * 1000);
}

server.post('/signin', (req, res) => {
  const url = `${internalApiUrl}/oauth/token`;
  const { email, password, redirectTo } = req.body
  const body = {email: email, password: password, grant_type: 'password'};
  const headers ={'Content-Type': 'application/json'};

  return callApi(url, {method: 'post', body: JSON.stringify(body), headers: headers}).then((json) => {
    const decodedToken = jwtDecode(json.access_token);
    const session = Object.assign({}, json, {data: decodedToken});
    res.cookie('session', session, {httpOnly: true, secure: false, expires: getSessionExpiration(session)});
    res.redirect(path.resolve('/', redirectTo));
  }).catch((err) => {
    res.cookie('error', err.message);
    res.redirect(path.resolve('/', redirectTo));
  });
});

server.get('/signout', (req, res) => {
  res.clearCookie('session');
  res.redirect('/');
});

server.get('*', render);

server.listen(port, () => {
  /* eslint-disable no-console */
  console.log(`The server is running at http://localhost:${port}/`);
});
