"use strict";

import Dispatcher from '../dispatcher/appDispatcher';
import ActionTypes from '../constants/actionTypes';
import _ from 'lodash';

import BaseStore from './baseStore';

import history from '../services/history';
import toastr from 'toastr';

class CategoryStore extends BaseStore {
  constructor() {
    super();

    this._currentCategory = null;
    this._categories = [];

    this.subscribe(() => this._registerToActions.bind(this))
  }

  reset() {
    this._initialized = false;
    this._currentCategory = null;
    this._categories = [];
  }

  get categories() {
    return this._categories;
  }

  get currentCategory() {
    return this._currentCategory;
  }

  findBySlug(slug) {
    return _.find(this._categories, {slug: slug});
  }

  getSelectOptions() {
    return this._categories.reduce((prec, cour, index) => {
      return prec.concat({value: cour.slug, label: cour.name});
    }, []);
  }

  _registerToActions(payload) {
    var action = payload.action;

    switch (action.actionType) {

      case ActionTypes.INITIALIZE_APP_RESPONSE:
        this._categories = action.json.categories;
        this._initialized = true;
        this.emitChange();
        break;

      case ActionTypes.GET_CATEGORIES_RESPONSE:
        if (action.errors) {
          this._errors = action.errors;
        } else {
            this._initialized = true;
            this._success = true;
            this._categories = action.json.items;
        }

        this.emitChange()
        break;

      case ActionTypes.CREATE_CATEGORY_RESPONSE:
        if (action.errors) {
          this._success = false;
          this._errors = action.errors;
        } else {
          this._success = true;
          this._categories.push(action.json);
          this._currentCategory = action.json;
          toastr.success('Catégorie Créée', 'Succès !');
        }

        this.emitChange()
        break;

      case ActionTypes.GET_CATEGORY_RESPONSE:
        if (action.errors) {
          this._success = false;
          this._errors = action.errors;
        } else {
          this._success = true;
          this._categories.push(action.json);
          this._currentCategory = action.json;
        }

        this.emitChange()
        break;

      case ActionTypes.UPDATE_CATEGORY_RESPONSE:
        var newCategory = action.json;

        var existing = _.find(this._categories, {slug: newCategory.slug});
        var existingIndex = _.indexOf(this._categories, existing);

        this._categories.splice(existingIndex, 1, newCategory);
        this._currentCategory = newCategory;

        toastr.success('Organisation mise à jour', 'Succès !');
        history.replaceState(null, '/admin/categories/' + newCategory.slug);

        this.emitChange()
        break;

      case ActionTypes.DELETE_CATEGORY_RESPONSE:
        _.remove(this._categories, function(category) {
            return action.json.slug === category.slug;
        });

        this._currentCategory = null;

        toastr.success('Organisation supprimée', 'Succès !');
        history.replaceState(null, '/admin/categories');

        this.emitChange()
        break;
    };
  }
}

export default new CategoryStore();