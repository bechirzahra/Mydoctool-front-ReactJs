'use strict';

import React, {Component, PropTypes} from 'react';
import _ from 'lodash';

import InputMDT from '../../../common/InputMDT';
import SelectMDT from '../../../common/SelectMDT';
import TextareaMDT from '../../../common/TextareaMDT';
import IconSelectorMDT from '../../../common/IconSelectorMDT';

/**
* A Data Question more props than an Item:
* - Unit
*/
class QuestionLevelProps extends Component {

  render() {
    let {item} = this.props;

    let valueOptions = [for (i of Array(11).keys()) {value: i, label: i}];

    const icons = [
      'icon-star',
      'icon-oval',
      'icon-heart',
      'icon-like',
      'icon-walk',
      'icon-important',
    ];

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
          <SelectMDT
            name="min"
            placeholder="Sélectionnez la valeur minimum"
            value={item.min ? item.min : ''}
            onChange={this.props.onFormChange}
            options={valueOptions}
          />
        </div>

        <div className="form-group">
          <SelectMDT
            name="max"
            placeholder="Sélectionnez la valeur maximum"
            value={item.max ? item.max : ''}
            onChange={this.props.onFormChange}
            options={valueOptions}
          />
        </div>

        <div className="form-group">
          <IconSelectorMDT
            name="icon"
            label="Sélectionnez l'icône à afficher"
            value={item.icon ? item.icon : ''}
            icons={icons}
            onChange={this.props.onFormChange}
          />
        </div>
      </div>
    );
  }
}

export default QuestionLevelProps;