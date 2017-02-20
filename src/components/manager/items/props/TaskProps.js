'use strict';

import React, {Component, PropTypes} from 'react';
import update from 'react/lib/update';

import _ from 'lodash';

import InputMDT from '../../../common/InputMDT';
import FileMDT from '../../../common/FileMDT';
import CheckboxMDT from '../../../common/CheckboxMDT';
import SelectMDT from '../../../common/SelectMDT';
import TextareaMDT from '../../../common/TextareaMDT';

/**
* A task more props than an Item:
* - bool completed
* - bool repeat
*/
class TaskProps extends Component {

  shouldComponentUpdate(nextProps, nextState) {
    let shouldUpdate = false;
    // if (this.props.item.options.length != nextProps.item.options.length) {
    //   shouldUpdate = true;
    // }
    return shouldUpdate;
  }

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
            placeholder="Saisissez la tâche à réaliser"
            value={item.text ? item.text : ''}
            onChange={this.props.onFormChange}
          />
        </div>
        <div className="form-group">

          <FileMDT name="documents"
            onChange={this.props.onFormChange}
            value={item.documents}
          />

          <div className="clear"></div>
        </div>

        <CheckboxMDT name="repeated"
          label="Rappel automatique"
          wrapper={true}
          value={item.repeated ? item.repeated : false}
          onChange={this.props.onFormChange}
        />
      </div>
    );
  }
}

export default TaskProps;