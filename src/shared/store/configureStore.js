let configureStore = (
  __DEV__ ?
    require('./configureStore.dev.js') :
    require('./configureStore.prod.js')
  ).configureStore;

export default configureStore;
