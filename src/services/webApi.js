import Dispatcher from '../dispatcher/appDispatcher';
import ActionTypes from '../constants/actionTypes';
import request from 'superagent';
import _ from 'lodash';
import sanitize from 'sanitize-filename';

import {APIEndpoints} from '../constants/parameters';
import ServerActionCreators from '../actions/serverActionCreators';

import AuthStore from '../stores/authStore';

const TIMEOUT = 15000;

function get (url) {
  var req = request
    .get(url)
    .accept('application/json')
    .timeout(TIMEOUT);

  if (AuthStore.isLoggedIn()) {
    req.set('Authorization', 'Bearer ' + AuthStore.getJwt());
  }

  return req;
};

function del (url) {
  var req = request
    .del(url)
    .accept('application/json')
    .timeout(TIMEOUT);

  if (AuthStore.isLoggedIn()) {
    req.set('Authorization', 'Bearer ' + AuthStore.getJwt());
  }

  return req;
};

function post (url, data) {
  var req = request
    .post(url)
    .type('form')
    .accept('application/json')
    .timeout(TIMEOUT);

  if (data !== undefined && data !== "undefined" && data !== null) {
    req.send(data);
  }

  if (AuthStore.isLoggedIn()) {
    req.set('Authorization', 'Bearer ' + AuthStore.getJwt());
  }

  return req;
};

function postFile (url) {
  var req = request
    .post(url)
    .accept('application/json');

  if (AuthStore.isLoggedIn()) {
    req.set('Authorization', 'Bearer ' + AuthStore.getJwt());
  }

  return req;
};

function put (url, data) {
  var req = request
    .put(url)
    .type('form')
    .accept('application/json')
    .timeout(TIMEOUT)
    .send(data);

  if (AuthStore.isLoggedIn()) {
    req.set('Authorization', 'Bearer ' + AuthStore.getJwt());
  }

  return req;
};

function putFile (url) {
  var req = request
    .put(url)
    .accept('application/json');

  if (AuthStore.isLoggedIn()) {
    req.set('Authorization', 'Bearer ' + AuthStore.getJwt());
  }

  return req;
};

function isLoggedIn(err) {
  if (err && err.status === 401) {
    ServerActionCreators.shouldLogin();
    return false;
  }
  return true;
};

var WebApi = {

  /**
  * ###   AUTH ACTIONS   ###
  */

  createUser: function(userData) {
    var url = APIEndpoints.REGISTER;

    post(url, userData)
    .end(function(err, res) {
      if (res) {
        if (res.status !== 200) {
          ServerActionCreators.receiveRegister(null, res.body);
        } else {
          ServerActionCreators.receiveRegister(res.body, null);
        }
      }
    });
  },

  loginUser: function(userData) {
    var url = APIEndpoints.LOGIN;

    post(url, userData)
    .end(function(err, res) {
      if (res) {
        if (res.status !== 200) {
          ServerActionCreators.receiveLogin(null, res.body);
        } else {
          ServerActionCreators.receiveLogin(res.body, null);
        }
      }
    });
  },

  resetPassword: function(email) {
    var url = APIEndpoints.RESET_PASSWORD;

    post(url, email)
    .end(function(err, res) {
      if (res) {
        if (res.status !== 200) {
          ServerActionCreators.receiveResetPassword(null, res.body);
        } else {
          ServerActionCreators.receiveResetPassword(res.body, null);
        }
      }
    });
  },

  // data: {password: ''}
  resettingPassword: function(data, token) {
    var url = APIEndpoints.RESETTING_PASSWORD + '/' + token;

    post(url, data)
    .end(function(err, res) {
      if (res) {
        if (res.status !== 200) {
          ServerActionCreators.receiveResettingPassword(null, res.body);
        } else {
          ServerActionCreators.receiveResettingPassword(res.body, null);
        }
      }
    });
  },

  /**
  * ###   Initialize ACTIONS   ###
  */

  initApp: function() {
    var url = APIEndpoints.INIT_APP;

    get(url)
    .end(function(err, res) {
      if (isLoggedIn(err) && res) {
        if (res && res.status === 200) {
          ServerActionCreators.receiveInitApp(res.body, null);
        } else {
          ServerActionCreators.receiveInitApp(null, res.body);
        }
      }
    });
  },

  initListing: function(listingSlug) {
    var url = APIEndpoints.INIT_LISTING + '/' + listingSlug + '/init';

    get(url)
    .end(function(err, res) {
      if (isLoggedIn(err) && res) {
        if (res && res.status === 200) {
          ServerActionCreators.receiveInitApp(res.body, null);
        } else {
          ServerActionCreators.receiveInitApp(null, res.body);
        }
      }
    });
  },

  initDashboard: function(listingSlug) {
    var url = APIEndpoints.INIT_DASHBOARD;

    get(url)
    .end(function(err, res) {
      if (isLoggedIn(err) && res) {
        if (res && res.status === 200) {
          ServerActionCreators.receiveInitDashboard(res.body, null);
        } else {
          ServerActionCreators.receiveInitDashboard(null, res.body);
        }
      }
    });
  },

  initAdmin: function() {
    var url = APIEndpoints.INIT_ADMIN;

    get(url)
    .end(function(err, res) {
      if (isLoggedIn(err) && res) {
        if (res && res.status === 200) {
          ServerActionCreators.receiveInitAdmin(res.body, null);
        } else {
          ServerActionCreators.receiveInitAdmin(null, res.body);
        }
      }
    });
  },

  /**
      ORGANIZATION
  */

  getOrganizations: function(page, resultsPerPage, filter) {
    var url = APIEndpoints.ORGANIZATION_ACTION_ROOT;

    var query = get(url)
    .query({page: page})
    .query({resultsPerPage: resultsPerPage});

    if (filter !== undefined && filter !== 'undefined' && filter !== null) {
      query.query({filter: filter});
    }

    query.end(function(err, res) {
      if (isLoggedIn(err) && res) {
        if (res.status !== 200) {
          ServerActionCreators.receiveGetOrganizations(null, res.body);
        } else {
          ServerActionCreators.receiveGetOrganizations(res.body, null);
        }
      }
    });
  },

  createOrganization: function(data, files = []) {
    var url = APIEndpoints.ORGANIZATION_ACTION_ROOT;

    let req = postFile(url);

    if (files.logo !== null) {
      req.attach('logoF', files.logoFile);
    }
    if (files.image !== null) {
      req.attach('imageF', files.imageFile);
    }

    delete data.logo;
    delete data.image;

    _.forEach(data, (v, k) => {
      if (v && v != null) {
        req.field(k, v);
      }
    });

    req.end(function(err, res) {
      if (isLoggedIn(err) && res) {
        if (res.status !== 200) {
          ServerActionCreators.receiveCreateOrganization(null, res.body);
        } else {
          ServerActionCreators.receiveCreateOrganization(res.body, null);
        }
      }
    });
  },

  updateOrganization: function(slug, data, files) {
    var url = APIEndpoints.ORGANIZATION_ACTION_ROOT + '/' + slug;

    var req = postFile(url);
    if (files.logoFile !== null) {
      req.attach('logoF', files.logoFile);
    }

    if (files.imageFile !== null) {
      req.attach('imageF', files.imageFile);
    }

    _.forEach(data, (v, k) => {
      if (v && v != null) {
        req.field(k, v);
      }
    });

    req.end(function(err, res) {
      if (isLoggedIn(err) && res) {
        if (res.status !== 200) {
          ServerActionCreators.receiveUpdateOrganization(null, res.body);
        } else {
          ServerActionCreators.receiveUpdateOrganization(res.body, null);
        }
      }
    });
  },

  getOrganization: function(slug) {
    var url = APIEndpoints.ORGANIZATION_ACTION_ROOT + '/' + slug;

    var query = get(url)
    .end(function(err, res) {
      if (isLoggedIn(err) && res) {
        if (res.status !== 200) {
          ServerActionCreators.receiveGetOrganization(null, res.body);
        } else {
          ServerActionCreators.receiveGetOrganization(res.body, null);
        }
      }
    });
  },

  deleteOrganization: function(slug) {
    var url = APIEndpoints.ORGANIZATION_ACTION_ROOT + '/' + slug;

    var query = del(url)
    .end(function(err, res) {
      if (isLoggedIn(err) && res) {
        if (res.status !== 200) {
          ServerActionCreators.receiveDeleteOrganization(null, res.body);
        } else {
          ServerActionCreators.receiveDeleteOrganization(res.body, null);
        }
      }
    });
  },

  /**
      INVITE
  */

  getInvites: function(page, resultsPerPage, filter) {
    var url = APIEndpoints.INVITE_ACTION_ROOT;

    var query = get(url)
    .query({page: page})
    .query({resultsPerPage: resultsPerPage});

    if (filter !== undefined && filter !== 'undefined' && filter !== null) {
      query.query({filter: filter});
    }

    query.end(function(err, res) {
      if (isLoggedIn(err) && res) {
        if (res.status !== 200) {
          ServerActionCreators.receiveGetInvites(null, res.body);
        } else {
          ServerActionCreators.receiveGetInvites(res.body, null);
        }
      }
    });
  },

  createInvite: function(data) {
    var url = APIEndpoints.INVITE_ACTION_ROOT;

    post(url, data)
    .end(function(err, res) {
      if (isLoggedIn(err) && res) {
        if (res.status !== 200) {
          ServerActionCreators.receiveCreateInvite(null, res.body);
        } else {
          ServerActionCreators.receiveCreateInvite(res.body, null);
        }
      }
    });
  },

  updateInvite: function(slug, data) {
    var url = APIEndpoints.INVITE_ACTION_ROOT + '/' + slug;

    put(url, data)
    .end(function(err, res) {
      if (isLoggedIn(err) && res) {
        if (res.status !== 200) {
          ServerActionCreators.receiveUpdateInvite(null, res.body);
        } else {
          ServerActionCreators.receiveUpdateInvite(res.body, null);
        }
      }
    });
  },

  getInvite: function(slug) {
    var url = APIEndpoints.INVITE_ACTION_ROOT + '/' + slug;

    var query = get(url)
    .end(function(err, res) {
      if (isLoggedIn(err) && res) {
        if (res.status !== 200) {
          ServerActionCreators.receiveGetInvite(null, res.body);
        } else {
          ServerActionCreators.receiveGetInvite(res.body, null);
        }
      }
    });
  },

  deleteInvite: function(slug) {
    var url = APIEndpoints.INVITE_ACTION_ROOT + '/' + slug;

    var query = del(url)
    .end(function(err, res) {
      if (isLoggedIn(err) && res) {
        if (res.status !== 200) {
          ServerActionCreators.receiveDeleteInvite(null, res.body);
        } else {
          ServerActionCreators.receiveDeleteInvite(res.body, null);
        }
      }
    });
  },

  /**
      USERS
  */

  getUsers: function(page, resultsPerPage, filter) {
    var url = APIEndpoints.USER_ACTION_ROOT;

    var query = get(url)
    .query({page: page})
    .query({resultsPerPage: resultsPerPage});

    if (filter !== undefined && filter !== 'undefined' && filter !== null) {
      query.query({filter: filter});
    }

    query.end(function(err, res) {
      if (isLoggedIn(err) && res) {
        if (res.status !== 200) {
          ServerActionCreators.receiveGetUsers(null, res.body);
        } else {
          ServerActionCreators.receiveGetUsers(res.body, null);
        }
      }
    });
  },

  uploadAvatar: function(file) {
    var url = APIEndpoints.ACCOUNT_ACTION_ROOT + '/avatar'

    let req = postFile(url);

    req.attach("file", file);
    req.field('file', file.name);

    req.end(function(err, res) {
      if (isLoggedIn(err) && res) {
        if (res.status !== 200) {
          ServerActionCreators.receiveUploadAvatar(null, res.body);
        } else {
          ServerActionCreators.receiveUploadAvatar(res.body, null);
        }
      }
    });
  },

  updateUser: function(slug, data) {
    var url = APIEndpoints.USER_ACTION_ROOT + '/' + slug;

    post(url, data)
    .end(function(err, res) {
      if (isLoggedIn(err) && res) {
        if (res.status !== 200) {
          ServerActionCreators.receiveUpdateUser(null, res.body);
        } else {
          ServerActionCreators.receiveUpdateUser(res.body, null);
        }
      }
    });
  },

  updateProfileInfo: function(data) {
    var url = APIEndpoints.ACCOUNT_ACTION_ROOT + '/edit/info';

    post(url, data)
    .end(function(err, res) {
      if (isLoggedIn(err) && res) {
        if (res.status !== 200) {
          ServerActionCreators.receiveUpdateUser(null, res.body);
        } else {
          ServerActionCreators.receiveUpdateUser(res.body, null);
        }
      }
    });
  },

  updateProfileAddress: function(data) {
    var url = APIEndpoints.ACCOUNT_ACTION_ROOT + '/edit/address';

    post(url, data)
    .end(function(err, res) {
      if (isLoggedIn(err) && res) {
        if (res.status !== 200) {
          ServerActionCreators.receiveUpdateUser(null, res.body);
        } else {
          ServerActionCreators.receiveUpdateUser(res.body, null);
        }
      }
    });
  },

  updateProfilePassword: function(data) {
    var url = APIEndpoints.ACCOUNT_ACTION_ROOT + '/edit/password';

    post(url, data)
    .end(function(err, res) {
      if (isLoggedIn(err) && res) {
        if (res.status !== 200) {
          ServerActionCreators.receiveUpdateUser(null, res.body);
        } else {
          ServerActionCreators.receiveUpdateUser(res.body, null);
        }
      }
    });
  },

  getUser: function(slug) {
    var url = APIEndpoints.USER_ACTION_ROOT + '/' + slug;

    var query = get(url)
    .end(function(err, res) {
      if (isLoggedIn(err) && res) {
        if (res.status !== 200) {
          ServerActionCreators.receiveGetUser(null, res.body);
        } else {
          ServerActionCreators.receiveGetUser(res.body, null);
        }
      }
    });
  },

  toggleFavorite: function(userId) {
    var url = APIEndpoints.USER_ACTION_ROOT + '/' + userId + '/favorite';

    var query = post(url)
    .end(function(err, res) {
      if (isLoggedIn(err) && res) {
        if (res.status !== 200) {
          ServerActionCreators.receiveToggleFavorite(null, res.body);
        } else {
          ServerActionCreators.receiveToggleFavorite(res.body, null);
        }
      }
    });
  },

  deleteUser: function(slug) {
    var url = APIEndpoints.USER_ACTION_ROOT + '/' + slug;

    var query = del(url)
    .end(function(err, res) {
      if (isLoggedIn(err) && res) {
        if (res.status !== 200) {
          ServerActionCreators.receiveDeleteUser(null, res.body);
        } else {
          ServerActionCreators.receiveDeleteUser(res.body, null);
        }
      }
    });
  },

  addUserListing: function(user_id, data) {
    var url = APIEndpoints.USER_ACTION_ROOT + '/' + user_id + '/listings/' + data.listing;
    post(url, data).end(function(err, res) {
      if (isLoggedIn(err) && res) {
        if (res.status !== 200) {
          ServerActionCreators.receiveAddUserListing(null, res.body);
        } else {
          ServerActionCreators.receiveAddUserListing(res.body, null);
        }
      }
    });
  },

  removeUserListing: function(uL) {
    var url = APIEndpoints.USER_ACTION_ROOT + '/' + uL.patient_id + '/listings/' + uL.listing_slug;

    post(url).end(function(err, res) {
      if (isLoggedIn(err) && res) {
        if (res.status !== 200) {
          ServerActionCreators.receiveRemoveUserListing(null, res.body);
        } else {
          ServerActionCreators.receiveRemoveUserListing(res.body, null);
        }
      }
    });
  },

  removeUserPatient: function(patientId) {
    var url = APIEndpoints.USER_ACTION_ROOT + '/' + patientId + '/remove-patient';

    post(url).end(function(err, res) {
      if (isLoggedIn(err) && res) {
        if (res.status !== 200) {
          ServerActionCreators.receiveRemoveUserPatient(null, res.body);
        } else {
          ServerActionCreators.receiveRemoveUserPatient(res.body, null);
        }
      }
    });
  },

  /**
      MESSAGE
  */

  getMessages: function(page, resultsPerPage, filter) {
    var url = APIEndpoints.MESSAGE_ACTION_ROOT;

    var query = get(url)
    .query({page: page})
    .query({resultsPerPage: resultsPerPage});

    if (filter !== undefined && filter !== 'undefined' && filter !== null) {
      query.query({filter: filter});
    }

    query.end(function(err, res) {
      if (isLoggedIn(err) && res) {
        if (res.status !== 200) {
          ServerActionCreators.receiveGetMessages(null, res.body);
        } else {
          ServerActionCreators.receiveGetMessages(res.body, null);
        }
      }
    });
  },

  createMessage: function(data, files) {
    var url = APIEndpoints.MESSAGE_ACTION_ROOT;

    var req = postFile(url);

    _.forEach(data, (v, k) => {
      req.field(k, v);
    });

    files.forEach((file, i) => {
      let name = 'files[' + i + ']';
      req.attach(name, file);
      req.field(name, file.name);
    });

    req.end(function(err, res) {
      if (isLoggedIn(err) && res) {
        if (res.status !== 200) {
          ServerActionCreators.receiveCreateMessage(null, res.body);
        } else {
          ServerActionCreators.receiveCreateMessage(res.body, null);
        }
      }
    });
  },

  updateMessage: function(slug, data) {
    var url = APIEndpoints.MESSAGE_ACTION_ROOT + '/' + slug;

    put(url, data)
    .end(function(err, res) {
      if (isLoggedIn(err) && res) {
        if (res.status !== 200) {
          ServerActionCreators.receiveUpdateMessage(null, res.body);
        } else {
          ServerActionCreators.receiveUpdateMessage(res.body, null);
        }
      }
    });
  },

  readMessage: function(slug) {
    var url = APIEndpoints.MESSAGE_ACTION_ROOT + '/read/' + slug;

    post(url)
    .end(function(err, res) {
      if (isLoggedIn(err) && res) {
        if (res.status !== 200) {
          ServerActionCreators.receiveReadMessage(null, res.body);
        } else {
          ServerActionCreators.receiveReadMessage(res.body, null);
        }
      }
    });
  },

  getMessage: function(slug) {
    var url = APIEndpoints.MESSAGE_ACTION_ROOT + '/' + slug;

    var query = get(url)
    .end(function(err, res) {
      if (isLoggedIn(err) && res) {
        if (res.status !== 200) {
          ServerActionCreators.receiveGetMessage(null, res.body);
        } else {
          ServerActionCreators.receiveGetMessage(res.body, null);
        }
      }
    });
  },

  deleteMessage: function(slug) {
    var url = APIEndpoints.MESSAGE_ACTION_ROOT + '/' + slug;

    var query = del(url)
    .end(function(err, res) {
      if (isLoggedIn(err) && res) {
        if (res.status !== 200) {
          ServerActionCreators.receiveDeleteMessage(null, res.body);
        } else {
          ServerActionCreators.receiveDeleteMessage(res.body, null);
        }
      }
    });
  },

  /**
    DOCUMENTS
  */

  getDocuments: function(page, resultsPerPage, filter) {
    var url = APIEndpoints.DOCUMENT_ACTION_ROOT;

    var query = get(url)
      .query({page: page})
      .query({resultsPerPage: resultsPerPage});

    if (filter !== undefined && filter !== 'undefined' && filter !== null) {
      query.query({filter: filter});
    }

    query.end(function(err, res) {
      if (isLoggedIn(err) && res) {
        if (res.status !== 200) {
          ServerActionCreators.receiveGetDocuments(null, res.body);
        } else {
          ServerActionCreators.receiveGetDocuments(res.body, null);
        }
      }
    });
  },

  createDocument: function(data) {
    var url = APIEndpoints.DOCUMENT_ACTION_ROOT;

    postFile(url)
      .field('name', data.name)
      .field('project', data.project)
      .attach('file', data.file)
      .end(function(err, res) {
        if (isLoggedIn(err) && res) {
            if (res.status !== 200) {
              ServerActionCreators.receiveCreateDocument(null, res.body);
            } else {
              ServerActionCreators.receiveCreateDocument(res.body, null);
            }
          }
      });
  },

  updateDocument: function(slug, data) {
    var url = APIEndpoints.DOCUMENT_ACTION_ROOT + '/' + slug + '/put';

    postFile(url)
      .field('name', data.name)
      .field('project', data.project)
      .attach('file', data.file)
      .end(function(err, res) {
        if (isLoggedIn(err) && res) {
          if (res.status !== 200) {
            ServerActionCreators.receiveUpdateDocument(null, res.body);
          } else {
            ServerActionCreators.receiveUpdateDocument(res.body, null);
          }
        }
      });
  },

  getDocument: function(slug) {
    var url = APIEndpoints.DOCUMENT_ACTION_ROOT + '/' + slug;

    var query = get(url)
      .end(function(err, res) {
      if (isLoggedIn(err) && res) {
        if (res.status !== 200) {
          ServerActionCreators.receiveGetDocument(null, res.body);
        } else {
          ServerActionCreators.receiveGetDocument(res.body, null);
        }
      }
    });
  },

  deleteDocument: function(slug) {
    var url = APIEndpoints.DOCUMENT_ACTION_ROOT + '/' + slug;

    var query = del(url)
      .end(function(err, res) {
      if (isLoggedIn(err) && res) {
        if (res.status !== 200) {
          ServerActionCreators.receiveDeleteDocument(null, res.body);
        } else {
          ServerActionCreators.receiveDeleteDocument(res.body, null);
        }
      }
    });
  },

  /**
      LISTING
  */

  getListings: function(page, resultsPerPage, filter) {
    var url = APIEndpoints.LISTING_ACTION_ROOT;

    var query = get(url)
    .query({page: page})
    .query({resultsPerPage: resultsPerPage});

    if (filter !== undefined && filter !== 'undefined' && filter !== null) {
      query.query({filter: filter});
    }

    query.end(function(err, res) {
      if (isLoggedIn(err) && res) {
        if (res.status !== 200) {
          ServerActionCreators.receiveGetListings(null, res.body);
        } else {
          ServerActionCreators.receiveGetListings(res.body, null);
        }
      }
    });
  },

  createListing: function(data) {
    var url = APIEndpoints.LISTING_ACTION_ROOT;

    post(url, data)
    .end(function(err, res) {
      if (isLoggedIn(err) && res) {
        if (res.status !== 200) {
          ServerActionCreators.receiveCreateListing(null, res.body);
        } else {
          ServerActionCreators.receiveCreateListing(res.body, null);
        }
      }
    });
  },

  createEmptyListing: function(data) {
    var url = APIEndpoints.LISTING_ACTION_ROOT + '/create-empty';

    post(url, data)
    .end(function(err, res) {
      if (isLoggedIn(err) && res) {
        if (res.status !== 200) {
          ServerActionCreators.receiveCreateEmptyListing(null, res.body);
        } else {
          ServerActionCreators.receiveCreateEmptyListing(res.body, null);
        }
      }
    });
  },

  duplicateListing: function(slug) {
    var url = `${APIEndpoints.LISTING_ACTION_ROOT}/${slug}/duplicate`;

    post(url)
    .end(function(err, res) {
      if (isLoggedIn(err) && res) {
        if (res.status !== 200) {
          ServerActionCreators.receiveDuplicateListing(null, res.body);
        } else {
          ServerActionCreators.receiveDuplicateListing(res.body, null);
        }
      }
    });
  },

  updateListing: function(slug, data, items, removedItems) {
    var url = APIEndpoints.LISTING_ACTION_ROOT + '/' + slug + '/save';

    let req = postFile(url);
    let itemsCopy = _.clone(items, true);

    // we should remove the documents from the items and send them apart
    _.forEach(itemsCopy, (item) => {
      _.forEach(item.documents, (doc, k) => {
        let baseName = `documents[${item.slug}][${k}]`;
        if (doc instanceof Blob)
          req.attach(`${baseName}[file]`, doc);
        else
          req.field(`${baseName}[slug]`, doc.slug);
        req.field(`${baseName}[name]`, sanitize(doc.name));
      });
      delete item.documents;
    });

    data.items = JSON.stringify(itemsCopy);

    _.forEach(data, (value, key) => {
      req.field(key, value);
    });

    _.forEach(removedItems, (value, key) => {
      let name = `removedItems[${key}]`;
      req.field(name, value);
    });

    req.end(function(err, res) {
      if (isLoggedIn(err) && res) {
        if (res.status !== 200) {
          ServerActionCreators.receiveUpdateListing(null, res.body);
        } else {
          ServerActionCreators.receiveUpdateListing(res.body, null);
        }
      }
    });
  },

  getListing: function(slug) {
    var url = APIEndpoints.LISTING_ACTION_ROOT + '/' + slug;

    var query = get(url)
    .end(function(err, res) {
      if (isLoggedIn(err) && res) {
        if (res.status !== 200) {
          ServerActionCreators.receiveGetListing(null, res.body);
        } else {
          ServerActionCreators.receiveGetListing(res.body, null);
        }
      }
    });
  },

  deleteListing: function(slug) {
    var url = APIEndpoints.LISTING_ACTION_ROOT + '/' + slug;

    var query = del(url)
    .end(function(err, res) {
      if (isLoggedIn(err) && res) {
        if (res.status !== 200) {
          ServerActionCreators.receiveDeleteListing(null, res.body);
        } else {
          ServerActionCreators.receiveDeleteListing(res.body, null);
        }
      }
    });
  },

  toggleTemplateListing: function(slug) {
    var url = `${APIEndpoints.LISTING_ACTION_ROOT}/${slug}/toggle-template`;

    post(url)
    .end(function(err, res) {
      if (isLoggedIn(err) && res) {
        if (res.status !== 200) {
          ServerActionCreators.receiveToggleTemplateListing(null, res.body);
        } else {
          ServerActionCreators.receiveToggleTemplateListing(res.body, null);
        }
      }
    });
  },

  /**
      CATEGORY
  */

  getCategories: function(page, resultsPerPage, filter) {
    var url = APIEndpoints.CATEGORY_ACTION_ROOT;

    var query = get(url)
    .query({page: page})
    .query({resultsPerPage: resultsPerPage});

    if (filter !== undefined && filter !== 'undefined' && filter !== null) {
      query.query({filter: filter});
    }

    query.end(function(err, res) {
      if (isLoggedIn(err) && res) {
        if (res.status !== 200) {
          ServerActionCreators.receiveGetCategories(null, res.body);
        } else {
          ServerActionCreators.receiveGetCategories(res.body, null);
        }
      }
    });
  },

  createCategory: function(data) {
    var url = APIEndpoints.CATEGORY_ACTION_ROOT;

    post(url, data)
    .end(function(err, res) {
      if (isLoggedIn(err) && res) {
        if (res.status !== 200) {
          ServerActionCreators.receiveCreateCategory(null, res.body);
        } else {
          ServerActionCreators.receiveCreateCategory(res.body, null);
        }
      }
    });
  },

  updateCategory: function(slug, data) {
    var url = APIEndpoints.CATEGORY_ACTION_ROOT + '/' + slug;

    put(url, data)
    .end(function(err, res) {
      if (isLoggedIn(err) && res) {
        if (res.status !== 200) {
          ServerActionCreators.receiveUpdateCategory(null, res.body);
        } else {
          ServerActionCreators.receiveUpdateCategory(res.body, null);
        }
      }
    });
  },

  getCategory: function(slug) {
    var url = APIEndpoints.CATEGORY_ACTION_ROOT + '/' + slug;

    var query = get(url)
    .end(function(err, res) {
      if (isLoggedIn(err) && res) {
        if (res.status !== 200) {
          ServerActionCreators.receiveGetCategory(null, res.body);
        } else {
          ServerActionCreators.receiveGetCategory(res.body, null);
        }
      }
    });
  },

  deleteCategory: function(slug) {
    var url = APIEndpoints.CATEGORY_ACTION_ROOT + '/' + slug;

    var query = del(url)
    .end(function(err, res) {
      if (isLoggedIn(err) && res) {
        if (res.status !== 200) {
          ServerActionCreators.receiveDeleteCategory(null, res.body);
        } else {
          ServerActionCreators.receiveDeleteCategory(res.body, null);
        }
      }
    });
  },

  /**
      ITEM ACTIVITY
  */

  getItemActivities: function(page, resultsPerPage, filter) {
    var url = APIEndpoints.ITEM_ACTIVITY_ACTION_ROOT;

    query.end(function(err, res) {
      if (isLoggedIn(err) && res) {
        if (res.status !== 200) {
          ServerActionCreators.receiveGetItemActivities(null, res.body);
        } else {
          ServerActionCreators.receiveGetItemActivities(res.body, null);
        }
      }
    });
  },

  answerItemActivity: function(slug, data) {
    var url = `${APIEndpoints.ITEM_ACTIVITY_ACTION_ROOT}/${slug}`;

    var req = postFile(url);

    let files = data.answerFile;
    delete data.answerFile;

    _.forEach(data, (v, k) => {
      if (k.match(/answerSelect/)) {
        req.field(k, JSON.stringify(v));
      } else {
        req.field(k, v);
      }
    });

    if (files && files.length) {
      files.forEach((file, i) => {
        let name = 'files[' + i + ']';
        req.attach(name, file);
        req.field(name, file.name);
      });
    }

    req.end(function(err, res) {
      if (isLoggedIn(err) && res) {
        if (res.status !== 200) {
          ServerActionCreators.receiveAnswerItemActivity(null, res.body);
        } else {
          ServerActionCreators.receiveAnswerItemActivity(res.body, null);
        }
      }
    });
  },

  getItemActivity: function(slug) {
    var url = APIEndpoints.ITEM_ACTIVITY_ACTION_ROOT + '/' + slug;

    var query = get(url)
    .end(function(err, res) {
      if (isLoggedIn(err) && res) {
        if (res.status !== 200) {
          ServerActionCreators.receiveGetItemActivity(null, res.body);
        } else {
          ServerActionCreators.receiveGetItemActivity(res.body, null);
        }
      }
    });
  },

  /**
      ALERTS
  */

  getAlerts: function() {
    var url = APIEndpoints.ALERT_ACTION_ROOT;

    get(url).end(function(err, res) {
      if (isLoggedIn(err) && res) {
        if (res.status !== 200) {
          ServerActionCreators.receiveGetAlerts(null, res.body);
        } else {
          ServerActionCreators.receiveGetAlerts(res.body, null);
        }
      }
    });
  },

  toggleCloseAlert: function(userId, type) {
    var url = `${APIEndpoints.USER_ACTION_ROOT}/${userId}/alerts/close`;

    put(url, {type: type}).end(function(err, res) {
      if (isLoggedIn(err) && res) {
        if (res.status !== 200) {
          ServerActionCreators.receiveToggleCloseAlert(null, res.body);
        } else {
          ServerActionCreators.receiveToggleCloseAlert(res.body, null);
        }
      }
    });
  },

  getAlert: function(slug) {
    var url = APIEndpoints.ALERT_ACTION_ROOT + '/' + slug;

    var query = get(url)
    .end(function(err, res) {
      if (isLoggedIn(err) && res) {
        if (res.status !== 200) {
          ServerActionCreators.receiveGetAlert(null, res.body);
        } else {
          ServerActionCreators.receiveGetAlert(res.body, null);
        }
      }
    });
  },

};

export default WebApi;
