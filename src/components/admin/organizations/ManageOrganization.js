'use strict';

import React, {Component} from 'react';
import Formsy from 'formsy-react';
import {Input, File} from 'formsy-react-components';

import AdminTitle from '../common/AdminTitle';

import OrganizationActionCreators from '../../../actions/organizationActionCreators';
import OrganizationStore from '../../../stores/organizationStore';

import {CONFIG} from '../../../constants/parameters';
import history from '../../../services/history';

class ManageOrganization extends Component {

  constructor(props) {
    super(props);

    this.state = {
      canSubmit: false,
      errors: [],
      loading: true,
      isUpdate: this.props.params.slug ? true : false,
      organization: null,
      logo: null,
      image: null
    };

    OrganizationStore.addChangeListener(this._onChange);
  }

  componentDidMount() {
    if (this.props.params.slug) {
      var currentOrganization = OrganizationStore.findBySlug(this.props.params.slug);

      if (currentOrganization) {
          this.setState({
            loading: false,
            organization: currentOrganization
          });
      } else {
        OrganizationActionCreators.getOrganization(this.props.params.slug);
      }
    }
  }

  componentWillUnmount() {
    OrganizationStore.removeChangeListener(this._onChange);
  }

  _onChange = () => {
    var rawErrors = OrganizationStore.errors;
    if (rawErrors.errors) {
      this.setState({errors: rawErrors.errors.errors});
    } else {
      let newUrl = `/admin/organizations/${this.props.params.slug}`;
      history.pushState(null, newUrl);
    }
  }

  enableButton = () => {
    this.setState({canSubmit: true});
  }

  disableButton = () => {
    this.setState({canSubmit: false});
  }

  submit = (data) => {
    let files = {
      logoFile: this.state.logo,
      imageFile: this.state.image,
    };

    if (this.state.isUpdate) {
      OrganizationActionCreators.updateOrganization(this.props.params.slug, data, files);
    } else {
      OrganizationActionCreators.createOrganization(data, files);
    }
  }

  addFile = (name, files, value) => {
    if (name === 'logo') {
      this.setState({logo: files[0]});
    } else {
      this.setState({image: files[0]});
    }
  }

  render() {
    var createErrorDiv = function(error) {
      return <div key={error.key}>{error}</div>
    };

    let title = this.state.organization === null ? 'Nouvelle Organisation' : 'Editer Organisation';

    return (
      <div>
        <AdminTitle title={title} />

        <div className="row">
          <div className="col-lg-12">
            <Formsy.Form onValidSubmit={this.submit}
              onValid={this.enableButton}
              onInvalid={this.disableButton}
            >
              {this.state.errors[0] ? this.state.errors.map(createErrorDiv, this) : ''}

              <Input name="name"
                label="Nom"
                placeholder="Le nom de l'organisation"
                value={this.state.isUpdate && !this.state.loading ? this.state.organization.name : ''}
                validations="minLength:1"
                validationError="Minimum 1 caractère"
                required />

              <Input name="groupName"
                label="Nom du groupe"
                placeholder="Le nom du groupe"
                value={this.state.isUpdate && !this.state.loading ? this.state.organization.group_name : ''}
              />

              <Input name="groupId"
                label="Identifiant du groupe"
                placeholder="e.g. 12XEZR1"
                value={this.state.isUpdate && !this.state.loading ? this.state.organization.group_id : ''}
              />

              <Input name="url"
                label="Adresse du site web"
                placeholder="http://maclinique.com"
                validations="isUrl"
                validationError="Ce champ doit être une URL valide"
                value={this.state.isUpdate && !this.state.loading ? this.state.organization.url : ''}
              />

              <fieldset>
                <h4>Logo actuel</h4>
                {this.state.organization !== null && this.state.organization.logo_path ? (
                  <a href={CONFIG.UPLOAD_ROOT + this.state.organization.logo_path} target="_blank">
                    <img width="200" src={CONFIG.UPLOAD_ROOT + this.state.organization.logo_path} />
                  </a>
                ) : 'Aucun logo'}

                <File name="logo"
                  label="Nouveau Logo"
                  onChange={this.addFile}
                />
              </fieldset>

              <fieldset>
                <h4>Image de couverture actuelle</h4>
                {this.state.organization !== null && this.state.organization.image_path ? (
                  <a href={CONFIG.UPLOAD_ROOT + this.state.organization.image_path} target="_blank">
                    <img width="200" src={CONFIG.UPLOAD_ROOT + this.state.organization.image_path} />
                  </a>
                ) : 'Aucune image'}

                <File name="image"
                  label="Nouvelle Image de couverture"
                  onChange={this.addFile}
                />
              </fieldset>

              {/*

                <fieldset>
                  <legend>Utilisateur en charge de l'organisation</legend>
                  <Input name="userFirstname"
                    label="Prénom"
                    placeholder="Prénom de l'utilisateur"
                    required
                  />

                  <Input name="userLastname"
                    label="Nom"
                    placeholder="Nom de l'utilisateur"
                    required
                  />

                  <Input name="userEmail"
                    label="Email du Manager"
                    placeholder="john@doe.com"
                    validations="isEmail"
                    validationError="Ce champ doit être un email valide"
                    value=''
                    help="Un e-mail sera envoyé à cette adresse pour inviter l'utilisateur à se créer un compte."
                    required
                  />
                </fieldset>
              */}

              <button type="submit" className="btn btn-primary" disabled={!this.state.canSubmit}>
                {this.state.isUpdate ? 'Mettre à jour' : 'Sauvegarder'}
              </button>
            </Formsy.Form>
          </div>
        </div>
      </div>
    );
  }
}


export default ManageOrganization;