"use strict";

import React, {Component} from 'react';
import {Link} from 'react-router';
import toastr from 'toastr';
import UserActionCreators from '../../actions/userActionCreators';

import AuthStore from '../../stores/authStore';
import UserStore from '../../stores/userStore';
import MessageStore from '../../stores/messageStore';
import Messages from './messages/Messages';

import Formsy from 'formsy-react';
import InputMDT from '../common/InputMDT';
import SelectMDT from '../common/SelectMDT';

import countries from '../../constants/countries';

class AccountAddress extends Component {

  constructor(props) {
    super(props);

    this.state = {
      canSubmit: false,
      errors: []
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
    UserActionCreators.updateProfileAddress(data);
  }

  render() {

    let user = UserStore.currentUser;

    return (
      <div className="main col-md-9">
          <h2>Mon adresse</h2>
          <Formsy.Form onValidSubmit={this.submit}
            onValid={this.enableButton}
            onInvalid={this.disableButton}
            validationErrors={{} || this.props.errors.children}
            className="row"
          >
            <div className="col-sm-6">
              <InputMDT
                name="address"
                label="Adresse"
                placeholder="Numéro et nom de voie"
                value={user.address}
                layout="account"
              />

              <InputMDT
                name="addressMore"
                label="Adresse complémentaire"
                placeholder="Etage, batiment, autre..."
                value={user.address_more}
                layout="account"
              />

              <InputMDT
                name="addressMore2"
                label="Adresse complémentaire"
                placeholder="Optionnel"
                value={user.address_more2}
                layout="account"
              />
            </div>
            <div className="col-sm-6">
              <InputMDT
                name="postalCode"
                label="Code Postal"
                placeholder="Indiquez votre code postal"
                value={user.postalcode}
                layout="account"
              />

              <InputMDT
                name="city"
                label="Ville"
                placeholder="Indiquez votre ville"
                value={user.city}
                layout="account"
              />

              <div className="form-group">
                <label>Pays</label>
                <SelectMDT
                  name="country"
                  placeholder="Sélectionnez votre pays"
                  options={countries}
                  value={user.country}
                />
              </div>
            </div>
            <div className="col-lg-12">
              <button type="submit" className="btn" disabled={!this.state.canSubmit}>Enregistrer</button>
            </div>
          </Formsy.Form>
        </div>
    );
  }

}

export default AccountAddress;