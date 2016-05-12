import React, { Component, PropTypes } from 'react';
import Navigation from '../Navigation';
import AlertPane from '../AlertPane';

class Header extends Component {
  static propTypes = {
    title: PropTypes.string,
    alert: PropTypes.object.isRequired,
    onAlertDismiss: PropTypes.func.isRequired,
  };

  render() {
    const { title, alert, onAlertDismiss } = this.props;

    return (
      <div className="container-fluid">
        <Navigation />
        <h2>{title}</h2>
        <AlertPane alert={alert} onAlertDismiss={onAlertDismiss} />
      </div>
    );
  }
}

export default Header;
