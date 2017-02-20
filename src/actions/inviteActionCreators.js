"use strict";

import Dispatcher from '../dispatcher/appDispatcher';
import WebApi from '../services/webApi';
import ActionTypes from '../constants/actionTypes';

var InviteActionCreators = {

  /**
  *   data: project data submitted by the form (name)
  */
  getInvites: function(page, resultsPerPage, filter) {
    setTimeout(function() {
      Dispatcher.handleViewAction({
        actionType: ActionTypes.GET_INVITES_REQUEST,
      });
      WebApi.getInvites(page, resultsPerPage, filter);
    }, 0);
  },

  getInvite: function(slug) {
    setTimeout(function() {
      Dispatcher.handleViewAction({
        actionType: ActionTypes.GET_INVITE_REQUEST,
      });
      WebApi.getInvite(slug);
    }, 0);
  },

  deleteInvite: function(slug) {
    setTimeout(function() {
      Dispatcher.handleViewAction({
        actionType: ActionTypes.DELETE_INVITE_REQUEST,
      });
      WebApi.deleteInvite(slug);
    }, 0);
  },

  createInvite: function(data) {
    setTimeout(function() {
      Dispatcher.handleViewAction({
        actionType: ActionTypes.CREATE_INVITE_REQUEST,
      });
      WebApi.createInvite(data);
    }, 0);
  }

};

export default InviteActionCreators;