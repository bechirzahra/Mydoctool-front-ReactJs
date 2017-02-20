"use strict";

import React, {Component} from 'react';
import {Link} from 'react-router';
import dateFormat from 'dateformat-light';

export default class BoolGridColumn extends Component {
  render() {
    return (
      <div>
        {this.props.data ? 'Oui' : 'Non'}
      </div>
    );
  }
}
