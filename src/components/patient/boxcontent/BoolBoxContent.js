'use strict';

import React, {Component, PropTypes} from 'react';
import RadioMDT from '../../common/RadioMDT';
import Autolinker from 'autolinker';

const propTypes = {
  item: PropTypes.object.isRequired,
};

const defaultProps = {
  done: false
};

class BoolBoxContent extends Component {
  render() {
    let {itemActivity, item} = this.props;
    let done = itemActivity.done;
    let htmlContent = Autolinker.link(item.text.replace(/(?:\r\n|\r|\n)/g, '<br />'));

    return (
      <div>
        <p dangerouslySetInnerHTML={{__html: htmlContent}} />
        <RadioMDT layout="timeline"
          name="answerBool"
          options={[
            {label: 'Oui', value: 'true'},
            {label: 'Non', value: 'false'},
          ]}
          value={'' + itemActivity.answer}
          className="form-inline text-center"
          disabled={done}
          required
        />
      </div>
    );
  }
}

BoolBoxContent.propTypes = propTypes;
BoolBoxContent.defaultProps = defaultProps;

export default BoolBoxContent;
