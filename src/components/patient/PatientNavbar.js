"use strict";

import React, {Component} from 'react';

import {Link, History} from 'react-router';
import AuthStore from '../../stores/authStore';
import UserStore from '../../stores/userStore';
import ItemActivityStore from '../../stores/itemActivityStore';
import ItemStore from '../../stores/itemStore';
import MessageStore from '../../stores/messageStore';

import {ITEM, USER} from '../../constants/parameters';
import ProfilePicture from '../common/ProfilePicture';
import MyDocToolSvg from '../common/MyDocToolSvg';

const PatientNavbar = React.createClass({
  mixins: [
    History
  ],

  componentDidMount() {
    UserStore.addChangeListener(this._onUserChange);
    ItemActivityStore.addChangeListener(this._onChange);
  },

  componentWillUnmount() {
    UserStore.removeChangeListener(this._onUserChange);
    ItemActivityStore.removeChangeListener(this._onChange);
  },

  // This onChange let us refresh the notification count.
  _onChange(){
    this.forceUpdate();
  },

  _onUserChange(){
    this.forceUpdate();
  },

  getTodoCount(iAs) {
    let todoCount = {
      tasks: 0,
      notices: 0,
      questions: 0
    };

    iAs.forEach((itemActivity) => {
      let item = ItemStore.findBySlug(itemActivity.item_slug);

      if (item.type === ITEM.TYPE_NOTICE) {
        todoCount.notices++;
      } else if (item.type === ITEM.TYPE_TASK) {
        todoCount.tasks++;
      } else {
        todoCount.questions++;
      }
    });

    return todoCount;
  },

  render() {
    let todo = this.getTodoCount(ItemActivityStore.filterNotDone());
    let messageCount = MessageStore.getMyUnreadMessages(UserStore.currentUser.id).length;

    let isDashboardActive = this.history.isActive('/dashboard') &&
      !this.history.isActive('/dashboard/tasks') &&
      !this.history.isActive('/dashboard/questions') &&
      !this.history.isActive('/dashboard/notices');

    let isMobileDashboardActive = this.history.isActive('/dashboard') ||
      this.history.isActive('/dashboard/tasks') ||
      this.history.isActive('/dashboard/questions') ||
      this.history.isActive('/dashboard/notices');

    return (
      <div>
        <nav id="headerFlux" className="navbar navbar-default navbar-fixed-top">

          <div id="menuMobile" className="container-fluid">
            <Link to="/dashboard" data-page="main" className={isMobileDashboardActive ? "active" : ''}><span className="icon-home"></span></Link>
            <Link to="/dashboard/messages" data-page="rightSidebar" activeClassName="active">
              <span className="icon-mail">
                <div className="notice-number">{messageCount}</div>
              </span>
            </Link>
            <Link to="/settings" data-page="leftSidebar" activeClassName="active"><span className="icon-burger"></span></Link>
          </div>

          <div id="menuDesktop" className="container">
            <div className="navbar-header">
              <Link to="/dashboard" className="logo">
                <MyDocToolSvg />
              </Link>
            </div>

            <div className="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
              <ul id="filtres" className="nav navbar-nav navbar-center">
                <li className={isDashboardActive ? "active" : ""}>
                  <Link to="/dashboard">
                    <span className="icon icon-home"></span> Accueil
                  </Link>
                </li>
                <li className={this.props.view === 'questions' ? "active" : ""}>
                  <Link to="/dashboard/questions">
                    <span className="icon margin icon-question">
                      <span className="path path1"></span>
                      <span className="path path2"></span>
                      <span className="path path3"></span>
                    </span>
                    Question
                    {todo.questions > 0 ? (
                      <div className="notice-number">{todo.questions}</div>
                    ) : ''}
                  </Link>
                </li>
                <li className={this.props.view === 'tasks' ? "active" : ""}>
                  <Link to="/dashboard/tasks">
                    <span className="icon margin icon-task2">
                      <span className="path path1"></span>
                      <span className="path path2"></span>
                      <span className="path path3"></span>
                      <span className="path4"></span>
                    </span>
                    Tâche
                    {todo.tasks > 0 ? (
                      <div className="notice-number">{todo.tasks}</div>
                    ) : ''}
                  </Link>
                </li>
                <li className={this.props.view === 'notices' ? "active" : ""}>
                  <Link to="/dashboard/notices">
                    <span className="icon margin icon-indice2">
                      <span className="path path1"></span>
                      <span className="path path2"></span>
                      <span className="path path3"></span>
                    </span>
                    Information
                    {todo.notices > 0 ? (
                      <div className="notice-number">{todo.notices}</div>
                    ) : ''}
                  </Link>
                </li>
              </ul>
              <ul id="profilMenu" className="nav navbar-nav navbar-right">
                <li className="dropdown">
                  <Link to="/settings" className="profile dropdown-toggle">
                    <ProfilePicture user={UserStore.currentUser}/>
                    <p>{UserStore.currentUser.printable_name}</p>
                  </Link>
                </li>
              </ul>
            </div>

          </div>
        </nav>

        {isMobileDashboardActive ? (
          <div id="filtresMobile" className="container-fluid">
            <ul>
              <li>
                <Link to="/dashboard/questions" activeClassName="active">
                  <span className="icon margin icon-question"><span className="path1"></span><span className="path2"></span><span className="path3"></span>
                  {todo.questions > 0 ? (
                    <div className="notice-number">{todo.questions}</div>
                  ) : ''}
                </span> <p>Question</p>
                </Link>
              </li>
              <li>
                <Link to="/dashboard/tasks" activeClassName="active">
                  <span className="icon margin icon-task2"><span className="path1"></span><span className="path2"></span><span className="path3"></span><span className="path4"></span>
                  {todo.tasks > 0 ? (
                    <div className="notice-number">{todo.tasks}</div>
                  ) : ''}
                  </span>
                  <p>Tâche</p>
                </Link>
              </li>
              <li>
                <Link to="/dashboard/notices" activeClassName="active">
                  <span className="icon margin icon-indice2"><span className="path1"></span><span className="path2"></span><span className="path3"></span>
                  {todo.notices > 0 ? (
                    <div className="notice-number">{todo.notices}</div>
                  ) : ''}
                  </span> <p>Information</p>
                </Link>
              </li>
            </ul>
          </div>
        ) : ''}

      </div>
    );
  }
});

export default PatientNavbar;