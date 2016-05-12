import fetch from '../core/fetch';
import ContentPage from '../components/ContentPage';
import App from '../containers/App';
import { wrapComponent } from './utils';

const content = ['about', 'privacy', 'contact', 'index'];

export function getContentRoute(location) {
  return fetch(`/api/content?path=${location.pathname}`).then(function(result) {
    return result.json();
  }).then(function(response) {
    return {component: wrapComponent(ContentPage, response)};
  });
}

export function getContentRoutes() {
  let routes = [];
  content.forEach((page) => {
    routes.push({
      path: '/' + page,
      component: App,
      getIndexRoute(location, callback) {
        return getContentRoute(location).then(function(contentRoute) {
          callback(null, contentRoute);
        }).catch(callback);
      }
    });
  });
  return routes;
}
