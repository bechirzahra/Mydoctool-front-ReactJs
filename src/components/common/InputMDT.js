'use strict';

import React, {Component} from 'react';
import {HOC} from 'formsy-react';

class InputMDT extends Component {

  componentDidMount() {
    if (this.props.resize) {
      this.resizeInputTitleProtocol($('#' + this.props.id)[0], this.props.getValue());
    }
  }

  changeValue = (event) => {
    var target = event.currentTarget;
    var value = target.value;

    this.props.setValue(value);
    this.props.onChange(this.props.name, value);

    if (this.props.resize) {
      this.resizeInputTitleProtocol(target, value);
    }
  }

  resizeInputTitleProtocol = (target, value) => {
    if (value.length >= 60) {
      return;
    }
    let newWidth = (130 + value.length*10) + 'px';
    $(target).parents('.group-input-custom').css('width', newWidth);
  }

  render() {
    let layout = this.props.layout ? this.props.layout : null;
    let type = this.props.type || 'text';

    let otherProps = {};
    if (this.props.id !== null) {
      otherProps.id = this.props.id;
    }

    if (layout && layout === 'elementOnly') {
      return (
        <div style={{display: 'inline-block'}}>
          <input
            ref="myinput"
            type="text"
            name={this.props.name}
            className="form-control"
            placeholder={this.props.placeholder}
            value={this.props.getValue()}
            onChange={this.changeValue}
            required={this.props.required}
            {...otherProps}
          />
          <span className="highlight"></span>
          <span className="bar"></span>
        </div>
      );
    } else if (layout && layout === 'simple') {
      return (
        <input
          type={type}
          name={this.props.name}
          placeholder={this.props.placeholder}
          value={this.props.getValue()}
          onChange={this.changeValue}
          required={this.props.required}
          className={this.props.className || ''}
          {...otherProps}
        />
      );
    } else if (layout && layout === 'timeline') {
      let cN = 'form-control ' + this.props.className;
      return (
        <div className="form-group">
          <input
            type={this.props.type || "text"}
            name={this.props.name}
            className={cN}
            placeholder={this.props.placeholder}
            value={this.props.getValue()}
            onChange={this.changeValue}
            required={this.props.required}
            disabled={this.props.disabled}
            {...otherProps}
          />
          {this.props.label && this.props.label !== '' ? (
            <label>{this.props.label}</label>
          ) : ''}
        </div>
      );
    } else if (layout && layout === 'account') {

      let label = '';
      let fullLabel = '';
      if (this.props.labelHtml) {
        label = {__html: this.props.labelHtml};
        fullLabel = (<label dangerouslySetInnerHTML={label} />);
      } else {
        fullLabel = (<label>{this.props.label}</label>);
      }

      return (
        <div className="form-group">
          {fullLabel}
          <input
            type={this.props.type || "text"}
            name={this.props.name}
            className="form-control"
            placeholder={this.props.placeholder}
            value={this.props.getValue()}
            onChange={this.changeValue}
            required={this.props.required}
            {...otherProps}
          />
        </div>
      );
    } else if (layout && layout === 'invite') {
      let label = this.props.required ? `${this.props.label}*` : this.props.label;
      return (
        <div className="form-group">
          <label className="col-lg-4" htmlFor={this.props.name}>
            {label}
          </label>
          <div className="col-lg-8">
            <input
              type={this.props.type || "text"}
              name={this.props.name}
              id={this.props.name}
              className="form-control"
              placeholder={this.props.placeholder}
              value={this.props.getValue()}
              onChange={this.changeValue}
              required={this.props.required}
              {...otherProps}
            />
          </div>
        </div>
      );
    } else if (layout && layout === 'auth') {
      let cssClasses = '', errorMessage = '';
      if (!this.props.isPristine() && this.props.getValue().trim() !== '' && !this.props.isValid()) {
        cssClasses += ' has-error';
        errorMessage = this.props.getErrorMessage();
      }

      return (
        <div className="form-group">
          <div className={this.props.className + cssClasses}>
            <input
              type={this.props.type || "text"}
              name={this.props.name}
              id={this.props.name}
              className="form-control"
              placeholder={this.props.placeholder}
              value={this.props.getValue()}
              onChange={this.changeValue}
              required={this.props.required}
              {...otherProps}
            />
            {errorMessage !== '' ? (
              <span className="help-block validation-message">{errorMessage}</span>
            ) : ''}
          </div>
        </div>
      );

    } else {
      return (
        <div className="group-input-custom">
          <input
            type={this.props.type || "text"}
            name={this.props.name}
            className="form-control"
            placeholder={this.props.placeholder}
            value={this.props.getValue()}
            onChange={this.changeValue}
            required={this.props.required}
            {...otherProps}
          />
          <span className="highlight"></span>
          <span className="bar"></span>
          <label>{this.props.label}</label>
        </div>
      );
    }
  }
};

InputMDT.defaultProps = {
  disabled: false,
  validatePristine: false,
  onChange: function onChange() {},
  onFocus: function onFocus() {},
  onBlur: function onBlur() {},
};

export default HOC(InputMDT);