"use strict";

import Dispatcher from '../dispatcher/appDispatcher';
import ActionTypes from '../constants/actionTypes';
import _ from 'lodash';

import BaseStore from './baseStore';

import history from '../services/history';
import toastr from 'toastr';

class MessageStore extends BaseStore {
  constructor() {
    super();

    this._currentMessage = null;
    this._messages = [];

    this.subscribe(() => this._registerToActions.bind(this))
  }

  reset() {
    this._initialized = false;
    this._currentMessage = null;
    this._messages = [];
  }

  get messages() {
    return this._messages;
  }

  get currentMessage() {
    return this._currentMessage;
  }

  findBySlug(slug) {
    return _.find(this._messages, {slug: slug});
  }

  filterBySlugs(slugs) {
    return _.filter(this._messages, (message) => {
      return _.includes(slugs, message.slug);
    });
  }

  getUnreadMessages(messagesSlugs = null) {
    let allMessages = [];
    if (messagesSlugs === null) {
      allMessages = this._messages;
    } else {
      allMessages = this.filterBySlugs(messagesSlugs);
    }

    return _.filter(allMessages, (message) => {
      return !message.read;
    });
  }

  getMyUnreadMessages(userId) {
    return _.filter(this._messages, (message) => {
      return !message.read && message.to_user_id === userId;
    });
  }

  _registerToActions(payload) {
    var action = payload.action;

    switch (action.actionType) {

      case ActionTypes.INITIALIZE_APP_RESPONSE:
        this._initialized = true;
        this._messages = action.json.messages;
        this.emitChange();
        break;

      case ActionTypes.ANSWER_ITEM_ACTIVITY_RESPONSE:
        if (action.errors) {
          this._success = false;
          this._errors = action.errors;
        } else {
          this._success = true;
          var newMessages = action.json.messages;
          this._messages = _.union(this._messages, newMessages);
        }

        this.emitChange()
        break;

      case ActionTypes.GET_MESSAGES_RESPONSE:
        if (action.errors) {
          this._errors = action.errors;
        } else {
            this._initialized = true;
            this._success = true;
            this._messages = action.json.items;
        }

        this.emitChange()
        break;

      case ActionTypes.CREATE_MESSAGE_RESPONSE:
        if (action.errors) {
          this._success = false;
          this._errors = action.errors;
        } else {
          this._success = true;
          this._messages.push(action.json.message);
          toastr.success('Message Envoyé', 'Succès !');
        }

        this.emitChange()
        break;

      case ActionTypes.GET_MESSAGE_RESPONSE:
        if (action.errors) {
          this._success = false;
          this._errors = action.errors;
        } else {
          this._success = true;
          this._messages.push(action.json);
          this._currentMessage = action.json;
        }

        this.emitChange()
        break;

      case ActionTypes.UPDATE_MESSAGE_RESPONSE:
        var newMessage = action.json;

        var existing = _.find(this._messages, {slug: newMessage.slug});
        var existingIndex = _.indexOf(this._messages, existing);

        this._messages.splice(existingIndex, 1, newMessage);
        this._currentMessage = newMessage;

        toastr.success('Message mise à jour', 'Succès !');
        history.replaceState(null, '/admin/messages/' + newMessage.slug);

        this.emitChange()
        break;

      case ActionTypes.READ_MESSAGE_RESPONSE:
        var newMessage = action.json;

        var existing = _.find(this._messages, {slug: newMessage.slug});
        var existingIndex = _.indexOf(this._messages, existing);

        this._messages.splice(existingIndex, 1, newMessage);
        this._currentMessage = newMessage;

        this.emitChange()
        break;

      case ActionTypes.DELETE_MESSAGE_RESPONSE:
        _.remove(this._messages, function(message) {
            return action.json.slug === message.slug;
        });

        this._currentMessage = null;

        toastr.success('Message supprimée', 'Succès !');
        history.replaceState(null, '/admin/messages');

        this.emitChange()
        break;

      case ActionTypes.REMOVE_USER_PATIENT_RESPONSE:
        if (action.errors) {
          this._success = false;
          this._errors = action.errors;
        } else {
          this._errors = [];

          let userId = action.json.user_id;
          _.remove(this._messages, (message) => {
            return message.from_user_id === parseInt(userId, 10) || message.to_user_id === parseInt(userId, 10);
          });
        }

        this.emitChange()
        break;
    };

  }
}

export default new MessageStore();