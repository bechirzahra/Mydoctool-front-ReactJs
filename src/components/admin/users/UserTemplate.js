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

class UserTemplate extends Component {

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
    // var editUrl = "/admin/users/" + this.props.user.id + "/edit";

    let {user} = this.props;
    // console.log(user);

    let renderUserGrid = () => {
      let linkedUsers = _.map(user.linked_users, (id) => {
        return UserStore.findById(id);
      });

      return (
        <UserGrid users={linkedUsers} />
      );
    };

    return (
      <div>
        <div className="table-responsive">
          <table className="table table-striped table-bordered">
            <tbody>
              <tr>
                <td>Id</td>
                <td>{user.id}</td>
              </tr>
              <tr>
                <td>Email</td>
                <td>{user.email}</td>
              </tr>
              <tr>
                <td>Type</td>
                <td>{user.type === USER.PATIENT ? 'Patient' : 'Médecin'}</td>
              </tr>
              <tr>
                <td>Prénom</td>
                <td>{user.firstname}</td>
              </tr>
              <tr>
                <td>Nom</td>
                <td>{user.lastname}</td>
              </tr>
              <tr>
                <td>Nom de jeune fille</td>
                <td>{user.maidenname}</td>
              </tr>
              <tr>
                <td>Date de naissance</td>
                <td>{`${user.birthday_day}/${user.birthday_month}/${user.birthday_year}`}</td>
              </tr>
              <tr>
                <td>Genre</td>
                <td>{user.gender}</td>
              </tr>
              <tr>
                <td>Numéro de téléphone</td>
                <td>{user.phoneNumber}</td>
              </tr>
              <tr>
                <td>IPP</td>
                <td>{user.ipp}</td>
              </tr>
              <tr>
                <td>Intervention</td>
                <td>{user.intervention_info}</td>
              </tr>
              <tr>
                <td>Date Intervention</td>
                <td>{`Intervention le ${user.intervention_day}/${user.intervention_month}/${user.intervention_year}`}</td>
              </tr>

              <tr>
                <td>Image de Profil</td>
                <td>
                  {user.avatar_path ? (
                    <a href={CONFIG.UPLOAD_ROOT + user.avatar_path} target="_blank">
                      <img width="100" src={CONFIG.UPLOAD_ROOT + user.avatar_path} />
                    </a>
                  ) : 'Aucune image'}
                </td>
              </tr>
              <tr>
                <td>Dernière connexion</td>
                <td>{user.last_login && user.last_login !== null ? dateFormat(isodate(user.last_login), 'dd/mm/yyyy') : 'Jamais'}</td>
              </tr>
            </tbody>
          </table>
        </div>

        {user.type === USER.PATIENT ? (
          <h2>Médecins</h2>
        ) : (
          <h2>Patients</h2>
        )}

        {renderUserGrid()}
      </div>
    );
  }
}

UserTemplate.propTypes = {
  user: PropTypes.object.isRequired,
  deleteUser: PropTypes.func.isRequired
};

export default UserTemplate;