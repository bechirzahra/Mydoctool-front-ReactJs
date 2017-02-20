"use strict";

import React, {Component, PropTypes} from 'react';
import {Link} from 'react-router';
import dateFormat from 'dateformat-light';
import {CONFIG, USER} from '../../../constants/parameters';
import UserStore from '../../../stores/userStore';
import UserGrid from '../users/UserGrid';
import InviteGrid from '../invites/InviteGrid';
import InviteStore from '../../../stores/inviteStore';
import csv from 'to-csv';
import isodate from 'isodate';
import _ from 'lodash';

class OrganizationTemplate extends Component {

  exportCSV(usersToExport, name) {
    let ret = [];

    _.forEach(usersToExport, (user) => {
      let copy = JSON.parse(JSON.stringify(user));
      delete copy.folder;
      delete copy.received_messages_slugs;
      delete copy.sent_messages_slugs;
      delete copy.invites_slugs;
      delete copy.linked_users;
      delete copy.roles;
      delete copy.avatar_path;

      copy.following_protocols_count = copy.custom_user_listings.length;
      delete copy.custom_user_listings;

      copy.type = copy.type === USER.DOCTOR ? 'Doctor' : 'Patient';
      ret.push(copy);
    });

    var element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(csv(ret)));
    element.setAttribute('download', name + '.csv');
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  }

  render() {
    var editUrl = "/admin/organizations/" + this.props.organization.slug + "/edit";

    let activeDoctors = UserStore.filterByOrganizationSlug(this.props.organization.slug);
    let activePatients = [];

    _.forEach(activeDoctors, (doctor) => {
      _.forEach(doctor.linked_users, (id) => {
        activePatients.push(UserStore.findById(id));
      });
    });

    _.uniq(activePatients);

    // Invites are both send by a Doctor and an Organization
    // let activeInvites = InviteStore.filterByOrganizationSlug(this.props.organization.slug);
    let activeInvites = _.filter(InviteStore.invites, (invite) => {
      let fromOrg = invite.from_organization_slug && invite.from_organization_slug === this.props.organization.slug;

      let docIds = _.map(activeDoctors, doc => {
        return doc.id;
      });
      let fromDoc = _.includes(docIds, invite.from_user_id);

      return (fromOrg || fromDoc) && !invite.accepted;
    })

    return (
      <div>
        <div className="panel panel-default">
          <div className="panel-body pull-right">
            <Link to={editUrl} className="btn btn-default" style={{marginRight: 15}}>Editer</Link>
            <a onClick={this.props.deleteOrganization} className="btn btn-danger">Supprimer</a>
          </div>
          <div className="clearfix"></div>
        </div>

        <div className="table-responsive">
          <table className="table table-striped table-bordered">
            <tbody>
              <tr>
                <td>Id</td>
                <td>{this.props.organization.id}</td>
              </tr>
              <tr>
                <td>Nom</td>
                <td>{this.props.organization.name}</td>
              </tr>
              <tr>
                <td>Nom du Groupe</td>
                <td>{this.props.organization.group_name}</td>
              </tr>
              <tr>
                <td>Id du Groupe</td>
                <td>{this.props.organization.group_id}</td>
              </tr>
              <tr>
                <td>URL</td>
                <td>{this.props.organization.url}</td>
              </tr>
              <tr>
                <td>Logo</td>
                <td>
                  {this.props.organization.logo_path ? (
                    <a href={CONFIG.UPLOAD_ROOT + this.props.organization.logo_path} target="_blank">
                      <img width="100" src={CONFIG.UPLOAD_ROOT + this.props.organization.logo_path} />
                    </a>
                  ) : 'Aucun logo'}
                </td>
              </tr>
              <tr>
                <td>Image</td>
                <td>
                  {this.props.organization.image_path ? (
                    <a href={CONFIG.UPLOAD_ROOT + this.props.organization.image_path} target="_blank">
                      <img width="100" src={CONFIG.UPLOAD_ROOT + this.props.organization.image_path} />
                    </a>
                  ) : 'Aucune image'}
                </td>
              </tr>
              <tr>
                <td>Créé le</td>
                <td>{dateFormat(isodate(this.props.organization.created_at), 'dd/mm/yyyy')}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h3>Médecins enregistrés</h3>
        <Link to={`/admin/organizations/${this.props.organization.slug}/invite`} className="btn btn-primary btn-sm">Inviter Docteur</Link>
        <a className="btn btn-primary btn-sm" onClick={this.exportCSV.bind(this, activeDoctors, `doctors-${this.props.organization.name}-${dateFormat(new Date(), 'dd-mm-yy')}`)}>Exporter CSV</a>
        <UserGrid users={activeDoctors} resultsPerPage={30}/>

        <h3>Patients enregistrés</h3>
        <a className="btn btn-primary btn-sm" onClick={this.exportCSV.bind(this, activePatients, `patients-${this.props.organization.name}-${dateFormat(new Date(), 'dd-mm-yy')}`)}>Exporter CSV</a>
        <UserGrid users={activePatients} resultsPerPage={30}/>

        <h3>Invitations en attente</h3>
        <InviteGrid invites={activeInvites} />

      </div>
    );
  }
}

OrganizationTemplate.propTypes = {
  organization: PropTypes.object.isRequired,
  deleteOrganization: PropTypes.func.isRequired
};

export default OrganizationTemplate;