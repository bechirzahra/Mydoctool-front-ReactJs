'use strict';

import React, {Component} from 'react';
import {Link} from 'react-router';
import dateFormat from 'dateformat-light';
import _ from 'lodash';
import Loader from '../../common/Loader';
import isodate from "isodate";

import UserStore from '../../../stores/userStore';
import MessageStore from '../../../stores/messageStore';
import MessageActionCreators from '../../../actions/messageActionCreators';
import parameters from '../../../constants/parameters';

export default class MessageView extends Component {

  constructor(props) {
    super(props);

    let loading = false;
    let message = MessageStore.findBySlug(this.props.params.messageSlug);

    if (!message) {
      message = null;
      loading = true;
      MessageActionCreators.getMessage(this.props.params.messageSlug);
    }

    this.state = {
      message: message,
      loading: null,
    }

    MessageStore.addChangeListener(this._onChange);
  }

  componentDidMount() {
    this.shouldSetRead();
  }

  shouldSetRead = () => {
    if (this.state.message !== null) {
      let i = _.findIndex(UserStore.currentUser.received_messages_slugs, (slug) => slug === this.state.message.slug);
      if (i >= 0 && !this.state.message.read) {
        MessageActionCreators.readMessage(this.state.message.slug);
      }
    }
  }

  componentWillUnmount() {
    MessageStore.removeChangeListener(this._onChange);
  }

  _onChange = () => {
    this.setState({
      message: MessageStore.findBySlug(this.props.params.messageSlug),
      loading: false
    });

    this.shouldSetRead();
  }

  render() {

    var renderDocument = (doc) => {
      return (
        <li key={doc.slug}>
          <a href={parameters.CONFIG.UPLOAD_ROOT + doc.full_path} target="_blank">{doc.name}</a>
        </li>
      );
    };

    return this.state.loading ? <Loader /> : (
      <div>

      <h1>Message</h1>

      <h2>Subject: {this.state.message.name}</h2>

      <div>
        <p className="well">{this.state.message.text}</p>

        <span><i>Attached documents</i></span>
        <ul>{this.state.message.documents.map(renderDocument, this)}</ul>
      </div>

      <p>
        <small>Sent by {this.state.message.from_user_printable} on {dateFormat(isodate(this.state.message.created_at))}</small>
      </p>
      </div>
    );
  }
}
