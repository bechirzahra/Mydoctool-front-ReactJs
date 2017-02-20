"use strict";

import React, {Component} from 'react';
import {Link} from 'react-router';

export default class ActionsGridColumn extends Component {
  render() {
    var modelUri = this.props.metadata.meta.modelUri;
    var viewUrl = "/admin/" + modelUri + "/";
    let edit = true;

    if (modelUri === 'users') {
      viewUrl += this.props.rowData.id;
      edit = false;
    } else {
      viewUrl += this.props.rowData.slug;
    }

    var editUrl = viewUrl + '/edit';

    return (
      <div>
        <Link to={viewUrl}>Voir</Link> {edit ? (<span>| <Link to={editUrl}>Editer</Link></span>) : ''}
      </div>
    );
  }
}
