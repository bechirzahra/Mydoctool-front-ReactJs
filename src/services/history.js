"use strict";

import {CONFIG} from '../constants/parameters'; // createHashHistory on dev, createBrowserHistory on prod
let createHistory = null;

if (CONFIG.HISTORY === 'createHashHistory') {
    createHistory = require('history/lib/createHashHistory');
} else if (CONFIG.HISTORY === 'createBrowserHistory') {
    createHistory = require('history/lib/createBrowserHistory');
}

export default createHistory();