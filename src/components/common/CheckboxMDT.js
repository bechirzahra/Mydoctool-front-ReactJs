'use strict';

import React, {Component} from 'react';
import {HOC} from 'formsy-react';

class CheckboxMDT extends Component {

  changeValue = (event) => {
    var target = event.currentTarget;
    this.props.setValue(target.checked);
    this.props.onChange(this.props.name, target.checked);
  }

  render() {

    let wrapperClassName = this.props.wrapper ? 'wrapperCheckbox' : '';
    let cN = this.props.className ? this.props.className : '';

    let label = this.props.label || '';
    let fullLabel = '';
    if (this.props.labelHtml) {
      label = {__html: this.props.labelHtml};
      fullLabel = (<label htmlFor={this.props.id || this.props.name} dangerouslySetInnerHTML={label} />);
    } else {
      fullLabel = (<label htmlFor={this.props.id || this.props.name}>{label}</label>);
    }


    return (
      <div className={"checkbox " + wrapperClassName + ' ' + cN}>
        <input
          type="checkbox"
          name={this.props.name}
          id={this.props.id || this.props.name}
          value={this.props.getValue()}
          onChange={this.changeValue}
          checked={this.props.getValue() === true}
          disabled={this.props.disabled}
          required={this.props.required}
        />
        {fullLabel}
      </div>
    );
  }
};

CheckboxMDT.defaultProps = {
  disabled: false,
  required: false,
  validatePristine: false,
  onChange: function onChange() {},
  onFocus: function onFocus() {},
  onBlur: function onBlur() {},
};

export default HOC(CheckboxMDT);