'use strict';

import React, {Component, PropTypes} from 'react';
import update from 'react/lib/update';
import _ from 'lodash';

import InputMDT from '../../../common/InputMDT';
import FileMDT from '../../../common/FileMDT';
import CheckboxMDT from '../../../common/CheckboxMDT';
import SelectMDT from '../../../common/SelectMDT';
import TextareaMDT from '../../../common/TextareaMDT';

import SelectOption from '../SelectOption';

import Utils from '../../../../services/utils';

/**
* A Select Question more props than an Item:
* - Options
*/
class QuestionDataProps extends Component {

  createOption = (e) => {
    e.preventDefault();

    let option = {
      value: Utils.generateUid(),
      label: '',
      order_c: this.props.item.options.length,
    }

    this.props.addOption(option);
  }

  moveItem = (dragIndex, hoverIndex) => {
    let {options} = this.props.item;
    let dragOption = options[dragIndex];

    let newOptions = update(options, {
      $splice: [
        [dragIndex, 1],
        [hoverIndex, 0, dragOption]
      ]
    });

    newOptions.forEach((option, k) => {
      option.order_c = k;
    });

    newOptions = _.sortBy(newOptions, (option, k) => {
      return parseInt(option.order_c, 10);
    });

    this.props.saveOptions(newOptions);
    this.forceUpdate();
  }

  // shouldComponentUpdate(nextProps, nextState) {
  //   let shouldUpdate = false;
  //   if (this.props.item.options.length != nextProps.item.options.length) {
  //     shouldUpdate = true;
  //   }
  //   return shouldUpdate;
  // }

  render() {
    let {item} = this.props;

    let renderOption = (option, k) => {

      return (
        <SelectOption
          key={option.value + k * 1099}
          option={option}
          k={k}
          removeOption={this.props.removeOption}
          saveOption={this.props.saveOption}
          moveItem={this.moveItem}
          value={option.label}
        />
      );
    };

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

        <div className="form-group responses">
          <label>Options réponse :</label>
          <ul>
            {item.options.map(renderOption, this)}
            <li className="add">
              <a onClick={this.createOption}><span className="icon icon-add"></span></a>
            </li>
          </ul>
        </div>
      </div>
    );
  }
}

export default QuestionDataProps;