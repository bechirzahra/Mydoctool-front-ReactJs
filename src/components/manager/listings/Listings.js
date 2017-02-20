'use strict';

import React, {Component} from 'react';
import {Link} from 'react-router';
import Loader from '../../common/Loader';
import history from '../../../services/history';

import ListingBox from './ListingBox';
import SearchInput from '../common/SearchInput';
import FilterInput from '../common/FilterInput';

import NewProtocolModal from '../common/NewProtocolModal';

import ListingActionCreators from '../../../actions/listingActionCreators';
import ListingStore from '../../../stores/listingStore';
import CategoryStore from '../../../stores/categoryStore';

export default class Listings extends Component {

  constructor(props) {
    super(props);

    let userListings = ListingStore.listings;
    let templates = ListingStore.templates;

    this.state = {
      loading: false,
      listings: userListings,
      filteredUserListings: userListings,
      filteredTemplateListings: templates,
      showModal: false,
    };

    ListingStore.addChangeListener(this._onChange);
  }



  componentWillUnmount() {
    ListingStore.removeChangeListener(this._onChange);
  }



  onSearchResult(stateFiltered, data) {
    if (data !== null) {
      this.state[stateFiltered] = data;
    } else {
      this.state[stateFiltered] = this.state.listings;
    }
    this.setState(this.state);
  }



  _onChange = () => {
    // We wait for the protocol to be initialized
    let newListing = ListingStore.currentListing;

    // Create a protocol
    if (newListing !== null) {
      // We redirect to the ManageListing page
      history.replaceState(null, '/protocols/' + newListing.slug + '/edit');
    }

    this.setState({loading: false});
  }


  /**
  * Duplicates a Listings (and its items)
  */
  duplicateListing = (slug) => {
    this.setState({loading: true});
    ListingActionCreators.duplicateListing(slug);
  }


  /**
  * Removes a Listings (and its items)
  */
  removeListing = (slug) => {
    this.setState({loading: true});
    ListingActionCreators.deleteListing(slug);
  }



  render() {
    var categories = CategoryStore.categories;

    let openModal = () => this.setState({showModal: true})
    let closeModal = () => this.setState({showModal: false})

    return this.state.loading ? <Loader /> : (
      <div id="protocoles">

        <div className="container-fluid fixedHeightBar bgPurple">
          <h2>Mes protocoles</h2>

          <SearchInput collection={this.state.listings}
            attribute="name"
            onSearchResult={this.onSearchResult.bind(this, 'filteredUserListings')}
          />

          <FilterInput collection={this.state.listings} reference={categories}
            onSearchResult={this.onSearchResult.bind(this, 'filteredUserListings')}
          />
        </div>

        <div className="container-fluid bgGrey">
          <div className="row col-lg-12">
            <div className="gridList">
              <ul className="editable">
                <li className="add" onClick={openModal}>
                  <span className="icon-add"></span>
                  <p>Créer un protocole</p>
                </li>
                {this.state.filteredUserListings.map((listing) =>
                  <ListingBox
                    key={listing.slug}
                    listing={listing}
                    duplicateListing={this.duplicateListing}
                    removeListing={this.removeListing}
                  />, this)}
              </ul>
            </div>
          </div>
        </div>

        <div className="container-fluid fixedHeightBar">
          <h2>Choisissez parmi nos modèles</h2>

          <FilterInput collection={this.state.listings} reference={categories}
            onSearchResult={this.onSearchResult.bind(this, 'filteredTemplateListings')}
            className="col-xs-2"
          />
        </div>

        <div className="container-fluid bgPurple">
          <div className="row col-lg-12">
            <div className="gridList">
              <ul>
                {this.state.filteredTemplateListings.map((listing) =>
                  <ListingBox
                    listing={listing}
                    actions={false}
                    key={'t-' + listing.slug}
                    template={true}
                    duplicateListing={this.duplicateListing}
                  />, this)}
              </ul>
            </div>
          </div>
        </div>

        <NewProtocolModal categories={categories}
          show={this.state.showModal}
          onHide={closeModal}
        />

      </div>
    );
  }
}
