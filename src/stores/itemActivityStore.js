"use strict";

import Dispatcher from '../dispatcher/appDispatcher';
import ActionTypes from '../constants/actionTypes';
import _ from 'lodash';

import BaseStore from './baseStore';

import history from '../services/history';
import toastr from 'toastr';

import {DND, ITEM_ACTIVITY, UNIT, FREQUENCY, SIGN} from '../constants/parameters';

class ItemActivityStore extends BaseStore {
  constructor() {
    super();

    this._currentItemActivity = null;
    this._itemActivities = [];

    this.subscribe(() => this._registerToActions.bind(this))
  }

  reset() {
    this._initialized = false;
    this._currentItemActivity = null;
    this._itemActivities = [];
  }

  get itemActivities() {
    return this._itemActivities;
  }

  get currentItemActivity() {
    return this._currentItemActivity;
  }

  findBySlug(slug) {
    return _.find(this._itemActivities, {slug: slug});
  }

  filterNotDone() {
    return _.filter(this._itemActivities, {done: false});
  }

  filterByUserId(id) {
    return _.filter(this._itemActivities, {user_id: parseInt(id, 10)});
  }

  filterByItemSlug(slug) {
    return _.filter(this._itemActivities, {item_slug: slug});
  }

  filterBySlugs(slugs) {
    return _.filter(this._itemActivities, function(item) {
      return _.includes(slugs, item.slug);
    });
  }

  filterByItemSlugAndUserId(slug, id) {
    return _.filter(this._itemActivities, {
      item_slug: slug,
      user_id: id
    });
  }

  filterDoneByItemSlugAndUserId(slug, id) {
    return _.filter(this._itemActivities, {
      item_slug: slug,
      user_id: id,
      done: true
    });
  }

  _registerToActions(payload) {
    var action = payload.action;

    switch (action.actionType) {

      case ActionTypes.INITIALIZE_APP_RESPONSE:
        this._initialized = true;
        this._itemActivities = action.json.itemActivities;
        this.emitChange();
        break;

      case ActionTypes.GET_ITEM_ACTIVITIES_RESPONSE:
        if (action.errors) {
          this._errors = action.errors;
        } else {
            this._initialized = true;
            this._success = true;
            this._itemActivities = action.json.itemActivities;
        }

        this.emitChange()
        break;

      case ActionTypes.ANSWER_ITEM_ACTIVITY_RESPONSE:
        if (action.errors) {
          this._success = false;
          this._errors = action.errors;
        } else {
          this._success = true;
          var newItemActivity = action.json.itemActivity;

          var existing = _.find(this._itemActivities, {slug: newItemActivity.slug});
          var existingIndex = _.indexOf(this._itemActivities, existing);

          this._itemActivities.splice(existingIndex, 1, newItemActivity);
          this._currentItemActivity = newItemActivity;

          // We should check if any other item activity has changed
          // This could be true for Tasks and Text questions

          let otherItemActivities = action.json.oldItemActivities;
          if (otherItemActivities && otherItemActivities !== null) {
            _.each(otherItemActivities, (iA) => {
              let tempExisting = _.find(this._itemActivities, {slug: iA.slug});
              let tempExistingIndex = _.indexOf(this._itemActivities, tempExisting);

              this._itemActivities.splice(tempExistingIndex, 1, iA);
              this._currentItemActivity = iA;
            });
          }

        }

        this.emitChange()
        break;

      case ActionTypes.GET_ITEM_ACTIVITY_RESPONSE:
        if (action.errors) {
          this._success = false;
          this._errors = action.errors;
        } else {
          this._success = true;
          this._itemActivities.push(action.json);
          this._currentItemActivity = action.json;
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
          _.remove(this._itemActivities, {user_id: parseInt(userId, 10)});
        }

        this.emitChange()
        break;

    };
  }
}

export default new ItemActivityStore();