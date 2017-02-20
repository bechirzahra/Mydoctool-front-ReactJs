"use strict";

import Dispatcher from '../dispatcher/appDispatcher';
import ActionTypes from '../constants/actionTypes';
import _ from 'lodash';

import BaseStore from './baseStore';

import history from '../services/history';
import toastr from 'toastr';

class InviteStore extends BaseStore {
  constructor() {
    super();

    this._currentInvite = null;
    this._invites = [];

    this.subscribe(() => this._registerToActions.bind(this))
  }

  reset() {
    this._initialized = false;
    this._currentInvite = null;
    this._invites = [];
  }

  get invites() {
    return this._invites;
  }

  get currentInvite() {
    return this._currentInvite;
  }

  getErrors() {
    return this._errors;
  }

  findBySlug(slug) {
    return _.find(this._invites, {slug: slug});
  }

  filterByOrganizationSlug(slug) {
    return _.filter(this._invites, (invite) => {
      return invite.from_organization_slug && invite.from_organization_slug === slug;
    })
  }

  _registerToActions(payload) {
    var action = payload.action;

    switch (action.actionType) {

      // Initialize the Admin Area
      case ActionTypes.INITIALIZE_ADMIN_RESPONSE:
        this._invites = action.json.invites;
        this._initialized = true;
        this.emitChange();
        break;

      case ActionTypes.INITIALIZE_APP_RESPONSE:
        this._initialized = true;
        this._invites = action.json.invites;
        this.emitChange();
        break;

      case ActionTypes.GET_INVITES_RESPONSE:
        if (action.errors) {
          this._errors = action.errors;
        } else {
            this._initialized = true;
            this._success = true;
            this._invites = action.json.items;
        }

        this.emitChange()
        break;

      case ActionTypes.CREATE_INVITE_RESPONSE:
        if (action.errors) {
          this._errors = action.errors;
        } else {
          this._success = true;
          this._invites.push(action.json);
        }

        this.emitChange()
        break;

      case ActionTypes.GET_INVITE_RESPONSE:
        if (action.errors) {
          this._success = false;
          this._errors = action.errors;
        } else {
          this._success = true;
          this._invites.push(action.json);
          this._currentInvite = action.json;
        }

        this.emitChange()
        break;

      case ActionTypes.DELETE_INVITE_RESPONSE:
        _.remove(this._invites, function(invite) {
            return action.json.slug === invite.slug;
        });

        this._currentInvite = null;

        toastr.success('Invitation supprimée', 'Succès !');
        history.replaceState(null, '/admin/invites');

        this.emitChange()
        break;
    };
  }
}

export default new InviteStore();