import Dispatcher from '../dispatcher/appDispatcher';
import WebApi from '../services/webApi';
import ActionTypes from '../constants/actionTypes';

var AuthActionCreators = {

    authUser: function(jwt) {
        if (jwt !== null && jwt !== 'null' && jwt !== '') {
            Dispatcher.handleViewAction({
                actionType: ActionTypes.AUTH_USER,
                jwt: jwt
            });
        }
    },

    /**
    *   userData: user data submitted by the form
    */
    createUser: function(userData) {
        Dispatcher.handleViewAction({
            actionType: ActionTypes.REGISTER_REQUEST,
            data: userData
        });
        WebApi.createUser(userData);
    },

    requestLogin: function(userData) {
        Dispatcher.handleViewAction({
            actionType: ActionTypes.LOGIN_REQUEST,
            data: userData
        });
        WebApi.loginUser(userData);
    },

    logout: function() {
        Dispatcher.handleViewAction({
            actionType: ActionTypes.LOGOUT_USER,
        });
    },

    resetPassword: function(email) {
        Dispatcher.handleViewAction({
            actionType: ActionTypes.RESET_PASSWORD
        });
        WebApi.resetPassword(email);
    },

    resettingPassword: function(data, token) {
        Dispatcher.handleViewAction({
            actionType: ActionTypes.RESETTING_PASSWORD
        });
        WebApi.resettingPassword(data, token);
    },

};

export default AuthActionCreators;