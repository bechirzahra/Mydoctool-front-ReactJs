"use strict";

import React, {Component} from 'react';
import {Link} from 'react-router';
import toastr from 'toastr';
import AuthStore from '../../stores/authStore';
import UserStore from '../../stores/userStore';
import MessageStore from '../../stores/messageStore';
import Messages from './messages/Messages';
import UserActionCreators from '../../actions/userActionCreators';

import Formsy from 'formsy-react';
import InputMDT from '../common/InputMDT';
import SelectMDT from '../common/SelectMDT';
import RadioMDT from '../common/RadioMDT';

class AccountPassword extends Component {

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
    UserActionCreators.updateProfilePassword(data);
  }

  mapInputs(inputs) {
    return {
      'fos_user_change_password_form[current_password]': inputs.current,
      'fos_user_change_password_form[plainPassword][first]': inputs.first,
      'fos_user_change_password_form[plainPassword][second]': inputs.second,
    };
  }

  render() {

    let user = UserStore.currentUser;

    let getFormErrors = () => {
      if (this.state.errors) {
        return (
          <div className="error">{this.state.errors.message}</div>
        );
      }
      return '';
    };

    return (
      <div className="main col-md-9">
        <h2>Mot de passe</h2>
        <Formsy.Form onValidSubmit={this.submit}
          onValid={this.enableButton}
          onInvalid={this.disableButton}
          validationErrors={{} || this.props.errors.children}
          className="row"
          mapping={this.mapInputs}
        >

          <div className="col-lg-12">

            {getFormErrors()}

            <InputMDT
              name="current"
              type="password"
              label="Mot de passe actuel"
              layout="account"
              required
            />

            <InputMDT
              name="first"
              type="password"
              label="Nouveau mot de passe"
              layout="account"
              required
            />

            <InputMDT
              name="second"
              type="password"
              label="Confirmer mot de passe"
              layout="account"
              validations="equalsField:first"
              validationError="Le mot de passe ne correspond pas"
              required
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

export default AccountPassword;