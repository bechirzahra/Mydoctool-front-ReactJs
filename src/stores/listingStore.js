"use strict";

import Dispatcher from '../dispatcher/appDispatcher';
import ActionTypes from '../constants/actionTypes';
import _ from 'lodash';

import BaseStore from './baseStore';

import history from '../services/history';
import toastr from 'toastr';

class ListingStore extends BaseStore {
  constructor() {
    super();

    this._currentListing = null;
    this._listings = [];
    this._templates = [];

    this.subscribe(() => this._registerToActions.bind(this))
  }

  reset() {
    this._initialized = false;
    this._currentListing = null;
    this._listings = [];
    this._templates = [];
  }

  get listings() {
    return this._listings;
  }

  get templates() {
    return this._templates;
  }

  get currentListing() {
    return this._currentListing;
  }

  findBySlug(slug) {
    return _.find(this._listings, {slug: slug});
  }

  getSelectOptions() {
    return _.map(this._listings, (listing) => {
      return {name: listing.name, slug: listing.slug};
    })
  }

  getSelectOptionsBis(maxLength = 35) {
    let options = _.map(this._listings, (listing) => {
      let label = listing.name;
      if (listing.name.length > maxLength) {
        label = label.slice(0, 27) + '...';
      }
      return {label: label, value: listing.slug};
    });
    options.unshift({label: 'Selectionnez un protocole', value: ''});
    return options;
  }

  _registerToActions(payload) {
    var action = payload.action;

    switch (action.actionType) {

      // Initialize the Admin Area
      case ActionTypes.INITIALIZE_ADMIN_RESPONSE:
        this._listings = action.json.listings;
        this._initialized = true;
        this.emitChange();
        break;

      case ActionTypes.INITIALIZE_APP_RESPONSE:
        this._listings = action.json.listings;
        this._templates = action.json.templates;
        this._initialized = true;
        this.emitChange();
        break;

      case ActionTypes.GET_LISTINGS_RESPONSE:
        if (action.errors) {
          this._errors = action.errors;
        } else {
            this._initialized = true;
            this._success = true;
            this._listings = action.json.items;
        }

        this.emitChange()
        break;

      case ActionTypes.CREATE_LISTING_RESPONSE:
        if (action.errors) {
          this._success = false;
          this._errors = action.errors;
        } else {
          this._success = true;
          this._listings.push(action.json);
          this._currentListing = action.json;
        }

        this.emitChange()
        break;

      case ActionTypes.CREATE_EMPTY_LISTING_RESPONSE:
        if (action.errors) {
          this._success = false;
          this._errors = action.errors;
        } else {
          this._success = true;
          this._listings.push(action.json);
          this._currentListing = action.json;
        }

        this.emitChange()
        break;

      case ActionTypes.DUPLICATE_LISTING_RESPONSE:
        if (action.errors) {
          this._success = false;
          this._errors = action.errors;
        } else {
          this._success = true;
          this._listings.push(action.json.listing);
          this._currentListing = null;
        }

        this.emitChange()
        break;

      case ActionTypes.GET_LISTING_RESPONSE:
        if (action.errors) {
          this._success = false;
          this._errors = action.errors;
        } else {
          this._success = true;
          this._listings.push(action.json);
          this._currentListing = action.json;
        }

        this.emitChange()
        break;

      case ActionTypes.UPDATE_LISTING_RESPONSE:
        var newListing = action.json.listing;

        var existing = _.find(this._listings, {slug: newListing.slug});
        var existingIndex = _.indexOf(this._listings, existing);

        this._listings.splice(existingIndex, 1, newListing);
        this._currentListing = null;

        this.emitChange()
        break;

      case ActionTypes.TOGGLE_TEMPLATE_LISTING_RESPONSE:
        var newListing = action.json;

        var existing = _.find(this._listings, {slug: newListing.slug});
        var existingIndex = _.indexOf(this._listings, existing);

        this._listings.splice(existingIndex, 1, newListing);
        this._currentListing = newListing;

        this.emitChange()
        break;

      case ActionTypes.DELETE_LISTING_RESPONSE:
        _.remove(this._listings, function(listing) {
            return action.json.slug === listing.slug;
        });

        this._currentListing = null;

        this.emitChange()
        break;
    };
  }
}

export default new ListingStore();