'use strict';

import React, {Component, PropTypes} from 'react';

import InputMDT from '../../common/InputMDT';
import CheckboxMDT from '../../common/CheckboxMDT';
import SelectMDT from '../../common/SelectMDT';
import TextareaMDT from '../../common/TextareaMDT';
import RadioMDT from '../../common/RadioMDT';

import ItemStore from '../../../stores/itemStore';
import {UNIT, FREQUENCY, DURATION} from '../../../constants/parameters';

import Utils from '../../../services/utils';
import Translator from '../../../services/Translator';

const propTypes = {
  active: PropTypes.bool.isRequired,
  frequencies: PropTypes.array.isRequired,
};

const defaultProps = {
  active: false,
};

class FrequencyBuilder extends Component {

  constructor(props) {
    super(props);

    this.state = {
      disabled: {}
    };
  }

  addNewFrequency = () => {
    let freq = {
      uid: Utils.generateUid(),
      dateStart: {
        value: 0,
        unit: UNIT.DAY,
      },
      frequency: FREQUENCY.ONCE,
      duration: {
        type: DURATION.TYPE_DATE,
        value: 0,
        unit: UNIT.DAY
      }
    };

    this.props.addFrequency(freq);
  }

  onDurationTypeChange = (uid, name, value) => {
    this.state.disabled[uid] = +value === DURATION.TYPE_END ? true : false;
    this.setState({
      disabled: this.state.disabled
    });
  }

  removeFrequency = (uid, e) => {
    e.preventDefault();

    this.props.removeFrequency(uid);
    this.forceUpdate();
  }

  shouldComponentUpdate(nextProps, nextState) {
    return (
      nextProps.frequencies.length !== this.props.frequencies.length ||
      nextProps.active !== this.props.active
    );
  }

  render() {
    // console.log('render FrequencyBuilder');
    let rootClassName = this.props.active ? 'active' : '';

    let frequenciesValueOptions = ItemStore.getFrequenciesValueOptions();
    let frequenciesUnitOptions = ItemStore.getFrequenciesUnitOptions();
    let frequenciesFreqOptions = ItemStore.getFrequenciesFreqOptions();

    let renderFrequency = (frequency) => {
      return (
        <li key={frequency.uid}>
          <div className="leftBorder"></div>
          <div className="timeLine"></div>

          <a href="#" onClick={this.removeFrequency.bind(this, frequency.uid)}
            className="delete">
            <span className="icon-trash"></span>
          </a>

          <div className="form-inline form-group">
            <label>Sélectionnez le début de cette action :</label>
            <SelectMDT
              name={`frequencies[${frequency.uid}][dateStart][value]`}
              options={frequenciesValueOptions}
              value={+frequency.dateStart.value}
            />
            <SelectMDT
              name={`frequencies[${frequency.uid}][dateStart][unit]`}
              options={frequenciesUnitOptions}
              value={+frequency.dateStart.unit}
            />
          </div>

          <div className="form-inlineform-group">
            <label className="labelTopInline">Sélectionnez la fréquence :</label>
          </div>

          <div className="form-inline">
            <div className="form-group">
              <SelectMDT
                name={`frequencies[${frequency.uid}][frequency]`}
                options={frequenciesFreqOptions}
                value={+frequency.frequency}
              />
            </div>

            <div className="form-group displayTwoLines">
              <RadioMDT
                name={`frequencies[${frequency.uid}][duration][type]`}
                layout='newLine'
                options={[
                  {label: 'Pendant une durée de', value: DURATION.TYPE_DATE},
                  {label: 'Jusqu\'à la fin du protocole', value: DURATION.TYPE_END},
                ]}
                value={+frequency.duration.type}
                onChange={this.onDurationTypeChange.bind(this, frequency.uid)}
              />
            </div>

            <div className="form-group durationForm">
              <SelectMDT
                name={`frequencies[${frequency.uid}][duration][value]`}
                options={frequenciesValueOptions}
                value={+frequency.duration.value}
                disabled={this.state.disabled[frequency.uid]}
              />
              <SelectMDT
                name={`frequencies[${frequency.uid}][duration][unit]`}
                options={frequenciesUnitOptions}
                value={+frequency.duration.unit}
                disabled={this.state.disabled[frequency.uid]}
                className={'noMargin'}
              />
            </div>
          </div>
        </li>
      );
    };
    return (
      <div className={`row frequenceWrapper ${rootClassName}`}>
        <ul className="frequenceItems">
          {this.props.frequencies.map(renderFrequency, this)}
        </ul>

        <a onClick={this.addNewFrequency} className="add noItems">
          <span className="icon-add"></span>
          <p>Ajouter une Fréquence</p>
        </a>
      </div>
    );
  }
}

FrequencyBuilder.propTypes = propTypes;
FrequencyBuilder.defaultProps = defaultProps;

export default FrequencyBuilder;
