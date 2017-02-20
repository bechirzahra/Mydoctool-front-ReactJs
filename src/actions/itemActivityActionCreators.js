"use strict";

import Dispatcher from '../dispatcher/appDispatcher';
import WebApi from '../services/webApi';
import ActionTypes from '../constants/actionTypes';

var ItemActivityActionCreators = {

  /**
  *   data: project data submitted by the form (name)
  */
  getItemActivities: function(page, resultsPerPage, filter) {
    setTimeout(function() {
      Dispatcher.handleViewAction({
        actionType: ActionTypes.GET_ITEM_ACTIVITIES_REQUEST,
      });
      WebApi.getItemActivitys(page, resultsPerPage, filter);
    }, 0);
  },

  answerItemActivity: function(slug, data) {
    setTimeout(function() {
      Dispatcher.handleViewAction({
        actionType: ActionTypes.ANSWER_ITEM_ACTIVITY_REQUEST,
      });
      WebApi.answerItemActivity(slug, data);
    }, 0);
  },

  getItemActivity: function(slug) {
    setTimeout(function() {
      Dispatcher.handleViewAction({
        actionType: ActionTypes.GET_ITEM_ACTIVITY_REQUEST,
      });
      WebApi.getItemActivity(slug);
    }, 0);
  },
};

export default ItemActivityActionCreators;