'use strict';

import React, {Component, PropTypes} from 'react';
import UserStore from '../../stores/userStore';

const propTypes = {
  user: PropTypes.object.isRequired,
  className: PropTypes.string,
};

const defaultProps = {
  className: '',
  style: {}
};

class ProfilePicture extends Component {

  render() {
    let {user} = this.props;
    let avatar = UserStore.getUserAvatar(user);

    if (avatar !== null && avatar !== '') {
      return (
        <div className={this.props.className} style={this.props.style}>
          <img src={avatar} className="img-circle" />
        </div>
      );
    } else {
      let inits = '';

      if (user.firstname && user.firstname[0]) {
        inits = inits + user.firstname[0];
      }

      if (user.lastname && user.lastname[0]) {
        inits = inits + user.lastname[0];
      }

      return (
        <div className={this.props.className} style={this.props.style}>
          {inits}
        </div>
      );
    }
  }
}

ProfilePicture.propTypes = propTypes;
ProfilePicture.defaultProps = defaultProps;

export default ProfilePicture;