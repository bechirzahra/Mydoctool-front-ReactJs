'use strict';

import React, {Component} from 'react';
import AdminTitle from '../common/AdminTitle';
import {Link} from 'react-router';

import UserGrid from './UserGrid';

export default class Users extends Component {
  render() {
    return (
      <div>
        <AdminTitle title="Utilisateurs" />

        <div className="row">
          <div className="col-lg-12">
            <UserGrid resultsPerPage={40} />
          </div>
        </div>
      </div>
    );
  }
}
