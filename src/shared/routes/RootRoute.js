import { getContentRoute } from './ContentRoutes';
import App from '../containers/App';
import DashboardRoute from './DashboardRoute';

export default {
  path: '/',
  component: App,
  childRoutes: [
    DashboardRoute
  ],
  getIndexRoute(location, callback) {
    getContentRoute(location).then((component) => {
      callback(null, component);
    });
  }
};
