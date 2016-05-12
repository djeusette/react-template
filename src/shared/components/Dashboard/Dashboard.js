import React, { Component, PropTypes } from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './Dashboard.scss';
import Helmet from 'react-helmet';

const title = 'Dashboard';

class Dashboard extends Component {
  static contextTypes = {
    onSetPageTitle: PropTypes.func.isRequired
  };

  componentWillMount() {
    const { onSetPageTitle } = this.context;
    onSetPageTitle(title);
  }

  render() {
    return (
      <div className='container-fluid'>
        <Helmet title={title} />
        <span>Hello</span>
      </div>
    );
  }
}

export default withStyles(s)(Dashboard);
