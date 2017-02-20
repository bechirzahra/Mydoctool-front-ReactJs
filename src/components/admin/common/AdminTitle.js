"use strict";

import React, {Component, PropTypes} from 'react';

class AdminTitle extends Component {
  render = () => {
    return (
      <div className="row">
        <div className="col-lg-12">
          <h1 className="page-header">{this.props.title}</h1>
        </div>
      </div>
    );
  }
}

AdminTitle.propTypes = {
  title: PropTypes.string.isRequired
}

export default AdminTitle;