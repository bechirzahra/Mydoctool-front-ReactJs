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

import ItemStore from '../../stores/itemStore';
import ItemActivityStore from '../../stores/itemActivityStore';
import SearchInput from './common/SearchInput';
import FilterInput from './common/FilterInput';
import AlertUserBlock from './common/AlertUserBlock';
import {ITEM} from '../../constants/parameters';
import {Link} from 'react-router';
import dateFormat from 'dateformat-light';
import isodate from 'isodate';

import Loader from '../common/Loader';
import InitializeActionCreators from '../../actions/initializeActionCreators';
import Utils from '../../services/utils';

/**
* This components renders the Manager DAshboard
* Different cases depending on the current Tab
* 1. tab Questions or Tasks
*   a. Filter Alerts by type (= question/task)
*   b. Group by User
*   c. Display
* 2. Waiting Users
*   a. Get Users that have a not done ItemActivity
*   b. Display
* 3. Favorites
*   a. Display Favorites
*/
class ManagerDashboard extends Component {

  constructor(props) {
    super(props);

    // Refresh the caching
    let loading = false;
    if (AlertStore.shouldRefresh()) {
      loading = true;
    }

    let state = {};
    if (loading) {
      state = {
        loading: true,
        alerts: [],
        tab: 'questions', // Could be: questions/tasks/waiting/favorites
        users: [], // All the users, according to the current Tab
        activeUsers: [], // The users we have Filtered / Searched
        initUserId: -1
      };

      InitializeActionCreators.initApp();
    } else {
      state = _.assign({
        loading: false,
        alerts: [],
        tab: 'questions', // Could be: questions/tasks/waiting/favorites
        users: [], // All the users, according to the current Tab
        activeUsers: [], // The users we have Filtered / Searched
        initUserId: -1
      }, this.initState(this.props));
    }
    this.state = state;

    AlertStore.addChangeListener(this._onChange);
  }

  componentDidMount() {
    $(window).resize(this.onResize);
    this.onResize();
  }

  // When changing tab, we receive a new prop with the current new tab
  componentWillReceiveProps = (nextProps) => {
    this.setState(this.initState(nextProps));
  }

  componentWillUnmount() {
    $(window).off("resize");
    AlertStore.removeChangeListener(this._onChange);
  }

  // This func helps us to fix the height of blocks.
  onResize = () => {
    const topBar = 68;
    let height = Math.max($(window).height() - topBar, $(this.refs.messages).height() + 50, $(this.refs.dash).height() + 50);
    if (this.refs.dash) {
      $(this.refs.dash).css('min-height', `${height}px`);
      $(this.refs.messages).css('min-height', `${height}px`);
    }
  }

  getWaitingUsers() {
    let iAs = ItemActivityStore.filterNotDone();
    let userIds = iAs.map(iA => {return iA.user_id;});
    userIds = _.uniq(userIds);


    let users = [];
    // We should check if the user still has an active Listing
    _.each(userIds, (userId) => {
      let addThisUser = false;

      let user = UserStore.findById(userId);
      let userListings = user.custom_user_listings;
      _.each(userListings, (userListing) => {
        let listing = ListingStore.findBySlug(userListing.listing_slug);

        if (listing && listing !== null) {
          let startDate = isodate(userListing.created_at);
          let endDate = Utils.addTimeIntervalToDate(startDate, listing.duration_value, listing.duration_unit);

          // If its Listing is still in progress
          if (endDate > new Date()) {
            // And its listing has waiting items
            let iAsOfThisListing = _.filter(ItemActivityStore.itemActivities, (iA) => {
              let item = ItemStore.findBySlug(iA.item_slug);
              return item.listing_slug === listing.slug && !iA.done && iA.user_id === userId;
            });

            addThisUser = iAsOfThisListing.length > 0 ? true : false;
          }
        }
      });
      if (addThisUser) {
        users.push(user);
      }
    });

    return users;
  }

  getAlertQuestionUsers() {
    let userIds = [];
    let alerts = AlertStore.getOpenAlerts();

    alerts.forEach(alert => {
      let item = ItemStore.findBySlug(alert.item_slug);
      if (item && item.type === ITEM.TYPE_QUESTION) {
        if (UserStore.findById(alert.user_id) !== undefined) {
          userIds.push(alert.user_id);
        }
      }
    });
    userIds = _.uniq(userIds);
    return UserStore.filterByIds(userIds);
  }

  getAlertQuestions() {
    let alertTasks = [];
    let alerts = AlertStore.getOpenAlerts();

    alerts.forEach(alert => {
      let item = ItemStore.findBySlug(alert.item_slug);
      if (item && item.type === ITEM.TYPE_QUESTION) {

        let user = UserStore.findById(alert.user_id);
        let UserListing = _.find(user.custom_user_listings, {patient_id: parseInt(user.id, 10), listing_slug: alert.listing_slug});

        if (UserListing && UserListing !== null) {
          alertTasks.push(alert);
        }
      }
    });

    alertTasks = _.groupBy(alertTasks, (alert) => {
      return alert.item_slug + 'user-' + alert.user_id;
    });

    return alertTasks;
  }

  getAlertTaskUsers() {
    let userIds = [];
    let alerts = AlertStore.getOpenAlerts();

    alerts.forEach(alert => {
      let item = ItemStore.findBySlug(alert.item_slug);
      if (item && item.type === ITEM.TYPE_TASK) {
        if (UserStore.findById(alert.user_id) !== undefined) {
          userIds.push(alert.user_id);
        }
      }
    });
    userIds = _.uniq(userIds);
    return UserStore.filterByIds(userIds);
  }

  getAlertTasks() {
    let alertTasks = [];
    let alerts = AlertStore.getOpenAlerts();

    alerts.forEach(alert => {
      let item = ItemStore.findBySlug(alert.item_slug);
      if (item && item.type === ITEM.TYPE_TASK) {
        let user = UserStore.findById(alert.user_id);
        let UserListing = _.find(user.custom_user_listings, {patient_id: parseInt(user.id, 10), listing_slug: alert.listing_slug});

        if (UserListing && UserListing !== null) {
          alertTasks.push(alert);
        }
      }
    });

    alertTasks = _.groupBy(alertTasks, (alert) => {
      return alert.item_slug + 'user-' + alert.user_id;
    });

    return alertTasks;
  }

  // Fetch the right alerts / users to display, depending on the current tab
  initState = (props) => {
    let users = [];
    let alerts = AlertStore.getOpenAlerts();
    let currentTab = 'questions';
    if (props.params.view) {
      currentTab = props.params.view;
    }

    let userIds = [];
    switch (currentTab) {

      case 'waiting':
        users = this.getWaitingUsers();
        break;

      case 'favorites':
        users = UserStore.filterFavorites();
        break;

      default:
        users = currentTab === 'questions' ? this.getAlertQuestionUsers() : this.getAlertTaskUsers();
        break;
    }

    return {
      loading: false,
      alerts: alerts,
      users: users,
      activeUsers: users,
      currentTab: currentTab
    };
  }

  _onChange = () => {
    this.setState(this.initState(this.props));
    this.onResize();
  }

  toggleCloseAlert = (userId) => {
    AlertActionCreators.toggleCloseAlert(userId, this.state.currentTab);
  }

  toggleFavorite = (userId) => {
    UserActionCreators.toggleFavorite(userId);
  }

  // When clicking on the Message icon, it triggers the init of a Message
  initMessage = (userId) => {
    let $message = $('.messages');
    if ($message && $message !== null) {

      if (userId === this.state.initUserId) {
        $('.messages').toggleClass('active');
      } else {
        $('.messages').addClass('active');
      }
    }
    this.setState({initUserId: parseInt(userId, 10)});
  }

  resetMessageForm = () => {
    this.setState({initUserId: -1});
  }

  onSearchResult = (stateFiltered) => {
    if (stateFiltered !== null) {
      this.setState({activeUsers: stateFiltered});
    } else {
      this.setState({activeUsers: this.state.users});
    }
  }

  render() {
    let user = UserStore.currentUser;

    let messages = MessageStore.filterBySlugs(user.received_messages_slugs);

    // Get the count of tabs
    const qtcount = AlertStore.getAlertsCounts();

    let alertsCount, tasksCount, waitingCount, favoritesCount;

    alertsCount = _.size(this.getAlertQuestions());
    tasksCount = _.size(this.getAlertTasks());
    favoritesCount = UserStore.filterFavorites().length;
    waitingCount = this.getWaitingUsers().length;

    let searchCN = `container-fluid contentDash ${this.state.currentTab}`;

    let today = new Date();
    let day = dateFormat(today, 'dddd');
    let dayAndMonth = dateFormat(today, 'dd mmmm');

    return this.state.loading ? <Loader /> : (
      <div id="dashboard">
        <div ref="dash" className="dash container-fluid">
          <div className="wrapper">

            <div className="welcomeDate">{day} <br/>{dayAndMonth}</div>

            <nav className="tabs">
              <Link to="/dashboard" activeClassName="open" className="alerts">
                <div className="number">{alertsCount}</div>
                <div className="title">Alertes</div>
              </Link>
              <Link to="/dashboard/tasks" activeClassName="open" className="tasks">
                <div className="number">{tasksCount}</div>
                <div className="title">Tâches</div>
              </Link>
              <Link to="/dashboard/waiting" activeClassName="open" className="users">
                <div className="number">{waitingCount}</div>
                <div className="title">Patients <span>en attente</span></div>
              </Link>
              <Link to="/dashboard/favorites" activeClassName="open" className="favorites">
                <div className="number">{favoritesCount}</div>
                <div className="title">Favoris</div>
              </Link>
            </nav>

            <div className="clearfix"></div>

            <div className={searchCN}>

              {/* SEARCH / FILTER BAR*/}
              <div className="row tools">

                <SearchInput collection={this.state.users}
                  attribute='printable_name'
                  onSearchResult={this.onSearchResult}
                  className="col-sm-8"
                />

                <FilterInput collection={this.state.users}
                  type="users"
                  currentTab={this.state.currentTab}
                  onSearchResult={this.onSearchResult}
                  reference={ListingStore.getSelectOptions()}
                  className="col-sm-4"
                />
              </div>


              {/* USERS */}
              {this.state.activeUsers.length > 0 ? _.map(this.state.activeUsers, (user) => {
                return <AlertUserBlock
                  key={user.id}
                  user={user}
                  currentTab={this.state.currentTab}
                  toggleCloseAlert={this.toggleCloseAlert}
                  toggleFavorite={this.toggleFavorite}
                  initMessage={this.initMessage}
                />
              }, this) : (
                <div className="row blocDash empty">
                  <div className="col-lg-12 user">
                    {
                      this.state.currentTab === 'favorites' ?
                    "Vous n'avez aucun favoris" :
                    "Vous n'avez pas d'alerte en cours"
                    }
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div ref="messages" className="messages">

          <ManageMessage
            users={UserStore.users}
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
      </div>
    );
  }

}

export default ManagerDashboard;
