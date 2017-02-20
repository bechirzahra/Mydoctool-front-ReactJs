"use strict";

import Dispatcher from '../dispatcher/appDispatcher';
import ActionTypes from '../constants/actionTypes';
import jwtDecode from 'jwt-decode';
import _ from 'lodash';

import BaseStore from './baseStore';
import UserStore from './userStore';

import AuthActions from '../actions/authActionCreators';
import history from '../services/history';

// Error is an object
var handleErrors = function(errors) {
  var _ret = {
    code: errors.code,
    message: errors.message,
    children: {}
  };

  if (errors.children) {
    _.forIn(errors.children, function(v, k) {
      if (v && v[0]) {
          _ret.children[k] = v[0];
      }
    });
  }

  return _ret;
};

class AuthStore extends BaseStore {
  constructor() {
    super();
    this._user = null;
    this._userId = null;
    this._jwt = null;

    this.subscribe(() => this._registerToActions.bind(this))
  }

  reset() {
    this._initialized = false;
    this._user = null;
    this._userId = null;
    this._jwt = null;
  }

  authUser(jwt) {
    if (jwt && jwt !== null && jwt !== 'null' && jwt !== '') {
      this._jwt = jwt;
      this._user = jwtDecode(this._jwt);
      localStorage.setItem('jwt', jwt);

      return true;
    }
    return false;
  }

  logout (reload = true) {
    localStorage.setItem('jwt', null);
    this._jwt = null;
    this._user = null;
    this._initialized = false;
    UserStore.initialized = false;
    if (reload) {
      window.location.reload();
    }
  }

  get user() {
    return this._user;
  }

  getJwt() {
    return this._jwt;
  }

  isLoggedIn() {
    return !!this._user;
  }

  getUserId() {
    return this._userId;
  }

  _registerToActions(payload) {
    var action = payload.action;

    switch (action.actionType) {

      // Given a token, auth a User
      case ActionTypes.AUTH_USER:
        this.authUser(action.jwt);
        break;

      // LOGIN: Response from the server
      case ActionTypes.LOGIN_RESPONSE:

        if (action.json && this.authUser(action.json.token)) {
          this._userId = action.json.data.userId;
          this._roles = action.json.data.c_roles;
          history.replaceState(null, '/dashboard');
        }

        if (action.errors) {
          this._errors = handleErrors(action.errors);
        }

        this.emitChange();
        break;

      // REGISTER: Response from the server
      case ActionTypes.REGISTER_RESPONSE:
        if (action.errors) {
          this._errors = action.errors;
        }
        else {
          if (action.json && this.authUser(action.json.token)) {
            this._userId = action.json.data.userId;
            history.replaceState(null, '/dashboard');
          }
        }
        this.emitChange();
        break;

      // The user has been disconnected
      case ActionTypes.SHOULD_LOGIN_USER:
        this.logout();
        history.replaceState(null, '/login');
        this.emitChange();
        break;

      case ActionTypes.RESET_PASSWORD_RESPONSE:
        if (action.errors) {
          this._errors = handleErrors(action.errors);
        } else {
          this._success = true;
        }

        this.emitChange();
        break;

        case ActionTypes.RESETTING_PASSWORD_RESPONSE:
          if (action.errors) {
              this._errors = handleErrors(action.errors);
          } else {
            if (action.json && this.authUser(action.json.token)) {
              this._userId = action.json.data.userId;
              // @TODO: Redirect to profile page
              history.replaceState(null, '/dashboard');
            }
          }

          this.emitChange();
          break;
    };
  }
}

export default new AuthStore();