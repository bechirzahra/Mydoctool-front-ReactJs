"use strict";

import Dispatcher from '../dispatcher/appDispatcher';
import ActionTypes from '../constants/actionTypes';
import _ from 'lodash';

import BaseStore from './baseStore';
import {CONFIG} from '../constants/parameters';

import history from '../services/history';
import toastr from 'toastr';

class OrganizationStore extends BaseStore {
  constructor() {
    super();

    this._currentOrganization = null;
    this._organizations = [];

    this.subscribe(() => this._registerToActions.bind(this))
  }

  reset() {
    this._initialized = false;
    this._currentOrganization = null;
    this._organizations = [];
  }

  get organizations() {
    return this._organizations;
  }

  get currentOrganization() {
    return this._currentOrganization;
  }

  findBySlug(slug) {
    return _.find(this._organizations, {slug: slug});
  }

  filterBySlugs(slugs) {
    return _.filter(this._organizations, (org) => {
      return _.includes(slugs, org.slug);
    });
  }

  getLogoPath() {
    if (this._currentOrganization && this._currentOrganization.logo_path && this._currentOrganization.logo_path !== '') {
      return CONFIG.UPLOAD_ROOT + this._currentOrganization.logo_path;
    }
    return '';
  }

  getOrganizationImage(organization) {
    if (organization !== null) {
      let gOrg = null;
      if (organization.slug === this._currentOrganization.slug) {
        gOrg = this._currentOrganization;
      } else {
        gOrg = _.find(this._organizations, {slug: organization.slug});
      }

      return (gOrg && gOrg !== null && gOrg.image_path !== undefined) ? CONFIG.UPLOAD_ROOT + gOrg.image_path : '';
    }
    return '';
  }

  _registerToActions(payload) {
    var action = payload.action;

    switch (action.actionType) {

      // Initialize the Admin Area
      case ActionTypes.INITIALIZE_ADMIN_RESPONSE:
        this._organizations = action.json.organizations;
        this._initialized = true;
        this.emitChange();
        break;

      case ActionTypes.INITIALIZE_APP_RESPONSE:
        this._initialized = true;

        this._organizations = action.json.organizations;
        if (action.json.organizations.length === 1) {
          this._currentOrganization = action.json.organizations[0];
        }
        this.emitChange();
        break;

      case ActionTypes.GET_ORGANIZATIONS_RESPONSE:
        if (action.errors) {
          this._errors = action.errors;
        } else {
            this._initialized = true;
            this._success = true;
            this._organizations = action.json.items;
        }

        this.emitChange()
        break;

      case ActionTypes.CREATE_ORGANIZATION_RESPONSE:
        if (action.errors) {
          this._success = false;
          this._errors = action.errors;
        } else {
          this._success = true;
          this._organizations.push(action.json);
          toastr.success('Organisation Créée', 'Succès !');
          history.replaceState(null, '/admin/organizations');
        }

        this.emitChange()
        break;

      case ActionTypes.GET_ORGANIZATION_RESPONSE:
        if (action.errors) {
          this._success = false;
          this._errors = action.errors;
        } else {
          this._success = true;
          this._organizations.push(action.json);
          this._currentOrganization = action.json;
        }

        this.emitChange()
        break;

      case ActionTypes.UPDATE_ORGANIZATION_RESPONSE:
        var newOrganization = action.json;

        var existing = _.find(this._organizations, {slug: newOrganization.slug});
        var existingIndex = _.indexOf(this._organizations, existing);

        this._organizations.splice(existingIndex, 1, newOrganization);
        this._currentOrganization = newOrganization;

        toastr.success('Organisation mise à jour', 'Succès !');
        this.emitChange()
        break;

      case ActionTypes.DELETE_ORGANIZATION_RESPONSE:
        _.remove(this._organizations, function(organization) {
            return action.json.slug === organization.slug;
        });

        this._currentOrganization = null;

        toastr.success('Organisation supprimée', 'Succès !');
        history.replaceState(null, '/admin/organizations');

        this.emitChange()
        break;
    };
  }
}

export default new OrganizationStore();