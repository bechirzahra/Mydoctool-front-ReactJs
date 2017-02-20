'use strict';

import React, {Component, PropTypes} from 'react';
import Formsy from 'formsy-react';
import {CONFIG} from '../../../constants/parameters';
import AutoSuggestMDT from '../../common/AutoSuggestMDT';
import InputMDT from '../../common/InputMDT';
import TextareaMDT from '../../common/TextareaMDT';
import toastr from 'toastr';

import Dropzone from 'react-dropzone';

import UserStore from '../../../stores/userStore';
import MessageStore from '../../../stores/messageStore';

import MessageActionCreators from '../../../actions/messageActionCreators';

const propTypes = {
  users: PropTypes.array.isRequired,
  initUserId: PropTypes.number
};

class ManageMessage extends Component {

  constructor(props) {
    super(props);

    let toUser = null;
    if (this.props.toUser) {
      toUser = this.props.toUser;
    }

    this.state = {
      toUser: toUser,
      canSubmit: false,
      errors: [],
      files: []
    };

    MessageStore.addChangeListener(this._onChange);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.initUserId != -1) {
      this.setState({toUser: UserStore.findById(nextProps.initUserId)});
    }
  }

  componentWillUnmount() {
    MessageStore.removeChangeListener(this._onChange);
  }

  _onChange = () => {
    this.setState({errors: MessageStore.errors});
  }

  enableButton = () => {
    this.setState({canSubmit: true});
  }

  disableButton = () => {
    this.setState({canSubmit: false});
  }

  submit = (data, resetForm) => {
    data.fromUser = UserStore.currentUser.id;
    data.toUser = this.state.toUser.id;
    MessageActionCreators.createMessage(data, this.state.files);

    resetForm();
    this.resetToUser();
    this.props.resetMessageForm();
  }

  resetToUser = () => {
    if (this.props.toUser) {
      this.setState({toUser: this.props.toUser});
    } else {
      this.setState({toUser: null});
    }
  }

  onDrop = (files) => {
    for (let file of files) {
      this.state.files.push(file);
    }
    this.setState({files: this.state.files});
  }

  deleteFile = (file) => {
    _.remove(this.state.files, file);
    this.setState({files: this.state.files});
  }

  getSuggestions = (input, callback) => {
    let {users} = this.props;

    const regex = new RegExp('^' + input, 'i');
    const suggestions = users.filter(u => regex.test(u.printable_name));

    return callback(null, suggestions);
  }

  getSuggestionValue = (suggestionObj) => {
    return suggestionObj.printable_name;
  }

  onSuggestionSelected = (suggestion) => {
    this.setState({toUser: suggestion});
  }

  render() {

    let renderFile = (file) => {
      return (
        <div key={"fi" + file.lastModified + file.size}>
          {file.name} - <a onClick={this.deleteFile.bind(this, file)}>Delete</a>
        </div>
      );
    };

    let renderSuggestion = (suggestion, input) => {
      let image = '';

      if (suggestion.avatar_path && suggestion.avatar_path !== '') {
        const path = CONFIG.UPLOAD_ROOT + suggestion.avatar_path;
        image = (
          <img src={path} className="img-circle" />
        );
      } else {
        image = 'TO';
      }

      return (
        <div>
          <div className="avatar">{image}</div>
          <span>{suggestion.printable_name}</span>
        </div>
      )
    };

    return (
      <Formsy.Form onValidSubmit={this.submit}
        onValid={this.enableButton}
        onInvalid={this.disableButton}
        validationErrors={{} || this.props.errors.children}
        ref="form"
      >

        {this.props.toUser && this.props.toUser !== null ? (
          <InputMDT
            name="toUserName"
            layout="timeline"
            value={this.props.toUser.printable_name}
            disabled
          />
        ) : (
          <AutoSuggestMDT
            name="toUserName"
            placeholder="Envoyer message à"
            suggestions={this.getSuggestions}
            suggestionRenderer={renderSuggestion}
            suggestionValue={this.getSuggestionValue}
            onSuggestionSelected={this.onSuggestionSelected}
            defaultValue={this.state.toUser && this.state.toUser !== null ? this.state.toUser.printable_name : ''}
          />
        )}


        <div className="form-group">
          <TextareaMDT name="text"
            placeholder="Saisie message"
            rows="5"
            value=""
            required
          />
        </div>

      {/*
        <Dropzone onDrop={this.onDrop}>
          <div>Try dropping some files here, or click to select files to upload.</div>
        </Dropzone>
      */}
        {this.state.files.map(renderFile, this)}

        <div className="form-group text-right">
          <button type="submit" className="btnPurple2" disabled={!this.state.canSubmit}>Envoyer</button>
        </div>

      </Formsy.Form>
    );
  }
}

ManageMessage.propTypes = propTypes;

export default ManageMessage;