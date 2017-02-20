"use strict";

import React, {Component} from 'react';
import {Link} from 'react-router';

import 'metis-menu';

export default class NavAdmin extends Component {

  constructor(props) {
    super(props);

    var $nav = $('nav');
    $nav.metisMenu();
  }

  render = () => {
    return (
      <nav ref="mainNav" className="navbar navbar-default navbar-static-top" role="navigation" style={{marginBottom: 0}}>

        <div className="navbar-header">
          <a className="navbar-brand" href="index.html">MyDocTool Admin</a>
        </div>

        <div className="navbar-default sidebar" role="navigation">
          <div className="sidebar-nav navbar-collapse">
            <ul className="nav" id="side-menu">
              <li><Link to="/admin"><i className="fa fa-dashboard fa-fw"></i> Dashboard</Link></li>
              <li><Link to="/admin/organizations"><i className="fa fa-folder-o fa-fw"></i> Organizations</Link></li>
              <li><Link to="/admin/users"><i className="fa fa-user fa-fw"></i> Utilisateurs</Link></li>
              <li><Link to="/admin/listings"><i className="fa fa-user fa-fw"></i> Protocoles</Link></li>
              <li><a onClick={this.props.reset}>-> [Retour sur MyDocTool]</a></li>
            </ul>
          </div>
        </div>
      </nav>
    );
  }
}
