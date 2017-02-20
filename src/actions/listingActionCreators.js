"use strict";

import Dispatcher from '../dispatcher/appDispatcher';
import WebApi from '../services/webApi';
import ActionTypes from '../constants/actionTypes';

var ListingActionCreators = {

  /**
  *   data: project data submitted by the form (name)
  */
  getListings: function(page, resultsPerPage, filter) {
    setTimeout(function() {
      Dispatcher.handleViewAction({
        actionType: ActionTypes.GET_LISTINGS_REQUEST,
      });
      WebApi.getListings(page, resultsPerPage, filter);
    }, 0);
  },

  createListing: function(data) {
    setTimeout(function() {
      Dispatcher.handleViewAction({
        actionType: ActionTypes.CREATE_LISTING_REQUEST,
      });
      WebApi.createListing(data);
    }, 0);
  },

  createEmptyListing: function(data) {
    setTimeout(function() {
      Dispatcher.handleViewAction({
        actionType: ActionTypes.CREATE_EMPTY_LISTING_REQUEST,
      });
      WebApi.createEmptyListing(data);
    }, 0);
  },

  duplicateListing: function(slug) {
    setTimeout(function() {
      Dispatcher.handleViewAction({
        actionType: ActionTypes.DUPLICATE_LISTING_REQUEST,
      });
      WebApi.duplicateListing(slug);
    }, 0);
  },

  updateListing: function(slug, data, items, removedItems) {
    setTimeout(function() {
      Dispatcher.handleViewAction({
        actionType: ActionTypes.UPDATE_LISTING_REQUEST,
      });
      WebApi.updateListing(slug, data, items, removedItems);
    }, 0);
  },

  getListing: function(slug) {
    setTimeout(function() {
      Dispatcher.handleViewAction({
        actionType: ActionTypes.GET_LISTING_REQUEST,
      });
      WebApi.getListing(slug);
    }, 0);
  },

  deleteListing: function(slug) {
    setTimeout(function() {
      Dispatcher.handleViewAction({
        actionType: ActionTypes.DELETE_LISTING_REQUEST,
      });
      WebApi.deleteListing(slug);
    }, 0);
  },

  toggleTemplateListing: function(slug) {
    setTimeout(function() {
      Dispatcher.handleViewAction({
        actionType: ActionTypes.TOGGLE_TEMPLATE_LISTING_REQUEST,
      });
      WebApi.toggleTemplateListing(slug);
    }, 0);
  },

};

export default ListingActionCreators;