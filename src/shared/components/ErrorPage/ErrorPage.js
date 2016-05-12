import React, { Component, PropTypes } from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './ErrorPage.scss';

let title = 'Error';
let content = 'Sorry, a critical error occurred on this page.';

class ErrorPage extends Component {

  render() {
    console.log(this.props);

    if (this.props.statusCode !== undefined)
      if (this.props.statusCode === 404) {
        title = 'Page Not Found';
        content = 'Sorry, the page you were trying to view does not exist.';
      }

    return (
      <div>
        <h1>{title}</h1>
        <p>{content}</p>
      </div>
    );
  }

}

export default withStyles(s)(ErrorPage);
