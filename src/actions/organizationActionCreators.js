"use strict";

import Dispatcher from '../dispatcher/appDispatcher';
import WebApi from '../services/webApi';
import ActionTypes from '../constants/actionTypes';

var OrganizationActionCreators = {

  /**
  *   data: project data submitted by the form (name)
  */
  getOrganizations: function(page, resultsPerPage, filter) {
    setTimeout(function() {
      Dispatcher.handleViewAction({
        actionType: ActionTypes.GET_ORGANIZATIONS_REQUEST,
      });
      WebApi.getOrganizations(page, resultsPerPage, filter);
    }, 0);
  },

  createOrganization: function(data, files = []) {
    setTimeout(function() {
      Dispatcher.handleViewAction({
        actionType: ActionTypes.CREATE_ORGANIZATION_REQUEST,
      });
      WebApi.createOrganization(data, files);
    }, 0);
  },

  updateOrganization: function(slug, data, files = []) {
    setTimeout(function() {
      Dispatcher.handleViewAction({
        actionType: ActionTypes.UPDATE_ORGANIZATION_REQUEST,
      });
      WebApi.updateOrganization(slug, data, files);
    }, 0);
  },

  getOrganization: function(slug) {
    setTimeout(function() {
      Dispatcher.handleViewAction({
        actionType: ActionTypes.GET_ORGANIZATION_REQUEST,
      });
      WebApi.getOrganization(slug);
    }, 0);
  },

  deleteOrganization: function(slug) {
    setTimeout(function() {
      Dispatcher.handleViewAction({
        actionType: ActionTypes.DELETE_ORGANIZATION_REQUEST,
      });
      WebApi.deleteOrganization(slug);
    }, 0);
  }

};

export default OrganizationActionCreators;