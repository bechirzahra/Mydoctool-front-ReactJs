'use strict';

import React, {Component, PropTypes} from 'react';
import {Link} from 'react-router';
import CategoryStore from '../../../stores/categoryStore';

import Formsy from 'formsy-react';

import InputMDT from '../../common/InputMDT';
import SelectMDT from '../../common/SelectMDT';
import TextareaMDT from '../../common/TextareaMDT';
import ColorPickerMDT from '../../common/ColorPickerMDT';
import ToggleMDT from '../../common/ToggleMDT';

import ItemStore from '../../../stores/itemStore';

class ListingStatusBar extends Component {

  constructor(props) {
    super(props);

    this.state = {
      canSubmit: false
    };
  }

  enableButton = () => {
    this.setState({
      canSubmit: true
    });
  }

  disableButton = () => {
    this.setState({
      canSubmit: false
    });
  }

  submit = (model) => {
    this.props.saveListing(model);
  }

  shouldComponentUpdate(nextProps, nextState) {
    return this.state.canSubmit !== nextState.canSubmit;
  }

  render() {
    let {listing} = this.props;
    let categories = CategoryStore.categories;

    return (
      <Formsy.Form
          onValid={this.enableButton}
          onInvalid={this.disableButton}
          onValidSubmit={this.submit}
        >
        <div className="container-fluid fixedHeightBar bgPurple2 navControls">

          <h2 className="name">
            <InputMDT
              id="input-listing-name"
              resize={true}
              name="name"
              value={listing.name}
              label="Nom du protocole"
              placeholder="Mon premier protocole"
            />
            <span className="icon-editer" onClick={() => {document.getElementById('input-listing-name').focus();}}></span>
          </h2>

          <Link to="/protocols" className="btnPurple3 cancel">Annuler</Link>
          <button type="submit" className="btnPurple2 save" disabled={!this.state.canSubmit}>Enregistrer</button>

        {/*
          <div className="publish">
            <ToggleMDT
              name="published"
              value={listing.published}
              label="Publié"
            />
          </div>
          */}
        </div>

        <div className="container-fluid fixedHeightBar general bgGrey">
            <div className="row">
              <div className="col-md-4">
                <SelectMDT
                  name='category'
                  required
                  placeholder="Sélectionnez une catégorie"
                  options={CategoryStore.getSelectOptions()}
                  value={listing.category_slug}
                />
              </div>
              <div className="col-md-1">
                <SelectMDT
                  name="durationValue"
                  options={ItemStore.getDayOptions()}
                  value={+listing.duration_value || 1}
                />
              </div>
              <div className="col-md-2">
                <SelectMDT
                  name="durationUnit"
                  options={ItemStore.getFrequenciesUnitOptions()}
                  value={+listing.duration_unit || 0}
                />
              </div>
              <div className="col-md-3 colorPicker">
                <p>Sélection de la couleur</p>
                <ColorPickerMDT
                  name="color"
                  value={listing.color}
                />
              </div>
              <div className="col-md-2 help">
                <a href="#">Besoin d'aide</a>
                <span className="icon-logo-helper"></span>
              </div>
            </div>
            <div className="row">
              <div className="form-group col-lg-12">
                <TextareaMDT
                  name="text"
                  placeholder="Saisissez la description du protocole"
                  value={listing.text}
                />
              </div>
            </div>
        </div>
      </Formsy.Form>
    );
  }
}

ListingStatusBar.propTypes = {
  listing: PropTypes.object.isRequired,
};

export default ListingStatusBar;