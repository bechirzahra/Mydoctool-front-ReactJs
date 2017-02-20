'use strict';

import React, {Component} from 'react';
import {HOC} from 'formsy-react';

class ToggleMDT extends Component {

  changeValue = (event) => {
    var target = event.currentTarget;
    this.props.setValue(target.checked);
    this.props.onChange(this.props.name, target.checked);
  }

  render() {
    return (
      <div>
        <p>{this.props.label}</p>
        <label>
          <input
            name={this.props.name}
            type="checkbox"
            value={this.props.getValue()}
            checked={this.props.getValue()}
            onChange={this.changeValue}
            className="ios-switch purple bigswitch"
          />
            <div><div></div></div>
        </label>
      </div>
    );
  }
};

ToggleMDT.defaultProps = {
  disabled: false,
  validatePristine: false,
  onChange: function onChange() {},
  onFocus: function onFocus() {},
  onBlur: function onBlur() {}
};

export default HOC(ToggleMDT);