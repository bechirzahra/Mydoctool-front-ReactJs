'use strict';

import React, {Component, PropTypes} from 'react';
import {DND} from '../../../constants/parameters';

import {DragSource} from 'react-dnd';

const emptyItemSource = {
  beginDrag(props) {
    return {
      id: props.type.id
    };
  },

  endDrag(props, monitor, component) {
    if (!monitor.didDrop()) {
      return;
    }

    const item = monitor.getItem();
    const dropResult = monitor.getDropResult();

    component.addItem(item, dropResult);
  }
};

class EmptyItem extends Component {

  addItem(item, dropResult) {
    this.props.addItem(item, dropResult.mkey);
  }

  render() {
    const {isDragging, connectDragSource} = this.props;
    const {type, icon} = this.props;
    const opacity = isDragging ? 0.4 : 1;

    return (
      connectDragSource(
        <a style={{opacity}}>
          <span className={`icon icon-${icon}`}></span>
          {type.label}
        </a>
      )
    );
  }
}

EmptyItem.propTypes = {
  type: PropTypes.object.isRequired,
  icon: PropTypes.string.isRequired,
  addItem: PropTypes.func.isRequired
};

export default DragSource(DND.EMPTY_ITEM, emptyItemSource, (connect, monitor) => ({
  connectDragSource: connect.dragSource(),
  isDragging: monitor.isDragging(),
}))(EmptyItem);