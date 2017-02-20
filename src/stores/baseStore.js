"use strict";

import {EventEmitter} from 'events';
import Dispatcher from '../dispatcher/appDispatcher';

const CHANGE_EVENT = 'change';

class BaseStore extends EventEmitter {

  constructor() {
    super();
    this._initialized = false;
    this._errors = [];
    this._success = false;
    this._cachingTimestamp = new Date().getTime();
  }

  subscribe(actionSubscribe) {
    this._dispatchToken = Dispatcher.register(actionSubscribe());
  }

  get dispatchToken() {
    return this._dispatchToken;
  }

  get errors() {
    return this._errors;
  }

  shouldRefresh() {
    let now = new Date().getTime();
    let offset = 5 * 60 * 1000; // A 5-minute offset
    if (now - this._cachingTimestamp > offset) {
      return true;
    }
    return false;
  }

  get cachingTimestamp() {
    return this._cachingTimestamp;
  }

  resetCachingTimestamp() {
    this._cachingTimestamp = new Date().getTime();
  }

  set initialized(init) {
    this._initialized = init;
  }

  isSuccess() {
    return this._success;
  }

  isInit() {
    return this._initialized;
  }

  emitChange() {
    this.emit(CHANGE_EVENT);
    this.resetCachingTimestamp();
  }

  addChangeListener(callback) {
    this.on(CHANGE_EVENT, callback);
  }

  removeChangeListener(callback) {
    this.removeListener(CHANGE_EVENT, callback);
  }
}

export default BaseStore;