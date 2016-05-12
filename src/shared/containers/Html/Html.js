import React, { Component, PropTypes } from 'react';

class Html extends Component {

  static propTypes = {
    children: PropTypes.element.isRequired,
    entry: PropTypes.string.isRequired,
    helmet: PropTypes.object.isRequired,
    css: PropTypes.array.isRequired,
    trackingId: PropTypes.string
  };

  googleAnalytics() {
    const { trackingId } = this.props;

    if (trackingId) {
      const trackingCode = 'window.ga=function(){ga.q.push(arguments)};ga.q=[];ga.l=+new Date;' +
      `ga('create','${trackingId}','auto');ga('send','pageview')`;

      return (
        <div>
          <script dangerouslySetInnerHTML={{ __html: trackingCode }} />
          <script src="https://www.google-analytics.com/analytics.js" async defer />
        </div>
      );
    }
  };

  render() {
    const { helmet, children, entry, css } = this.props;

    return (
      <html {...helmet.htmlAttributes.toComponent()}>
        <head>
          {helmet.title.toComponent()}
          {helmet.base.toComponent()}
          {helmet.meta.toComponent()}
          {helmet.link.toComponent()}
          {helmet.style.toComponent()}

          <link rel='stylesheet' href='/assets/bootstrap/css/bootstrap.min.css' />
          <link rel='stylesheet' href='/assets/bootstrap/css/bootstrap-theme.min.css' />
          <link rel='stylesheet' href='/assets/font-awesome/css/font-awesome.min.css' />
          <link rel='stylesheet' href='/assets/bootstrap-social.css' />
          <style type='text/css' id='css'>{css.join('')}</style>
        </head>
        <body>
          {children}

          <script src={entry}></script>
          {this.googleAnalytics()}
          {helmet.script.toComponent()}
        </body>
      </html>
    );
  }
}

export default Html;
