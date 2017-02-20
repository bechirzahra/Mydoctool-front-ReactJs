'use strict';

import React, {Component} from 'react';
import {HOC} from 'formsy-react';
import utils from '../../services/utils';

class RadioMDT extends Component {

  changeValue = (event) => {
    var value = event.currentTarget.value;
    this.props.setValue(value);
    this.props.onChange(this.props.name, value);
  }

  render() {

    let renderRadio = (option) => {
      let uid = utils.generateUid();
      var checked = (this.props.getValue() == option.value);

      let wrapperClassName = this.props.wrapper ? 'wrapperCheckbox' : '';

      if (this.props.layout === 'newLine') {
        return (
          <div className="form-group displayBlock" key={uid}>
            <div className="radio">
              <input
                type="radio"
                name={this.props.name}
                value={option.value}
                id={uid}
                checked={checked}
                onChange={this.changeValue}
                disabled={this.props.disabled}
              />
              <label htmlFor={uid}>{option.label}</label>
            </div>
          </div>
        );
      } else if (this.props.layout === 'wrapper') {

        return (
          <div className="radio wrapperCheckbox" key={uid}>
              <input
                type="radio"
                name={this.props.name}
                value={option.value}
                id={uid}
                checked={checked}
                onChange={this.changeValue}
                disabled={this.props.disabled}
              />
              <label htmlFor={uid}>{option.label}</label>
          </div>
        );

      } else if (this.props.layout === 'timeline' || this.props.layout === 'invite') {
        return (
          <div className="radio" key={uid}>
            <input
              type="radio"
              name={this.props.name}
              value={option.value}
              id={uid}
              checked={checked}
              onChange={this.changeValue}
              disabled={this.props.disabled}
            />
            <label htmlFor={uid}>{option.label}</label>
          </div>
        );

      } else {
        return (
          <div key={uid}>
            <input
              type="radio"
              name={this.props.name}
              value={option.value}
              id={uid}
              checked={checked}
              onChange={this.changeValue}
              disabled={this.props.disabled}
            />
            <label htmlFor={uid}>{option.label}</label>
          </div>
        );
      }
    };

    if (this.props.layout === 'newLine' || this.props.layout === 'timeline') {
      return (
        <div className={this.props.className || ''}>
        {this.props.label ? (
          <label>{this.props.label}</label>
        ) : ''}
          {this.props.options.map(renderRadio, this)}
        </div>
      );
    } else if (this.props.layout === 'invite') {
      return (
        <div className={this.props.className || ''}>
        {this.props.label ? (
          <label className={this.props.labelClassName || ''}>{this.props.label}</label>
        ) : ''}
          <div className="col-lg-8 inline-radio">
            {this.props.options.map(renderRadio, this)}
          </div>
        </div>
      );
    } else {
      return (
        <div className="form-group">
          {this.props.options.map(renderRadio, this)}
        </div>
      );
    }
  }
};

RadioMDT.defaultProps = {
  disabled: false,
  validatePristine: false,
  onChange: function onChange() {},
  onFocus: function onFocus() {},
  onBlur: function onBlur() {},
};

export default HOC(RadioMDT);