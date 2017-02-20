'use strict';

import React, {Component, PropTypes} from 'react';
import {findDOMNode} from 'react-dom';

import _ from 'lodash';
import {DND} from '../../../constants/parameters';
import InputMDT from '../../common/InputMDT';

import {DragSource, DropTarget} from 'react-dnd';

const optionSource = {
  beginDrag(props) {
    return {
      id: props.option.value,
      value: props.option.value,
      order_c: props.option.order_c
    };
  }
};

const optionTarget = {
  hover(props, monitor, component) {
    const dragIndex = monitor.getItem().order_c;
    const hoverIndex = props.option.order_c;

    if (dragIndex === hoverIndex) {
      return;
    }

    // Determine rectangle on screen
    const hoverBoundingRect = findDOMNode(component).getBoundingClientRect();

    // Get vertical middle
    const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;

    // Determine mouse position
    const clientOffset = monitor.getClientOffset();

    // Get pixels to the top
    const hoverClientY = clientOffset.y - hoverBoundingRect.top;

    // Only perform the move when the mouse has crossed half of the options height
    // When dragging downwards, only move when the cursor is below 50%
    // When dragging upwards, only move when the cursor is above 50%

    // Dragging downwards
    if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
      return;
    }

    // Dragging upwards
    if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
      return;
    }

    // Time to actually perform the action
    // console.log('move item');
    props.moveItem(dragIndex, hoverIndex);

    // Note: we're mutating the monitor option here!
    // Generally it's better to avoid mutations,
    // but it's good here for the sake of performance
    // to avoid expensive index searches.
    monitor.getItem().order_c = hoverIndex;
  }
};

const propTypes = {
  option: PropTypes.object.isRequired,
  saveOption: PropTypes.func.isRequired,
  removeOption: PropTypes.func.isRequired,
  moveItem: PropTypes.func.isRequired,
}

class SelectOption extends Component {

  removeOption = (e) => {
    // e.preventDefault();
    this.props.removeOption(this.props.option);
  }

  onFormOptionChange = (e) => {
    // e.preventDefault();
    this.props.option.label = e.target.value;
    this.props.saveOption(this.props.option);
  }

  render() {
    const {isDragging, connectDragSource, connectDropTarget} = this.props;
    const {option, k} = this.props;
    const opacity = isDragging ? 0.4 : 1;

    let letter = String.fromCharCode(65 + k);
    let name = `options[${option.value}][label]`;

    return (
      connectDragSource(connectDropTarget(
        <li
          style={{opacity}}
        >
          <div className="id">{letter}</div>

          <input
            type='text'
            name={name}
            placeholder={`Option ${letter}`}
            value={option.label}
            onChange={this.onFormOptionChange}
          />

          <div className="actions">
            <a><span className="icon icon-arrows"></span></a>
            <a onClick={this.removeOption}><span className="icon icon-trash"></span></a>
          </div>
        </li>
      ))
    );
  }
}

SelectOption.propTypes = propTypes;

export default _.flow(
  DropTarget(DND.SELECT_OPTION, optionTarget, (connect) => ({
    connectDropTarget: connect.dropTarget(),
  })),
  DragSource(DND.SELECT_OPTION, optionSource, (connect, monitor) => ({
    connectDragSource: connect.dragSource(),
    isDragging: monitor.isDragging(),
  }))
)(SelectOption);