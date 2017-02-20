'use strict';

import React, {Component, PropTypes} from 'react';
import Autolinker from 'autolinker';

const propTypes = {
  item: PropTypes.object.isRequired,
};

class TaskBoxContent extends Component {
  render() {
    let {item} = this.props;
    let htmlContent = Autolinker.link(item.text.replace(/(?:\r\n|\r|\n)/g, '<br />'));

    return (
      <div>
        <p dangerouslySetInnerHTML={{__html: htmlContent}} />
      </div>
    );
  }
}

TaskBoxContent.propTypes = propTypes;

export default TaskBoxContent;
