'use strict';

import React, {Component, PropTypes} from 'react';
import Griddle from 'griddle-react';

import InviteStore from '../../../stores/inviteStore';
import InviteActionCreators from '../../../actions/inviteActionCreators';

import ActionsGridColumn from '../common/ActionsGridColumn';
import DateGridColumn from '../common/DateGridColumn';
import BoolGridColumn from '../common/BoolGridColumn';

class InviteGrid extends Component {
  constructor(props) {
    super(props);

    this.state = {
      results: [],
      filter: null
    };

    InviteStore.addChangeListener(this._onChange);
  }

  componentDidMount() {
    if (this.props.invites && this.props.invites !== null) {
      this.setState({results: this.props.invites});
    } else {
      if (this.props.forceLoad || !InviteStore.isInit()) {
        InviteActionCreators.invites;
      } else {
        this.setState({results: InviteStore.invites});
      }
    }
  }

  componentWillUnmount() {
    InviteStore.removeChangeListener(this._onChange);
  }

  _onChange = () => {
    this.setState({
      results: InviteStore.invites,
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
        "columnName": "to_email",
        "order": 2,
        "locked": false,
        "visible": true,
        "displayName": "Email"
      },
      {
        "columnName": "accepted",
        "order": 3,
        "locked": false,
        "visible": true,
        "displayName": "Accepté ?",
        "customComponent": BoolGridColumn
      },
      {
        "columnName": "printable_type",
        "order": 4,
        "locked": false,
        "visible": true,
        "displayName": "Type Invitation"
      },
      {
        "columnName": "created_at",
        "order": 5,
        "locked": false,
        "visible": true,
        "displayName": "CreatedAt",
        "customComponent": DateGridColumn
      },
      {
        "columnName": "actions",
        "order": 6,
        "locked": true,
        "visible": true,
        "displayName": "Actions",
        "customComponent": ActionsGridColumn,
        meta: {
            modelUri: 'invites'
        }
      }
    ];

    return (
      <Griddle
        columnMetadata={columnMeta}
        columns={["id", "to_email", "accepted", "printable_type", "created_at", "actions"]}
        results={this.state.results}
        resultsPerPage={this.state.externalResultsPerPage}
        showFilter={true}
      />
    );
  }
}

InviteGrid.propTypes = {
    resultsPerPage: PropTypes.number,
    forceLoad: PropTypes.bool
};

export default InviteGrid;