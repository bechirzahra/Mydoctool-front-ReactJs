import React from 'react';
import {ReactRouter, Link, IndexRoute, Route} from 'react-router';

import AuthStore from './stores/authStore';
import UserStore from './stores/userStore';
import AlertStore from './stores/alertStore';
import ItemActivityStore from './stores/itemActivityStore';

import App from './components/App';
import ErrorPage from './components/ErrorPage';

import BaseWebsite from './components/website/BaseWebsite';

// AUTH
import BaseAuth from './components/auth/BaseAuth';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import ResetPassword from './components/auth/ResetPassword';
import ResettingPassword from './components/auth/ResettingPassword';

// Base APP
import BaseApp from './components/app/BaseApp';
import BaseDashboard from './components/app/BaseDashboard';
import Dashboard from './components/app/Dashboard';
import PatientDashboard from './components/patient/PatientDashboard';
import PatientList from './components/manager/PatientList';
import PatientPage from './components/manager/PatientPage';

import Invite from './components/app/Invite';

// ACCOUNT
import Account from './components/app/Account';
import AccountInfos from './components/app/AccountInfos';
import AccountAddress from './components/app/AccountAddress';
import AccountPassword from './components/app/AccountPassword';
import AccountOrganization from './components/app/AccountOrganization';

import ManageMessage from './components/app/messages/ManageMessage';
import MessageView from './components/app/messages/MessageView';

import Listings from './components/manager/listings/Listings';
import ManageListing from './components/manager/listings/ManageListing';

// ADMIN
import BaseAdmin from './components/admin/BaseAdmin';
import Organizations from './components/admin/organizations/Organizations';
import ManageOrganization from './components/admin/organizations/ManageOrganization';
import OrganizationPage from './components/admin/organizations/OrganizationPage';
import InviteUserOrganization from './components/admin/invites/InviteUserOrganization';
import Users from './components/admin/users/Users';
import UserPage from './components/admin/users/UserPage';
import AdminListings from './components/admin/listings/AdminListings';

function requireAuth(nextState, replaceState) {
  if (!AuthStore.isLoggedIn()) {
    replaceState({ nextPathname: nextState.location.pathname }, '/login');
  }
}

function shouldRedirectToDashboard(nextState, replaceState) {
  if (AuthStore.isLoggedIn()) {
    replaceState({ nextPathname: nextState.location.pathname }, '/dashboard');
  } else {
    replaceState({ nextPathname: nextState.location.pathname }, '/login');
  }
}

var routes = (
  <Route component={App}>

    <Route path="/" component={BaseWebsite} onEnter={shouldRedirectToDashboard} />

    <Route component={BaseAuth}>
      <Route path='/login' component={Login} />
      <Route path='/register(/:inviteSlug)' component={Register} />
      <Route path='/reset-password' component={ResetPassword} />
      <Route path='/resetting/:token' component={ResettingPassword} />
    </Route>

    // App related, auth-required
    <Route component={BaseApp} onEnter={requireAuth}>

      <Route component={BaseDashboard}>

        <Route path="/dashboard(/:view)" component={Dashboard}/>

        // Account
        <Route path="/settings" component={Account}>
          <IndexRoute component={AccountInfos} />
          <Route path="address" component={AccountAddress} />
          <Route path="password" component={AccountPassword} />
          <Route path="organization" component={AccountOrganization} />
        </Route>

        // Manager part
        <Route path="/patients" component={PatientList} />
        <Route path='/patients/add' component={Invite} />
        <Route path="/patients/:id" component={PatientPage} />
        <Route path='/patients/:id/edit' component={Invite} />


        // Listings
        <Route path="/protocols" component={Listings} />
        <Route path="/protocols/:listingSlug/edit" component={ManageListing} />
      </Route>

      // Messages
      <Route path="/messages/new/:userId" component={ManageMessage} />
      <Route path="/messages/:messageSlug(/:type)" component={MessageView} />

    </Route>

    <Route path="/admin" component={BaseAdmin}>
      <Route path="organizations" component={Organizations} />
      <Route path="organizations/new" component={ManageOrganization} />
      <Route path="organizations/:slug" component={OrganizationPage} />
      <Route path="organizations/:slug/edit" component={ManageOrganization} />

      <Route path="organizations/:slug/invite" component={InviteUserOrganization} />

      <Route path="users" component={Users} />
      <Route path="users/:id" component={UserPage} />

      <Route path="listings" component={AdminListings} />
    </Route>

    // Other
    <Route path="*" component={ErrorPage}/>
  </Route>
);

export default routes;