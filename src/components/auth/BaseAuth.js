'use strict';

import React, {Component} from 'react';
import NavBar from '../common/NavBar';

export default class BaseAuth extends Component {
  render() {

    return (
      <div className="base-auth">
        {this.props.children}
      </div>
    );
  }
}