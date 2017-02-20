"use strict";

import Dispatcher from '../dispatcher/appDispatcher';
import WebApi from '../services/webApi';
import ActionTypes from '../constants/actionTypes';

import AuthStore from '../stores/authStore';

var InitializeActionCreators = {

    initApp: function() {
      setTimeout(function() {
        Dispatcher.handleViewAction({
            actionType: ActionTypes.INITIALIZE_APP_REQUEST,
        });
        WebApi.initApp();
      }, 0);
    },

    initListing: function(listingSlug) {
      setTimeout(function() {
        Dispatcher.handleViewAction({
            actionType: ActionTypes.INITIALIZE_LISTING_REQUEST,
        });
        WebApi.initListing(listingSlug);
      }, 0);
    },

    initDashboard() {
      setTimeout(function() {
        Dispatcher.handleViewAction({
            actionType: ActionTypes.INITIALIZE_DASHBOARD_REQUEST,
        });
        WebApi.initDashboard();
      }, 0);
    },

    adminInit: function() {
      setTimeout(function() {
        Dispatcher.handleViewAction({
            actionType: ActionTypes.INITIALIZE_ADMIN_REQUEST,
        });
        WebApi.initAdmin();
      }, 0);
    },
};

export default InitializeActionCreators;