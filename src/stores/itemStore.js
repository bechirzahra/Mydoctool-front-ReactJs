"use strict";

import Dispatcher from '../dispatcher/appDispatcher';
import ActionTypes from '../constants/actionTypes';
import _ from 'lodash';

import BaseStore from './baseStore';

import history from '../services/history';
import toastr from 'toastr';
import Translator from '../services/Translator';

import {DND, ITEM, UNIT, FREQUENCY, SIGN} from '../constants/parameters';

class ItemStore extends BaseStore {
  constructor() {
    super();

    this._currentItem = null;
    this._items = [];

    this.subscribe(() => this._registerToActions.bind(this))
  }

  reset() {
    this._initialized = false;
    this._currentItem = null;
    this._items = [];
  }

  get items() {
    return this._items;
  }

  get currentItem() {
    return this._currentItem;
  }

  findBySlug(slug) {
    return _.find(this._items, {slug: slug});
  }

  filterBySlugs(slugs) {
    return _.filter(this._items, function(item) {
      return _.includes(slugs, item.slug);
    });
  }

  filterByListing(listingSlug) {
    return _.filter(this._items, {listing_slug: listingSlug});
  }

  getItemTypeFromString(type) {
    switch (type) {
      case DND.TASK:
        return ITEM.TYPE_TASK;
        break;
      case DND.NOTICE:
        return ITEM.TYPE_NOTICE;
        break;
      default:
        return ITEM.TYPE_QUESTION;
        break;
    }
  }

  getQuestionTypeFromString(questionType) {
    switch(questionType) {
      case DND.DATA:
        return ITEM.QUESTION_DATA;
        break;
      case DND_SELECT:
        return ITEM.QUESTION_SELECT;
        break;
      case DND_BOOL:
        return ITEM.QUESTION_BOOL;
        break;
      case DND_LEVEL:
        return ITEM.QUESTION_LEVEL;
        break;
      case DND_TEXT:
        return ITEM.QUESTION_TEXT;
        break;
    }
  }

  getFrequenciesValueOptions() {
    var ret = [];
    for (let i=1; i<=31; i++) {
      ret.push({value: i - 1, label: i});
    }
    return ret;
  }

  getFrequenciesFreqOptions() {
    return _.map(FREQUENCY, function(value, key) {
      return {value: value, label: Translator.translate(key)};
    });
  }

  getFrequenciesUnitOptions() {
    return _.map(UNIT, function(value, key) {
      return {value: value, label: Translator.translate(key)};
    });
  }

  getAlertSignOptions() {
    return _.map(SIGN, function(value, key) {
      return {value: value, label: Translator.translate(key)};
    });
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
        this._items = action.json.items;
        this.emitChange();
        break;

      case ActionTypes.GET_ITEMS_RESPONSE:
        if (action.errors) {
          this._errors = action.errors;
        } else {
            this._initialized = true;
            this._success = true;
            this._items = action.json.items;
        }

        this.emitChange()
        break;

      case ActionTypes.CREATE_ITEM_RESPONSE:
        if (action.errors) {
          this._success = false;
          this._errors = action.errors;
        } else {
          this._success = true;
          this._items.push(action.json.item);
        }

        this.emitChange()
        break;

      case ActionTypes.GET_ITEM_RESPONSE:
        if (action.errors) {
          this._success = false;
          this._errors = action.errors;
        } else {
          this._success = true;
          this._items.push(action.json);
          this._currentItem = action.json;
        }

        this.emitChange()
        break;

      case ActionTypes.DUPLICATE_LISTING_RESPONSE:
        if (action.errors) {
          this._success = false;
          this._errors = action.errors;
        } else {
          this._success = true;
          this._items = _.union(this._items, action.json.items);
        }

        this.emitChange()
        break;

      case ActionTypes.UPDATE_LISTING_RESPONSE:
        var listing = action.json.listing;
        var newItems = action.json.items;

        this._currentListing = null;

        // First, we remove old items
        _.remove(this._items, {listing_slug: listing.slug});

        // And we add all the items we have for this listing
        _.each(newItems, (item) => {

          // We have to cheat on arrays because of a JMS Serializer bug

          item.frequencies = JSON.parse(item.t_frequencies);
          delete item.t_frequencies;

          item.alerts = JSON.parse(item.t_alerts);
          delete item.t_alerts;

          item.options = JSON.parse(item.t_options);
          delete item.t_options

          this._items.push(item);
        });

        this.emitChange()
        break;

      case ActionTypes.UPDATE_ITEM_RESPONSE:
        var newItem = action.json;

        var existing = _.find(this._items, {slug: newItem.slug});
        var existingIndex = _.indexOf(this._items, existing);

        this._items.splice(existingIndex, 1, newItem);
        this._currentItem = newItem;

        this.emitChange()
        break;

      case ActionTypes.READ_ITEM_RESPONSE:
        var newItem = action.json;

        var existing = _.find(this._items, {slug: newItem.slug});
        var existingIndex = _.indexOf(this._items, existing);

        this._items.splice(existingIndex, 1, newItem);
        this._currentItem = newItem;

        this.emitChange()
        break;

      case ActionTypes.DELETE_ITEM_RESPONSE:
        _.remove(this._items, function(item) {
            return action.json.slug === item.slug;
        });

        this._currentItem = null;

        this.emitChange()
        break;
    };
  }
}

export default new ItemStore();
