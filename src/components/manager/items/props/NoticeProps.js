'use strict';

import React, {Component, PropTypes} from 'react';
import _ from 'lodash';

import InputMDT from '../../../common/InputMDT';
import FileMDT from '../../../common/FileMDT';
import CheckboxMDT from '../../../common/CheckboxMDT';
import SelectMDT from '../../../common/SelectMDT';
import TextareaMDT from '../../../common/TextareaMDT';

/**
* A Notice is the simplest Item:
*/
class NoticeProps extends Component {

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
            placeholder="Saisissez votre information"
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
      </div>
    );
  }
}

export default NoticeProps;