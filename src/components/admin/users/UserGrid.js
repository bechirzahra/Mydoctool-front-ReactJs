'use strict';

import React, {Component, PropTypes} from 'react';
import Griddle from 'griddle-react';

import UserStore from '../../../stores/userStore';
import UserActionCreators from '../../../actions/userActionCreators';

import ActionsGridColumn from '../common/ActionsGridColumn';
import DateGridColumn from '../common/DateGridColumn';
import UserTypeColumn from '../common/UserTypeColumn';

class UserGrid extends Component {
  constructor(props) {
    super(props);

    this.state = {
      results: [],
      filter: null
    };

    UserStore.addChangeListener(this._onChange);
  }

  componentDidMount() {
    if (this.props.users && this.props.users !== null) {
      this.setState({results: this.props.users});
    } else {
      if (this.props.forceLoad || !UserStore.isInit()) {
        UserActionCreators.users;
      } else {
        this.setState({results: UserStore.users});
      }
    }
  }

  componentWillUnmount() {
    UserStore.removeChangeListener(this._onChange);
  }

  _onChange = () => {
    this.setState({
      results: UserStore.users,
    });
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.users && nextProps.users !== null) {
      this.setState({
        results: nextProps.users
      });
    }
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
        "columnName": "printable_name",
        "order": 2,
        "locked": false,
        "visible": true,
        "displayName": "Nom"
      },
      {
        "columnName": "email",
        "order": 3,
        "locked": false,
        "visible": true,
        "displayName": "Email"
      },
      {
        "columnName": "type",
        "order": 4,
        "locked": false,
        "visible": true,
        "displayName": "Type",
        "customComponent": UserTypeColumn
      },
      {
        "columnName": "organization_name",
        "order": 5,
        "locked": false,
        "visible": true,
        "displayName": "Organization"
      },
      {
        "columnName": "last_login",
        "order": 6,
        "locked": false,
        "visible": true,
        "displayName": "Dernière connexion",
        "customComponent": DateGridColumn
      },
      {
        "columnName": "actions",
        "order": 7,
        "locked": true,
        "visible": true,
        "displayName": "Actions",
        "customComponent": ActionsGridColumn,
        meta: {
            modelUri: 'users'
        }
      }
    ];

    return (
      <Griddle
        columnMetadata={columnMeta}
        columns={["id", "printable_name", "email", "type", "organization_name", "last_login", "actions"]}
        results={this.state.results}
        resultsPerPage={this.props.resultsPerPage}
        showFilter={true}
      />
    );
  }
}

UserGrid.propTypes = {
    resultsPerPage: PropTypes.number,
    forceLoad: PropTypes.bool
};

export default UserGrid;