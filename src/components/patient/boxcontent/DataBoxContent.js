'use strict';

import React, {Component, PropTypes} from 'react';
import InputMDT from '../../common/InputMDT';
import utils from '../../../services/utils';
import Autolinker from 'autolinker';

const propTypes = {
  item: PropTypes.object.isRequired,
  done: PropTypes.bool
};

class DataBoxContent extends Component {
  render() {
    let {itemActivity, item} = this.props;
    let done = itemActivity.done;
    let htmlContent = Autolinker.link(item.text.replace(/(?:\r\n|\r|\n)/g, '<br />'));
    return (
      <div>

        {done ? (
          <div className="form-group">
            <label>{itemActivity.answer} {utils.capitalizeFirstLetter(item.unit)}</label>
          </div>
        ) : (

        <div>
          <p dangerouslySetInnerHTML={{__html: htmlContent}} />
          <InputMDT
            name="answerInt"
            layout="timeline"
            className="tiny"
            value=""
            label={utils.capitalizeFirstLetter(item.unit)}
            placeholder="Saisissez la valeur"
            required
          />
        </div>
        )}

      </div>
    );
  }
}

DataBoxContent.propTypes = propTypes;

export default DataBoxContent;
