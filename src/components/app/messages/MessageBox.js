"use strict";

import React, {Component, PropTypes} from 'react';
import {Link} from 'react-router';
import dateFormat from 'dateformat-light';
import UserStore from '../../../stores/userStore';
import MessageActionCreators from '../../../actions/messageActionCreators';
import UserBox from '../../patient/UserBox';
import ProfilePicture from '../../common/ProfilePicture';
import DocumentGrid from '../../common/DocumentGrid';
import isodate from "isodate";

const propTypes = {
  message: PropTypes.object.isRequired
};

class MessageBox extends Component {

  readMessage = () => {
    let {message} = this.props;
    MessageActionCreators.readMessage(message.slug);
    $(this.refs.message).fadeOut();
  }

  openMessage = (e) => {
    e.preventDefault();
    $(this.refs.li).toggleClass('open');
  }

  render() {
    let {type, message} = this.props;

    let user = UserStore.findById(message.from_user_id);

    if ((!user || user === null)) {
      if (parseInt(UserStore.currentUser.id, 10) === parseInt(message.from_user_id, 10)) {
        user = UserStore.currentUser;
      } else {
        user = null;
      }
    }

    if (type && type === 'doctor' && user !== null) {
      return (
        <li ref="li">
          <div className="lane"></div>
          <ProfilePicture user={user} className="photo" />

          <a onClick={this.openMessage} className="more">
            <span className="icon-dots-three"></span>
          </a>

          <div className="content">
            <p className="name">{message.from_user_printable}</p>
            <p className="date">{dateFormat(isodate(message.created_at), 'd mmmm yyyy')}</p>
            <p className="text">{message.text}</p>
            {/*<div className="text-right">
              <a onClick={this.readMessage} className="btnPurple2">Ok</a>
            </div> */}
          </div>
        </li>
      );
    }

    return user !== null ? (
      <div ref="message" className="bloc important">
        <div className="type">Important</div>
        <div className="header">
          <UserBox type="box"
            user={user}
            date={message.created_at}
          />
        </div>
        <div className="content">{message.text}</div>

        <DocumentGrid
          withImages={true}
          documents={message.documents}
        />

        <div className="text-center">
          <a className="btn" onClick={this.readMessage}>Ok</a>
        </div>
      </div>
    ) : '';
  }
}

MessageBox.propTypes = propTypes;

export default MessageBox;