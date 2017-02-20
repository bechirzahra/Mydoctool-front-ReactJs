'use strict';

import React, {Component} from 'react';
import Formsy from 'formsy-react';
import {Input, File, Select} from 'formsy-react-components';

import AdminTitle from '../common/AdminTitle';

import OrganizationActionCreators from '../../../actions/organizationActionCreators';
import OrganizationStore from '../../../stores/organizationStore';
import InviteActionCreators from '../../../actions/inviteActionCreators';
import InviteStore from '../../../stores/inviteStore';

import history from '../../../services/history';
import toastr from 'toastr';

class InviteUserOrganization extends Component {

  constructor(props) {
    super(props);

    this.state = {
      canSubmit: false,
      errors: [],
      loading: true,
      invite: null,
    };

    InviteStore.addChangeListener(this._onChange);
  }

  componentWillUnmount() {
    InviteStore.removeChangeListener(this._onChange);
  }

  _onChange = () => {
    let errors = InviteStore.getErrors();
    if (errors.length === 0) {
      toastr.success("Utilisateur invité");
      history.pushState(null, `/admin/organizations/${this.props.params.slug}`);
    }
  }

  enableButton = () => {
    this.setState({canSubmit: true});
  }

  disableButton = () => {
    this.setState({canSubmit: false});
  }

  submit = (data) => {
    data.organization_slug = this.props.params.slug;

    InviteActionCreators.createInvite(data);
  }

  render() {
    var createErrorDiv = function(error) {
      return <div key={error.key}>{error}</div>
    };

    let organization = OrganizationStore.findBySlug(this.props.params.slug);

    return (
      <div>
        <AdminTitle title={`Inviter un utilisateur à rejoindre l'organisation ${organization.name}`} />

        <div className="row">
          <div className="col-lg-12">
            <Formsy.Form onValidSubmit={this.submit}
              onValid={this.enableButton}
              onInvalid={this.disableButton}
            >
              {this.state.errors[0] ? this.state.errors.map(createErrorDiv, this) : ''}

                <fieldset>
                  <Input name="firstname"
                    label="Prénom"
                    placeholder="Prénom de l'utilisateur"
                    required
                  />

                  <Input name="lastname"
                    label="Nom"
                    placeholder="Nom de l'utilisateur"
                    required
                  />

                  <Input name="email"
                    label="Email"
                    placeholder="john@doe.com"
                    validations="isEmail"
                    validationError="Ce champ doit être un email valide"
                    value=''
                    help="Un e-mail sera envoyé à cette adresse pour inviter l'utilisateur à se créer un compte."
                    required
                  />

                  <Select name="type"
                    label="Role dans l'organisation"
                    options={[
                      {label: 'Choisissez un rôle', value:''},
                      {label: 'Docteur', value: 'doctor'},
                      {label: 'Manager', value: 'manager'},
                    ]}
                    required
                  />
                </fieldset>

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


export default InviteUserOrganization;