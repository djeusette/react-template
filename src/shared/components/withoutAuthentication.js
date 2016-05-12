import React, { PropTypes } from 'react';
import {connect} from 'react-redux';
import { replace } from 'react-router-redux';

export default function withoutAuthentication(Component) {
  class NotAuthenticatedComponent extends React.Component {
    static contextTypes = {
      router: PropTypes.object.isRequired
    };

    componentWillMount() {
      this.checkAuth();
    }

    componentWillReceiveProps(nextProps) {
      this.checkAuth();
    }

    checkAuth() {
      const { dispatch, isAuthenticated } = this.props;

      if (isAuthenticated) {
        dispatch(replace('/'));
      }
    }

    render() {
      const { isAuthenticated } = this.props;

      return (
        <div>
          { isAuthenticated ? null : <Component {...this.props} /> }
        </div>
      )
    }
  }

  function mapStateToProps(state) {
    const { user } = state;
    const {
      isAuthenticated
    } = user;

    return {
      isAuthenticated
    };
  }

  return connect(mapStateToProps)(NotAuthenticatedComponent);
}
