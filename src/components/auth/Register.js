'use strict';
import Translator from '../../services/Translator';
import React, {Component} from 'react';
import Loader from '../common/Loader';
import _ from 'lodash';
import {Link} from 'react-router';

import Formsy from 'formsy-react';
import {Input} from 'formsy-react-components';
import InputMDT from '../common/InputMDT';
import CheckboxMDT from '../common/CheckboxMDT';

import AuthStore from '../../stores/authStore';
import InviteStore from '../../stores/inviteStore';
import OrganizationStore from '../../stores/organizationStore';
import UserStore from '../../stores/userStore';

import AuthActionCreators from '../../actions/authActionCreators';
import InviteActionCreators from '../../actions/inviteActionCreators';
import OrganizationActionCreators from '../../actions/organizationActionCreators';
import UserActionCreators from '../../actions/userActionCreators';

import P from '../../constants/parameters';
import poweredImage from '../../assets/images/powered.png';
import '../../assets/scss/login.scss';

export default class Register extends Component {

  constructor(props) {
    super(props);

    var invite = null, loading = false;

    if (this.props.params.inviteSlug) {
      invite = InviteStore.findBySlug(this.props.params.inviteSlug);

      if (!invite) {
        InviteActionCreators.getInvite(this.props.params.inviteSlug);
        loading = true;
      }
    }

    this.state = {
      loading: loading,
      invite: invite,
      canSubmit: false,
      errors: [],
    };

    AuthStore.addChangeListener(this._onChange);
    InviteStore.addChangeListener(this._onInviteChange);
  }

  componentWillUnmount() {
    AuthStore.removeChangeListener(this._onChange);
    InviteStore.removeChangeListener(this._onInviteChange);
  }

  _onChange = () => {
    this.setState({
      errors: AuthStore.errors,
      user: AuthStore.user,
    });
  }

  _onInviteChange = () => {
    if (this.props.params.inviteSlug) {
      let invite = this.state.invite || InviteStore.findBySlug(this.props.params.inviteSlug);
      let loading = false;

      this.setState({
        invite: invite,
        loading: loading
      });
    }
  }

  enableButton = () => {
    this.setState({canSubmit: true});
  }

  disableButton = () => {
    this.setState({canSubmit: false});
  }

  submit = (model) => {
    if (this.state.invite && this.state.invite !== null) {
      model.invite_slug = this.state.invite.slug;
    }
    AuthActionCreators.createUser(model);
  }

  mapInputs(inputs) {
    return {
      'fos_user_registration_form[firstname]': inputs.firstname,
      'fos_user_registration_form[lastname]': inputs.lastname,
      'fos_user_registration_form[email]': inputs.email,
      'fos_user_registration_form[plainPassword][first]': inputs.password,
      'fos_user_registration_form[plainPassword][second]': inputs.passwordrepeat,
      'invite-slug': inputs.inviteSlug,
    };
  }

  render() {
    let createErrorDiv = (error, key) => {
      return (
        <div key={key}>{error}</div>
      );
    };

    let specMessage = '';
    let cguUrl = '';

    if (this.state.invite && this.state.invite !== null) {
      if (this.state.invite.accepted) {
        specMessage = (
          <div className="message">Cette invitation n'est plus valable</div>
        );
      }
      if (this.state.invite.printable_from_organization !== '') {
        cguUrl = 'http://vwww.myodoctool.com/cgu_patient';
        specMessage = (
          <div className="message">
            <p>
              Vous êtes invité à vous inscrire sur la plateforme de suivi patient MyDocTool.
              Merci de remplir le formulaire ci joint et de cliquer sur le bouton « créer un compte » pour confirmer votre inscription.
            </p>
            <p>
              Bien cordialement,<br/>
              L’équipe MyDocTool
            </p>
          </div>
        );
      } else if (this.state.invite.printable_from_user !== '') {
        cguUrl = 'http://vwww.myodoctool.com/cgu_patient';
        specMessage = (
          <div className="message">
            <p>
              Vous êtes invité à vous inscrire par le Dr {this.state.invite.printable_from_user} sur la plateforme de suivi patient MyDocTool.
              Merci de remplir le formulaire ci joint et de cliquer sur le bouton « créer un compte » pour confirmer votre inscription.
            </p>
            <p>
              Bien cordialement,<br/>
              L’équipe MyDocTool
            </p>
          </div>
        );
      }
    }

    return this.state.loading ? <Loader /> : (
      <div id="register" className="container">
        <div className="col-md-6">
          <div className="infos">
            <div className="logo">
            <p>
              {this.state.invite.logo_image !== '' ? (
                <img src={P.CONFIG.UPLOAD_ROOT + this.state.invite.logo_image} />
              ) : ''
              }
            </p>
            </div>
            <h2>Bonjour,</h2>
            {specMessage}
          </div>
        </div>
        <div className="col-md-6">
          <div className="form">
            <h2>Inscription</h2>
            <Formsy.Form
              onValidSubmit={this.submit}
              onValid={this.enableButton}
              onInvalid={this.disableButton}
              mapping={this.mapInputs}
              className="form-horizontal"
            >
              <div className="form-group">
                <div className="col-sm-6">
                <Input type="text"
                    name="firstname"
                    value={this.state.invite && this.state.invite.more_data.firstname ? this.state.invite.more_data.firstname : ''}
                    layout="elementOnly"
                    placeholder="Prénom"
                    required
                  />
                </div>
                <div className="col-sm-6">
                  <Input type="text"
                    name="lastname"
                    value={this.state.invite && this.state.invite.more_data.lastname ? this.state.invite.more_data.lastname : ''}
                    layout="elementOnly"
                    placeholder="Nom"
                    required
                  />
                </div>
              </div>

              <InputMDT type="email"
                name="email"
                value={this.state.invite && this.state.invite.to_email ? this.state.invite.to_email : ''}
                layout="auth"
                placeholder="Votre adresse email"
                className="col-sm-12"
                validations="isEmail"
                validationError="Ce champ doit être un email valide"
                required
              />

              <InputMDT type="password"
                name="password"
                layout="auth"
                placeholder="Choisissez votre mot de passe"
                className="col-sm-12"
                required
              />

              <InputMDT type="password"
                name="passwordrepeat"
                placeholder="Confirmez votre mot de passe"
                layout="auth"
                validations="equalsField:password"
                validationError="Le mot de passe ne correspond pas"
                className="col-sm-12"
                required
              />

              <CheckboxMDT
                name="checkbox"
                className="cgu"
                id="cgu"
                label="J'accepte les conditions générales d’utilisations"
                labelHtml={Translator.translate('MES_PROTOCOLES')` <a href="${cguUrl}" target="_blank"> Translator.translate('MES_PROTOCOLES')</a>`}
                required
              />

            {/**
              <div className="checkbox cgu">
                <input type="checkbox" id="cgu" required/>
                <label htmlFor="cgu">J’accepte les <a href="#">conditions générales d’utilisations</a></label>
              </div>
            */}
              <button type="submit" className="btn" disabled={!this.state.canSubmit}>Créer un compte</button>
            </Formsy.Form>
          </div>
        </div>
        <div className="text-center col-md-6 col-md-offset-6 actions">
          <p>Vous êtes déjà inscrit ? <Link to="/login">Connectez-vous</Link></p>
        </div>

        <div id="footer">
          <Link to ="/"><img src={poweredImage} /></Link>
        </div>
      </div>
    );
  }
}
