import React, { PropTypes } from 'react';
import {connect} from 'react-redux';
import { replace } from 'react-router-redux';

export default function withAuthentication(Component) {

  class AuthenticatedComponent extends React.Component {
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
      const { dispatch, location: { pathname }, isAuthenticated } = this.props;

      if (!isAuthenticated) {
        dispatch(replace(`/login?redirectTo=${pathname}`));
      }
    }

    render() {
      const { isAuthenticated } = this.props;

      return (
        <div>
          { isAuthenticated ? <Component {...this.props} /> : null }
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

  return connect(mapStateToProps)(AuthenticatedComponent);
}
