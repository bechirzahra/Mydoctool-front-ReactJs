"use strict";

import React, {Component} from 'react';
import {Link} from 'react-router';

import AuthStore from '../../stores/authStore';
import UserStore from '../../stores/userStore';
import MessageStore from '../../stores/messageStore';
import Messages from './messages/Messages';

import {USER} from '../../constants/parameters';

import PatientDashboard from '../patient/PatientDashboard';
import PatientNavbar from '../patient/PatientNavbar';

import ManagerNavbar from '../manager/common/ManagerNavbar';
import ManagerDashboard from '../manager/ManagerDashboard';

import styles from '../../assets/scss/styles.scss';

/**
* This component renders the correct Navbar (PatientNavbar or ManagerNavbar)
* We couldn't merge this component with Dashboard as we have specific `viewParam` for the patient
*/
export default class BaseDashboard extends Component {

  render() {
    let user = UserStore.currentUser;

    if (user.type === USER.PATIENT) {

      let viewParam = this.props.params.view ? this.props.params.view : this.props.children === null ? 'all' : null;

      return (
        <div className="full-size">
          <PatientNavbar
            view={viewParam}
          />

          {this.props.children}
        </div>

      );
    } else {
      return (
        <div className="full-size">
          <ManagerNavbar />

          {this.props.children}
        </div>
      );
    }
  }
}