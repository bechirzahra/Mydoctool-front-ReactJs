  "use strict";

import React, {Component} from 'react';

import AdminTitle from '../common/AdminTitle';
import UserActionCreators from '../../../actions/userActionCreators';
import UserStore from '../../../stores/userStore';
import UserTemplate from './UserTemplate';

export default class UserPage extends Component {

  constructor(props) {
    super(props);

    this.state = {
      loading: true,
      user: null
    };
  }

  componentDidMount() {
    var currentUser = UserStore.findById(this.props.params.id);

    if (currentUser) {
      this.setState({user: currentUser});
    } else {
      UserActionCreators.getUser(this.props.params.id);
    }

    UserStore.addChangeListener(this._onChange);
  }

  componentWillUnmount() {
    UserStore.removeChangeListener(this._onChange);
  }

  componentWillReceiveProps(nextProps) {
    this.setState({user: UserStore.findById(nextProps.params.id)});
  }

  _onChange = () => {
    this.setState({user: UserStore.getCurrentUser()});
  }

  deleteUser = () => {
    UserActionCreators.deleteUser(this.props.params.id);
  }

  render() {
    return (
      <div>
        <AdminTitle title="Fiche Utilisateur" />

        <div className="row">
          <div className="col-lg-12">
          {this.state.user !== null ?
            <UserTemplate user={this.state.user}
            deleteUser={this.deleteUser} />
            : "Fetching data..."
          }
          </div>
        </div>
      </div>
      );
  }
}