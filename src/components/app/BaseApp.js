"use strict";

import React, {Component} from 'react';
import NavBar from '../common/NavBar';
import Loader from '../common/Loader';

import InitializeActionCreators from '../../actions/initializeActionCreators';
import UserStore from '../../stores/userStore';
import MessageStore from '../../stores/messageStore';
import CategoryStore from '../../stores/categoryStore';
import ListingStore from '../../stores/listingStore';
import ItemStore from '../../stores/itemStore';
import ItemActivityStore from '../../stores/itemActivityStore';
import AlertStore from '../../stores/alertStore';

import HTML5Backend from 'react-dnd-html5-backend';
import { DragDropContext } from 'react-dnd';

/**
* Initialize the data for the App
* Intialize the Context for the Drag And Drop (used in the Listing builder process)
*/
class BaseApp extends Component {

  constructor(props) {
    super(props);

    var loading = false;

    if (!this.storesReady()) {
      loading = true;
      InitializeActionCreators.initApp();
    }

    this.state = {
      loading: loading
    };

    UserStore.addChangeListener(this._onChange);
    MessageStore.addChangeListener(this._onChange);
    CategoryStore.addChangeListener(this._onChange);
    ListingStore.addChangeListener(this._onChange);
    ItemStore.addChangeListener(this._onChange);
    ItemActivityStore.addChangeListener(this._onChange);
    AlertStore.addChangeListener(this._onChange);

  }

  componentWillUnmount() {
    UserStore.removeChangeListener(this._onChange);
    MessageStore.removeChangeListener(this._onChange);
    CategoryStore.removeChangeListener(this._onChange);
    ListingStore.removeChangeListener(this._onChange);
    ItemStore.removeChangeListener(this._onChange);
    ItemActivityStore.removeChangeListener(this._onChange);
    AlertStore.removeChangeListener(this._onChange);

  }

  storesReady = () => {
    return (
      UserStore.isInit() &&
      MessageStore.isInit() &&
      CategoryStore.isInit() &&
      ListingStore.isInit() &&
      ItemStore.isInit() &&
      ItemActivityStore.isInit() &&
      AlertStore.isInit()
    );
  }

  _onChange = () => {
    this.setState({loading: !this.storesReady()});
  }

  render() {
    return this.state.loading ? <Loader /> : this.props.children;
  }
}

export default DragDropContext(HTML5Backend)(BaseApp);