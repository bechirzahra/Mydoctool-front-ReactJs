'use strict';

import React, {Component, PropTypes} from 'react';
import update from 'react/lib/update';
import {Modal} from 'react-bootstrap';
import _ from 'lodash';

import {DND, ITEM} from '../../../constants/parameters';

import Formsy from 'formsy-react';
import InputMDT from '../../common/InputMDT';
import CheckboxMDT from '../../common/CheckboxMDT';
import SelectMDT from '../../common/SelectMDT';
import TextareaMDT from '../../common/TextareaMDT';

import FrequencyBuilder from './FrequencyBuilder';
import AlertBuilder from './AlertBuilder';

import TaskProps from './props/TaskProps';
import NoticeProps from './props/NoticeProps';
import QuestionDataProps from './props/QuestionDataProps';
import QuestionSelectProps from './props/QuestionSelectProps';
import QuestionBoolProps from './props/QuestionBoolProps';
import QuestionLevelProps from './props/QuestionLevelProps';
import QuestionTextProps from './props/QuestionTextProps';

import ItemStore from '../../../stores/itemStore';

import ListingActionCreators from '../../../actions/listingActionCreators';

const propTypes = {
  item: PropTypes.object,
  saveItem: PropTypes.func.isRequired
};

const defaultProps = {
  item: null,
};

class ItemModal extends Component {

  constructor(props) {
    super(props);

    let {item} = this.props;

    this.state = {
      canSubmit: false,
      item: item,
      itemModalMode: 'freq',
    };

    this._modalProps = this.getModalProps(item);
  }

  changeModalMode = (mode) => {
    this.setState({itemModalMode: mode});
  }


  getModalProps = (item) => {
    var rootId = "";
    let SidebarLeft;
    let modalTitle = "";

    let props = {
      item: item,
      onFormChange: this.onFormChange,
    };

    if(item !== null) {
      switch(item.printable_type) {
        case DND.TASK:
          rootId = "popinTask";
          SidebarLeft = <TaskProps {...props}/>;
          modalTitle = "Tâche";
          break;
        case DND.NOTICE:
          rootId = "popinNotice";
          SidebarLeft = <NoticeProps {...props}/>;
          modalTitle = "Information";
          break;
        case DND.DATA:
          rootId = "popinData";
          SidebarLeft = <QuestionDataProps {...props}/>;
          modalTitle = "Données";
          break;
        case DND.SELECT:
          rootId = "popinSelect";
          SidebarLeft = <QuestionSelectProps addOption={this.addOption}
            removeOption={this.removeOption}
            saveOption={this.saveOption}
            saveOptions={this.saveOptions}
            {...props}/>;
          modalTitle = "Choix Multiple";
          break;
        case DND.BOOL:
          rootId = "popinBool";
          SidebarLeft = <QuestionBoolProps {...props}/>;
          modalTitle = "Oui / Non";
          break;
        case DND.LEVEL:
          rootId = "popinLevel";
          SidebarLeft = <QuestionLevelProps {...props}/>;
          modalTitle = "Niveau";
          break;
        case DND.TEXT:
          rootId = "popinText";
          SidebarLeft = <QuestionTextProps {...props}/>;
          modalTitle = "Texte";
          break;
      }
    }

    return {
      rootId: rootId,
      SidebarLeft: SidebarLeft,
      modalTitle: modalTitle
    };
  }


  componentWillReceiveProps(nextProps) {
    if (nextProps.item !== null) {
      this.setState({
        item: nextProps.item,
      });

      this._modalProps = this.getModalProps(nextProps.item);
    }
  }

  /**
    ### Frequencies methods  ###
  */

  /**
  * Adds a new Frequency, saves it
  */
  addFrequency = (freq) => {
    this.setState({item: update(this.state.item, {frequencies: {$push: [freq]}})});
  }

  /**
  * Removes an existing Frequency
  */
  removeFrequency = (uid) => {
    _.remove(this.state.item.frequencies, {uid: uid});
    this.setState({item: this.state.item});
  }

  /**
    ### Alerts methods  ###
  */

  /**
  * Adds an alert, saves it.
  */
  addAlert = (alert) => {
    this.setState({item: update(this.state.item, {alerts: {$push: [alert]}})});
  }

  /**
  * Saves an existing Alert
  */
  saveAlert = (updatedAlert) => {
    let alert = _.find(this.state.item.alerts, {uid: updatedAlert.uid});
    let index = this.state.item.alerts.indexOf(alert);

    this.setState({
      item: update(this.state.item, {alerts: {$splice: [[index, 1, updatedAlert]]}})
    });
  }

  /**
  * Removes an existing Alert
  */
  removeAlert = (uid) => {
    _.remove(this.state.item.alerts, {uid: uid});
    this.setState({item: this.state.item});
  }

  /**
    ### Options methods  ###
  */

  /**
  * This method refresh the left side of the modal, and save the state of the new item
  */
  saveNewItem = (newItem) => {
    this._modalProps = this.getModalProps(newItem);
    this.setState({item: newItem}, () => {
      // console.log('end save item');
    });
  }

  addOption = (option) => {
    let newItem = update(this.state.item, {options: {$push: [option]}});
    this.saveNewItem(newItem);
  }

  saveOption = (updatedOption) => {
    let option = _.find(this.state.item.options, {value: updatedOption.value});
    let index = this.state.item.options.indexOf(option);

    let newItem = update(this.state.item, {options: {$splice: [[index, 1, updatedOption]]}});
    this.saveNewItem(newItem);
  }

  saveOptions = (options) => {
    this.state.item.options = options;
    this.saveNewItem(this.state.item);
  }

  removeOption = (option) => {
    let options = this.state.item.options;

    _.remove(options, {value: option.value});

    // We should re-order them
    options.forEach((option, k) => {
      option.order_c = k;
    });

    this.saveOptions(options);
  }


  // Enable the form submit button
  enableButton = () => {
    this.setState({canSubmit: true});
  }

  // Disable the form submit button
  disableButton = () => {
    this.setState({canSubmit: false});
  }


  /**
  * Save the current Item and close the ItemModal
  */
  submit = (model) => {
    let frequencies = model.frequencies;
    let alerts = model.alerts;
    let options = model.options;

    delete model.frequencies;
    delete model.alerts;
    delete model.options;

    let newItem = update(this.state.item, {$merge: model});

    /**
    * We rebuild the item.frequencies object, to fit with the
    * data model defined in ManageListing.js
    */
    let newFrequencies = [];
    _.each(frequencies, (v, k) => {
      let ret = v;
      ret.uid = k;
      newFrequencies.push(ret);
    });

    newItem.frequencies = newFrequencies;

    let newAlerts = [];
    _.each(alerts, (v, k) => {
      let ret = v;
      ret.uid = k;

      let currentAlert = _.find(this.state.item.alerts, {uid: k});
      let conditions = ret.conditions;

      let newConditions = [];
      _.each(conditions, (condition, uid) => {
        let rett = condition;
        rett.uid = uid;
        rett.parentUid = k;

        // We have to go save the current condition AnswerType
        let currentCondition = _.find(currentAlert.conditions, {uid: uid});
        rett.answer.type = currentCondition.answer.type;

        newConditions.push(rett);
      });

      ret.conditions = newConditions;

      newAlerts.push(ret);
    });

    newItem.alerts = newAlerts;

    // Call the ManageListing.saveItem func
    this.props.saveItem(newItem, true);
  }

  getItemsSelectOptions = () => {
    let ret = [];
    _.each(this.props.items, (item) => {
      if (item.printable_type !== DND.NOTICE) {
        ret.push({value: item.slug, label: item.name});
      }
    });

    _.remove(ret, {value: this.state.item.slug});
    // @Translator
    ret.unshift({value: this.state.item.slug, label: 'Cette question'});

    return ret;
  }

  /**
  * This func creates an object with the different select options with
  * which we can compare answers.
  */
  getItemsValueSelectOptions = () => {
    let ret = {};

    _.each(this.props.items, (item) => {

      // If we are displaying data from the current item, get the current state that has more options.
      let itemToTakeData = item.slug === this.state.item.slug ? this.state.item : item;


      if (itemToTakeData.printable_type === DND.SELECT) {
          ret[itemToTakeData.slug] = itemToTakeData.options;
      }

      else if (itemToTakeData.printable_type === DND.BOOL) {
        // @Translator
        ret[itemToTakeData.slug] = [
          {label: 'Non', value: false},
          {label: 'Oui', value: true}
        ];
      }

      else if (itemToTakeData.printable_type === DND.LEVEL) {
        ret[itemToTakeData.slug] = [];

        let min = 0;
        let max = 10;

        if (itemToTakeData.min && itemToTakeData.min !== null) {
          min = itemToTakeData.min;
        }

        if (itemToTakeData.max && itemToTakeData.max !== null) {
          max = itemToTakeData.max;
        }

        for (var i = min; i <= max; i++) {
          ret[itemToTakeData.slug].push({label: i, value: i});
        };
      }

    }, this);

    return ret;
  }

  onFormChange = (name, val) => {
    // The immutable solution seems to make the product laggier
    let newItem = update(this.state.item, {[name]: {$set: val}});
    this.setState({item: newItem});
    // this.state.item[name] = val;
    // this.setState({item: this.state.item});
  }

  render() {
    let {item} = this.state;

    // console.log('render item modal');

    if (item === null) {
      return (<div></div>);
    }

    return (
      <Modal show={this.props.show}
        onHide={this.props.onHide}
        dialogClassName="popinCreateItem"
        id={this._modalProps.rootId}>

        <Modal.Header closeButton>
          <Modal.Title>{this._modalProps.modalTitle}</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <Formsy.Form
            onValid={this.enableButton}
            onInvalid={this.disableButton}
            onValidSubmit={this.submit}
            onChange={() => this.setState({enableValidation: false})}
            role="form"
            ref="form"
          >
            <div className="row" style={{position: 'relative'}}>

              <div className="col-lg-4">
                <div className="sidebarTitle">
                  <span className="icon-bubble"></span>
                  <p>Contenu</p>
                  <div className="clear"></div>
                </div>

                <div className="sidebarLeft">
                  {this._modalProps.SidebarLeft}
                </div>
              </div>

              <div className="col-lg-8">
                <ul className="ongletsMenu">
                  <li className={this.state.itemModalMode === 'freq' ? 'active' : ''}
                    title="frequence"
                    onClick={() => {this.changeModalMode('freq')}}
                  >
                    <span className="icon-calendar"></span>
                    <p>Fréquence</p>
                  </li>

                  {/* A notice has not Alert, we should not display the menu then */}
                  {() => {
                    if (item.printable_type !== DND.NOTICE) {
                      return (
                        <li className={this.state.itemModalMode === 'alert' ? 'active' : ''}
                          title="alert"
                          onClick={() => {this.changeModalMode('alert')}}
                        >
                          <span className="icon-alert"></span>
                          <p>Alerte</p>
                        </li>
                      );
                    }
                  }()}
                </ul>

                <FrequencyBuilder
                  active={this.state.itemModalMode === 'freq'}
                  frequencies={this.state.item.frequencies}
                  addFrequency={this.addFrequency}
                  removeFrequency={this.removeFrequency}
                />

                <AlertBuilder
                  active={this.state.itemModalMode === 'alert'}
                  alerts={this.state.item.alerts}
                  addAlert={this.addAlert}
                  removeAlert={this.removeAlert}
                  saveAlert={this.saveAlert}
                  itemSlug={item.slug}
                  itemType={item.printable_type}
                  itemsSelectOptions={this.getItemsSelectOptions()}
                  itemsValueSelectOptions={this.getItemsValueSelectOptions()}
                />

                <div className="row alertWrapper">
                  <ul className="alerteItems">
                  </ul>
                  <a href="#" className="add">
                    <span className="icon-add"></span>
                    <p>Ajouter une Alerte</p>
                  </a>
                </div>
              </div>

              <button type="submit" className="btnPopinTop btnPurple2" disabled={!this.state.canSubmit}>Valider</button>
            </div>
          </Formsy.Form>
        </Modal.Body>
      </Modal>
    );
  }
}

ItemModal.propTypes = propTypes;
ItemModal.defaultProps = defaultProps;

export default ItemModal;