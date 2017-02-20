'use strict';

import React, {Component} from 'react';
import {HOC} from 'formsy-react';
import Dropzone from 'react-dropzone';

class FileMDT extends Component {

  constructor(props) {
    super(props);

    this.state = {
      files: this.props.getValue() || []
    };
  }

  changeValue = (files) => {
    this.addFiles(files);

    this.props.setValue(this.state.files);
    this.props.onChange(this.props.name, this.state.files, this.state.files.length);
  }

  addFiles = (files) => {
    for (let file of files) {
      let exists = _.find(this.state.files, (f) => {
        return f.name + f.size === file.name + file.size;
      });
      if (exists === undefined) {
        this.state.files.push(file);
      }
    }
    this.setState({files: this.state.files});
  }

  deleteFile = (file) => {
    _.remove(this.state.files, file);
    this.setState({files: this.state.files});
  }

  render() {

    let renderFile = (file) => {};

    if (this.props.layout && this.props.layout === 'answer') {

      renderFile = (file) => {
        return (
          <div className="col-md-4" key={"fi" + file.lastModified + file.size}>
            <div className="item attachement">
              <span className="icon-close" onClick={this.deleteFile.bind(this, file)}></span>
              {file.preview && file.name.match(/\.(jpg|jpeg|png|gif)$/) ?
                (<img src={file.preview} width="75"/>) :
                (<span className="icon-file"></span>)
              }
              <p>{file.name}</p>
            </div>
          </div>
        );
      };

      return (
        <div className="filesActions">
          <Dropzone
            onDrop={this.changeValue}
            name={this.props.name}
            className="col-md-4"
            >
              <div className="item droppable">
                <p>Glisser un document<br/> ou parcourir</p>
                <span>2M maximum</span>
              </div>
          </Dropzone>

          {_.map(this.state.files, renderFile)}
        </div>
      );
    } else {

      renderFile = (file) => {
        let key = file.slug ? file.slug : file.lastModified + file.size;
        return (
          <li className="attachement" key={key}>
            <span className="icon-close" onClick={this.deleteFile.bind(this, file)}></span>

            {file.preview && file.name.match(/\.(jpg|jpeg|png|gif)$/) ?
              (<img src={file.preview} width="75"/>) :
              (<span className="icon-file"></span>)
            }

            <p>{file.name}</p>
          </li>
        );
      };

      return (
        <ul className="filesActions">

          <li className="droppable">
            <Dropzone
              onDrop={this.changeValue}
              name={this.props.name}
              className="droppable-dropzone"
              activeStyle={{backgroundColor: '#FFEDD0'}}
            >
              <div>Glissez un document<br/>ou<br/>cliquez pour parcourir vos fichiers</div>
            </Dropzone>
          </li>

            {_.map(this.state.files, renderFile)}
        </ul>
      );
    }
  }
};

FileMDT.defaultProps = {
  disabled: false,
  validatePristine: false,
  onChange: function onChange() {},
  onFocus: function onFocus() {},
  onBlur: function onBlur() {},
};

export default HOC(FileMDT);
