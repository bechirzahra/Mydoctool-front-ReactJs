"use strict";

import Dispatcher from '../dispatcher/appDispatcher';
import WebApi from '../services/webApi';
import ActionTypes from '../constants/actionTypes';

var ItemActionCreators = {

  /**
  *   data: project data submitted by the form (name)
  */
  getItems: function(page, resultsPerPage, filter) {
    setTimeout(function() {
      Dispatcher.handleViewAction({
        actionType: ActionTypes.GET_ITEMS_REQUEST,
      });
      WebApi.getItems(page, resultsPerPage, filter);
    }, 0);
  },

  createItem: function(data, files) {
    setTimeout(function() {
      Dispatcher.handleViewAction({
        actionType: ActionTypes.CREATE_ITEM_REQUEST,
      });
      WebApi.createItem(data, files);
    }, 0);
  },

  updateItem: function(slug, data) {
    setTimeout(function() {
      Dispatcher.handleViewAction({
        actionType: ActionTypes.UPDATE_ITEM_REQUEST,
      });
      WebApi.updateItem(slug, data);
    }, 0);
  },

  readItem: function(slug) {
    setTimeout(function() {
      Dispatcher.handleViewAction({
        actionType: ActionTypes.READ_ITEM_REQUEST,
      });
      WebApi.readItem(slug);
    }, 0);
  },

  getItem: function(slug) {
    setTimeout(function() {
      Dispatcher.handleViewAction({
        actionType: ActionTypes.GET_ITEM_REQUEST,
      });
      WebApi.getItem(slug);
    }, 0);
  },

  deleteItem: function(slug) {
    setTimeout(function() {
      Dispatcher.handleViewAction({
        actionType: ActionTypes.DELETE_ITEM_REQUEST,
      });
      WebApi.deleteItem(slug);
    }, 0);
  }

};

export default ItemActionCreators;