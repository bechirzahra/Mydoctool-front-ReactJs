"use strict";

import React, {Component} from 'react';
import update from 'react/lib/update';
import {Link} from 'react-router';

import AuthStore from '../../stores/authStore';
import UserStore from '../../stores/userStore';
import ItemActivityStore from '../../stores/itemActivityStore';
import ItemStore from '../../stores/itemStore';
import MessageStore from '../../stores/messageStore';
import Messages from '../app/messages/Messages';
import OrganizationStore from '../../stores/organizationStore';

import OrganizationBox from './OrganizationBox';
import UserBox from './UserBox';
import MessageBox from '../app/messages/MessageBox';
import ItemActivityBox from './ItemActivityBox';

import {ITEM, USER, CONFIG} from '../../constants/parameters';
import dateFormat from 'dateformat-light';
import flux from '../../assets/scss/flux.scss';

import isodate from "isodate";

class PatientDashboard extends Component {

  constructor(props) {
    super(props);

    let view = 'all';
    if (this.props.params.view) {
      view = this.props.params.view;
    }

    let user = UserStore.currentUser;

    this.state = {
      messages: MessageStore.getUnreadMessages(user.received_messages_slugs),
      loading: false,
      view: view,
      itemActivities: ItemActivityStore.itemActivities
    };

    MessageStore.addChangeListener(this._onMessageChange);
    ItemActivityStore.addChangeListener(this._onChange);
  }

  componentWillReceiveProps(nextProps) {
    let view = 'all';
    if (nextProps.params.view) {
      view = nextProps.params.view;
    }
    this.setState({
      view: view
    });
  }

  componentWillUnmount() {
    MessageStore.removeChangeListener(this._onMessageChange);
    ItemActivityStore.removeChangeListener(this._onChange);
  }

  _onMessageChange = () => {
    let user = UserStore.currentUser;
    let messages = MessageStore.getUnreadMessages(user.received_messages_slugs);

    this.setState({messages: messages});
  }

  _onChange = () => {
    let updatedItemActivity = ItemActivityStore.currentItemActivity;

    if (updatedItemActivity !== null) {
      let existing = _.find(this.state.itemActivities, {slug: updatedItemActivity.slug});
      let index = this.state.itemActivities.indexOf(existing);

      this.setState({
        itemActivities: update(this.state.itemActivities, {$splice: [[index, 1, updatedItemActivity]]})
      });
    }
  }

  filterItemActivities = (itemActivities) => {
    // For mobile purposes, we add a Message nav
    if (this.state.view === 'messages') {
      return [];
    }

    if (this.state.view !== 'all') {
      return _.filter(this.state.itemActivities, (itemActivity) => {
        let item = ItemStore.findBySlug(itemActivity.item_slug);

        if (this.state.view === 'notices') {
          return item.type === ITEM.TYPE_NOTICE;
        } else if (this.state.view === 'tasks') {
          return item.type === ITEM.TYPE_TASK;
        } else {
          return item.type === ITEM.TYPE_QUESTION;
        }
      });
    }

    return this.state.itemActivities;
  }

  getTodoCount = (iAs) => {
    let todoCount = {
      tasks: 0,
      notices: 0,
      questions: 0
    };

    iAs.forEach((itemActivity) => {
      let item = ItemStore.findBySlug(itemActivity.item_slug);

      if (!itemActivity.done) {
        if (item.type === ITEM.TYPE_NOTICE) {
          todoCount.notices++;
        } else if (item.type === ITEM.TYPE_TASK) {
          todoCount.tasks++;
        } else {
          todoCount.questions++;
        }
      }
    });

    return todoCount;
  }

  render() {
    let user = UserStore.currentUser;
    let linkedUsers = UserStore.users;
    let filteredItemActivities = this.filterItemActivities(this.state.itemActivities);

    let organizations = [];
    _.forEach(linkedUsers, (u) => {
      if (u.organization_slug && u.organization_slug !== null) {
        organizations.push(u.organization_slug);
      }
    });
    organizations = _.uniq(organizations);
    organizations = OrganizationStore.filterBySlugs(organizations);


    // To display activities, we have to group and sort those by date
    // But, we also have to up repeated tasks that haven't been done

    // First, let's separate those tasks
    let filterItemActivitiesWTasks = [];
    let reapeatedTasks = [];
    _.each(filteredItemActivities, (iA, key) => {
      if (!iA.done){
        let item = ItemStore.findBySlug(iA.item_slug);
        if (item.printable_type === 'task' && item.repeated) {

          // We shouldn't print the same task (even if it's diff item activities) twice
          // if (_.find(reapeatedTasks, (iATask) => {return iATask.item_slug;}) === undefined) {
          reapeatedTasks.push(iA);
          // }
        } else {
          filterItemActivitiesWTasks.push(iA);
        }
      } else {
        filterItemActivitiesWTasks.push(iA);
      }
    });

    // Group the rest of iAs
    filterItemActivitiesWTasks = _.groupBy(filterItemActivitiesWTasks, (iA) => {
      let d = isodate(iA.created_at);
      return `${d.getFullYear()}${d.getUTCMonth()}${d.getUTCDate()}`;
    });

    // Sort the rest of iAs
    filterItemActivitiesWTasks = _.sortByOrder(filterItemActivitiesWTasks, (iAA, k) => {
      return isodate(iAA[0].created_at).getTime();
    }, 'desc');


    // Now, we should add the repeatedTasks at the top of the first
    _.each(reapeatedTasks, (iATask) => {
      filterItemActivitiesWTasks[0].push(iATask);
    });


    let renderDayActivity = (iAs, k) => {

      let sortedIAs = _.sortBy(iAs, (iA) => {
        return iA.done;
      });

      let todoCount = this.getTodoCount(sortedIAs);

      let welcomePhrase = `Vous avez ${todoCount.tasks} tâches à faire, ${todoCount.questions} questions en attente de réponse, et ${todoCount.notices} informations à découvrir.`;
      if (todoCount.tasks === 0 && todoCount.questions === 0 && todoCount.notices === 0) {
        welcomePhrase = "Vous avez répondu à toutes nos demandes. Merci !";
      }

      return (
        <div key={k}>
          <div className="day">
            <h2>{dateFormat(isodate(iAs[0].created_at), 'd mmmm yyyy')}</h2>
            <hr/>
            <div className="welcome">{welcomePhrase}</div>
          </div>

          {sortedIAs.map((itemActivity) => {
            return (
              <ItemActivityBox
                key={itemActivity.slug}
                itemActivity={itemActivity}
              />
            );
          }, this)}
        </div>
      );
    };

    let mainLogo = organizations[0] && organizations[0].logo_path ? CONFIG.UPLOAD_ROOT + organizations[0].logo_path : '';

    return (
        <div id="wrapper" className="container">

          {/** LEFT SIDEBAR */}
          <div className="leftSidebar col-md-2">
            <h3>Etablissements de santé</h3>
            <hr/>
            <ul className="listImages">

              {organizations.map((org) => {
                return <OrganizationBox key={org.slug} organization={org} />
              }, this)}

            </ul>


            <h3>Médecins</h3>
            <hr/>
            <ul className="listImages">
              {linkedUsers.map((user) => {
                return <UserBox key={user.id} user={user} />;
              }, this)}
            </ul>
          </div>

          {/** MAIN COLULMN */}
          {this.state.view !== 'messages' ? (
            <div className="main col-md-6">
              <div className="logoInstitution">
                {mainLogo && mainLogo !== '' && mainLogo !== null ? (
                  <img src={mainLogo} className="img-responsive" />
                ) : ''}
              </div>

              {filterItemActivitiesWTasks.length === 0 ? (
                <div className="bloc open">
                  <div style={{padding: 30, fontSize: 16, color: '#5A5A5A'}}>
                    <span className="icon icon-notice"></span> Vous n'avez pas de messages.
                  </div>
                </div>
              ) : _.map(filterItemActivitiesWTasks, renderDayActivity)}
            </div>
          ) : ''}

          {/** RIGHT SIDEBAR */}
          <div className="rightSidebar col-md-4" style={this.state.view === 'messages' ? {display: 'block'} : {}}>
            <h2>Messages</h2>
            <hr/>

            {this.state.messages.map((message) => {
              return <MessageBox message={message} key={message.slug} />;
            }, this)}
          </div>

        </div>
    );
  }
}

export default PatientDashboard;