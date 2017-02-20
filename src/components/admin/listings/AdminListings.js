'use strict';

import React, {Component} from 'react';
import AdminTitle from '../common/AdminTitle';
import {Link} from 'react-router';
import ListingGrid from './ListingGrid';

class AdminListings extends Component {
  render() {
    return (
      <div>
        <AdminTitle title="Protocoles" />

        <div className="row">
          <div className="col-lg-12">
            <ListingGrid resultsPerPage={40} />
          </div>
        </div>
      </div>
    );
  }
}

export default AdminListings;