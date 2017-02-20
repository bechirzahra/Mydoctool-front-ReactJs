"use strict";

var Dispatcher = require('../dispatcher/appDispatcher');
var WebApi = require('../services/webApi');
var ActionTypes = require('../constants/actionTypes');

var DocumentActionCreators = {

    /**
    *   data: project data submitted by the form (name)
    */
    getDocuments: function(page, resultsPerPage, filter) {
        setTimeout(function() {
            Dispatcher.handleViewAction({
                actionType: ActionTypes.GET_DOCUMENTS_REQUEST,
            });
            WebApi.getDocuments(page, resultsPerPage, filter);
        }, 0);
    },

    createDocument: function(data) {
        setTimeout(function() {
            Dispatcher.handleViewAction({
                actionType: ActionTypes.CREATE_DOCUMENT_REQUEST,
            });
            WebApi.createDocument(data);
        }, 0);
    },

    updateDocument: function(slug, data) {
        setTimeout(function() {
            Dispatcher.handleViewAction({
                actionType: ActionTypes.UPDATE_DOCUMENT_REQUEST,
            });
            WebApi.updateDocument(slug, data);
        }, 0);
    },

    getDocument: function(slug) {
        setTimeout(function() {
            Dispatcher.handleViewAction({
                actionType: ActionTypes.GET_DOCUMENT_REQUEST,
            });
            WebApi.getDocument(slug);
        }, 0);
    },

    deleteDocument: function(slug) {
        setTimeout(function() {
            Dispatcher.handleViewAction({
                actionType: ActionTypes.DELETE_DOCUMENT_REQUEST,
            });
            WebApi.deleteDocument(slug);
        }, 0);
    }

};

module.exports = DocumentActionCreators;