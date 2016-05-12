import React from 'react';

export function wrapComponent(Component, props) {
  return React.createClass({ render: function() {
    return React.createElement(Component, props, this.props.children); }
  });
}
