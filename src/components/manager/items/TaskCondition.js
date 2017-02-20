'use strict';

import React, {Component, PropTypes} from 'react';
import InputMDT from '../../common/InputMDT';

let propTypes = {
  condition: PropTypes.object
};

class TaskCondition extends Component {

  removeCondition(uid, e) {
    e.preventDefault();

    this.props.removeCondition(uid);
  }

  render() {
    let {condition} = this.props;

    let baseName = `alerts[${condition.parentUid}][conditions][${condition.uid}]`;

    let text = this.props.text;

    return (
      <li>
        <div className="leftBorder"></div>
        <div className="timeLine"></div>
        <a href="#" onClick={this.removeCondition.bind(this, condition)} className="delete">
          <span className="icon-trash"></span>
        </a>
        <div>
          {this.props.text}

          <InputMDT
            name={`${baseName}[answer][value]`}
            value={condition.answer.value}
            layout="elementOnly"
          />

          jours
         </div>
      </li>
    );
  }
}

TaskCondition.propTypes = propTypes;

export default TaskCondition;