"use strict";

import Dispatcher from '../dispatcher/appDispatcher';
import WebApi from '../services/webApi';
import ActionTypes from '../constants/actionTypes';

var AlertActionCreators = {

  /**
  *   data: project data submitted by the form (name)
  */
  getAlerts: function(page, resultsPerPage, filter) {
    setTimeout(function() {
      Dispatcher.handleViewAction({
        actionType: ActionTypes.GET_ALERTS_REQUEST,
      });
      WebApi.getAlerts(page, resultsPerPage, filter);
    }, 0);
  },

  toggleCloseAlert: function(userId, type) {
    setTimeout(function() {
      Dispatcher.handleViewAction({
        actionType: ActionTypes.TOGGLE_CLOSE_ALERT_REQUEST,
      });
      WebApi.toggleCloseAlert(userId, type);
    }, 0);
  },

  getAlert: function(slug) {
    setTimeout(function() {
      Dispatcher.handleViewAction({
        actionType: ActionTypes.GET_ALERT_REQUEST,
      });
      WebApi.getAlert(slug);
    }, 0);
  },

};

export default AlertActionCreators;