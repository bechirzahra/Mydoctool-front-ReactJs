"use strict";

import Dispatcher from '../dispatcher/appDispatcher';
import ActionTypes from '../constants/actionTypes';
import _ from 'lodash';

import BaseStore from './baseStore';
import ItemActivityStore from './itemActivityStore';
import ItemStore from './itemStore';

import history from '../services/history';
import toastr from 'toastr';
import {ITEM} from '../constants/parameters';

class AlertStore extends BaseStore {
  constructor() {
    super();

    this._currentAlert = null;
    this._alerts = [];

    this.subscribe(() => this._registerToActions.bind(this))
  }

  reset() {
    this._initialized = false;
    this._currentAlert = null;
    this._alerts = [];
  }

  get alerts() {
    return this._alerts;
  }

  get currentAlert() {
    return this._currentAlert;
  }

  findBySlug(slug) {
    return _.find(this._alerts, {slug: slug});
  }

  findByItemActivitySlug(slug) {
    return _.find(this._alerts, {item_activity_slug: slug});
  }

  filterByUserId(id) {
    return _.filter(this._alerts, {user_id: id});
  }

  getOpenAlerts() {
    return _.filter(this._alerts, (alert) => {
      return !alert.closed;
    });
  }

  getSelectOptions() {
    return [
      {slug: 'questions', name: 'Alertes Questions'},
      {slug: 'tasks', name: 'Alertes Tâches'},
      {slug: 'none', name: 'Aucune Alerte'},
    ];
  }

  getQuestionAlerts() {
    let ret = [];
    _.each(this._alerts, function(alert) {
      let item = ItemStore.findBySlug(alert.item_slug);
      if (item && item !== null) {
        if (item.type == ITEM.TYPE_QUESTION) {
          ret.push(alert);
        }
      }
    });

    return ret;
  }

  getOpenQuestionAlerts(userId = null) {
    let ret = [];

    let alerts = userId === null ? this._alerts : this.filterByUserId(userId);

    _.each(alerts, function(alert) {
      if (!alert.closed) {
        let item = ItemStore.findBySlug(alert.item_slug);
        if (item && item !== null) {
          if (item.type == ITEM.TYPE_QUESTION) {
            ret.push(alert);
          }
        }
      }
    });

    return ret;
  }

  getAlertsCounts(userId = null) {
    let retQ = [];
    let retT = [];

    let alerts = userId === null ? this._alerts : this.filterByUserId(userId);

    _.each(alerts, function(alert) {
      if (!alert.closed) {
        let item = ItemStore.findBySlug(alert.item_slug);
        if (item && item !== null) {
          if (item.type == ITEM.TYPE_QUESTION) {
            retQ.push(alert);
          } else if (item.type == ITEM.TYPE_TASK) {
            retT.push(alert);
          }
        }
      }
    });

    // console.log(retQ, retT);

    retQ = _.groupBy(retQ, (alert) => {
      return alert.user_id + alert.item_slug;
    });

    retT = _.groupBy(retT, (alert) => {
      return alert.user_id + alert.item_slug;
    });

    return {
      tasks: _.size(retT),
      questions: _.size(retQ)
    };
  }

  getTaskAlerts() {
    let ret = [];
    _.each(this._alerts, function(alert) {
      let item = ItemStore.findBySlug(alert.item_slug);

      if (item && item !== null) {
        if (item.type == ITEM.TYPE_TASK) {
          ret.push(alert);
        }
      }
    });

    return ret;
  }

  getOpenTaskAlerts(userId = null) {
    let ret = [];
    let alerts = userId === null ? this._alerts : this.filterByUserId(userId);

    _.each(alerts, function(alert) {
      if (!alert.closed) {
        let item = ItemStore.findBySlug(alert.item_slug);

        if (item && item !== null) {
          if (item.type == ITEM.TYPE_TASK) {
            ret.push(alert);
          }
        }
      }
    });

    return ret;
  }

  _registerToActions(payload) {
    var action = payload.action;

    switch (action.actionType) {

      case ActionTypes.INITIALIZE_APP_RESPONSE:
        this._alerts = action.json.alerts;
        this._initialized = true;
        this.emitChange();
        break;

      case ActionTypes.GET_ALERTS_RESPONSE:
        if (action.errors) {
          this._errors = action.errors;
        } else {
          this._initialized = true;
          this._success = true;
          this._alerts = action.json.items;
        }

        this.emitChange()
        break;

      case ActionTypes.GET_ALERT_RESPONSE:
        if (action.errors) {
          this._success = false;
          this._errors = action.errors;
        } else {
          this._success = true;
          this._alerts.push(action.json);
          this._currentAlert = action.json;
        }

        this.emitChange()
        break;

      case ActionTypes.TOGGLE_CLOSE_ALERT_RESPONSE:
        if (action.errors) {
          this._errors = action.errors;
        } else {
          this._success = true;
          let updatedAlerts = action.json;

          // We should remove them from the store as they're closed
          _.remove(this._alerts, (alert) => {
            return _.find(updatedAlerts, {slug: alert.slug}) !== undefined;
          });
        }

        this.emitChange()
        break;

      case ActionTypes.DELETE_ALERT_RESPONSE:
        _.remove(this._alerts, function(alert) {
            return action.json.slug === alert.slug;
        });

        this._currentAlert = null;

        toastr.success('Invitation supprimée', 'Succès !');
        history.replaceState(null, '/admin/alerts');

        this.emitChange()
        break;

      case ActionTypes.REMOVE_USER_PATIENT_RESPONSE:
        if (action.errors) {
          this._success = false;
          this._errors = action.errors;
        } else {
          this._errors = [];

          let userId = action.json.user_id;
          _.remove(this._alerts, {user_id: parseInt(userId, 10)});
        }

        this.emitChange()
        break;
    };

  }
}

export default new AlertStore();