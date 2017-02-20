'use strict';

import React, {Component} from 'react';
import ManageMessage from '../app/messages/ManageMessage';
import MessageBox from '../app/messages/MessageBox';
import AlertActionCreators from '../../actions/alertActionCreators';
import UserActionCreators from '../../actions/userActionCreators';

import UserStore from '../../stores/userStore';
import MessageStore from '../../stores/messageStore';
import AlertStore from '../../stores/alertStore';
import ListingStore from '../../stores/listingStore';
import InviteStore from '../../stores/inviteStore';

import ItemStore from '../../stores/itemStore';
import ItemActivityStore from '../../stores/itemActivityStore';
import SearchInput from './common/SearchInput';
import FilterInput from './common/FilterInput';
import ListingUserBlock from './common/ListingUserBlock';
import {ITEM} from '../../constants/parameters';
import {Link} from 'react-router';


class PatientList extends Component {

  constructor(props) {
    super(props);

    this.state = _.assign({
      users: [], // All the users, according to the current Tab
      activeUsers: [], // The users we have Filtered / Searched
      initUserId: -1
    }, this.initState(this.props));
  }

  initState = (props) => {
    let users = UserStore.users;
    //let invites = InviteStore.invites;

    let result = [].concat(users);

    // We should also display invites: let's mimic a User from an Invite
    /*_.forEach(invites, (invite) => {
      let tUser = {};
      tUser.email = invite.to_email;
      tUser.firstname = invite.more_data.firstname;
      tUser.lastname = invite.more_data.lastname;
      tUser.printable_name = invite.more_data.firstname + ' ' + invite.more_data.lastname;
      tUser.invite = true;
      tUser.id = -invite.id;
      tUser.birthday_day = invite.more_data.birthdayDay;
      tUser.birthday_month = invite.more_data.birthdayMonth;
      tUser.birthday_year = invite.more_data.birthdayYear;
      result.push(tUser);
    });*/

    return {
      users: result,
      activeUsers: result,
    };
  }

  componentDidMount() {
    $(window).resize(this.onResize);
    this.onResize();
  }

  componentWillUnmount() {
    $(window).off("resize");
  }

  onResize = () => {
    const topBar = 68;
    let height = $(window).height();
    if (this.refs.dash) {
      $(this.refs.dash).css('min-height', `${height - topBar}px`);
    }
  }

  toggleFavorite = (userId) => {
    UserActionCreators.toggleFavorite(userId);
  }

  onSearchResult = (stateFiltered) => {
    if (stateFiltered !== null) {
      this.setState({activeUsers: stateFiltered});
    } else {
      this.setState({activeUsers: this.state.users});
    }
  }

  render() {
    let protocolFilterReferences = ListingStore.getSelectOptions();
    protocolFilterReferences.unshift({name: 'Aucun protocole', slug: -1});

    return (
      <div id="patients">
        <div className="dash" ref="dash">
          <div className="container-fluid wrapper">

            <div className="row tools">
              <SearchInput collection={this.state.users}
                attribute='printable_name'
                onSearchResult={this.onSearchResult}
                className="col-sm-4"
              />

              <FilterInput collection={this.state.users}
                type="protocols"
                onSearchResult={this.onSearchResult}
                reference={protocolFilterReferences}
                className="col-sm-4"
                placeholder="Filtrer par protocole"
              />

              <FilterInput collection={this.state.users}
                type="alerts"
                onSearchResult={this.onSearchResult}
                reference={AlertStore.getSelectOptions()}
                className="col-sm-4"
                placeholder="Filtrer par alerte"
              />
            </div>

            <div className="contentPatients">
              {this.state.activeUsers.map((user) => {
                return <ListingUserBlock
                  key={user.id}
                  user={user}
                  toggleFavorite={this.toggleFavorite}
                />;
              }, this)}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default PatientList;
