"use strict";

import React, {Component} from 'react';
import {Link} from 'react-router';
import ListingActionCreators from '../../../actions/listingActionCreators';
import toastr from 'toastr';
import ListingStore from '../../../stores/listingStore';

export default class ListingActionsGridColumn extends Component {

  componentDidMount() {
    ListingStore.addChangeListener(this._onChange);
  }

  componentWillUnmount() {
    ListingStore.removeChangeListener(this._onChange);
  }

  _onChange = () => {
    let cL = ListingStore.currentListing;
    if (cL.slug === this.props.rowData.slug) {
      if(ListingStore.errors.length > 0) {
        toastr.error('Une erreur est survenue');
      } else {
        let message = cL.is_template ? `Protocole "${cL.name}" est maintenant un template` :
        `Protocole "${cL.name}" n'est plus un template`;
        toastr.success(message);
      }
    }
  }

  toggleTemplate = () => {
    let slug = this.props.rowData.slug;

    ListingActionCreators.toggleTemplateListing(slug);
  }

  render() {
    let listing = this.props.rowData;
    let action = "";

    if (listing.is_template) {
      action = "Remove template";
    } else {
      action = "Set as a template";
    }

    return (
      <a onClick={this.toggleTemplate}>
        {action}
      </a>
    );
  }
}
