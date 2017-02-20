"use strict";

import Dispatcher from '../dispatcher/appDispatcher';
import WebApi from '../services/webApi';
import ActionTypes from '../constants/actionTypes';

var UserActionCreators = {

  /**
  *   data: project data submitted by the form (name)
  */
  getUsers: function(page, resultsPerPage, filter) {
    setTimeout(function() {
      Dispatcher.handleViewAction({
        actionType: ActionTypes.GET_USERS_REQUEST,
      });
      WebApi.getUsers(page, resultsPerPage, filter);
    }, 0);
  },

  createUser: function(data) {
    setTimeout(function() {
      Dispatcher.handleViewAction({
        actionType: ActionTypes.CREATE_USER_REQUEST,
      });
      WebApi.createUser(data);
    }, 0);
  },

  uploadAvatar: function(file) {
    setTimeout(function() {
      Dispatcher.handleViewAction({
        actionType: ActionTypes.UPLOAD_AVATAR_REQUEST,
      });
      WebApi.uploadAvatar(file);
    }, 0);
  },

  updateUser: function(slug, data) {
    setTimeout(function() {
      Dispatcher.handleViewAction({
        actionType: ActionTypes.UPDATE_USER_REQUEST,
      });
      WebApi.updateUser(slug, data);
    }, 0);
  },

  updateProfileInfo: function(data) {
    setTimeout(function() {
      Dispatcher.handleViewAction({
        actionType: ActionTypes.UPDATE_USER_REQUEST,
      });
      WebApi.updateProfileInfo(data);
    }, 0);
  },

  updateProfileAddress: function(data) {
    setTimeout(function() {
      Dispatcher.handleViewAction({
        actionType: ActionTypes.UPDATE_USER_REQUEST,
      });
      WebApi.updateProfileAddress(data);
    }, 0);
  },

  updateProfilePassword: function(data) {
    setTimeout(function() {
      Dispatcher.handleViewAction({
        actionType: ActionTypes.UPDATE_USER_REQUEST,
      });
      WebApi.updateProfilePassword(data);
    }, 0);
  },

  getUser: function(slug) {
    setTimeout(function() {
      Dispatcher.handleViewAction({
        actionType: ActionTypes.GET_USER_REQUEST,
      });
      WebApi.getUser(slug);
    }, 0);
  },

  toggleFavorite: function(userId) {
    setTimeout(function() {
      Dispatcher.handleViewAction({
        actionType: ActionTypes.TOGGLE_FAVORITE_USER_REQUEST,
      });
      WebApi.toggleFavorite(userId);
    }, 0);
  },

  addUserListing: function(userId, data) {
    setTimeout(function() {
      Dispatcher.handleViewAction({
        actionType: ActionTypes.ADD_USER_LISTING_REQUEST,
      });
      WebApi.addUserListing(userId, data);
    }, 0);
  },

  removeUserListing: function(uL) {
    setTimeout(function() {
      Dispatcher.handleViewAction({
        actionType: ActionTypes.REMOVE_USER_LISTING_REQUEST,
      });
      WebApi.removeUserListing(uL);
    }, 0);
  },

  removeUserPatient: function(patientId) {
    setTimeout(function() {
      Dispatcher.handleViewAction({
        actionType: ActionTypes.REMOVE_USER_PATIENT_REQUEST,
      });
      WebApi.removeUserPatient(patientId);
    }, 0);
  },
};

export default UserActionCreators;