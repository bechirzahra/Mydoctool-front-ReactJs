"use strict";

import Dispatcher from '../dispatcher/appDispatcher';
import ActionTypes from '../constants/actionTypes';
import _ from 'lodash';
import dateFormat from 'dateformat-light';
import BaseStore from './baseStore';
import AuthStore from './authStore';
import {CONFIG} from '../constants/parameters';
import history from '../services/history';

class UserStore extends BaseStore {
  constructor() {
    super();

    this._currentUser = null;
    this._users = [];

    this.subscribe(() => this._registerToActions.bind(this))
  }

  reset() {
    this._initialized = false;
    this._currentUser = null;
    this._users = [];
  }

  get users() {
    return this._users;
  }

  get currentUser() {
    return this._currentUser;
  }

  get avatar() {
    if (this._currentUser !== null && this._currentUser.avatar_path && this._currentUser.avatar_path !== null) {
      return CONFIG.UPLOAD_ROOT + this._currentUser.avatar_path;
    }
    return '';
  }

  getUserBirthday(user) {
    return new Date(user.birthday_year, user.birthday_month - 1, user.birthday_day);
  }

  getUserAge(user) {
    let birthday = this.getUserBirthday(user);
    let ageDifMs = Date.now() - birthday.getTime();
    let ageDate = new Date(ageDifMs); // miliseconds from epoch
    return Math.abs(ageDate.getUTCFullYear() - 1970);
  }

  getInterventionDate(user) {
    let date = new Date(user.intervention_year, user.intervention_month - 1, user.intervention_day);

    return dateFormat(date, 'dd/mm/yyyy');
  }

  getUserAvatar(user) {
    if (user && user !== null) {
      let gUser = null;
      if (user.id === this._currentUser.id) {
        gUser = this._currentUser;
      } else {
        gUser = _.find(this._users, {id: user.id});
      }

      return (gUser && gUser !== null && gUser.avatar_path !== undefined) ? CONFIG.UPLOAD_ROOT + gUser.avatar_path : '';
    }
    return '';
  }

  findById(id) {
    return _.find(this._users, {id: parseInt(id, 10)});
  }

  filterByIds(ids) {
    return _.filter(this._users, (user) => {
      return _.includes(ids, user.id);
    });
  }

  filterByOrganizationSlug(slug) {
    return _.filter(this._users, (user) => {
      return user.organization_slug && user.organization_slug === slug;
    })
  }

  hasRole(role) {
    return this.currentUser.roles.indexOf(role) >= 0;
  }

  filterFavorites() {
    return _.filter(this._users, user => {
      return user.favorite;
    });
  }

  getSizeOptions() {
    let ret = [];
    for (let i = 100; i <= 220; i++) {
      let label = i/100;
      if (i % 10 === 0 && i % 100 !== 0) {label += '0'};
      ret.push({label: `${label}m`, value: i});
    };
    return ret;
  }

  getYearOptions() {
    let ret = [];
    for (let i = 2016; i >= 1900; i--) {
      ret.push({label: i, value: i});
    };
    return ret;
  }

  getMonthOptions() {
    let ret = [];
    for (let i = 1; i <= 12; i++) {
      let date = new Date(2015, i-1);
      let label = dateFormat(date, 'mmmm');
      ret.push({label: label, value: i});
    }
    return ret;
  }

  getDayOptions() {
    let ret = [];
    for (let i = 1; i <= 31; i++) {
      ret.push({label: i, value: i});
    };
    return ret;
  }

  _registerToActions(payload) {
    var action = payload.action;

    switch (action.actionType) {

      case ActionTypes.INITIALIZE_APP_RESPONSE:
        this._initialized = true;

        // So far, here the linkedUsers struct : [{user => Object, favorite: Boolean}, ...]
        // We should flat it
        if (action.json && action.json.linkedUsers) {
          let tempUsersArray = JSON.parse(action.json.linkedUsers);
          this._users = []  ;
          tempUsersArray.forEach(user => {
            let newUser = user.user;
            newUser.favorite = user.favorite;
            newUser.enabled = user.enabled;
            this._users.push(newUser);
          });
        }

        this._currentUser = action.json.user;
        this.emitChange();
        break;

      // Initialize the Admin Area
      case ActionTypes.INITIALIZE_ADMIN_RESPONSE:
        this._users = action.json.users;

        if (action.json && action.json.linkedUsers) {
          let uIds = action.json.linkedUsers;

          _.forEach(uIds, (ids, uId) => {
            let existing = _.find(this._users, {id: parseInt(uId,10)});
            if (existing && existing !== null) {
              let newUser = existing;
              newUser.linked_users = ids;
              let existingIndex = _.indexOf(this._users, existing);
              this._users.splice(existingIndex, 1, newUser);
            }
          })
        }

        this._initialized = true;
        this.emitChange();
        break;

      case ActionTypes.TOGGLE_FAVORITE_USER_RESPONSE:
        // Get the linked user that just changed
        // Update it in this._users;
        let newUser = action.json.user;
        newUser.favorite = action.json.favorite;

        var existing = _.find(this._users, {slug: newUser.slug});
        var existingIndex = _.indexOf(this._users, existing);

        this._users.splice(existingIndex, 1, newUser);

        this.emitChange();
        break;

      case ActionTypes.ANSWER_ITEM_ACTIVITY_RESPONSE:
        if (action.errors) {
          this._success = false;
          this._errors = action.errors;
        } else {
          this._success = true;
          var newMessages = action.json.messages;

          newMessages.forEach(function(message) {
            this._currentUser.received_messages_slugs.push(message.slug);
          }, this);
        }

        this.emitChange()
        break;

      case ActionTypes.UPDATE_USER_RESPONSE:
        if (action.errors) {
          this._success = false;
          this._errors = action.errors;
        } else {
          this._errors = [];
          var newUser = action.json;

          var existing = _.find(this._users, {slug: newUser.slug});
          var existingIndex = _.indexOf(this._users, existing);

          this._users.splice(existingIndex, 1, newUser);

          if (parseInt(this._currentUser.id, 10) === parseInt(newUser.id, 10)) {
            this._currentUser = newUser;
          }
        }

        this.emitChange()
        break;

      case ActionTypes.UPLOAD_AVATAR_RESPONSE:
        if (action.errors) {
          this._success = false;
          this._errors = action.errors;
        } else {
          this._errors = [];
          var newUser = action.json;
          var newAvatar = newUser.avatar_path;

          if (parseInt(this._currentUser.id, 10) === parseInt(newUser.id, 10)) {
            this._currentUser.avatar_path = newAvatar;
          }
        }

        this.emitChange()
        break;

      case ActionTypes.ADD_USER_LISTING_RESPONSE:
        if (action.errors) {
          this._success = false;
          this._errors = action.errors;
        } else {
          this._errors = [];

          let userId = action.json.user_id;
          let listingSlug = action.json.listing_slug;

          let existing = _.find(this._users, {id: parseInt(userId, 10)});
          let existingIndex = _.indexOf(this._users, existing);

          existing.custom_user_listings.push(action.json.userListing);

          this._users.splice(existingIndex, 1, existing);
        }

        this.emitChange()
        break;

      case ActionTypes.REMOVE_USER_LISTING_RESPONSE:
        if (action.errors) {
          this._success = false;
          this._errors = action.errors;
        } else {
          this._errors = [];

          let userId = action.json.user_id;
          let listingSlug = action.json.listing_slug;

          let existing = _.find(this._users, {id: parseInt(userId, 10)});
          let existingIndex = _.indexOf(this._users, existing);

          _.remove(existing.custom_user_listings, {listing_slug: listingSlug});

          this._users.splice(existingIndex, 1, existing);
        }

        this.emitChange()
        break;

      case ActionTypes.REMOVE_USER_PATIENT_RESPONSE:
        if (action.errors) {
          this._success = false;
          this._errors = action.errors;
        } else {
          this._errors = [];

          let userId = action.json.user_id;
          _.remove(this._users, {id: parseInt(userId, 10)});
        }

        this.emitChange()
        break;

    };
  }
}

export default new UserStore();
