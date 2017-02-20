'use strict';

import React, {Component, PropTypes} from 'react';
import update from 'react/lib/update';

import InputMDT from '../../common/InputMDT';
import CheckboxMDT from '../../common/CheckboxMDT';
import SelectMDT from '../../common/SelectMDT';
import TextareaMDT from '../../common/TextareaMDT';
import RadioMDT from '../../common/RadioMDT';

import ItemStore from '../../../stores/itemStore';
import {DND, UNIT, FREQUENCY, DURATION, LOGIC, SIGN, DATE, ANSWER} from '../../../constants/parameters';

import TaskCondition from './TaskCondition';
import QuestionDataCondition from './QuestionDataCondition';

import Utils from '../../../services/utils';

const propTypes = {
  active: PropTypes.bool.isRequired,
  alerts: PropTypes.array.isRequired,
  addAlert: PropTypes.func,
  removeAlert: PropTypes.func,
  saveAlert: PropTypes.func,
  itemType: PropTypes.string,
  itemsSelectOptions: PropTypes.array,
};

const defaultProps = {
  active: false,
};

class AlertBuilder extends Component {

  constructor(props) {
    super(props);

    let multiple = true;
    if (this.props.itemType === DND.TASK || this.props.itemType === DND.TEXT) {
      multiple = false;
    }

    this.state = {
      disabled: {},
      multiple: multiple,
    };
  }

  /**
  * Adds a new Alert
  */
  addNewAlert = () => {
    let alert = {
      uid: Utils.generateUid(),
      conditions: [],
      patientMessage: {
        send: false,
        text: '',
      },
      doctorMessage: {
        send: false,
        text: '',
      },
    };

    alert = this.addCondition(alert);
    this.props.addAlert(alert);
  }

  /**
  * Removes an Alert
  */
  removeAlert = (uid, e) => {
    e.preventDefault();

    this.props.removeAlert(uid);
  }

  /**
  * Adds a condition to an Alert
  */
  addCondition = (alert, save = false) => {

    let condition = {
      uid: Utils.generateUid(),
      parentUid: alert.uid,
      logic: LOGIC.AND,
      base: {
        slug: -1,
        date: DATE.D,
      },
      sign: SIGN.EQUAL,
      answer: {
        type: ANSWER.VALUE,
        value: 0,
        date: DATE.D_1,
      }
    };

    let updatedAlert = update(alert, {conditions: {$push: [condition]}});

    if (save) {
      this.props.saveAlert(updatedAlert);
    }

    return updatedAlert;
  }

  /**
  * Update a condition with an object
  */
  updateCondition = (condition, obj) => {
    let parent = _.find(this.props.alerts, {uid: condition.parentUid});
    let conditions = parent.conditions;

    let index = conditions.indexOf(condition);
    let newCondition = _.merge(condition, obj);

    parent.conditions.splice(index, 1, newCondition);
    this.props.saveAlert(parent);
  }

  /**
  * Removes an Alert's condition.
  * If an Alert no longer has a condition, we delete it.
  * params: Object condition
  */
  removeCondition = (condition) => {
    let parent = _.find(this.props.alerts, {uid: condition.parentUid});
    _.remove(parent.conditions, {uid: condition.uid});

    if (parent.conditions.length < 1) {
      this.props.removeAlert(parent.uid);
    } else {
      this.props.saveAlert(parent);
    }

    this.forceUpdate();
  }

  // shouldComponentUpdate(nextProps, nextState) {
  //   // console.log('shouldComponentUpdate');
  //   if (
  //     nextProps.alerts.length !== this.props.alerts.length ||
  //     nextProps.active !== this.props.active
  //   ) {
  //     return true;
  //   }

  //   let c = 0;
  //   let newC = 0;
  //   _.forEach(nextProps.alerts, (alert) => {newC += alert.conditions.length;});
  //   _.forEach(this.props.alerts, (alert) => {c += alert.conditions.length;});

  //   return c !== newC;
  // }

  render() {
    // console.log('render AlertBuilder');
    let rootClassName = this.props.active ? 'active' : '';

    let getConditionTemplate = (condition, order) => {
      let daysSelectOptions = [];
      _.each(DATE, (v, k) => {
        daysSelectOptions.push({label: k, value: v});
      });

      let props = {
        condition: condition,
        removeCondition: this.removeCondition,
        key: condition.uid,
        itemsSelectOptions: this.props.itemsSelectOptions,
        itemsValueSelectOptions: this.props.itemsValueSelectOptions,
        daysSelectOptions: daysSelectOptions,
        order: order,
        itemSlug: this.props.itemSlug,
      };

      switch(this.props.itemType) {
        case DND.TASK:
          return <TaskCondition text="Si la tâche n’est pas faite après" {...props} />;
          break;
        case DND.DATA:
          return <QuestionDataCondition updateCondition={this.updateCondition} {...props} />;
          break;
        case DND.SELECT:
          return <QuestionDataCondition updateCondition={this.updateCondition} {...props} />;
          break;
        case DND.BOOL:
          return <QuestionDataCondition updateCondition={this.updateCondition} {...props} />;
          break;
        case DND.LEVEL:
          return <QuestionDataCondition updateCondition={this.updateCondition} {...props} />;
          break;
        case DND.TEXT:
          return <TaskCondition text="Si la question n'a pas été répondu après" {...props} />;
          break;
      }
    };

    let renderAlert = (alert, k) => {
      let id = `ale-${alert.uid}`;

      return (
        <li key={alert.uid}>
          <input type="checkbox" className="alertTilte" id={id} defaultChecked/>
          <label className="alertTitle" htmlFor={id}>
            Alerte {k + 1} <span className="icon icon-angle-down"></span>
          </label>
          <div className="contentItem">
            <ul className="frequenceItems">
              {alert.conditions.map(getConditionTemplate, this)}

              {() => {
                if (this.state.multiple) {
                  return (
                    <li className="add">
                      <a onClick={this.addCondition.bind(this, alert, true)} className="add">
                        <span className="icon-add"></span><p>Ajouter une Condition</p>
                      </a>
                    </li>
                  );
                }
              }()}
            </ul>

            <div className="else container-fluid">
              <div className="row">
                <h3>Alors :</h3>
              </div>
              <div className="row">
                <div className="col-lg-6 borderRight">

                  <CheckboxMDT
                    name={`alerts[${alert.uid}][patientMessage][send]`}
                    label="Envoyer message au patient"
                    value={true && alert.patientMessage.send}
                  />

                  <TextareaMDT
                    name={`alerts[${alert.uid}][patientMessage][message]`}
                    placeholder="Message du patient"
                    value={alert.patientMessage.message}
                  />

                </div>
                <div className="col-lg-6">

                  <CheckboxMDT
                    name={`alerts[${alert.uid}][doctorMessage][send]`}
                    label="Vous envoyer un message"
                    value={true && alert.doctorMessage.send}
                  />

                  <TextareaMDT
                    name={`alerts[${alert.uid}][doctorMessage][message]`}
                    placeholder="Message pour vous"
                    value={alert.doctorMessage.message}
                  />

                </div>
              </div>
            </div>

          </div>
        </li>
      );
    };

    return (
      <div className={`row alertWrapper ${rootClassName}`}>
        <ul className="alerteItems">
          {this.props.alerts.map(renderAlert, this)}
        </ul>
        <a onClick={this.addNewAlert} className="add">
          <span className="icon-add"></span>
          <p>Ajouter une Alerte</p>
        </a>
      </div>
    );
  }
}

AlertBuilder.propTypes = propTypes;
AlertBuilder.defaultProps = defaultProps;

export default AlertBuilder;