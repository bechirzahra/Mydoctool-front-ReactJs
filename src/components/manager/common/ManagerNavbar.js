'use strict';

import React, {Component} from 'react';
import {Link, History} from 'react-router';
import UserStore from '../../../stores/userStore';
import ProfilePicture from '../../common/ProfilePicture';
import logoUrl from '../../../assets/images/SVG/logo.svg';
import OrganizationStore from '../../../stores/organizationStore';

import Translator from '../../../services/Translator';

import { Navbar, Nav, NavItem, NavDropdown, MenuItem } from 'react-bootstrap';



const ManagerNavbar = React.createClass({
  mixins: [
    History
  ],

  componentDidMount() {
    UserStore.addChangeListener(this._onChange);
  },

  componentWillUnmount() {
    UserStore.removeChangeListener(this._onChange);
  },

  _onChange() {
    if (UserStore.currentUser !== null) {
      this.forceUpdate();
    }
  },

  toggleMessages() {
    let $message = $('.messages');
    if ($message && $message !== null) {
      $('.messages').toggleClass('active');
    }
  },

  changeLaguage(lang) {
    Translator.changeLaguage(lang);
    location.reload();
    return;
  },


  render() {
    let user = UserStore.currentUser;
    let isDashboardActive = this.history.isActive('/dashboard') ||
      this.history.isActive('/dashboard/tasks') ||
      this.history.isActive('/dashboard/favorites') ||
      this.history.isActive('/dashboard/waiting');

    let organizationLogo = OrganizationStore.getLogoPath();
    return (
      <Navbar id="header" bsStyle="default" fluid>
        <Navbar.Header>
          <Link to="/dashboard" className="logo">
            <img src={logoUrl} />
          </Link>
          <Navbar.Toggle />
          <button type="button" className="navbar-toggle collapsed" onClick={this.toggleMessages}>
            <span className="sr-only">Toggle Messages</span>
            <span className="icon-mail"></span>
          </button>
        </Navbar.Header>
        <Navbar.Collapse>
          <Nav id="menu" fluid>
            <li><Link to="/dashboard" className={isDashboardActive ? "active" : ''} >{Translator.translate('DASHBOARD')}</Link></li>
            <li><Link to="/protocols" activeClassName="active">{Translator.translate('MES_PROTOCOLES')}</Link></li>
            <li><Link to="/patients" activeClassName="active">{Translator.translate('MES_PATIENTS')}</Link></li>
            <li><Link to="/patients/add" activeClassName="active">{Translator.translate('AJOUTER_UN_PATIENT')}</Link></li>


                <NavDropdown  title={Translator.locale} id='dropdown' fluid>
                  <MenuItem onClick={() => this.changeLaguage('EN')}>EN</MenuItem>
                  <MenuItem onClick={() => this.changeLaguage('FR')}>FR</MenuItem>
                </NavDropdown>




            {UserStore.hasRole('ROLE_ADMIN') ? (
              <li><Link to="/admin">Admin</Link></li>
            ) : ''}
          </Nav>
          <Nav pullRight>
            <li>
              <Link to="/settings" className="profile dropdown-toggle">
                <ProfilePicture user={user} />
                <p>{user.printable_name}</p>
              </Link>
            </li>
            {organizationLogo !== '' ? (
              <li className="brand">
                <span className="helper"></span>
                <img src={organizationLogo} />
              </li>
            ) : ''}
          </Nav>
        </Navbar.Collapse>
      </Navbar>

      // <nav id="header" className="navbar navbar-default">
      //   <div className="container-fluid">
      //     <div className="navbar-header">
      //       <button type="button" className="navbar-toggle collapsed" data-toggle="collapse" data-target="#navbar">
      //         <span className="sr-only">Toggle navigation</span>
      //         <span className="icon-bar"></span>
      //         <span className="icon-bar"></span>
      //         <span className="icon-bar"></span>
      //       </button>
      //       <button type="button" className="navbar-toggle collapsed" onClick={this.toggleMessages}>
      //         <span className="sr-only">Toggle Messages</span>
      //         <span className="icon-mail"></span>
      //       </button>
      //       <Link to="/dashboard" className="logo">
      //         <img src={logoUrl} />
      //       </Link>
      //     </div>

      //     <div className="collapse navbar-collapse" id="navbar">
      //       <ul id="menu" className="nav navbar-nav navbar-center">
      //         <li><Link to="/dashboard" className={isDashboardActive ? "active" : ''}>Dashboard</Link></li>
      //         <li><Link to="/protocols" activeClassName="active">Mes protocoles</Link></li>
      //         <li><Link to="/patients" activeClassName="active">Mes patients</Link></li>
      //         <li><Link to="/patients/add" activeClassName="active">Ajouter un patient</Link></li>
      //         {UserStore.hasRole('ROLE_ADMIN') ? (
      //           <li><Link to="/admin">Admin</Link></li>
      //         ) : ''}
      //       </ul>
      //       <ul id="profilMenu" className="nav navbar-nav navbar-right">
      //         <li className="dropdown">
      //           <Link to="/settings" className="profile dropdown-toggle">
      //             <ProfilePicture user={user} />
      //             <p>{user.printable_name}</p>
      //           </Link>
      //         </li>
      //         {organizationLogo !== '' ? (
      //           <li className="brand">
      //             <img src={organizationLogo} />
      //           </li>
      //         ) : ''}
      //       </ul>
      //     </div>

      //   </div>
      // </nav>

    );
  }
});

export default ManagerNavbar;
