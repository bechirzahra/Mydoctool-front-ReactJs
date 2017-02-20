'use strict';

import React, {Component, PropTypes} from 'react';
import ItemStore from '../../../stores/itemStore';

class SearchInput extends Component {

  search() {
    var ret = null;
    if (this.refs.search.value.trim() !== '') {
      ret = _.filter(this.props.collection, (item) => {
        let regexp = new RegExp(this.refs.search.value, "gi");
        return (item[this.props.attribute].match(regexp) !== null);
      });
    }

    this.props.onSearchResult(ret);
  }

  searchItemActivityListings() {
    var ret = null;
    if (this.refs.search.value.trim() !== '') {
      ret = _.filter(this.props.collection, (itemActivity) => {
        let item = ItemStore.findBySlug(itemActivity.item_slug);
        let regexp = new RegExp(this.refs.search.value, "gi");
        return (item[this.props.attribute].match(regexp) !== null);
      });
    }

    this.props.onSearchResult(ret);
  }

  render() {
    // console.log(this.props.collection);
    let cN = this.props.className ? `search ${this.props.className}` : 'search';

    return (
      <div className={cN}>
        <div className="group-input-custom">
          <input type="text"
            ref="search"
            onChange={
              this.props.type === 'itemActivity' ?
              this.searchItemActivityListings.bind(this) :
              this.search.bind(this)
            }
            required
          />
          <span className="highlight"></span>
          <span className="bar"></span>
          <label>Rechercher ...</label>
          <span className="iconRight icon-search"></span>
        </div>
      </div>
    );
  }
}

SearchInput.propTypes = {
  collection: PropTypes.array.isRequired,
  attribute: PropTypes.string.isRequired,
  onSearchResult: PropTypes.func.isRequired,
  className: PropTypes.string
};

export default SearchInput;