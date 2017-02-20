'use strict';

import React, {Component} from 'react';
import {HOC} from 'formsy-react';

class TextareaMDT extends Component {

  changeValue = (event) => {
    var target = event.currentTarget;
    var value = target.value;

    this.props.setValue(value);
    this.props.onChange(this.props.name, value);
  }

  render() {

    return (
      <textarea
        name={this.props.name}
        className="form-control"
        rows={this.props.rows}
        placeholder={this.props.placeholder}
        value={this.props.getValue()}
        onChange={this.changeValue}
        >
      </textarea>
    );
  }
};

TextareaMDT.defaultProps = {
  disabled: false,
  validatePristine: false,
  onChange: function onChange() {},
  onFocus: function onFocus() {},
  onBlur: function onBlur() {},
  rows: 2
};

export default HOC(TextareaMDT);