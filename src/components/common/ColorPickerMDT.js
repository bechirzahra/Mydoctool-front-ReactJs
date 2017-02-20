'use strict';

import React, {Component} from 'react';
import {HOC} from 'formsy-react';

class ColorPickerMDT extends Component {

  componentDidMount() {
    $(this.refs.picker).click((e) => {
      e.preventDefault();

      if (!$(e.target).is("li, ul")) {
        $(this.refs.pickerUl).toggle();
      }
    });

    $(this.refs.pickerUl).find('li').click((e) => {
      e.preventDefault();

      let color = $(e.target).css('backgroundColor');
      color = this.rgb2hex(color);

      this.props.setValue(color);

      $(this.refs.pickerUl).toggle();
    });
  }

  rgb2hex(rgb) {
    if (/^#[0-9A-F]{6}$/i.test(rgb)) return rgb;

    rgb = rgb.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
    let hex = (x) => {
      return ("0" + parseInt(x).toString(16)).slice(-2);
    }
    return "#" + hex(rgb[1]) + hex(rgb[2]) + hex(rgb[3]);
  }

  changeValue = (event) => {
    var target = event.currentTarget;
    var value = target.value;

    this.props.setValue(value);
    this.props.onChange(this.props.name, value);
  }

  render() {

    return (
      <a ref="picker" href="#" className="color" style={{backgroundColor: this.props.getValue()}}>
         <ul ref="pickerUl">
          <li className="red"></li>
          <li className="orange"></li>
          <li className="yellow"></li>
          <li className="green"></li>
          <li className="blue"></li>
          <li className="purple"></li>
          <li className="pink"></li>
          <li className="grey"></li>
        </ul>
        <input ref="pickerInput"
          type="hidden"
          name={this.props.name}
          value={this.props.getValue()}
          required={this.props.required ? this.props.required : false}
        />
      </a>
    );
  }
};

ColorPickerMDT.defaultProps = {
  disabled: false,
  validatePristine: false,
  onChange: function onChange() {},
  onFocus: function onFocus() {},
  onBlur: function onBlur() {},
};

export default HOC(ColorPickerMDT);