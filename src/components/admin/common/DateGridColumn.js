"use strict";

import React, {Component} from 'react';
import {Link} from 'react-router';
import dateFormat from 'dateformat-light';
import isodate from 'isodate';

export default class DateGridColumn extends Component {
  render() {
    let dateFormatted = '';
    if (this.props.data && this.props.data !== null && this.props.data !== '') {
      dateFormatted = dateFormat(isodate(this.props.data), 'dd/mm/yyyy');
    }

    return (
      <div>
        {dateFormatted}
      </div>
    );
  }
}
