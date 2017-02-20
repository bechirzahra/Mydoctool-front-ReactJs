// "use strict";

import React, {Component} from 'react';
import Formsy from 'formsy-react';
import {Input} from 'formsy-react-components';
import {Link} from 'react-router';
import AuthStore from '../../stores/authStore';
import AuthActionCreators from '../../actions/authActionCreators';

import poweredImage from '../../assets/images/powered.png';
import '../../assets/scss/login.scss';
import logo from '../../assets/images/logo.png';

export default class Login extends Component {

  constructor(props) {
    super(props);

    this.state = {
      canSubmit: false,
      errors: {}
    };

    AuthStore.addChangeListener(this._onChange);
  }

  componentWillUnmount() {
    AuthStore.removeChangeListener(this._onChange);
  }

  _onChange = () => {
    this.setState({errors: AuthStore.errors});
  }

  enableButton = () => {
    this.setState({canSubmit: true});
  }

  disableButton = () => {
    this.setState({canSubmit: false});
  }

  submit = (data) => {
    AuthActionCreators.requestLogin(data);
  }

  render() {
    return (
      <div id="login" className="container">
        <div className="col-md-6">
          <div className="infos">
            <div className="logo">
            <p>
              <img src={logo} />
            </p>
            </div>
            <h2>Bonjour,</h2>
            <p className="message">pour recevoir les informations de votre médecin et répondre à ses questions, merci de vous connecter</p>
          </div>
        </div>
        <div className="col-md-6">
          <div className="form">
            <h2>Connectez-vous</h2>
            <Formsy.Form onValidSubmit={this.submit}
              onValid={this.enableButton}
              onInvalid={this.disableButton}
              validationErrors={{} || this.props.errors.children}
              className="form-horizontal"
            >

              {this.state.errors.code && this.state.errors.code === 401 ? (
                <div className="form-group" style={{marginBottom: 0}}>
                  <div className="col-sm-12 has-error">
                    <span className="help-block validation-message">Identifiants incorrects</span>
                  </div>
                </div>
              ) : ''}

              <div className="form-group">
                <div className="col-sm-12">
                <Input name="username"
                    type="email"
                    validations='isEmail'
                    validationError='Should be an e-mail'
                    placeholder="Votre email"
                    layout="elementOnly"
                    required
                  />
                </div>
              </div>
              <div className="form-group">
                <div className="col-sm-12">
                <Input name="password"
                    type="password"
                    layout="elementOnly"
                    placeholder="Votre mot de passe"
                    required
                  />
                </div>
              </div>
              <div className="row">
                <div className="col-sm-6">
                  <div className="checkbox autoLog">
                    <input type="checkbox" id="autoLogi" />
                    <label htmlFor="autoLogi">Se rappeler de moi</label>
                  </div>
                </div>
                <div className="col-sm-6 text-right">
                  <Link to="/reset-password" className="forgotten">Mot de passe oublié ?</Link>
                </div>
              </div>
            <button type="submit" className="btn" disabled={!this.state.canSubmit}>Connexion</button>
            </Formsy.Form>
          </div>
        </div>
        <div className="text-center col-md-6 col-md-offset-6 actions">
          <p>Vous n'êtes pas inscrit ? <a href="mailto:contact@mydoctool.com">Contactez-nous pour créer un compte.</a></p>
        </div>
        <div id="footer">
          <Link to="/"><img src={poweredImage} /></Link>
        </div>
      </div>
    );
  }
}