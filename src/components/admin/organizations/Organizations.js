'use strict';

import React, {Component} from 'react';
import AdminTitle from '../common/AdminTitle';
import {Link} from 'react-router';

import OrganizationGrid from './OrganizationGrid';

export default class Organizations extends Component {
  render() {
    return (
      <div>
        <AdminTitle title="Organisations" />

        <div className="row">
          <div className="col-lg-12">
            <div style={{marginBottom: 20}}>
              <Link to="/admin/organizations/new" className="btn btn-primary">Créer une Organisation</Link>
            </div>
            <OrganizationGrid resultsPerPage={40} />
          </div>
        </div>
      </div>
    );
  }
}
