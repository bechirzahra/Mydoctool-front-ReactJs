"use strict";

import React, {Component} from 'react';
import {Link} from 'react-router';
import toastr from 'toastr';
import dateFormat from 'dateformat-light';
import Formsy from 'formsy-react';

import utils from '../../services/utils';
import AuthStore from '../../stores/authStore';
import UserStore from '../../stores/userStore';
import MessageStore from '../../stores/messageStore';
import Messages from './messages/Messages';
import UserActionCreators from '../../actions/userActionCreators';
import InputMDT from '../common/InputMDT';
import SelectMDT from '../common/SelectMDT';
import RadioMDT from '../common/RadioMDT';
import isodate from "isodate";
import {USER} from '../../constants/parameters';
import history from '../../services/history';

class AccountInfos extends Component {

  constructor(props) {
    super(props);

    this.state = {
      canSubmit: false,
      errors: [],
      emailChanged: false,
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
    } else {
      this.setState({errors: errors});
    }

    if (this.state.emailChanged) {
      toastr.info('Vous avez changé votre e-mail. Pour des raisons de sécurité, merci de vous reconnecter.')
      AuthStore.logout(false);
      history.pushState(null, '/login');
    }
  }

  enableButton = () => {
    this.setState({canSubmit: true});
  }

  disableButton = () => {
    this.setState({canSubmit: false});
  }

  submit = (data) => {
    if (data.email !== UserStore.currentUser.email) {
      this.setState({emailChanged: true});
    }
    UserActionCreators.updateProfileInfo(data);
  }

  render() {

    let user = UserStore.currentUser;
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
              name="firstname"
              label="Prénom"
              placeholder="Votre prénom"
              value={user.firstname}
              layout="account"
            />

            <InputMDT
              name="lastname"
              label="Nom"
              placeholder="Votre nom"
              value={user.lastname}
              layout="account"
            />

            <InputMDT
              name="maidenname"
              label="Nom de jeune fille"
              placeholder="Votre nom de jeune fille"
              value={user.maidenname}
              layout="account"
            />

            <InputMDT
              name="email"
              label="Email"
              placeholder="e.g. john@doe.com"
              value={user.email}
              layout="account"
            />

            <InputMDT
              name="phoneNumber"
              label="Téléphone portable"
              placeholder="0X XX XX XX XX"
              value={user.phone_number}
              layout="account"
            />
          </div>

          {user.type === USER.PATIENT ? (
            <div className="col-sm-6">
              <div className="form-group date">
                <label htmlFor="born">Date de naissance</label>

                <SelectMDT
                  name="birthdayDay"
                  placeholder="Jour"
                  options={UserStore.getDayOptions()}
                  value={user.birthday_day}
                />

                <SelectMDT
                  name="birthdayMonth"
                  placeholder="Mois"
                  options={UserStore.getMonthOptions()}
                  value={user.birthday_month}
                />

                <SelectMDT
                  name="birthdayYear"
                  placeholder="Année"
                  options={UserStore.getYearOptions()}
                  value={user.birthday_year}
                />
              </div>

              <RadioMDT
                name="gender"
                label="Sexe"
                className="form-group sexe"
                options={[
                  {label: 'Femme', value: '3'},
                  {label: 'Homme', value: '2'}
                ]}
                layout="timeline"
                value={user.gender}
              />

              <InputMDT
                name="height"
                label="Taille (en m)"
                placeholder="Indiquez votre taille"
                value={user.height}
                layout="account"
              />

              <InputMDT
                name="weight"
                labelHtml={`Poids au <b>${dateFormat(isodate(weightDate), "d mmmm yyyy")}</b>`}
                placeholder="Entrez votre poids en kg (ex : 60,5)"
                value={user.weight}
                layout="account"
              />

              <RadioMDT
                name="smoker"
                label="Fumeur"
                className="form-group smoker"
                options={[
                  {label: 'Oui', value: '1'},
                  {label: 'Non', value: '0'}
                ]}
                layout="timeline"
                value={user.smoker}
              />
            </div>
          ) : (
            <div className="col-sm-6">

              <InputMDT
                name="expertise"
                label="Votre spécialisation"
                value={user.expertise}
                layout="account"
              />

            </div>
          )}

          <div className="col-lg-12">
            <button type="submit" className="btn" disabled={!this.state.canSubmit}>Enregistrer</button>
          </div>
        </Formsy.Form>
      </div>
    );
  }

}

export default AccountInfos;