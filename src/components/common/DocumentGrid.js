'use strict';

import React, {Component, PropTypes} from 'react';
import _ from 'lodash';
import {CONFIG} from '../../constants/parameters';
import { ReactRpg } from 'react-rpg';

const propTypes = {
  documents: PropTypes.array.isRequired
};


class DocumentGrid extends Component {

  constructor(props) {
    super(props);

    let images = [];
    let others = [];

    this.props.documents.forEach((doc) => {

      if (doc.extension.match(/(jpg|jpeg|png|gif)/)) {
        doc.url = CONFIG.UPLOAD_ROOT + doc.full_path;
        doc.link = CONFIG.UPLOAD_ROOT + doc.full_path;
        images.push(doc);
      } else {
        doc.path = CONFIG.UPLOAD_ROOT + doc.full_path;
        others.push(doc);
      }
    });

    this.state = {
      files: others,
      images: images,
      imagesToShow: []
    };
  }

  render() {
    let renderFile = (doc) => {
      const path = `${CONFIG.UPLOAD_ROOT}${doc.full_path}`;

      return (
        <li key={doc.slug}>
          <a href={path} target="_blank">
            <span className="icon icon-file"></span> <p>{doc.printable_name}</p>
          </a>
        </li>
      );
    };

    return (
      <div>
        <ul className="filesDownload">
          {_.map(this.state.files, renderFile)}
        </ul>

        <ReactRpg
          imagesArray={this.state.images}
          columns={4}
          padding={5}
        />
      </div>
    );
  }
}

DocumentGrid.propTypes = propTypes;

export default DocumentGrid;
