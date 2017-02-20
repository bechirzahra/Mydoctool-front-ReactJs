'use strict';

import React, {Component} from 'react';
import {Link} from 'react-router';
import dateFormat from 'dateformat-light';
import isodate from "isodate";

export default class Messages extends Component {
  render() {
    let messages = this.props.messages;

    var renderMessage = (message) => {
      let isRead = !message.read ? '(Non lu)' : '';
      return (
        <li key={message.slug}>
          <Link to={"/messages/" + message.slug}><b>{isRead}</b> From: XXX | Subject: {message.name} | On: {dateFormat(isodate(message.createdAt), 'fullDate')}</Link>
        </li>
      )
    };

    return (
      <ul>
        {messages.map(renderMessage, this)}
      </ul>
    );
  }
}
