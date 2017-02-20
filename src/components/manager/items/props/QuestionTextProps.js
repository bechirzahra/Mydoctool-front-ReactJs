'use strict';

import React, {Component, PropTypes} from 'react';
import update from 'react/lib/update';

import _ from 'lodash';

import InputMDT from '../../../common/InputMDT';
import FileMDT from '../../../common/FileMDT';
import RadioMDT from '../../../common/RadioMDT';
import SelectMDT from '../../../common/SelectMDT';
import TextareaMDT from '../../../common/TextareaMDT';

/**
* A task more props than an Item:
* - bool completed
* - bool repeat
*/
class QuestionTextProps extends Component {

  render() {
    let {item} = this.props;

    return(
      <div>
        <div className="form-group">
          <InputMDT
            name="name"
            placeholder="Saisissez votre libellé"
            value={item.name ? item.name : ''}
            onChange={this.props.onFormChange}
          />
        </div>
        <div className="form-group">
          <TextareaMDT
            name="text"
            rows="5"
            placeholder="Saisissez votre question"
            value={item.text ? item.text : ''}
            onChange={this.props.onFormChange}
          />
        </div>
        <div className="form-group">
          <FileMDT name="documents" onChange={this.props.onFormChange}/>
          <div className="clear"></div>
        </div>

        <RadioMDT name="text_answer_short"
          layout="wrapper"
          value={item.text_answer_short ? item.text_answer_short : true}
          options={[
            {label: 'Réponse courte', value: true},
            {label: 'Réponse longue', value: false}
          ]}
          onChange={this.props.onFormChange}
        />
      </div>
    );
  }
}

export default QuestionTextProps;