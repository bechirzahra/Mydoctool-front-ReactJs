'use strict';

import React, {Component} from 'react';
import {HOC} from 'formsy-react';
import Dropzone from 'react-dropzone';

class SimpleFileMDT extends Component {

  constructor(props) {
    super(props);

    this.state = {
      file: this.props.getValue() || null
    };
  }

  changeValue = (e) => {
    this.addFiles(e);

    this.props.setValue(e.target.value);
    this.props.onChange(this.props.name, this.state.file);
  }

  addFiles = (e) => {
    this.state.file = e.target.files[0];
    this.setState({files: this.state.file});
  }

  render() {

    let renderFile = (file) => {
      return (
        <div key={"fi" + file.lastModified + file.size}>
          {file.name.match(/\.(jpg|jpeg|png|gif)$/) ?
            (<img src={window.URL.createObjectURL(file)} width="75"/>) : ''
          }
        </div>
      );
    };

    return (
      <div className="form-group">
        <label>{this.props.label}</label>
        <input
          type="file"
          name={this.props.name}
          className="form-control"
          value={this.props.getValue()}
          onChange={this.changeValue}
          style={{fontSize: '14px', lineHeight: '14px', padding: '12px'}}
        />
      </div>
    );

  }
};

SimpleFileMDT.defaultProps = {
  disabled: false,
  validatePristine: false,
  onChange: function onChange() {},
  onFocus: function onFocus() {},
  onBlur: function onBlur() {},
};

export default HOC(SimpleFileMDT);