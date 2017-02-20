'use strict';

import React, {Component, PropTypes} from 'react';
import {HOC} from 'formsy-react';

const propTypes = {
  options: PropTypes.array.isRequired,
  className: PropTypes.string,
};

const defaultProps = {
  disabled: false,
  validatePristine: false,
  onChange: function onChange() {},
  onFocus: function onFocus() {},
  onBlur: function onBlur() {},
  className: ''
};

class SelectMDT extends Component {

  changeValue = (event) => {
    var target = event.currentTarget;
    var value;
    if (this.props.multiple) {
      value = [];
      for (var i = 0; i < target.length; i++) {
        var option = target.options[i];
        if (option.selected) {
          value.push(option.value);
        }
      }
    } else {
      value = target.value;
    }
    this.props.setValue(value);
    this.props.onChange(this.props.name, value);
  }

  render() {
    let renderOption = ({label, value}) => {
      return (
        <option key={value} value={value}>{label}</option>
      );
    };

    let rootClassName = `group-select-custom ${this.props.className}`;
    let isDisabled = this.props.disabled ? true : false;
    return (
      <div className={rootClassName}>
        <select className="browser-default"
          onChange={this.changeValue}
          value={this.props.getValue()}
          disabled={isDisabled}
          required={this.props.required ? this.props.required : false}
        >
          {
            () => {
              if (this.props.placeholder && this.props.placeholder !== '') {
                return (<option value="">{this.props.placeholder}</option>)
              }
            }()
          }

          {this.props.options.map(renderOption, this)}
        </select>
      </div>
    );
  }
};

SelectMDT.propTypes = propTypes;
SelectMDT.defaultProps = defaultProps;

export default HOC(SelectMDT);