'use strict';

import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import _ from 'lodash';
import dateFormat from 'dateformat-light';
import {Modal} from 'react-bootstrap';
import toastr from 'toastr';
import history from '../../services/history';

import ManageMessage from '../app/messages/ManageMessage';
import MessageBox from '../app/messages/MessageBox';
import UserActionCreators from '../../actions/userActionCreators';

import UserStore from '../../stores/userStore';
import MessageStore from '../../stores/messageStore';
import ListingStore from '../../stores/listingStore';
import ItemActivityStore from '../../stores/itemActivityStore';

import SearchInput from './common/SearchInput';
import FilterInput from './common/FilterInput';
import {Link} from 'react-router';
import ProfilePicture from '../common/ProfilePicture';

import PatientTabData from './patient/PatientTabData';
import PatientListingData from './patient/PatientListingData';

import Loader from '../common/Loader';

class PatientPage extends Component {

  constructor(props) {
    super(props);

    const userId = this.props.params.id;
    let iAs = ItemActivityStore.filterByUserId(userId);

    this.state = {
      loading: false,
      user: UserStore.findById(userId),
      itemActivities: iAs,
      activeItemActivities: iAs,
      tab: 'data',
      popover: false,
      showModal: false
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
    let height = Math.max($(window).height() - topBar, $(this.refs.messages).height() + 50, $(this.refs.dash).height() + 50);
    if (this.refs.dash) {
      $(this.refs.dash).css('min-height', `${height}px`);
      $(this.refs.messages).css('min-height', `${height}px`);
    }
  }

  toggleFavorite = (userId) => {
    let updatedUser = this.state.user;
    updatedUser.favorite = !updatedUser.favorite;
    this.setState({user: updatedUser});
    UserActionCreators.toggleFavorite(userId);
  }

  onSearchResult = (stateFiltered) => {
    if (stateFiltered !== null) {
      this.setState({activeItemActivities: stateFiltered});
    } else {
      this.setState({activeItemActivities: this.state.itemActivities});
    }
  }

  switchTab = (newTab) => {
    this.setState({tab: newTab});
  }

  removeUserListing = (uL) => {
    UserActionCreators.removeUserListing(uL);
  }

  resetMessageForm = () => {
    this.setState({initUserId: -1});
  }

  close = () => {
    this.setState({ showModal: false });
  }

  open = () => {
    this.setState({ showModal: true });
  }

  removeUser = () => {
    this.setState({loading: true});
    UserActionCreators.removeUserPatient(this.state.user.id);
    UserStore.addChangeListener(this._onRemoveUser);
  }

  _onRemoveUser = () => {
    toastr.success('Utilisateur supprimé', 'Succès');
    UserStore.removeChangeListener(this._onRemoveUser);
    history.pushState(null, '/patients');
  }

  render() {
    let doctor = UserStore.currentUser;
    let {user} = this.state;

    let messages = _.filter(MessageStore.messages, (message) => {
      return (message.from_user_id === doctor.id && message.to_user_id === user.id) ||
        (message.from_user_id === user.id && message.to_user_id === doctor.id);
    });

    messages = _.sortByOrder(messages, (message) => {
      return message.created_at;
    }, ['desc']);

    let tabProps = {
      user: user,
      itemActivities: this.state.activeItemActivities
    };

    let protocolReferences = [];
    _.each(this.state.user.custom_user_listings, (userlisting) => {
      let tempListing = ListingStore.findBySlug(userlisting.listing_slug);
      if (tempListing && tempListing !== null) {
        protocolReferences.push({name: tempListing.name, slug: tempListing.slug});
      }
    });

    return this.state.loading ? <Loader type="inline"/> : (
      <div id="patient">
        <div className="dash" ref="dash">
          <div className="container-fluid wrapper">

            <div className="row infos">
              <Link to={`/patients/${user.id}/edit`} className="edit"><span className="icon-editer"></span></Link>
              <a className="delete" onClick={this.open}><span className="icon-trash"></span></a>

              <div className="col-sm-2 col-md-1 col-lg-1">
                <div className="picture">
                  <ProfilePicture user={user} className="img" />

                  <div onClick={this.toggleFavorite.bind(this, user.id)} className="favorites">
                    <span className="icon-heart border" style={{color: '#A7A7A7'}}></span>
                    <span className="icon-heart bg" style={user.favorite ? {color: '#D9455F'} : {color: 'white'}}></span>
                  </div>

                </div>
              </div>
              <div className="col-sm-3 col-md-offset-1">
                <p>{user.printable_name}</p>
                <p>{user.birthday_day ? `${user.birthday_day}/${user.birthday_month}/${user.birthday_year}` : ''}</p>
                <p>{user.email}</p>
                <p>{user.phoneNumber}</p>
              </div>
              <div className="col-sm-3">
                <p>{user.gender}</p>
                <p>{user.maidenname ? `${user.maidenname} (nom jeune fille)` : ''}</p>
                <p>IPP {user.ipp}</p>
              </div>
              <div className="col-sm-3">
                <p>{user.intervention_day ? `Intervention le ${user.intervention_day}/${user.intervention_month}/${user.intervention_year}` : ''}</p>
                <p>{user.intervention_info}</p>
              </div>
            </div>

            <div className="row tabs">
              <nav className="col-lg-12">
                <a className={this.state.tab === 'data' ? "open" : ''} onClick={this.switchTab.bind(this, 'data')}>Données patients</a>
                <a className={this.state.tab === 'listing' ? "open" : ''} onClick={this.switchTab.bind(this, 'listing')}>Protocoles</a>
              </nav>
            </div>

            <div className="row">
              <div className="col-lg-12"><div className="tabsLine"></div></div>
            </div>

            {this.state.tab === 'data' ? (
              <div>
                <div className="row tools">
                  <FilterInput collection={this.state.itemActivities}
                    type="itemActivity"
                    onSearchResult={this.onSearchResult}
                    reference={protocolReferences}
                    className="col-sm-4"
                    placeholder="Filtrer par protocole"
                  />

                  <SearchInput collection={this.state.itemActivities}
                    type="itemActivity"
                    attribute='name'
                    onSearchResult={this.onSearchResult}
                    className="col-sm-8"
                  />
                </div>

                <PatientTabData {...tabProps} />
              </div>
            ) : (
              <PatientListingData removeUserListing={this.removeUserListing} {...tabProps} />
            )}

          </div>
        </div>

        <div ref="messages" className="messages">
          <ManageMessage
            toUser={this.state.user}
            users={UserStore.filterByIds(user.linked_users_ids)}
            initUserId={this.state.initUserId}
            resetMessageForm={this.resetMessageForm}
          />

          <ul className="timeline">
            {messages.map((message) => {
              return <MessageBox
                key={message.slug}
                type="doctor"
                message={message}
              />
            })}
          </ul>
        </div>


        <Modal show={this.state.showModal}
          onHide={this.close}
          dialogClassName="popinAddProtocole deletePatient">

          <Modal.Header closeButton>
            <Modal.Title>Souhaitez-vous supprimer le patient ?</Modal.Title>
          </Modal.Header>

          <Modal.Body>
            <button onClick={this.close} className="btnPurple2">Annuler</button>
            <a onClick={this.removeUser} className="btnPurple2">Confirmer</a>
          </Modal.Body>
        </Modal>
      </div>
    );
  }
}

export default PatientPage;