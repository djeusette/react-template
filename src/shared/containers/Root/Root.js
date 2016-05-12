import React, { Component, PropTypes } from 'react'
import { Provider } from 'react-redux';
import DevTools from '../../containers/DevTools';
import emptyFunction from 'fbjs/lib/emptyFunction';
import _ from 'lodash';
import routes from '../../routes';
import { Router, RouterContext } from 'react-router';
import s from './Root.scss';

class Root extends Component {
  static propTypes = {
    store: PropTypes.object.isRequired,
    renderProps: PropTypes.object.isRequired,
    context: PropTypes.shape({
      insertCss: PropTypes.func
    })
  };

  static childContextTypes = {
    insertCss: PropTypes.func.isRequired
  };

  componentWillMount() {
    const { context } = this.props;
    this.removeCss = context.insertCss(s);
  }

  componentWillUnmount() {
    this.removeCss();
  }

  getChildContext() {
    return this.props.context;
  }

  getRouterElement() {
    return process.env.BROWSER ?
      (<Router {...this.props.renderProps}>{routes}</Router>)
    :
      (<RouterContext {...this.props.renderProps} />)
  }

  getContent() {
    return __DEV__ ?
      (<div className={s.wrapper}>
        { this.getRouterElement() }
        <DevTools />
      </div>)
    :
      this.getRouterElement()
  }

  render() {
    const { store } = this.props;
    return (
      <Provider store={store}>
        { this.getContent() }
      </Provider>
    );
  }
}

export default Root;

