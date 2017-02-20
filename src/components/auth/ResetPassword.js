"use strict";

import React, {Component} from 'react';
import Formsy from 'formsy-react';
import {Input} from 'formsy-react-components';
import {Link} from 'react-router';
import Loader from '../common/Loader';
import AuthActionCreators from '../../actions/authActionCreators';
import AuthStore from '../../stores/authStore';

import poweredImage from '../../assets/images/powered.png';
import '../../assets/scss/login.scss';

export default class ResetPassword extends Component {

  constructor(props) {
    super(props);

    this.state = {
      loading: false,
      canSubmit: false,
      errors: {},
      success: false,
    };
  }

  componentDidMount() {
    AuthStore.addChangeListener(this._onChange);
  }

  componentWillUnmount() {
    AuthStore.removeChangeListener(this._onChange);
  }

  _onChange = () => {
    this.setState({errors: AuthStore.errors, success: AuthStore.isSuccess(), loading: false});
  }

  enableButton = () => {
    this.setState({canSubmit: true});
  }

  disableButton = () => {
    this.setState({canSubmit: false});
  }

  submit = (email) => {
    this.setState({loading: true});
    AuthActionCreators.resetPassword(email);
  }

  render() {
    var that = this;
    var getFormErrors = function() {
      if (that.state.errors) {
        return (
          <div className="error">{that.state.errors.message}</div>
          );
      }
      return '';
    };

    let success = this.state.loading ? <Loader type="inline"/> : this.state.success ? (
      <div>
        <p>
          Nous vous avons envoyé un email à l’adresse renseigné avec le lien permettant de réinitialiser votre mot de passe.
        </p>
      </div>
    ) : (
      <Formsy.Form onValidSubmit={that.submit}
          onValid={that.enableButton}
          onInvalid={that.disableButton}
          mapping={that.mapInputs}
          className='form-horizontal'
        >

        {getFormErrors()}

        <div className="form-group">
          <div className="col-sm-12">
            <Input name="email"
              layout="elementOnly"
              type="email"
              placeholder="Addresse Email"
              validations="isEmail"
              validationError="This is not a valid email"
            />
          </div>
        </div>
        <button type="submit" className="btn" disabled={!that.state.canSubmit}>Réinitialiser</button>
      </Formsy.Form>
    );

    return (
      <div id="forgotten" className="container">
        <div className="col-md-6 col-md-offset-3">
          <div className="form">
            <div className="logo">
              <p>
                <img src="http://etablissements.hopital.fr/pics/photos/structures_photo_logo_3234.jpg" />
              </p>
            </div>
            <h2>Réinitialisez votre<br/>mot de passe</h2>

            {success}

          </div>
        </div>

        {/*
        <div className="actionsAccount col-md-6 col-md-offset-3">
          <div className="col-xs-6 text-left">
            <a className="login" href="login.php">Connectez-vous</a>
          </div>
          <div className="col-xs-6 text-right">
            <a href="register.php">Vous n'êtes pas inscrit ? <span>Créez un compte</span></a>
          </div>
          <div className="clearfix"></div>
        </div>
        */}

        <div id="footer">
          <Link to="/"><img src={poweredImage} /></Link>
        </div>
      </div>
    );
  }
}
