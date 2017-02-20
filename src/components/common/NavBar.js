"use strict";

import React, {Component} from 'react';

import {Link} from 'react-router';
import AuthStore from '../../stores/authStore';

export default class NavBar extends Component {

  logout = () => {
    AuthStore.logout();
  }

  render() {

    var inOrOut = AuthStore.isLoggedIn() ? (
      <li><a href="#" onClick={this.logout}>Logout</a></li>
    ) : (
      <div>
      <li><Link to="/register">Register</Link></li>
      <li><Link to="/login">Login</Link></li>
      <li><Link to="/reset-password">Reset password</Link></li>
      </div>
    );

    return (
      <ul>
        <li><Link to="/">Home</Link></li>
        <li><Link to="/admin">Admin</Link></li>
        {inOrOut}
      </ul>
    );
  }
}