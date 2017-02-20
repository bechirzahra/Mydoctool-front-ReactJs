  "use strict";

import React, {Component} from 'react';

import AdminTitle from '../common/AdminTitle';
import OrganizationActionCreators from '../../../actions/organizationActionCreators';
import OrganizationStore from '../../../stores/organizationStore';
import OrganizationTemplate from './OrganizationTemplate';

export default class OrganizationPage extends Component {

  constructor(props) {
    super(props);

    this.state = {
      loading: true,
      organization: null
    };
  }

  componentDidMount() {
    var currentOrganization = OrganizationStore.findBySlug(this.props.params.slug);

    if (currentOrganization) {
      this.setState({organization: currentOrganization});
    } else {
      OrganizationActionCreators.getOrganization(this.props.params.slug);
    }

    OrganizationStore.addChangeListener(this._onChange);
  }

  componentWillUnmount() {
    OrganizationStore.removeChangeListener(this._onChange);
  }

  _onChange = () => {
    this.setState({organization: OrganizationStore.getCurrentOrganization()});
  }

  deleteOrganization = () => {
    OrganizationActionCreators.deleteOrganization(this.props.params.slug);
  }

  render() {
    return (
      <div>
        <AdminTitle title="Fiche Organisation" />

        <div className="row">
          <div className="col-lg-12">
          {this.state.organization !== null ?
            <OrganizationTemplate organization={this.state.organization}
            deleteOrganization={this.deleteOrganization} />
            : "Fetching data..."
          }
          </div>
        </div>
      </div>
      );
  }
}