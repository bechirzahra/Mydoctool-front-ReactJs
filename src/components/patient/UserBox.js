"use strict";

import React, {Component, PropTypes} from 'react';
import {Link} from 'react-router';
import dateFormat from 'dateformat-light';
import ProfilePicture from '../common/ProfilePicture';
import isodate from "isodate";

const propTypes = {
  user: PropTypes.object.isRequired,
  type: PropTypes.string,
  // date: PropTypes.string,
};

const defaultProps = {
  type: 'list',
};

class UserBox extends Component {

  render() {
    let {user} = this.props;
    // console.log(user);
    if (this.props.type === 'box') {
      let {date} = this.props;
      return (
        <div className="author">
          <ProfilePicture user={user} className="small profile-image"/>
          <p>Dr {user.printable_name}</p>
          <div className="date">{dateFormat(isodate(date), 'd mmmm yyyy')}</div>
        </div>
      );
    } else {
      return (
        <li>
          <ProfilePicture user={user} className="profile-image"/>
          <div>
            <p>Dr {user.printable_name}</p>
            <span className="speciality">{user.expertise}</span>
          </div>
        </li>
      );
    }
  }
}

UserBox.propTypes = propTypes;
UserBox.defaultProps = defaultProps;

export default UserBox;