'use strict';

import React, {Component, PropTypes} from 'react';
import CheckboxMDT from '../../common/CheckboxMDT';
import Autolinker from 'autolinker';

const propTypes = {
  item: PropTypes.object.isRequired,
};

class SelectBoxContent extends Component {

  render() {
    let {itemActivity, item} = this.props;
    let done = itemActivity.done;
    let htmlContent = Autolinker.link(item.text.replace(/(?:\r\n|\r|\n)/g, '<br />'));

    let renderOption = (option) => {
      let name = `answerSelect[${option.value}]`;
      // console.log(option.label, option.value);
      return (
        <CheckboxMDT
          name={name}
          value={itemActivity.answer[option.value]}
          id={option.value}
          label={option.label}
          disabled={done}
          key={option.value}
        />
      )
    };

    _.remove(item.options, (option) => {
      return option.label.trim() === '';
    });

    return (
      <div>
        <p dangerouslySetInnerHTML={{__html: htmlContent}} />
        {item.options.map(renderOption, this)}
      </div>
    );
  }
}

SelectBoxContent.propTypes = propTypes;

export default SelectBoxContent;
