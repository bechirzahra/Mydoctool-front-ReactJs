'use strict';

import React, {Component} from 'react';
import Formsy from 'formsy-react';
import UserStore from '../../../stores/userStore';
import MessageStore from '../../../stores/messageStore';
import AlertStore from '../../../stores/alertStore';
import ListingStore from '../../../stores/listingStore';
import ItemStore from '../../../stores/itemStore';
import ItemActivityStore from '../../../stores/itemActivityStore';
import {ITEM} from '../../../constants/parameters';

import ListingProgress from '../common/ListingProgress';
import UserActionCreators from '../../../actions/userActionCreators';

import SelectMDT from '../../common/SelectMDT';
import InputMDT from '../../common/InputMDT';

class PatientListingData extends Component {

  constructor(props) {
    super(props);

    this.state = {
      errors: [],
      canSubmit: false
    };
  }

  componentDidMount() {
    UserStore.addChangeListener(this._onUserChange);
  }

  componentWillUnmount() {
    UserStore.removeChangeListener(this._onUserChange);
  }

  _onUserChange = () => {
    this.forceUpdate();
  }

  enableButton = () => {
    this.setState({canSubmit: true});
  }

  disableButton = () => {
    this.setState({canSubmit: false});
  }

  submit = (data, resetForm) => {
    this.setState({canSubmit: false});
    UserActionCreators.addUserListing(this.props.user.id, data);
    resetForm();
  }

  render() {

    let {user, itemActivities} = this.props;
    let UserListings = user.custom_user_listings;

    let renderListing = (uL) => {
      let listing = ListingStore.findBySlug(uL.listing_slug);

      return listing && listing !== null ? (
        <li key={uL.listing_slug}>

          <div className="border" style={{borderLeftColor: listing.color}}></div>

          <div className="row">

            <div className="col-sm-6 title"><p>{listing.name}</p></div>

            <ListingProgress
              listing={listing}
              UserListing={uL}
              className="col-sm-6"
            />

          </div>

          <a className="delete" onClick={this.props.removeUserListing.bind(this, uL)}><span className="icon icon-trash"></span></a>
        </li>
      ) : '';
    };

    return (
      <div className="protocolsContent">
        <ul>
          {UserListings.map(renderListing, this)}
        </ul>


        <div className="add">
          <Formsy.Form onValidSubmit={this.submit}
            onValid={this.enableButton}
            onInvalid={this.disableButton}
            validationErrors={{} || this.props.errors.children}
            className="bloc"
          >
            <div className="more"><span className="icon icon-add"></span></div>

            <SelectMDT
              name="listing"
              options={ListingStore.getSelectOptionsBis()}
              required
            />

            <div className="date">
              <label>Début:</label>

              <InputMDT name="startDay"
                layout="simple"
                className="form-control"
                placeholder="DD"
              />

              <InputMDT name="startMonth"
                layout="simple"
                className="form-control"
                placeholder="MM"
              />

              <InputMDT name="startYear"
                layout="simple"
                className="form-control year"
                placeholder="AAAA"
              />
            </div>
            <button type="submit" className="btnPurple2" disabled={!this.state.canSubmit}>Ajouter</button>
          </Formsy.Form>
        </div>
      </div>
    );
  }
}

export default PatientListingData;