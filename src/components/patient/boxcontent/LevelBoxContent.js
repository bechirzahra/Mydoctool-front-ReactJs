'use strict';

import React, {Component, PropTypes} from 'react';
import LevelMDT from '../../common/LevelMDT';
import Autolinker from 'autolinker';

const propTypes = {
  item: PropTypes.object.isRequired,
};

const defaultProps = {
  done: false
};

class LevelBoxContent extends Component {

  render() {
    let {itemActivity, item} = this.props;
    let done = itemActivity.done;
    let htmlContent = Autolinker.link(item.text.replace(/(?:\r\n|\r|\n)/g, '<br />'));

    return (
      <div className="form-group">

        {done ? (
          <p>Niveau {itemActivity.answer} sur un total de {item.max}</p>
        ) : (
          <div>
            <p dangerouslySetInnerHTML={{__html: htmlContent}} />
            <LevelMDT
              name="answerInt"
              value={itemActivity.answer}
              min={item.min}
              max={item.max}
              icon={item.icon}
            />
          </div>
        )}

      </div>
    );
  }
}

LevelBoxContent.propTypes = propTypes;
LevelBoxContent.defaultProps = defaultProps;

export default LevelBoxContent;
