'use strict';

import React, {Component, PropTypes} from 'react';

import InputMDT from '../../common/InputMDT';
import CheckboxMDT from '../../common/CheckboxMDT';
import SelectMDT from '../../common/SelectMDT';
import TextareaMDT from '../../common/TextareaMDT';
import RadioMDT from '../../common/RadioMDT';

import {ANSWER, LOGIC} from '../../../constants/parameters';

import ItemStore from '../../../stores/itemStore';

let propTypes = {
  condition: PropTypes.object,
  itemsSelectOptions: PropTypes.array,
};

class QuestionDataConditions extends Component {

  constructor(props) {
    super(props);

    // We should check wether we're displaying the current item or another one
    let slugToCompare = this.props.condition.base.slug === -1 ? this.props.itemSlug : this.props.condition.base.slug;

    let defaultOptions = this.props.itemsValueSelectOptions[slugToCompare] || null;
    // console.log(defaultOptions);
    this.state = {
      itemsValueSelectOptions: defaultOptions
    };
  }

  // Let us init the value
  // componentDidMount() {
  //   this.onBaseChange(null, this.props.itemSlug);
  //   console.log('itemsValueSelectOptions', this.state.itemsValueSelectOptions);
  // }

  removeCondition(uid, e) {
    e.preventDefault();

    this.props.removeCondition(uid);
  }

  changeAnswerType = (e) => {
    let target = e.currentTarget;
    let retValue = target.value === 'date' ? ANSWER.DATE : ANSWER.VALUE;

    this.props.updateCondition(this.props.condition, {answer: {type: retValue}});
  }

  onBaseChange = (name, value) => {
    let {itemsValueSelectOptions} = this.props;

    if (itemsValueSelectOptions[value] !== undefined && itemsValueSelectOptions[value] !== null) {
      this.setState({itemsValueSelectOptions: itemsValueSelectOptions[value]});
    } else {
      this.setState({itemsValueSelectOptions: null});
    }
  }

  render() {
    let {condition} = this.props;
    let baseName = `alerts[${condition.parentUid}][conditions][${condition.uid}]`;

    return (
      <li>
        <div className="leftBorder"></div>
        <div className="timeLine"></div>
        <a href="#" onClick={this.removeCondition.bind(this, condition)} className="delete"><span className="icon-trash"></span></a>

        <div className="form-group form-inline">

          {() => {
            if (this.props.order > 0) {
              return (
                <SelectMDT
                  name={`${baseName}[logic]`}
                  options={[
                    {label: 'Et', value: LOGIC.AND},
                    {label: 'Ou', value: LOGIC.OR},
                  ]}
                  value={condition.logic}
                />
              );
            } else {
              return (
                <label>Si</label>
              );
            }
          }()}

          <SelectMDT
            name={`${baseName}[base][slug]`}
            options={this.props.itemsSelectOptions}
            value={condition.base.slug}
            onChange={this.onBaseChange}
          />

          <label>à</label>

          <SelectMDT
            name={`${baseName}[base][date]`}
            options={this.props.daysSelectOptions}
            value={condition.base.date}
          />
        </div>

        <div className="form-group form-inline">

          <SelectMDT
            name={`${baseName}[sign]`}
            options={ItemStore.getAlertSignOptions()}
            value={condition.sign}
          />

          <div className="form-group">
            <label>à</label>
          </div>

          <div className="radio fix1">
            <input type="radio"
              id={`${baseName}[answer][type]`}
              name={`${baseName}[answer][type]`}
              checked={condition.answer.type === ANSWER.VALUE}
              onChange={this.changeAnswerType}
              value="value"
            />
            <label htmlFor={`${baseName}[answer][type]`}></label>

            {() => {

              if (this.state.itemsValueSelectOptions !== null) {
                return (
                  <SelectMDT
                    name={`${baseName}[answer][value]`}
                    options={this.state.itemsValueSelectOptions}
                    value={condition.answer.value}
                  />
                );
              } else {
                return (
                  <InputMDT name={`${baseName}[answer][value]`}
                    layout="elementOnly"
                    placeholder={0}
                    value={condition.answer.value}
                  />
                );
              }

            }()}
          </div>

          <div className="radio fix2">
            <input type="radio"
              id={`${baseName}[answer][type2]`}
              name={`${baseName}[answer][type]`}
              checked={condition.answer.type === ANSWER.DATE}
              onChange={this.changeAnswerType}
              value="date"
            />
            <label htmlFor={`${baseName}[answer][type2]`}></label>

            <SelectMDT
              name={`${baseName}[answer][date]`}
              options={this.props.daysSelectOptions}
              value={condition.answer.date}
            />
          </div>
        </div>
      </li>
    );
  }
}

QuestionDataConditions.propTypes = propTypes;

export default QuestionDataConditions;