import Dispatcher from '../dispatcher/appDispatcher';
import WebApi from '../services/webApi';
import ActionTypes from '../constants/actionTypes';

import history from '../services/history';

/**
*   ### SERVER ACTIONS ###
*/
export default {

  /**
  *   ### AUTH ###
  */

  receiveLogin: function(json, errors) {
    Dispatcher.handleServerAction({
      actionType: ActionTypes.LOGIN_RESPONSE,
      json: json,
      errors: errors
    });
  },

  receiveRegister: function(json, errors) {
    Dispatcher.handleServerAction({
      actionType: ActionTypes.REGISTER_RESPONSE,
      json: json,
      errors: errors
    });
  },

  receiveRegisterOAuth: function(json, errors) {
    Dispatcher.handleServerAction({
      actionType: ActionTypes.REGISTER_OAUTH_RESPONSE,
      json: json,
      errors: errors
    });
  },

  receiveResetPassword: function(json, errors) {
    Dispatcher.handleServerAction({
      actionType: ActionTypes.RESET_PASSWORD_RESPONSE,
      json: json,
      errors: errors
    });
  },

  receiveResettingPassword: function(json, errors) {
    Dispatcher.handleServerAction({
      actionType: ActionTypes.RESETTING_PASSWORD_RESPONSE,
      json: json,
      errors: errors
    });
  },

  shouldLogin: function() {
    Dispatcher.handleViewAction({
      actionType: ActionTypes.SHOULD_LOGIN_USER,
    });
  },

  /**
  *   ### INITIALIZE ###
  */

  receiveInitApp: function(json, errors) {
    Dispatcher.handleServerAction({
      actionType: ActionTypes.INITIALIZE_APP_RESPONSE,
      json: json,
      errors: errors
    });
  },

  receiveInitDashboard: function(json, errors) {
    Dispatcher.handleServerAction({
      actionType: ActionTypes.INITIALIZE_DASHBOARD_RESPONSE,
      json: json,
      errors: errors
    });
  },

  receiveInitAdmin: function(json, errors) {
    Dispatcher.handleServerAction({
      actionType: ActionTypes.INITIALIZE_ADMIN_RESPONSE,
      json: json,
      errors: errors
    });
  },


  /**
  *   ### ORGANIZATIONS ###
  */
  receiveGetOrganizations: function(json, errors) {
    Dispatcher.handleServerAction({
      actionType: ActionTypes.GET_ORGANIZATIONS_RESPONSE,
      json: json,
      errors: errors
    });
  },

  receiveCreateOrganization: function(json, errors) {
    Dispatcher.handleServerAction({
      actionType: ActionTypes.CREATE_ORGANIZATION_RESPONSE,
      json: json,
      errors: errors
    });
  },

  receiveUpdateOrganization: function(json, errors) {
    Dispatcher.handleServerAction({
      actionType: ActionTypes.UPDATE_ORGANIZATION_RESPONSE,
      json: json,
      errors: errors
    });
  },

  receiveGetOrganization: function(json, errors) {
    Dispatcher.handleServerAction({
      actionType: ActionTypes.GET_ORGANIZATION_RESPONSE,
      json: json,
      errors: errors
    });
  },

  receiveDeleteOrganization: function(json, errors) {
    Dispatcher.handleServerAction({
      actionType: ActionTypes.DELETE_ORGANIZATION_RESPONSE,
      json: json,
      errors: errors
    });
  },

  /**
  *   ### INVITES ###
  */
  receiveGetInvites: function(json, errors) {
    Dispatcher.handleServerAction({
      actionType: ActionTypes.GET_INVITES_RESPONSE,
      json: json,
      errors: errors
    });
  },

  receiveCreateInvite: function(json, errors) {
    Dispatcher.handleServerAction({
      actionType: ActionTypes.CREATE_INVITE_RESPONSE,
      json: json,
      errors: errors
    });
  },

  receiveUpdateInvite: function(json, errors) {
    Dispatcher.handleServerAction({
      actionType: ActionTypes.UPDATE_INVITE_RESPONSE,
      json: json,
      errors: errors
    });
  },

  receiveGetInvite: function(json, errors) {
    Dispatcher.handleServerAction({
      actionType: ActionTypes.GET_INVITE_RESPONSE,
      json: json,
      errors: errors
    });
  },

  receiveDeleteInvite: function(json, errors) {
    Dispatcher.handleServerAction({
      actionType: ActionTypes.DELETE_INVITE_RESPONSE,
      json: json,
      errors: errors
    });
  },

  /**
  *   ### USERS ###
  */
  receiveGetUsers: function(json, errors) {
    Dispatcher.handleServerAction({
      actionType: ActionTypes.GET_USERS_RESPONSE,
      json: json,
      errors: errors
    });
  },

  receiveCreateUser: function(json, errors) {
    Dispatcher.handleServerAction({
      actionType: ActionTypes.CREATE_USER_RESPONSE,
      json: json,
      errors: errors
    });
  },

  receiveUpdateUser: function(json, errors) {
    Dispatcher.handleServerAction({
      actionType: ActionTypes.UPDATE_USER_RESPONSE,
      json: json,
      errors: errors
    });
  },

  receiveUploadAvatar: function(json, errors) {
    Dispatcher.handleServerAction({
      actionType: ActionTypes.UPLOAD_AVATAR_RESPONSE,
      json: json,
      errors: errors
    });
  },

  receiveGetUser: function(json, errors) {
    Dispatcher.handleServerAction({
      actionType: ActionTypes.GET_USER_RESPONSE,
      json: json,
      errors: errors
    });
  },

  receiveToggleFavorite: function(json, errors) {
    Dispatcher.handleServerAction({
      actionType: ActionTypes.TOGGLE_FAVORITE_USER_RESPONSE,
      json: json,
      errors: errors
    });
  },

  receiveAddUserListing: function(json, errors) {
    Dispatcher.handleServerAction({
      actionType: ActionTypes.ADD_USER_LISTING_RESPONSE,
      json: json,
      errors: errors
    });
  },

  receiveRemoveUserListing: function(json, errors) {
    Dispatcher.handleServerAction({
      actionType: ActionTypes.REMOVE_USER_LISTING_RESPONSE,
      json: json,
      errors: errors
    });
  },

  receiveRemoveUserPatient: function(json, errors) {
    Dispatcher.handleServerAction({
      actionType: ActionTypes.REMOVE_USER_PATIENT_RESPONSE,
      json: json,
      errors: errors
    });
  },

  /**
  *   ### MESSAGES ###
  */
  receiveGetMessages: function(json, errors) {
    Dispatcher.handleServerAction({
      actionType: ActionTypes.GET_MESSAGES_RESPONSE,
      json: json,
      errors: errors
    });
  },

  receiveCreateMessage: function(json, errors) {
    Dispatcher.handleServerAction({
      actionType: ActionTypes.CREATE_MESSAGE_RESPONSE,
      json: json,
      errors: errors
    });
  },

  receiveUpdateMessage: function(json, errors) {
    Dispatcher.handleServerAction({
      actionType: ActionTypes.UPDATE_MESSAGE_RESPONSE,
      json: json,
      errors: errors
    });
  },

  receiveReadMessage: function(json, errors) {
    Dispatcher.handleServerAction({
      actionType: ActionTypes.READ_MESSAGE_RESPONSE,
      json: json,
      errors: errors
    });
  },

  receiveGetMessage: function(json, errors) {
    Dispatcher.handleServerAction({
      actionType: ActionTypes.GET_MESSAGE_RESPONSE,
      json: json,
      errors: errors
    });
  },

  receiveDeleteMessage: function(json, errors) {
    Dispatcher.handleServerAction({
      actionType: ActionTypes.DELETE_MESSAGE_RESPONSE,
      json: json,
      errors: errors
    });
  },

  /**
  *   ### DOCUMENTS ###
  */
  receiveGetDocuments: function(json, errors) {
    Dispatcher.handleServerAction({
      actionType: ActionTypes.GET_DOCUMENTS_RESPONSE,
      json: json,
      errors: errors
    });
  },

  receiveCreateDocument: function(json, errors) {
    Dispatcher.handleServerAction({
      actionType: ActionTypes.CREATE_DOCUMENT_RESPONSE,
      json: json,
      errors: errors
    });
  },

  receiveUpdateDocument: function(json, errors) {
    Dispatcher.handleServerAction({
      actionType: ActionTypes.UPDATE_DOCUMENT_RESPONSE,
      json: json,
      errors: errors
    });
  },

  receiveGetDocument: function(json, errors) {
    Dispatcher.handleServerAction({
      actionType: ActionTypes.GET_DOCUMENT_RESPONSE,
      json: json,
      errors: errors
    });
  },

  receiveDeleteDocument: function(json, errors) {
    Dispatcher.handleServerAction({
      actionType: ActionTypes.DELETE_DOCUMENT_RESPONSE,
      json: json,
      errors: errors
    });
  },

  /**
  *   ### LISTINGS ###
  */
  receiveGetListings: function(json, errors) {
    Dispatcher.handleServerAction({
      actionType: ActionTypes.GET_LISTINGS_RESPONSE,
      json: json,
      errors: errors
    });
  },

  receiveCreateListing: function(json, errors) {
    Dispatcher.handleServerAction({
      actionType: ActionTypes.CREATE_LISTING_RESPONSE,
      json: json,
      errors: errors
    });
  },

  receiveCreateEmptyListing: function(json, errors) {
    Dispatcher.handleServerAction({
      actionType: ActionTypes.CREATE_EMPTY_LISTING_RESPONSE,
      json: json,
      errors: errors
    });
  },

  receiveDuplicateListing: function(json, errors) {
    Dispatcher.handleServerAction({
      actionType: ActionTypes.DUPLICATE_LISTING_RESPONSE,
      json: json,
      errors: errors
    });
  },

  receiveUpdateListing: function(json, errors) {
    Dispatcher.handleServerAction({
      actionType: ActionTypes.UPDATE_LISTING_RESPONSE,
      json: json,
      errors: errors
    });
  },

  receiveGetListing: function(json, errors) {
    Dispatcher.handleServerAction({
      actionType: ActionTypes.GET_LISTING_RESPONSE,
      json: json,
      errors: errors
    });
  },

  receiveDeleteListing: function(json, errors) {
    Dispatcher.handleServerAction({
      actionType: ActionTypes.DELETE_LISTING_RESPONSE,
      json: json,
      errors: errors
    });
  },

  receiveToggleTemplateListing: function(json, errors) {
    Dispatcher.handleServerAction({
      actionType: ActionTypes.TOGGLE_TEMPLATE_LISTING_RESPONSE,
      json: json,
      errors: errors
    });
  },

  /**
  *   ### Categories ###
  */
  receiveGetCategories: function(json, errors) {
    Dispatcher.handleServerAction({
      actionType: ActionTypes.GET_CATEGORIES_RESPONSE,
      json: json,
      errors: errors
    });
  },

  receiveCreateCategory: function(json, errors) {
    Dispatcher.handleServerAction({
      actionType: ActionTypes.CREATE_CATEGORY_RESPONSE,
      json: json,
      errors: errors
    });
  },

  receiveCreateEmptyCategory: function(json, errors) {
    Dispatcher.handleServerAction({
      actionType: ActionTypes.CREATE_EMPTY_CATEGORY_RESPONSE,
      json: json,
      errors: errors
    });
  },

  receiveUpdateCategory: function(json, errors) {
    Dispatcher.handleServerAction({
      actionType: ActionTypes.UPDATE_CATEGORY_RESPONSE,
      json: json,
      errors: errors
    });
  },

  receiveGetCategory: function(json, errors) {
    Dispatcher.handleServerAction({
      actionType: ActionTypes.GET_CATEGORY_RESPONSE,
      json: json,
      errors: errors
    });
  },

  receiveDeleteCategory: function(json, errors) {
    Dispatcher.handleServerAction({
      actionType: ActionTypes.DELETE_CATEGORY_RESPONSE,
      json: json,
      errors: errors
    });
  },

  /**
  *   ### ITEM ###
  */
  receiveGetItems: function(json, errors) {
    Dispatcher.handleServerAction({
      actionType: ActionTypes.GET_ITEMS_RESPONSE,
      json: json,
      errors: errors
    });
  },

  receiveCreateItem: function(json, errors) {
    Dispatcher.handleServerAction({
      actionType: ActionTypes.CREATE_ITEM_RESPONSE,
      json: json,
      errors: errors
    });
  },

  receiveUpdateItem: function(json, errors) {
    Dispatcher.handleServerAction({
      actionType: ActionTypes.UPDATE_ITEM_RESPONSE,
      json: json,
      errors: errors
    });
  },

  receiveReadItem: function(json, errors) {
    Dispatcher.handleServerAction({
      actionType: ActionTypes.READ_ITEM_RESPONSE,
      json: json,
      errors: errors
    });
  },

  receiveGetItem: function(json, errors) {
    Dispatcher.handleServerAction({
      actionType: ActionTypes.GET_ITEM_RESPONSE,
      json: json,
      errors: errors
    });
  },

  receiveDeleteItem: function(json, errors) {
    Dispatcher.handleServerAction({
      actionType: ActionTypes.DELETE_ITEM_RESPONSE,
      json: json,
      errors: errors
    });
  },

  /**
  *   ### ITEM ACTIVITY ###
  */
  receiveGetItemActivities: function(json, errors) {
    Dispatcher.handleServerAction({
      actionType: ActionTypes.GET_ITEM_ACTIVITIES_RESPONSE,
      json: json,
      errors: errors
    });
  },

  receiveAnswerItemActivity: function(json, errors) {
    Dispatcher.handleServerAction({
      actionType: ActionTypes.ANSWER_ITEM_ACTIVITY_RESPONSE,
      json: json,
      errors: errors
    });
  },

  receiveGetItemActivity: function(json, errors) {
    Dispatcher.handleServerAction({
      actionType: ActionTypes.GET_ITEM_ACTIVITY_RESPONSE,
      json: json,
      errors: errors
    });
  },

  /**
  *   ### ALERT ###
  */
  receiveGetAlerts: function(json, errors) {
    Dispatcher.handleServerAction({
      actionType: ActionTypes.GET_ALERTS_RESPONSE,
      json: json,
      errors: errors
    });
  },

  receiveToggleCloseAlert: function(json, errors) {
    Dispatcher.handleServerAction({
      actionType: ActionTypes.TOGGLE_CLOSE_ALERT_RESPONSE,
      json: json,
      errors: errors
    });
  },

  receiveGetAlert: function(json, errors) {
    Dispatcher.handleServerAction({
      actionType: ActionTypes.GET_ALERT_RESPONSE,
      json: json,
      errors: errors
    });
  },

};
