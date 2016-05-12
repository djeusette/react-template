import React, { Component, PropTypes } from 'react';
import s from './App.scss';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { Map } from 'immutable';
import { connect } from 'react-redux';
import { onErrorShown } from '../../actions/errors';

class App extends Component {
  static propTypes = {
    children: PropTypes.element.isRequired,
    error: PropTypes.object.isRequired,
    dispatch: PropTypes.func.isRequired
  };

  static contextTypes = {
    history: PropTypes.object,
    router: PropTypes.object.isRequired,
    insertCss: PropTypes.func.isRequired
  };

  static childContextTypes = {
    history: PropTypes.object,
    router: PropTypes.object.isRequired,
    insertCss: PropTypes.func.isRequired,
    onSetPageTitle: PropTypes.func.isRequired
  };

  getChildContext() {
    return Object.assign({}, this.context, {onSetPageTitle: this.onSetPageTitle});
  }

  constructor() {
    super();
    this.state = this._getInitialState();
    this.onSetPageTitle = this.onSetPageTitle.bind(this);
  }

  _getInitialState() {
    return {data: Map({'pageTitle': null})};
  }

  onSetPageTitle(title) {
    this.setState(({data}) => {
      return {data: data.set('pageTitle', title)};
    });
  }

  componentWillMount() {
    this.removeCss = this.context.insertCss(s);
  }

  componentWillUnmount() {
    this.removeCss();
  }

  onAlertDismiss() {
    const { dispatch } = this.props;
    dispatch(onErrorShown());
  }

  render() {
    const { error, children } = this.props;
    const pageTitle = this.state.data.get('pageTitle');

    return (
      <div className={s.root}>
        <Header alert={error} onAlertDismiss={this.onAlertDismiss.bind(this)} title={pageTitle} />
        { React.cloneElement(children) }
        <Footer />
      </div>
    );
  }
}

function mapStateToProps(state) {
  const { error } = state;
  return { error };
}

export default connect(mapStateToProps)(App);
