// "use strict";

import jQuery from 'jquery';
import 'bootstrap';
import 'bootstrap.css';
import 'toastr.css';

import React, {Component} from 'react';
import Helmet from 'react-helmet';

import faviconApple from '../assets/images/favicons/apple-touch-icon-152x152.png';
import faviconMs from '../assets/images/favicons/mstile-144x144.png';
import favicon from '../assets/images/favicons/favicon-96x96.png';

/**
* This is the start of the App
* We initialize the favicons and title of the App and render any children
*/
export default class App extends Component {
  render() {
    return (
      <div className="full-size">
        <Helmet
          titleTemplate="MyDocTool - %s"
          link={[
            {"rel": "apple-touch-icon-precomposed", "href": faviconApple},
            {"rel": "icon", "sizes": "96x96", "href": favicon}
          ]}
          meta={[
            {"name": "msapplication-TileColor", "content": '#775680'},
            {"name": "msapplication-TileColor", "content": faviconMs}
          ]}
        />
        {this.props.children}
      </div>
    );
  }
}