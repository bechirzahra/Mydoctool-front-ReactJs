"use strict";

import React, {Component} from 'react';
import Spinner from 'react-spinjs';

var loaderStyle = {
  width: 100 + '%',
  height: 100 + '%',
  backgroundColor: 'white',
  position: 'absolute',
  top: 0,
  left: 0,
  zIndex: 999
};

var loaderStyleBis = {
  position: 'relative',
  top: 0,
  left: 0,
  zIndex: 999,
  height: 100,
};

export default class Loader extends Component {
  render() {
    var opts = {
        lines: 9 // The number of lines to draw
      , length: 24 // The length of each line
      , width: 12 // The line thickness
      , radius: 32 // The radius of the inner circle
      , scale: 0.25 // Scales overall size of the spinner
      , corners: 1 // Corner roundness (0..1)
      , color: '#000' // #rgb or #rrggbb or array of colors
      , opacity: 0.25 // Opacity of the lines
      , rotate: 30 // The rotation offset
      , direction: 1 // 1: clockwise, -1: counterclockwise
      , speed: 1.4 // Rounds per second
      , trail: 60 // Afterglow percentage
      , fps: 20 // Frames per second when using setTimeout() as a fallback for CSS
      , zIndex: 2e9 // The z-index (defaults to 2000000000)
      , className: 'spinner' // The CSS class to assign to the spinner
      , top: '50%' // Top position relative to parent
      , left: '50%' // Left position relative to parent
      , shadow: false // Whether to render a shadow
      , hwaccel: false // Whether to use hardware acceleration
      , position: 'absolute' // Element positioning
    };

    if (this.props.type && this.props.type === 'inline') {
      return (
        <div style={loaderStyleBis}>
          <Spinner config={opts} />
        </div>
      );
    }

    return (
      <div style={loaderStyle}><Spinner config={opts} /></div>
    );
  }
}