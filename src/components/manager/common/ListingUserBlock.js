'use strict';

import React, {Component, PropTypes} from 'react';
import dateFormat from 'dateformat-light';
import {Link} from 'react-router';
import toastr from 'toastr';
import UserStore from '../../../stores/userStore';
import ProfilePicture from '../../common/ProfilePicture';
import ListingStore from '../../../stores/listingStore';
import MessageStore from '../../../stores/messageStore';
import AlertStore from '../../../stores/alertStore';
import ItemStore from '../../../stores/itemStore';
import ItemActivityStore from '../../../stores/itemActivityStore';
import ListingProgress from './ListingProgress';
import ItemActivityBlock from './ItemActivityBlock';
import Loader from '../../common/Loader';
import isodate from "isodate";
import Utils from '../../../services/utils';

const propTypes = {
  user: PropTypes.object.isRequired,
};

class ListingUserBlock extends Component {

  constructor(props) {
    super(props);

    this.state = {
      loading: false,
      favorite: this.props.user ? this.props.user.favorite : false,
    };
  }

  toggleFavorite = (userId, e) => {
    e.preventDefault();
    this.setState({favorite: !this.state.favorite});
    this.props.toggleFavorite(userId);
  }

  showInviteNotif = (e) => {
    e.preventDefault();
    toastr.info("Vous ne pouvez pas ajouter un protocole à un patient n'ayant pas accepté votre invitation");
  }

  render() {
    let {user} = this.props;
    let key = `user-${user.id}`;

    if (!user) {
      return (
        <div key={key}>user doesn't exist</div>
      );
    }

    let UserListing = _.filter(user.custom_user_listings, {patient_id: parseInt(user.id, 10)});
    let UserListingSlugs = UserListing.map((uli) => {
      return uli.listing_slug
    });

    let listings = _.filter(ListingStore.listings, (li) => {
      return _.includes(UserListingSlugs, li.slug);
    });

    let alerts = {
      questions: AlertStore.getOpenQuestionAlerts(user.id).length,
      tasks: AlertStore.getOpenTaskAlerts(user.id).length,
    };

    /**
    * LISTING block
    */
    let renderListingBlock = (cUser, cListing) => {
      let key = `listing-${cListing.slug}-${cUser.id}`;

      if (!cListing) {
        return (
          <div key={key}>listing doesn't exist</div>
        );
      }

      let thisUserListing = _.find(cUser.custom_user_listings, {patient_id: parseInt(cUser.id, 10), listing_slug: cListing.slug});

      let startDate = isodate(thisUserListing.created_at);
      let endDate = Utils.addTimeIntervalToDate(startDate, cListing.duration_value, cListing.duration_unit);
      let today = new Date();

      let isListingDone = endDate < today ? true : false;

      return !isListingDone ? (
        <Link to={`/protocols/${cListing.slug}/edit`} key={key}>
          <div className="col-lg-12 protocol" style={{borderLeftColor: cListing.color, marginBottom: 10}}>
            <div className="col-lg-6"><p>{cListing.name}</p></div>

            <ListingProgress
              listing={cListing}
              UserListing={thisUserListing}
              className="col-lg-6"
            />
          </div>
        </Link>
      ) : '';
    };

    return (
      <div className="row bloc" key={user.id}>
        <div className="col-sm-4 user">

          {!user.invite ? (
            <Link to={`/patients/${user.id}`}>
              <div className="picture" style={{float: 'left'}}>
                <ProfilePicture user={user} className="img" />

                <div onClick={this.toggleFavorite.bind(this, user.id)} className="favorites">
                  <span className="icon-heart border" style={{color: '#A7A7A7'}}></span>
                  <span className="icon-heart bg" style={this.state.favorite ? {color: '#D9455F'} : {color: 'white'}}></span>
                </div>
              </div>

              <div className="nameUser">
                <p>{user.printable_name}</p>
                {!user.enabled ? <p><i>(Ce patient n'a pas encore accepté votre invitation)</i></p> : null}
                <p>{user.intervention_info ? user.intervention_info : ''}</p>
                <p>{user.intervention_day ? UserStore.getInterventionDate(user) : ''}</p>
              </div>

            </Link>
          ) : (
            <a onClick={this.showInviteNotif}>
              <div className="picture" style={{float: 'left'}}>
                <ProfilePicture user={user} className="img" />
              </div>

              <div className="nameUser">
                <p>{user.printable_name}</p>
                <p><i>(Ce patient n'a pas encore accepté votre invitation)</i></p>
              </div>
            </a>
          )}

        </div>
        <div className="col-sm-2 user">
          <div className="infoUser">
            <p>{user.birthday_year && user.birthday_year !== '' ? `${UserStore.getUserAge(user)} ans` : ''}</p>
            <p>{user.email}</p>
            <p>{user.phone_number}</p>
          </div>
        </div>

        <div className="col-sm-1 notices">
          {alerts.questions > 0 ? (<p className="questions">{alerts.questions}</p>) : ''}
          &nbsp;
          {alerts.tasks > 0 ? (<p className="tasks">{alerts.tasks}</p>) : ''}
        </div>

        {/* NOW, PROTOCOLS */}
        <div className="col-sm-5">
          <div className="row">
            {_.map(listings, renderListingBlock.bind(this, user), this)}
          </div>
        </div>
      </div>
    );
  }
}

ListingUserBlock.propTypes = propTypes;

export default ListingUserBlock;
