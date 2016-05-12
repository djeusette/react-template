import React, { Component, PropTypes } from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './ContentPage.scss';
import Helmet from 'react-helmet';

class ContentPage extends Component {
  static contextTypes = {
    onSetPageTitle: PropTypes.func.isRequired
  };

  static propTypes = {
    content: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    error: PropTypes.string
  };

  componentWillMount() {
    const { title } = this.props;
    this.context.onSetPageTitle(title);
  }

  render() {
    let { content, title, error } = this.props;
    let pageTitle = title || 'Not found';

    return (
      <div className='container-fluid'>
        <Helmet title={title} />
        <div dangerouslySetInnerHTML={{ __html: content || error || '' }} />
      </div>
    );
  }
}

export default withStyles(s)(ContentPage);
