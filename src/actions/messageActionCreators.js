"use strict";

import Dispatcher from '../dispatcher/appDispatcher';
import WebApi from '../services/webApi';
import ActionTypes from '../constants/actionTypes';

var MessageActionCreators = {

  /**
  *   data: project data submitted by the form (name)
  */
  getMessages: function(page, resultsPerPage, filter) {
    setTimeout(function() {
      Dispatcher.handleViewAction({
        actionType: ActionTypes.GET_MESSAGES_REQUEST,
      });
      WebApi.getMessages(page, resultsPerPage, filter);
    }, 0);
  },

  createMessage: function(data, files) {
    setTimeout(function() {
      Dispatcher.handleViewAction({
        actionType: ActionTypes.CREATE_MESSAGE_REQUEST,
      });
      WebApi.createMessage(data, files);
    }, 0);
  },

  updateMessage: function(slug, data) {
    setTimeout(function() {
      Dispatcher.handleViewAction({
        actionType: ActionTypes.UPDATE_MESSAGE_REQUEST,
      });
      WebApi.updateMessage(slug, data);
    }, 0);
  },

  readMessage: function(slug) {
    setTimeout(function() {
      Dispatcher.handleViewAction({
        actionType: ActionTypes.READ_MESSAGE_REQUEST,
      });
      WebApi.readMessage(slug);
    }, 0);
  },

  getMessage: function(slug) {
    setTimeout(function() {
      Dispatcher.handleViewAction({
        actionType: ActionTypes.GET_MESSAGE_REQUEST,
      });
      WebApi.getMessage(slug);
    }, 0);
  },

  deleteMessage: function(slug) {
    setTimeout(function() {
      Dispatcher.handleViewAction({
        actionType: ActionTypes.DELETE_MESSAGE_REQUEST,
      });
      WebApi.deleteMessage(slug);
    }, 0);
  }

};

export default MessageActionCreators;