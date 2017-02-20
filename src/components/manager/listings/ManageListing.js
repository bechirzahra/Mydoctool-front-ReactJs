'use strict';

import React, {Component} from 'react';
import update from 'react/lib/update';
import _ from 'lodash';
import toastr from 'toastr';

import history from '../../../services/history';
import Loader from '../../common/Loader';

import ListingStatusBar from '../common/ListingStatusBar';
import ListingBuilder from '../common/ListingBuilder';
import ItemModal from '../items/ItemModal';

import CategoryStore from '../../../stores/categoryStore';
import ListingStore from '../../../stores/listingStore';
import ItemStore from '../../../stores/itemStore';

import ListingActionCreators from '../../../actions/listingActionCreators';

import Utils from '../../../services/utils';

class ManageListing extends Component {
  constructor(props) {
    super(props);

    let listing = ListingStore.findBySlug(this.props.params.listingSlug);
    let items = ItemStore.filterByListing(listing.slug);

    items = _.sortBy(items, (item) => {
      return item.order_c;
    });

    this.state = {
      loading: false,
      listing: listing,
      items: items || [],
      removedItems: [],
      currentItem: null,
      showItemModal: false
    };

    ItemStore.addChangeListener(this._onChange);
    ListingStore.addChangeListener(this._onChange);
  }

  componentWillUnmount() {
    ItemStore.removeChangeListener(this._onChange);
    ListingStore.removeChangeListener(this._onChange);
  }

  _onChange() {
    // Once the Listing have been saved, we redirect on the /manage/protocols page
    history.replaceState(null, '/protocols');
    toastr.success('Protocole sauvegardé', 'Succès !');
  }


  /**
  * Move / Sort an item
  */
  moveItem = (dragIndex, hoverIndex) => {
    const {items} = this.state;
    let dragItem = items[dragIndex];

    let newState = update(this.state, {
      items: {
        $splice: [
          [dragIndex, 1],
          [hoverIndex, 0, dragItem]
        ]
      }
    });

    newState.items.forEach((item, k) => {
      item.order_c = k;
    });

    newState.items = this.orderItems(newState.items);

    this.setState(newState);
  }


  /**
  * Sync the item position in items with its order_c
  */
  orderItems(items){
    return _.sortBy(items, (item, k) => {
      return parseInt(item.order_c, 10);
    });
  }


  /**
  * Init the sync between item position / order_c
  */
  reOrderItems(items) {
    let newItems = this.orderItems(items);
    newItems.forEach((item, k) => {
      item.order_c = k;
    });
    return newItems;
  }


  /**
  * Create a new virgin Item
  */
  addItem = (rawItem, mkey) => {
    let newItem = {
      slug: Utils.generateUid(),
      printable_type: rawItem.id,
      order_c: this.state.items.length,
      name: '',
      text: '',
      unit: '',
      documents: [],
      frequencies: [],
      alerts: [],
      options: [],
      text_answer_short: true,
      icon: '',
      min: 0,
      max: 0,
    };

    if (mkey === 'down') {
      this.state.items.push(newItem);
    } else {
      newItem.order_c = 0;
      _.each(this.state.items, (item) => {item.order_c++});
      this.state.items.unshift(newItem);
    }

    this.setState({
      items: this.orderItems(this.state.items),
    });

    this.openModal(newItem.slug);
  }


  /**
  * Save the item, close the modal on done.
  */
  saveItem = (item, closeModal = false) => {
    let newItems = update(this.state.items, {
      $splice: [[item.order_c, 1, item]]
    });

    this.setState({
      items: newItems
    }, () => {
      if (closeModal) {
        this.closeModal();
      }
    });
  }


  /**
  * Clone an item.
  */
  duplicateItem = (itemSlug) => {
    let item = _.find(this.state.items, {slug: itemSlug});
    let newItem = _.clone(item);

    newItem.name += ' (copy)';
    newItem.slug = Utils.generateUid();
    newItem.order_c = this.state.items.length;

    // We should change the alert uid
    _.each(newItem.alerts, (alert, k) => {
      _.each(alert.conditions, (condition, kk) => {
        if (condition.base && condition.base.slug && condition.base.slug === itemSlug) {
          newItem.alerts[k].conditions[kk].base.slug = -1;
        }
      });
    });

    let newItems = update(this.state.items, {$push: [newItem]});

    this.setState({
      items: newItems
    });
  }


  /**
  * Remove an item from the Listing
  */
  removeItem = (itemSlug, e) => {
    e.preventDefault();

    _.remove(this.state.items, {slug: itemSlug});
    this.state.items = this.reOrderItems(this.state.items);
    this.state.removedItems.push(itemSlug);

    this.setState({
      items: this.state.items,
      removedItems: this.state.removedItems
    });
  }


  /**
  * Open the Modal
  */
  openModal = (itemSlug) => {
    let currentItem = _.find(this.state.items, {slug: itemSlug});
    this.setState({
      currentItem: currentItem,
      showItemModal: true,
    });
  }


  /**
  * Close the Modal
  */
  closeModal = () => {
    this.setState({
      currentItem: null,
      showItemModal: false
    });
  }


  /**
  * Save the Listing in DB.
  */
  saveListing = (data = null) => {
    this.setState({loading: true});

    ListingActionCreators.updateListing(
      this.state.listing.slug,
      data,
      this.state.items,
      this.state.removedItems
    );
  }


  render() {
    return this.state.loading ? <Loader /> : (
      <div id="protocole">
        <ListingStatusBar
          listing={this.state.listing}
          saveListing={this.saveListing}
        />

        <ListingBuilder
          listing={this.state.listing}
          items={this.state.items}
          addItem={this.addItem}
          duplicateItem={this.duplicateItem}
          removeItem={this.removeItem}
          moveItem={this.moveItem}
          openModal={this.openModal}
          saveListing={this.saveListing}
        />

        <ItemModal item={this.state.currentItem}
          show={this.state.showItemModal}
          onHide={this.closeModal}
          saveItem={this.saveItem}
          items={this.state.items}
          changeModalMode={this.changeModalMode}
        />
      </div>
    );
  }
}

export default ManageListing;