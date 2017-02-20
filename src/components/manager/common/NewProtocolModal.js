'use strict';

import React, {Component, PropTypes} from 'react';
import {Modal} from 'react-bootstrap';
import _ from 'lodash';

import ListingActionCreators from '../../../actions/listingActionCreators';
import CategoryActionCreators from '../../../actions/categoryActionCreators';
import CategoryStore from '../../../stores/categoryStore';
import Translator from '../../../services/Translator';

class NewProtocolModal extends Component {

  constructor(props) {
    super(props);

    this.state = {
      loading: false,
      errors: {name: '', category: ''},
      selectedCategory: null,
      newCategory: '',
      listingName: '',
    };

    CategoryStore.addChangeListener(this._onCategoryChange);
  }

  componentWillUnmount() {
    CategoryStore.removeChangeListener(this._onCategoryChange);
  }

  _onCategoryChange = () => {
    this.setState({
      loading: false,
      selectedCategory: CategoryStore.currentCategory.slug
    });

    this.refs.categoryName.value = "";
    $(this.refs.select).removeClass('open');
  }

  selectCategory = (categorySlug) => {
    this.setState({selectedCategory: categorySlug});
  }

  onInputChange = (e) => {
    this.setState({newCategory: e.target.value});
  }

  createCategory = (e) => {
    e.preventDefault();

    this.setState({loading: true});

    let data = {
      name: this.state.newCategory
    };

    CategoryActionCreators.createCategory(data);
  }

  onListingNameChange = (e) => {
    this.setState({listingName: e.target.value});
  }

  submit = (e) => {
    e.preventDefault();
    let data = {
      name: this.state.listingName,
      category: this.state.selectedCategory
    };

    this.state.errors = {name: '', category: ''};

    if (data.name === null || data.name.trim() === '') {
      this.state.errors.name = Translator.translate('CHAMP_VIDE');
      this.setState({errors: this.state.errors});
    }
    else if (data.category === null || data.category === '') {
      this.state.errors.category = "Ce champ ne peut être vide.";
      this.setState({errors: this.state.errors});
    } else {
      this.setState({loading: true});
      ListingActionCreators.createEmptyListing(data);
    }


  }

  render() {

    let renderCategory = (category) => {
      let isSelected = category.slug === this.state.selectedCategory ? 'selected' : '';
      return (
        <li key={category.slug}
          onClick={this.selectCategory.bind(this, category.slug)}
          className={isSelected}
        >
        {category.name}
        </li>
      );
    };

    let toggleSelect = (e) => {
      if ($(e.target).is("li,p,span,.select")) {
        $(this.refs.select).toggleClass('open');
      }
    }

    let printSelect = this.state.selectedCategory === null ? "Sélectionnez une catégorie" :
      _.find(this.props.categories, {slug: this.state.selectedCategory}).name;

    return (
      <Modal show={this.props.show}
        onHide={this.props.onHide}
        dialogClassName="popinAddProtocole">

        <Modal.Header closeButton>
          <Modal.Title>Créer un nouveau protocole</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <div className={this.state.errors.name !== '' ? "form-group has-error" : "form-group"}>

            {this.state.errors.name !== '' ? (
              <label className="control-label">{this.state.errors.name}</label>
            ) : ''}

            <input type="text" className="form-control" placeholder={Translator.translate('CHAMP_VIDE')}
              ref="listingName"
              onChange={this.onListingNameChange}
            />
          </div>
          <div className={this.state.errors.category !== '' ? "form-group has-error" : "form-group"}>

            {this.state.errors.category !== '' ? (
              <label className="control-label">{this.state.errors.category}</label>
            ) : ''}

            <div className="select" ref="select" onClick={toggleSelect}>
              <p>{printSelect}</p>
              <span className="icon-angle-down"></span>
              <div className="clear"></div>
              <ul>
                <div className="scroll">
                  {this.props.categories.map(renderCategory, this)}
                </div>
                <div className="addCategorie">
                  <form>
                    <div className="form-group col-lg-9">
                      <input type="text" className="form-control" placeholder="Nouvelle catégorie ?"
                        ref="categoryName"
                        onChange={this.onInputChange} />
                    </div>
                    <div className="form-group col-lg-3">
                      <a className="btnPurple2" onClick={this.createCategory}>Créer</a>
                    </div>
                  </form>
                </div>
              </ul>
            </div>
          </div>
        </Modal.Body>

        <Modal.Footer>
          <a href="#" className="btnPurple2" onClick={this.submit}>Commencer</a>
        </Modal.Footer>
      </Modal>
    );
  }
}

NewProtocolModal.propTypes = {
  categories: PropTypes.array,
  show: PropTypes.bool,
};

export default NewProtocolModal;
