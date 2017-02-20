'use strict';

import React, {Component} from 'react';
import {HOC} from 'formsy-react';
import IconRating from 'react-icon-rating';

class LevelMDT extends Component {

  changeValue = (number) => {
    this.props.setValue(number);
    this.props.onChange(this.props.name, number);
  }

  render() {

    const toggledClassName = this.props.icon + ' rating-symbol-foreground';
    const untoggledClassName = this.props.icon + ' rating-symbol-background';
    return (
      <IconRating
        toggledClassName={toggledClassName}
        untoggledClassName={untoggledClassName}
        min={this.props.min}
        max={this.props.max}
        onChange={this.changeValue}
        className='no-margin no-padding rating-symbol'
      />
    );
  }
};

LevelMDT.defaultProps = {
  disabled: false,
  validatePristine: false,
  onChange: function onChange() {},
  onFocus: function onFocus() {},
  onBlur: function onBlur() {},
};

export default HOC(LevelMDT);