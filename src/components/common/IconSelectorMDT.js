'use strict';

import React, {Component, PropTypes} from 'react';
import {HOC} from 'formsy-react';

const propTypes = {
  icons: PropTypes.array.isRequired,
};

const defaultProps = {
  disabled: false,
  validatePristine: false,
  onChange: function onChange() {},
  onFocus: function onFocus() {},
  onBlur: function onBlur() {},
};

class IconSelectorMDT extends Component {

  changeValue = (icon) => {
    this.props.setValue(icon);
    this.props.onChange(this.props.name, icon);
  }

  render() {

    let renderIcon = (icon, k) => {
      let activeClassName = this.props.getValue() === icon ? 'active' : '';
      return (
        <li key={icon + k}
          className={activeClassName}
          onClick={this.changeValue.bind(this, icon)}
        >
          <span className={`icon ${icon}`}></span>
        </li>
      );
    };

    return (
      <div className="iconTypes">
        <label>{this.props.label}</label>
        <ul>
          {this.props.icons.map(renderIcon, this)}
        </ul>
      </div>
    );
  }
};

IconSelectorMDT.propTypes = propTypes;
IconSelectorMDT.defaultProps = defaultProps;

export default HOC(IconSelectorMDT);