'use strict';

import React, {Component, PropTypes} from 'react';
import UserStore from '../../../stores/userStore';
import ProfilePicture from '../../common/ProfilePicture';
import ListingStore from '../../../stores/listingStore';
import MessageStore from '../../../stores/messageStore';
import AlertStore from '../../../stores/alertStore';
import ItemStore from '../../../stores/itemStore';
import ItemActivityStore from '../../../stores/itemActivityStore';
import dateFormat from 'dateformat-light';
import ListingProgress from './ListingProgress';
import ItemActivityBlock from './ItemActivityBlock';
import Loader from '../../common/Loader';
import {ITEM} from '../../../constants/parameters';
import isodate from "isodate";
import {Link} from 'react-router';

import { DropdownButton,MenuItem } from 'react-bootstrap';

const propTypes = {
  user: PropTypes.object.isRequired,
  currentTab: PropTypes.string.isRequired,
  toggleCloseAlert: PropTypes.func,
  toggleFavorite: PropTypes.func,
  initMessage: PropTypes.func
};

class AlertUserBlock extends Component {

  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      favorite: this.props.user ? this.props.user.favorite : false,
    };
  }

  toggleCloseAlert = (userId) => {
    this.setState({loading: true});
    this.props.toggleCloseAlert(userId)
  }

  toggleFavorite = (userId, e) => {
    e.preventDefault();
    this.setState({favorite: !this.state.favorite});
    this.props.toggleFavorite(userId);
  }

  render() {
    let {user} = this.props;
    let key = `user-${user.id}`;


    if (!user) {
      return (
        <div key={key}>user doesn't exist</div>
      );
    }

    let alerts = this.props.currentTab === 'questions' ?
      AlertStore.getOpenQuestionAlerts(user.id) :
      AlertStore.getOpenTaskAlerts(user.id);
    let cAlerts = _.groupBy(alerts, 'listing_slug');

    /**
    * ITEM block
    */
    let renderItemBlock = (cUser, cListing, itemSlug) => {
      let item = ItemStore.findBySlug(itemSlug);
      let key = `item-${itemSlug}-${cListing.slug}-${cUser.id}`;

      if (
        (this.props.currentTab === 'questions' && item.type === ITEM.TYPE_QUESTION) ||
        (this.props.currentTab === 'tasks' && item.type === ITEM.TYPE_TASK) ||
        (this.props.currentTab !== 'questions' && this.props.currentTab !== 'tasks')
      ) {

        return <MenuItem eventKey={key}><ItemActivityBlock key={key} item={item} user={cUser}/></MenuItem>;
      }
    };


    /**
    * LISTING block
    */
    let renderListingBlock = (cUser, alerts, listingSlug) => {
      let cListing = ListingStore.findBySlug(listingSlug);
      let key = `listing-${listingSlug}-${cUser.id}`;


      if (!cListing) {
        return '';
      }

      // We now have our Alerts, linked to an ItemActivity and and Item
      let cItems = [];
      let cItemsSlugs = [];

      _.forEach(alerts, (alert) => {
        let cItem = ItemStore.findBySlug(alert.item_slug);
        cItemsSlugs.push(cItem.slug);

        // We should find every item linked to an alert
        let goodAlert = _.find(cItem.alerts, {uid: alert.alert_uid});
        if (goodAlert && goodAlert.conditions) {

          _.each(goodAlert.conditions, (cCondition) => {
            if (cCondition.base) {
              cItemsSlugs.push(cCondition.base.slug);
            } else {
              // In case we have a Task or a Text Question, the base Slug is the item itself
              cItemsSlugs.push(cItem.slug);
            }
          });
        }
      });

      // We have an array with every item Concerned with this/those alerts
      cItemsSlugs = _.uniq(cItemsSlugs);


      // Let's find the start / end date of a listing
      let UserListing = _.find(cUser.custom_user_listings, {patient_id: parseInt(cUser.id, 10), listing_slug: listingSlug});

      return UserListing && UserListing !== null ? (
        <div className="row protocolLine" key={key}>
            <div className="col-md-12">
          <Link to={`/protocols/${cListing.slug}/edit`}>
            <div className="col-md-10 protocol">
              <div className="row">
                <p className="title">{cListing.name}</p>
              </div>
              <ListingProgress listing={cListing} UserListing={UserListing} />
            </div>
          </Link>
<div className="col-md-2"><DropdownButton pullRight title={
        <span><i className="icon-mail"></i> {cItemsSlugs.length}</span>
      } id="alert">


            {_.map(cItemsSlugs, renderItemBlock.bind(this, cUser, cListing))}

  <MenuItem eventKey="1">test</MenuItem>
  <MenuItem eventKey="2">Dropdown link</MenuItem>
</DropdownButton></div></div>


        </div>
      ) : '';
    };


    return (
      <div className="row blocDash" key={key}>
        <div className="col-sm-3 user">
          <a onClick={this.props.initMessage.bind(this, user.id)} className="message"><span className="icon-mail"></span></a>

          <Link to={`/patients/${user.id}`}>
            <div className="picture">
              <ProfilePicture user={user} className="img" />

              <div onClick={this.toggleFavorite.bind(this, user.id)} className="favorites">
                <span className="icon-heart border" style={{color: '#A7A7A7'}}></span>
                <span className="icon-heart bg" style={this.state.favorite ? {color: '#D9455F'} : {color: 'white'}}></span>
              </div>

            </div>
            <div className="nameUser">
              <p>{user.firstname}</p>
              <p>{user.lastname}</p>
            </div>
          </Link>
        </div>

        {/* NOW, PROTOCOLS */}
        <div className="col-sm-9">
          {_.map(cAlerts, renderListingBlock.bind(this, user), this)}
        </div>

        {!this.state.loading ? this.props.currentTab === 'waiting' ? (
            <div className="col-lg-12 lastLogin">Dernière connexion le {user.last_login && user.last_login !== null ? dateFormat(isodate(user.last_login), 'mmmm, dS yyyy') : '-'}</div>
          ) : (
            <div className="checkbox pull-right">
              <input type="checkbox" id={`checkbox${key}`} onChange={this.toggleCloseAlert.bind(this, user.id)}/>
              <label htmlFor={`checkbox${key}`}>Clôturer alerte</label>
            </div>
          ) : '' }
      </div>
    );
  }
}

AlertUserBlock.propTypes = propTypes;

export default AlertUserBlock;
