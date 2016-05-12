import RootRoute from './RootRoute';
import ErrorRoute from './ErrorRoute';
import { getContentRoutes } from './ContentRoutes';

export default [RootRoute, ...getContentRoutes(), ErrorRoute];
