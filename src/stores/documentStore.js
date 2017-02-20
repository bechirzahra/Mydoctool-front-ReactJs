"use strict";

import Dispatcher from '../dispatcher/appDispatcher';
import ActionTypes from '../constants/actionTypes';
import _ from 'lodash';

import BaseStore from './baseStore';

import history from '../services/history';
import toastr from 'toastr';

class DocumentStore extends BaseStore {
  constructor() {
    super();

    this._currentDocument = null;
    this._documents = [];

    this.subscribe(() => this._registerToActions.bind(this))
  }

  reset() {
    this._initialized = false;
    this._currentDocument = null;
    this._documents = [];
  }

  get documents() {
    return this._documents;
  }

  get currentDocument() {
    return this._currentDocument;
  }

  findBySlug(slug) {
    return _.find(this._documents, {slug: slug});
  }

  _registerToActions(payload) {
    var action = payload.action;

    switch (action.actionType) {

      case ActionTypes.GET_DOCUMENTS_RESPONSE:
        if (action.errors) {
          this._errors = action.errors;
        } else {
            this._initialized = true;
            this._success = true;
            this._documents = action.json.items;
        }

        this.emitChange()
        break;

      case ActionTypes.CREATE_MESSAGE_RESPONSE:
        if (action.errors) {
          this._success = false;
          this._errors = action.errors;
        } else {
          this._success = true;
          this._documents.push(action.json.documents);
        }

        this.emitChange()
        break;

      case ActionTypes.CREATE_DOCUMENT_RESPONSE:
        if (action.errors) {
          this._success = false;
          this._errors = action.errors;
        } else {
          this._success = true;
          this._documents.push(action.json);
          toastr.success('Document Créée', 'Succès !');
          history.replaceState(null, '/admin/documents');
        }

        this.emitChange()
        break;

      case ActionTypes.GET_DOCUMENT_RESPONSE:
        if (action.errors) {
          this._success = false;
          this._errors = action.errors;
        } else {
          this._success = true;
          this._documents.push(action.json);
          this._currentDocument = action.json;
        }

        this.emitChange()
        break;

      case ActionTypes.UPDATE_DOCUMENT_RESPONSE:
        var newDocument = action.json;

        var existing = _.find(this._documents, {slug: newDocument.slug});
        var existingIndex = _.indexOf(this._documents, existing);

        this._documents.splice(existingIndex, 1, newDocument);
        this._currentDocument = newDocument;

        toastr.success('Document mise à jour', 'Succès !');
        history.replaceState(null, '/admin/documents/' + newDocument.slug);

        this.emitChange()
        break;

      case ActionTypes.DELETE_DOCUMENT_RESPONSE:
        _.remove(this._documents, function(document) {
            return action.json.slug === document.slug;
        });

        this._currentDocument = null;

        toastr.success('Document supprimée', 'Succès !');
        history.replaceState(null, '/admin/documents');

        this.emitChange()
        break;
    };
  }
}

export default new DocumentStore();