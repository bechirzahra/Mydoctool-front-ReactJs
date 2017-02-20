"use strict";

import React, {Component} from 'react';
import {Link, History} from 'react-router';

import AuthStore from '../../stores/authStore';
import UserStore from '../../stores/userStore';
import MessageStore from '../../stores/messageStore';
import Messages from './messages/Messages';
import UserActionCreators from '../../actions/userActionCreators';
import {USER} from '../../constants/parameters';


const Account = React.createClass({
  mixins: [
    History
  ],

  getInitialState() {
    return {
      filePreview: null
    };
  },

  logout(e) {
    e.preventDefault();
    AuthStore.logout();

    this.history.replaceState(null, '/');
  },

  openFile(e) {
    let fileInput = this.refs.fileInput;
    fileInput.value = null;
    fileInput.click();
  },

  uploadFile(e) {
    let file = null;
    if (e.target.files.length) {
      file = e.target.files[0];
    }

    this.setState({filePreview: window.URL.createObjectURL(file)});

    UserActionCreators.uploadAvatar(file);
  },

  render() {
    let avatarUrl = this.state.filePreview !== null ? this.state.filePreview : UserStore.avatar;
    let user = UserStore.currentUser;
    let moreMenu = '';

    if (UserStore.hasRole('ROLE_MANAGER')) {
      moreMenu = (
        <li><Link to="/settings/organization" activeClassName="active"><span className="icon icon-house"></span> Mon groupe</Link></li>
      );
    } else if (user.type === USER.PATIENT){
      moreMenu = (
        <li><Link to="/settings/address" activeClassName="active"><span className="icon icon-house"></span> Mon adresse</Link></li>
      );
    }

    let isMainActive = this.history.isActive('/settings') &&
      (!this.history.isActive('/settings/password') &&
      !this.history.isActive('/settings/address') &&
      !this.history.isActive('/settings/organization')
      );

    return (
      <div id="account" className="container">

        <div className="leftSidebar col-md-3">
          <div id="profilPicture">
            <div className="overflow">
              <img src={avatarUrl} className="" />
            </div>
            <a onClick={this.openFile}>
              <span className="icon-camera"></span>
              <input type="file"
                ref="fileInput"
                name="avatar"
                onChange={this.uploadFile}
                style={{display: 'none'}}
              />
            </a>
          </div>
          <ul className="accountMenu">
              <li><Link to="/settings" className={isMainActive ? "active" : ''}><span className="icon icon-user"></span> Mes informations</Link></li>
              {moreMenu}
              <li><Link to="/settings/password" activeClassName="active"><span className="icon icon-locked"></span> Mot de passe</Link></li>
              <li><a href="#" onClick={this.logout}><span className="icon icon-logout"></span> Déconnexion</a></li>
          </ul>
        </div>

        {this.props.children}

      </div>
    );
  }

});

export default Account;