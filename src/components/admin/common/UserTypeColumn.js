"use strict";

import React, {Component} from 'react';
import {Link} from 'react-router';
import {USER} from '../../../constants/parameters';

export default class UserTypeColumn extends Component {
  render() {

    return (
      <div>
        {this.props.data === USER.PATIENT ? 'Patient' : 'Médecin'}
      </div>
    );
  }
}
