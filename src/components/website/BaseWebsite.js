'use strict';

import React, {Component} from 'react';

export default class BaseWebsite extends Component {
  render() {
    return this.props.children;
  }
}
