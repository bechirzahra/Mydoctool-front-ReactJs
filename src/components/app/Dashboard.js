"use strict";

import React, {Component} from 'react';

import UserStore from '../../stores/userStore';

import {USER} from '../../constants/parameters';

import PatientDashboard from '../patient/PatientDashboard';
import ManagerDashboard from '../manager/ManagerDashboard';

import styles from '../../assets/scss/styles.scss';

export default class Dashboard extends Component {

  render() {
    let user = UserStore.currentUser;

    if (user.type === USER.PATIENT) {
      return <PatientDashboard {...this.props}/>;
    } else {
      return <ManagerDashboard {...this.props}/>;
    }
  }
}