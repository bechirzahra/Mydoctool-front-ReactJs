"use strict";

import Dispatcher from '../dispatcher/appDispatcher';
import WebApi from '../services/webApi';
import ActionTypes from '../constants/actionTypes';

var CategoryActionCreators = {

  /**
  *   data: project data submitted by the form (name)
  */
  getCategories: function(page, resultsPerPage, filter) {
    setTimeout(function() {
      Dispatcher.handleViewAction({
        actionType: ActionTypes.GET_CATEGORIES_REQUEST,
      });
      WebApi.getCategories(page, resultsPerPage, filter);
    }, 0);
  },

  createCategory: function(data) {
    setTimeout(function() {
      Dispatcher.handleViewAction({
        actionType: ActionTypes.CREATE_CATEGORY_REQUEST,
      });
      WebApi.createCategory(data);
    }, 0);
  },

  updateCategory: function(slug, data) {
    setTimeout(function() {
      Dispatcher.handleViewAction({
        actionType: ActionTypes.UPDATE_CATEGORY_REQUEST,
      });
      WebApi.updateCategory(slug, data);
    }, 0);
  },

  getCategory: function(slug) {
    setTimeout(function() {
      Dispatcher.handleViewAction({
        actionType: ActionTypes.GET_CATEGORY_REQUEST,
      });
      WebApi.getCategory(slug);
    }, 0);
  },

  deleteCategory: function(slug) {
    setTimeout(function() {
      Dispatcher.handleViewAction({
        actionType: ActionTypes.DELETE_CATEGORY_REQUEST,
      });
      WebApi.deleteCategory(slug);
    }, 0);
  }

};

export default CategoryActionCreators;