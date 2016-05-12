import React, { Component, PropTypes } from 'react';
import { Alert } from 'react-bootstrap';
import { onErrorShown } from '../../actions/errors';

class AlertPane extends Component {
  static propTypes = {
    alert: PropTypes.object.isRequired,
    onAlertDismiss: PropTypes.func.isRequired
  };

  handleAlertDismiss() {
    this.props.onAlertDismiss();
  }

  render() {
    const { alert } = this.props;

    if (!alert.shown) {
      return (
        <Alert bsStyle="danger" onDismiss={this.handleAlertDismiss.bind(this)}>
          <p>{alert.content}</p>
        </Alert>
      );
    } else {
      return null;
    }
  }
}

export default AlertPane;
