'use strict';

import React, {Component, PropTypes} from 'react';
import Griddle from 'griddle-react';

import OrganizationStore from '../../../stores/organizationStore';
import OrganizationActionCreators from '../../../actions/organizationActionCreators';

import ActionsGridColumn from '../common/ActionsGridColumn';
import DateGridColumn from '../common/DateGridColumn';

class OrganizationGrid extends Component {
  constructor(props) {
    super(props);

    this.state = {
      results: [],
      filter: null
    };

    OrganizationStore.addChangeListener(this._onChange);
  }

  componentDidMount() {
    if (this.props.forceLoad || !OrganizationStore.isInit()) {
      OrganizationActionCreators.organizations;
    } else {
      this.setState({results: OrganizationStore.organizations});
    }
  }

  componentWillUnmount() {
    OrganizationStore.removeChangeListener(this._onChange);
  }

  _onChange = () => {
    this.setState({
      results: OrganizationStore.organizations,
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
        "customComponent": ActionsGridColumn,
        meta: {
            modelUri: 'organizations'
        }
      }
    ];

    return (
      <Griddle
        columnMetadata={columnMeta}
        columns={["id", "name", "created_at", "actions"]}
        results={this.state.results}
        resultsPerPage={this.state.externalResultsPerPage}
        showFilter={true}
      />
    );
  }
}

OrganizationGrid.propTypes = {
    resultsPerPage: PropTypes.number,
    forceLoad: PropTypes.bool
};

export default OrganizationGrid;