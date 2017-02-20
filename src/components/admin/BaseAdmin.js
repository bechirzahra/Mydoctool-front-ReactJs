"use strict";

import React, {Component} from 'react';
import Loader from '../common/Loader';
import Helmet from 'react-helmet';
import NavAdmin from './common/NavAdmin';
import AdminTitle from './common/AdminTitle';

import InitializeActionCreators from '../../actions/initializeActionCreators';

import CategoryStore from '../../stores/categoryStore';
import DocumentStore from '../../stores/documentStore';
import ItemActivityStore from '../../stores/itemActivityStore';
import ListingStore from '../../stores/listingStore';
import UserStore from '../../stores/userStore';
import OrganizationStore from '../../stores/organizationStore';
import InviteStore from '../../stores/inviteStore';

import history from '../../services/history';

let $ = jQuery;

import '../../assets/scss/admin-area.scss';

export default class BaseAdmin extends Component {

  constructor(props) {
    super(props);

    this.state = {
      loading: true
    };

    OrganizationStore.addChangeListener(this._onChange);
    UserStore.addChangeListener(this._onChange);
    InviteStore.addChangeListener(this._onChange);
    ListingStore.addChangeListener(this._onChange);

    if (this.state.loading) {
      InitializeActionCreators.adminInit();
    }
  }

  componentWillUnmount() {
    UserStore.removeChangeListener(this._onChange);
    OrganizationStore.removeChangeListener(this._onChange);
    InviteStore.removeChangeListener(this._onChange);
    ListingStore.removeChangeListener(this._onChange);
  }

  checkStores() {
    return (
      UserStore.isInit() &&
      OrganizationStore.isInit() &&
      InviteStore.isInit() &&
      ListingStore.isInit()
    );
  }

  reset() {
    UserStore.reset();
    OrganizationStore.reset();
    InviteStore.reset();
    CategoryStore.reset();
    DocumentStore.reset();
    ListingStore.reset();
    ItemActivityStore.reset();

    history.pushState(null, '/');
  }

  _onChange = () => {
    this.setState({loading: !this.checkStores()});
  }

  render = () => {
    var getBaseAdmin = function() {
        return (
            <div>
              <AdminTitle title="Dashboard Admin"/>

            {/*
              <div className="row">
                <div className="col-lg-12">
                  <div className="panel panel-default">
                    <div className="panel-heading">
                      Utilisateurs de la semaine
                    </div>
                    <div className="panel-body">
                      User Grid ...
                    </div>
                  </div>
                </div>
              </div>
              */}
            </div>
        );
    };

    return this.state.loading ? <Loader /> : (
      <div id="admin-area">
        <Helmet
          titleTemplate="MyDocTool Admin - %s"
          script={[
            {"src": "/build/adminVendors.js", "type": "text/javascript"}
          ]}
        />
        <NavAdmin reset={this.reset}/>

        <div id="page-wrapper">
          {this.props.children || getBaseAdmin()}
        </div>
      </div>
    );
  }
}