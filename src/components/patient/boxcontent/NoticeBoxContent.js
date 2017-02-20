'use strict';

import React, {Component, PropTypes} from 'react';
import Autolinker from 'autolinker';

const propTypes = {
  item: PropTypes.object.isRequired,
};

class NoticeBoxContent extends Component {
  render() {
    let {itemActivity, item} = this.props;
    let done = itemActivity.done;
    let htmlContent = Autolinker.link(item.text.replace(/(?:\r\n|\r|\n)/g, '<br />'));

    return (
      <div>
      <p dangerouslySetInnerHTML={{__html: htmlContent}} />
      </div>
    );
  }
}

NoticeBoxContent.propTypes = propTypes;

export default NoticeBoxContent;
