'use strict';

import React, {Component} from 'react';
import Formsy from 'formsy-react';
import {Input, Select, File} from 'formsy-react-components';
import toastr from 'toastr';
import UserStore from '../../stores/userStore';
import InputMDT from '../common/InputMDT';
import SelectMDT from '../common/SelectMDT';
import RadioMDT from '../common/RadioMDT';
import TextareaMDT from '../common/TextareaMDT';

import InviteActionCreators from '../../actions/inviteActionCreators';
import UserActionCreators from '../../actions/userActionCreators';
import InviteStore from '../../stores/inviteStore';
import history from '../../services/history';
import {USER} from '../../constants/parameters';

export default class Invite extends Component {

  constructor(props) {
    super(props);

    let user = null;
    if (this.props.params.id && this.props.params.id !== null) {
      user = UserStore.findById(this.props.params.id);
    }

    this.state = {
      canSubmit: false,
      user: user,
      errors: [],
    };

    UserStore.addChangeListener(this._onUserUpdate);
    InviteStore.addChangeListener(this._onChange);
  }

  onResize = () => {
    const topBar = 68;
    let height = $(window).height();
    if (this.refs.dash) {
      $(this.refs.dash).css('min-height', `${height - topBar}px`);
      $(this.refs.messages).css('min-height', `${height - topBar}px`);
    }
  }

  _onChange = () => {
    let errors = InviteStore.getErrors();
    this.setState({
      errors: errors
    });

    if (errors.length === 0) {
      toastr.success('Patient invité', 'Succès');
      history.pushState(null, '/patients');
    }
  }

  _onUserUpdate = () => {
    let errors = InviteStore.getErrors();
    this.setState({
      errors: errors
    });

    if (errors.length === 0 && this.state.user !== null) {
      toastr.success('Fiche Patient enregistrée', 'Succès');
      history.pushState(null, `/patients/${this.state.user.id}`);
    }
  }

  componentDidMount() {
    $(window).resize(this.onResize);
    this.onResize();
  }

  componentWillUnmount() {
    $(window).off("resize");
    InviteStore.removeChangeListener(this._onChange);
    UserStore.removeChangeListener(this._onUserUpdate);
  }

  enableButton = () => {
    this.setState({canSubmit: true});
  }

  disableButton = () => {
    this.setState({canSubmit: false});
  }

  submit = (data) => {
    if (this.state.user === null) {
      InviteActionCreators.createInvite(data);
    } else {
      UserActionCreators.updateUser(this.state.user.id, data);
    }
  }

  render() {

    // var inviteDoctor = () => {
    //   return (
    //     <div>
    //       <h1>Inviter un Médecin à rejoindre la plateforme</h1>

    //       <Formsy.Form onValidSubmit={this.submit}
    //         onValid={this.enableButton}
    //         onInvalid={this.disableButton}
    //         validationErrors={{} || this.props.errors.children}
    //         className="form-signin"
    //       >
    //         <fieldset>
    //           <Input name="userFirstname"
    //             label="Prénom"
    //             placeholder="Prénom de l'utilisateur"
    //             required
    //           />

    //           <Input name="userLastname"
    //             label="Nom"
    //             placeholder="Nom de l'utilisateur"
    //             required
    //           />

    //           <Input name="userEmail"
    //             label="Email du Manager"
    //             placeholder="john@doe.com"
    //             validations="isEmail"
    //             validationError="Ce champ doit être un email valide"
    //             value=''
    //             help="Un e-mail sera envoyé à cette adresse pour inviter l'utilisateur à se créer un compte."
    //             required
    //           />

    //           <Input type="hidden"
    //             name="type"
    //             value={this.props.params.type}
    //           />

    //           <button type="submit" className="btn btn-default" disabled={!this.state.canSubmit}>Inviter</button>
    //         </fieldset>
    //       </Formsy.Form>
    //     </div>
    //   );
    // };

    let {user} = this.state;
    let title = user === null ? 'Ajouter un patient' : 'Éditer un patient';
    let btnTitle = user === null ? 'Créer la fiche patient' : 'Sauvegarder le patient';

    return (
      <div id="addPatient">
        <div className="dash" ref="dash">
          <div className="container-fluid wrapper">
            <Formsy.Form onValidSubmit={this.submit}
              onValid={this.enableButton}
              onInvalid={this.disableButton}
              validationErrors={{} || this.props.errors.children}
            >
              <div className="row title">
                <div className="col-md-6"><p className="text-left">{title}</p></div>
                {user === null ? (
                  <div className="col-md-6 text-right no-margin-right"><a onClick={(e) => {e.preventDefault();}} className="btn-small btnPurple2 disabled"><span className="icon icon-add"></span> Importer un fichier patient</a></div>
                ) : ''}
              </div>

              <div className="row form" style={{borderBottom: 0}}>
                <div className="form-horizontal password col-md-6">

                  <div className="form-group">
                    <label className="section col-lg-12">Contact</label>
                  </div>

                  <InputMDT name="firstname"
                    label="Prénom"
                    placeholder="Prénom de l'utilisateur"
                    layout="invite"
                    value={user !== null ? user.firstname : ''}
                    required
                  />

                  <InputMDT name="lastname"
                    label="Nom"
                    placeholder="Nom de l'utilisateur"
                    layout="invite"
                    value={user !== null ? user.lastname : ''}
                    required
                  />

                  <InputMDT name="email"
                    label="Email"
                    placeholder="john@doe.com"
                    validations="isEmail"
                    layout="invite"
                    validationError="Ce champ doit être un email valide"
                    value={user !== null ? user.email : ''}
                    help="Un e-mail sera envoyé à cette adresse pour inviter l'utilisateur à se créer un compte."
                    required
                  />

                </div>
                <div className="form-horizontal password col-md-6 borderLeft">
                  <div className="form-group">
                    <label className="section col-lg-12">Champs optionnels</label>
                  </div>

                  <RadioMDT name="gender"
                    className="form-group"
                    label="Genre"
                    labelClassName="col-lg-4"
                    options={[
                      {label: 'Femme', value: USER.FEMALE},
                      {label: 'Homme', value: USER.MALE}
                    ]}
                    value={user !== null ? user.gender : ''}
                    layout="invite"
                  />

                  <div className="form-group date">
                    <label className="col-lg-4" htmlFor="born">Date de naissance</label>

                    <div className="col-lg-8">
                      <SelectMDT
                        name="birthdayDay"
                        placeholder="Jour"
                        options={UserStore.getDayOptions()}
                        value={user !== null ? user.birthday_day : ''}
                      />

                      <SelectMDT
                        name="birthdayMonth"
                        placeholder="Mois"
                        options={UserStore.getMonthOptions()}
                        value={user !== null ? user.birthday_month : ''}
                      />

                      <SelectMDT
                        name="birthdayYear"
                        placeholder="Année"
                        options={UserStore.getYearOptions()}
                        value={user !== null ? user.birthday_year : ''}
                      />
                    </div>
                  </div>

                  <InputMDT name="phoneNumber"
                    label="Téléphone"
                    layout="invite"
                    value={user !== null ? user.phone_number : null}
                  />

                  <InputMDT name="maidenName"
                    label="Nom de jeune fille"
                    layout="invite"
                    value={user !== null ? user.maidenname : ''}
                  />

                  <InputMDT name="ipp"
                    label="Code IPP"
                    layout="invite"
                    placeholder="Identifiant Permanent Patient"
                    value={user !== null ? user.ipp : ''}
                  />

                </div>
              </div>

              <div className="row form" style={{borderTop: 0}}>

                <div className="form-horizontal password col-md-6">

                  <div className="form-group">
                    <label className="section col-lg-12">Intervention</label>
                  </div>

                  <InputMDT name="interventionInfo"
                    label="Type d'intervention"
                    layout="invite"
                    value={user !== null ? user.intervention_info : ''}
                  />

                  <div className="form-group date">
                    <label className="col-lg-4" htmlFor="born">Date d'intervention</label>

                    <div className="col-lg-8">
                      <SelectMDT
                        name="interventionDay"
                        placeholder="Jour"
                        options={UserStore.getDayOptions()}
                        value={user !== null ? user.intervention_day : ''}
                      />

                      <SelectMDT
                        name="interventionMonth"
                        placeholder="Mois"
                        options={UserStore.getMonthOptions()}
                        value={user !== null ? user.intervention_month : ''}
                      />

                      <SelectMDT
                        name="interventionYear"
                        placeholder="Année"
                        options={UserStore.getYearOptions()}
                        value={user !== null ? user.intervention_year : ''}
                      />
                    </div>
                  </div>
                </div>

                <div className="form-horizontal password col-md-6">
                  <div className="form-group">
                    <label className="section col-lg-12">Autres Informations </label>
                  </div>
                  <div className="form-group">
                    <TextareaMDT
                      name="otherInfo"
                      rows="4"
                      placeholder="Exemples : Historique ou particularités du patient, allergies..."
                      value={user !== null ? user.other_info : ''}
                    />
                  </div>
                </div>
              </div>

              <InputMDT type="hidden" name="type" value="patient" />

              <div className="row save">
                <div className="text-right"><button type="submit" className={`btnPurple2 btn-small ${!this.state.canSubmit ? 'disabled' : ''}`} disabled={!this.state.canSubmit}>{btnTitle}</button></div>
              </div>
            </Formsy.Form>
          </div>
        </div>
      </div>
    );
  }
}
