'use strict';

import React, {Component, PropTypes} from 'react';
import AlertStore from '../../../stores/alertStore';
import ItemStore from '../../../stores/itemStore';
import ListingStore from '../../../stores/listingStore';

class FilterInput extends Component {

  search() {
    var ret = null;
    if (this.refs.search.value.trim() !== '') {
      ret = _.filter(this.props.collection, (item) => {
        return item.category_slug === this.refs.search.value;
      });
    }

    this.props.onSearchResult(ret);
  }

  filterUserListings() {
    var ret = null;

    if (this.refs.search.value.trim() !== '') {
      ret = _.filter(this.props.collection, (user) => {

        let alerts = [];

        if (this.props.currentTab === 'questions') {
          alerts = AlertStore.getOpenQuestionAlerts(user.id);
        } else {
          alerts = AlertStore.getOpenTaskAlerts(user.id);
        }

        let ls = [];
        _.each(alerts, function(alert) {
          let item = ItemStore.findBySlug(alert.item_slug);
          let listing = ListingStore.findBySlug(item.listing_slug);
          ls.push(listing);
        });

        return (_.find(ls, {slug: this.refs.search.value}) !== undefined ? true : false);
      });
    }

    this.props.onSearchResult(ret);
  }

  filterProtocolsListings() {
    var ret = null;
    let value = this.refs.search.value.trim();
    if (value !== '') {
      ret = _.filter(this.props.collection, (user) => {
        let UserListing = _.filter(user.custom_user_listings, {patient_id: parseInt(user.id, 10)});
        // console.log(value, UserListing);
        if (value === "-1") {
          return UserListing.length === 0 ? true : false;
        } else {
          return (_.find(UserListing, {listing_slug: value}) !== undefined ? true : false);
        }
      });
    }

    this.props.onSearchResult(ret);
  }

  filterAlertsListings() {
    var ret = null;
    const val = this.refs.search.value.trim();

    if (val !== '') {
      ret = _.filter(this.props.collection, (user) => {

        if (val === 'none') {
          let alerts = AlertStore.filterByUserId(user.id);
          return alerts.length === 0;
        } else if (val === 'questions') {
          return AlertStore.getOpenQuestionAlerts(user.id).length > 0;
        } else if (val === 'tasks') {
          return AlertStore.getOpenTaskAlerts(user.id).length > 0;
        }

        return false;
      });
    }

    this.props.onSearchResult(ret);
  }

  filterItemActivityListings() {
    var ret = null;
    const val = this.refs.search.value.trim();

    if (val !== '') {
      ret = _.filter(this.props.collection, (itemActivity) => {
        let item = ItemStore.findBySlug(itemActivity.item_slug);
        return val === item.listing_slug;
      });
    }

    this.props.onSearchResult(ret);
  }

  render() {

    var renderOption = (option) => {
      return (
        <option key={option.slug} value={option.slug}>{option.name}</option>
      );
    };

    let cN = this.props.className ? `filter ${this.props.className}` : 'filter';

    return (
      <div className={cN}>
        <div className="group-select-custom">
          <select className="browser-default"
            defaultValue=""
            ref="search"
            onChange={this.props.type === 'users' ?
              this.filterUserListings.bind(this) :
              this.props.type === 'protocols' ?
              this.filterProtocolsListings.bind(this) :
              this.props.type === 'alerts' ?
              this.filterAlertsListings.bind(this) :
              this.props.type === 'itemActivity' ?
              this.filterItemActivityListings.bind(this) :
              this.search.bind(this)
            }
          >
            <option value="">{this.props.placeholder || 'Filtrer'}</option>
            {this.props.reference.map(renderOption, this)}
          </select>
        </div>
      </div>
    );
  }
}

FilterInput.propTypes = {
  collection: PropTypes.array.isRequired,
  reference: PropTypes.array.isRequired,
  onSearchResult: PropTypes.func.isRequired,
};

export default FilterInput;