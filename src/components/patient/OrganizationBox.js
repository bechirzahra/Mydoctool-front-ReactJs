"use strict";

import React, {Component, PropTypes} from 'react';
import {Link} from 'react-router';
import dateFormat from 'dateformat-light';
import ProfilePicture from '../common/ProfilePicture';
import isodate from "isodate";
import OrganizationStore from '../../stores/organizationStore';

import defaultImage from '../../assets/images/organizationDefaultImage.jpg';

const propTypes = {
  organization: PropTypes.object.isRequired,
  type: PropTypes.string,
  // date: PropTypes.string,
};

const defaultProps = {
  type: 'list',
};

class OrganizationBox extends Component {

  render() {
    let {organization} = this.props;
    let avatar = OrganizationStore.getOrganizationImage(organization);

    if (avatar === '') {
      avatar = defaultImage;
    }

    return (
      <li>
        <img src={avatar} className="img-circle" />
        <div>
          <p>{organization.name}</p>
          {organization.url && organization.url !== null && organization.url !== '' ? (
            <a href={organization.url} target="_blank">Site internet</a>
          ) : ''}
        </div>
      </li>
    );
  }
}

OrganizationBox.propTypes = propTypes;
OrganizationBox.defaultProps = defaultProps;

export default OrganizationBox;