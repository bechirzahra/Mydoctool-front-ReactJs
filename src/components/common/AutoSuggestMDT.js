'use strict';

import React, {Component} from 'react';
import {HOC} from 'formsy-react';
import Autosuggest from 'react-autosuggest';
import UserStore from '../../stores/userStore';

class AutoSuggestMDT extends Component {

  onSuggestionSelected = (suggestion, event) => {
    event.preventDefault();
    this.props.setValue(suggestion.printable_name);
    this.props.onSuggestionSelected(suggestion);
  }

  render() {
    const inputAttributes = {
      id: this.props.id || '',
      name: this.props.name || '',
      className: 'form-control',
      placeholder: this.props.placeholder || ''
    };

    // console.log(this.props.suggestions);

    return (
      <div className="form-group">
        <Autosuggest
          suggestions={this.props.suggestions}
          suggestionRenderer={this.props.suggestionRenderer}
          suggestionValue={this.props.suggestionValue}
          onSuggestionSelected={this.onSuggestionSelected}
          inputAttributes={inputAttributes}
          value={this.props.defaultValue}
        />
      </div>
    );
  }
};

AutoSuggestMDT.defaultProps = {
  disabled: false,
  validatePristine: false,
  onChange: function onChange() {},
  onFocus: function onFocus() {},
  onBlur: function onBlur() {},
};

AutoSuggestMDT.propTypes = {
};

export default HOC(AutoSuggestMDT);