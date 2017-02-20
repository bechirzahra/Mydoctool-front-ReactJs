'use strict';

import keyMirror from 'fbjs/lib/keyMirror';
import ini from './parameters_dev.ini';

const URIServer = ini.URIServer;
const UploadRoot = URIServer + '/uploads';
const APIRoot = URIServer + '/api';

export default {

    CONFIG: {
        UPLOAD_ROOT: UploadRoot,
        HISTORY: ini.HISTORY
    },

    INVITE: {
        REGISTER_JOIN_ORGANIZATION_MANAGER: 0,
        JOIN_ORGANIZATION_MANAGER: 1,
        REGISTER_JOIN_ORGANIZATION_DOCTOR: 2,
        JOIN_ORGANIZATION_DOCTOR: 3,
        REGISTER_USER: 4,
        REGISTER_ANSWER: 5,
        ANSWER: 6,
    },

    APIEndpoints: {
        // AUTH
        REGISTER: APIRoot + '/register',
        REGISTER_OAUTH: APIRoot + '/oauth/login_check',
        LOGIN: APIRoot + '/login_check',
        RESET_PASSWORD: APIRoot + '/resetting/send-email',
        RESETTING_PASSWORD: APIRoot + '/resetting/reset',

        // INIT
        INIT_APP: APIRoot + '/init/app',
        INIT_ADMIN: APIRoot + '/admin/init',
        INIT_DASHBOARD: APIRoot + '/init/dashboard',

        USER_ACTION_ROOT: APIRoot + '/users',
        ORGANIZATION_ACTION_ROOT: APIRoot + '/organizations',
        INVITE_ACTION_ROOT: APIRoot + '/invites',
        MESSAGE_ACTION_ROOT: APIRoot + '/messages',
        DOCUMENT_ACTION_ROOT: APIRoot + '/documents',
        LISTING_ACTION_ROOT: APIRoot + '/listings',
        CATEGORY_ACTION_ROOT: APIRoot + '/categories',
        ITEM_ACTION_ROOT: APIRoot + '/items',
        ITEM_ACTIVITY_ACTION_ROOT: APIRoot + '/itemactivities',
        ACCOUNT_ACTION_ROOT: APIRoot + '/profile',
        ALERT_ACTION_ROOT: APIRoot + '/alerts',
    },

    PAYLOAD: keyMirror({
        SERVER_ACTION: null,
        VIEW_ACTION: null
    }),

    USER: {
        DOCTOR: 0,
        PATIENT: 1,
        MALE: 2,
        FEMALE: 3,
    },

    DND: {
        ADDED_ITEM: 'added_item',
        EMPTY_ITEM: 'empty_item',
        TASK: 'task',
        NOTICE: 'notice',
        DATA: 'data',
        SELECT: 'select',
        BOOL: 'bool',
        LEVEL: 'level',
        TEXT: 'text',
        SELECT_OPTION: 'select_option',
    },

    ITEM: {
        TYPE_QUESTION: 1,
        TYPE_NOTICE: 2,
        TYPE_TASK: 3,
        QUESTION_DATA: 11,
        QUESTION_SELECT: 12,
        QUESTION_BOOL: 13,
        QUESTION_LEVEL: 14,
        QUESTION_TEXT: 15,
    },

    UNIT: {
        DAY: 0,
        WEEK: 1,
        MONTH: 2,
        YEAR: 4,
        END: 3,
    },

    DURATION: {
        TYPE_END: 0,
        TYPE_DATE: 1,
    },

    FREQUENCY: {
        ONCE: 0,
        EVERY_DAY: 1,
        EVERY_TWO_DAYS: 2,
        EVERY_THREE_DAYS: 3,
        EVERY_WEEK: 4,
        EVERY_MONTH: 5,
        TWICE_A_MONTH: 6,
    },

    LOGIC: {
        AND: 0,
        OR: 1,
    },

    SIGN: {
        EQUAL: 20,
        DIFF: 21,
        SUP: 22,
        INF: 23,
        // ANSWERED: 24,
        // NOT_ANSWERED: 25,
    },

    ANSWER: {
        VALUE: 0,
        DATE: 1,
    },

    DATE: {
        D: 'j',
        D_1: 'j1',
        D_2: 'j2',
        D_3: 'j3',
    },

    CHART: {
        TWO_WEEKS: 21,
        ONE_MONTH: 22,
        THREE_MONTHS: 23,
        SIX_MONTHS: 24,
        ONE_YEAR: 25,
    },
};
