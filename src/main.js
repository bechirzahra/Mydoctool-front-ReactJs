"use strict";

import React from 'react';
import ReactDOM from 'react-dom';
import {Router, Route} from 'react-router';

// import Injection from 'react-hot-loader/Injection';

import history from './services/history';
import routes from './routes';
import dateFormat from 'dateformat-light';
import AuthActionCreators from './actions/authActionCreators';

import Translator from './services/Translator';

// If we already have a jwt token stored, auth the user
var jwt = localStorage.getItem('jwt');

var langue  =  (localStorage.getItem('langue')) ? localStorage.getItem('langue') : 'FR';
Translator.changeLaguage(langue);
if (jwt) {
  AuthActionCreators.authUser(jwt);
}
if(localStorage.getItem('langue') == 'FR') {
// Redefine, in French, dates
dateFormat.i18n = {
  dayNames: [
    'Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam',
    'Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'
  ],
  monthNames: [
    'Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Août', 'Sep', 'Oct', 'Nov', 'Dec',
    'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
  ]
};
}

// Polyfill for older browsers
// From https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/keys
if (!Object.keys) {
  Object.keys = (function() {
    'use strict';
    var hasOwnProperty = Object.prototype.hasOwnProperty,
        hasDontEnumBug = !({ toString: null }).propertyIsEnumerable('toString'),
        dontEnums = [
          'toString',
          'toLocaleString',
          'valueOf',
          'hasOwnProperty',
          'isPrototypeOf',
          'propertyIsEnumerable',
          'constructor'
        ],
        dontEnumsLength = dontEnums.length;

    return function(obj) {
      if (typeof obj !== 'object' && (typeof obj !== 'function' || obj === null)) {
        throw new TypeError('Object.keys called on non-object');
      }

      var result = [], prop, i;

      for (prop in obj) {
        if (hasOwnProperty.call(obj, prop)) {
          result.push(prop);
        }
      }

      if (hasDontEnumBug) {
        for (i = 0; i < dontEnumsLength; i++) {
          if (hasOwnProperty.call(obj, dontEnums[i])) {
            result.push(dontEnums[i]);
          }
        }
      }
      return result;
    };
  }());
}

// Start of the app
ReactDOM.render(
  <Router routes={routes} history={history}/>,
  document.getElementById('app')
);
