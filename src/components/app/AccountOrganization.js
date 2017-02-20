"use strict";

import React, {Component} from 'react';
import {Link} from 'react-router';
import toastr from 'toastr';
import dateFormat from 'dateformat-light';
import Formsy from 'formsy-react';
import isodate from "isodate";

import utils from '../../services/utils';
import AuthStore from '../../stores/authStore';
import UserStore from '../../stores/userStore';
import OrganizationStore from '../../stores/organizationStore';
import MessageStore from '../../stores/messageStore';
import Messages from './messages/Messages';
import UserActionCreators from '../../actions/userActionCreators';
import OrganizationActionCreators from '../../actions/organizationActionCreators';

import InputMDT from '../common/InputMDT';
import SelectMDT from '../common/SelectMDT';
import RadioMDT from '../common/RadioMDT';
import SimpleFileMDT from '../common/SimpleFileMDT';


import {USER} from '../../constants/parameters';

class AccountOrganization extends Component {

  constructor(props) {
    super(props);

    this.state = {
      canSubmit: false,
      errors: [],
      logoFile: null,
      imageFile: null
    };

    UserStore.addChangeListener(this._onChange);
  }

  componentWillUnmount() {
    UserStore.removeChangeListener(this._onChange);
  }

  _onChange = () => {
    let errors = UserStore.errors;

    if (errors.length === 0) {
      toastr.success('Profil mis à jour', 'Succès !');
    }

    this.setState({errors: errors});
  }

  enableButton = () => {
    this.setState({canSubmit: true});
  }

  disableButton = () => {
    this.setState({canSubmit: false});
  }

  submit = (data) => {
    let files = {
      logoFile: this.state.logoFile,
      imageFile: this.state.imageFile
    };
    OrganizationActionCreators.updateOrganization(OrganizationStore.currentOrganization.slug, data, files);
  }

  onFileChange = (type, file) => {
    if (type === 'logo') {
      this.setState({logoFile: file});
    } else {
      this.setState({imageFile: file});
    }
  }

  render() {

    let user = UserStore.currentUser;
    let organization = OrganizationStore.currentOrganization;

    let weightDate = utils.isValidDate(user.weight_changed_at) ? user.weight_changed_at : new Date();

    return (
      <div className="main col-md-9">
        <h2>Mes informations</h2>
        <Formsy.Form onValidSubmit={this.submit}
          onValid={this.enableButton}
          onInvalid={this.disableButton}
          validationErrors={{} || this.props.errors.children}
          className="row"
        >
          <div className="col-sm-6">

            <InputMDT
              name="name"
              label="Nom"
              value={organization.name}
              layout="account"
            />

            <InputMDT
              name="groupName"
              label="Nom du groupe"
              value={organization.group_name}
              layout="account"
            />
          </div>

          <div className="col-sm-6">

            <InputMDT
              name="url"
              label="Lien du site web"
              value={organization.url}
              layout="account"
            />

            <SimpleFileMDT
              name="logo"
              layout="account"
              label="Votre logo"
              onChange={this.onFileChange}
            />

            <SimpleFileMDT
              name="image"
              layout="account"
              label="Image de profil"
              onChange={this.onFileChange}
            />

          </div>

          <div className="col-lg-12">
            <button type="submit" className="btn" disabled={!this.state.canSubmit}>Enregistrer</button>
          </div>
        </Formsy.Form>
      </div>
    );
  }

}

export default AccountOrganization;