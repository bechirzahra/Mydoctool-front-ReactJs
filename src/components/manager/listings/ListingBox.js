'use strict';

import React, {Component, PropTypes} from 'react';
import {Link} from 'react-router';

import CategoryStore from '../../../stores/categoryStore';

class ListingBox extends Component {

  duplicateListing = (slug) => {
    this.props.duplicateListing(slug);
  }

  removeListing = (slug) => {
    this.props.removeListing(slug);
  }

  render() {
    var actions = this.props.actions ? (
      <div className="actions">
        <a onClick={this.duplicateListing.bind(this, this.props.listing.slug)}><span className="icon-clone"></span></a>
        <a onClick={this.removeListing.bind(this, this.props.listing.slug)}><span className="icon-trash"></span></a>
      </div>
    ) : '';

    let category = CategoryStore.findBySlug(this.props.listing.category_slug);

    let editRoute = `/protocols/${this.props.listing.slug}/edit`;
    let editButton = this.props.template ? (
      <a className="btnPurple" onClick={this.duplicateListing.bind(this, this.props.listing.slug)}>Editer une copie</a>
    ) : (
      <Link to={editRoute} className="btnPurple">Editer</Link>
    );

    return (
      <li>
        <div className="itemWrapper">
          <div className="color" style={{backgroundColor: this.props.listing.color}}></div>
          <div className="wrapper">
            <p className="protocoleTitle">{this.props.listing.name}</p>
            <p className="protocoleDescription">{this.props.listing.text}</p>
            {editButton}
          </div>
          <div className="protocleFooter">
            <div className="visible">
              <p className="categorie">{category && category !== null ? category.name : ''}</p>
            </div>
            {actions}
          </div>
        </div>
      </li>
    );
  }
}

ListingBox.propTypes = {
  listing: PropTypes.object.isRequired,
  actions: PropTypes.bool,
  template: PropTypes.bool
};

ListingBox.defaultProps = {
  actions: true,
  template: false
};

export default ListingBox;