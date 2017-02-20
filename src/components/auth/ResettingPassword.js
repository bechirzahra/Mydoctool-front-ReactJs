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
export default class ResettingPassword extends Component {

  constructor(props) {
    super(props);

    this.state = {
      canSubmit: false,
      errors: {},
    };

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

  submit = (data) => {
    this.setState({loading: true});
    AuthActionCreators.resettingPassword(data, this.props.params.token);
  }

  mapInputs(inputs) {
    return {
      'fos_user_resetting_form[plainPassword][first]': inputs.first,
      'fos_user_resetting_form[plainPassword][second]': inputs.second,
    };
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
          Mot de passe réinitialisé. <Link to="/">Retour à l'accueil.</Link>
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
            <Input type="password"
              name="first"
              layout="elementOnly"
              placeholder="Choisissez votre mot de passe"
              required
            />
          </div>
        </div>
        <div className="form-group">
          <div className="col-sm-12">
            <Input type="password"
              name="second"
              placeholder="Confirmez votre mot de passe"
              layout="elementOnly"
              validations="equalsField:first"
              validationError="Le mot de passe ne correspond pas"
              required
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

        <div id="footer">
          <Link to="/"><img src={poweredImage} /></Link>
        </div>
      </div>
    );
  }
}
