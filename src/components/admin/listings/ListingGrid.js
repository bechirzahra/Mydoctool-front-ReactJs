'use strict';

import React, {Component, PropTypes} from 'react';
import Griddle from 'griddle-react';

import ListingStore from '../../../stores/listingStore';
import ListingActionCreators from '../../../actions/listingActionCreators';

import ListingActionsGridColumn from '../common/ListingActionsGridColumn';
import DateGridColumn from '../common/DateGridColumn';

class ListingGrid extends Component {
  constructor(props) {
    super(props);

    this.state = {
      results: [],
      filter: null
    };

    ListingStore.addChangeListener(this._onChange);
  }

  componentDidMount() {
    this.setState({results: ListingStore.listings});
  }

  componentWillUnmount() {
    ListingStore.removeChangeListener(this._onChange);
  }

  _onChange = () => {
    this.setState({
      results: ListingStore.listings,
    });
  }

  render() {

    var columnMeta = [
      {
        "columnName": "id",
        "order": 1,
        "locked": false,
        "visible": true,
        "displayName": "Id"
      },
      {
        "columnName": "name",
        "order": 2,
        "locked": false,
        "visible": true,
        "displayName": "Nom"
      },
      {
        "columnName": "created_at",
        "order": 4,
        "locked": false,
        "visible": true,
        "displayName": "CreatedAt",
        "customComponent": DateGridColumn
      },
      {
        "columnName": "actions",
        "order": 5,
        "locked": true,
        "visible": true,
        "displayName": "Actions",
        "customComponent": ListingActionsGridColumn,
        meta: {
            modelUri: 'listings'
        }
      }
    ];

    return (
      <Griddle
        columnMetadata={columnMeta}
        columns={["id", "name", "created_at", "actions"]}
        results={this.state.results}
        resultsPerPage={this.props.resultsPerPage}
        showFilter={true}
      />
    );
  }
}

ListingGrid.propTypes = {
    resultsPerPage: PropTypes.number,
    forceLoad: PropTypes.bool
};

export default ListingGrid;