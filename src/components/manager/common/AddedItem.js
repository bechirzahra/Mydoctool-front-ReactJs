'use strict';

import React, {Component, PropTypes} from 'react';
import {findDOMNode} from 'react-dom';

import _ from 'lodash';
import {DND} from '../../../constants/parameters';

import {DragSource, DropTarget} from 'react-dnd';

const itemSource = {
  beginDrag(props) {
    return {
      slug: props.item.slug,
      order_c: props.item.order_c
    };
  }
};

const itemTarget = {
  hover(props, monitor, component) {
    const dragIndex = monitor.getItem().order_c;
    const hoverIndex = props.item.order_c;

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

    // Only perform the move when the mouse has crossed half of the items height
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
    props.moveItem(dragIndex, hoverIndex);

    // Note: we're mutating the monitor item here!
    // Generally it's better to avoid mutations,
    // but it's good here for the sake of performance
    // to avoid expensive index searches.
    monitor.getItem().order_c = hoverIndex;
  }
};

const propTypes = {
  item: PropTypes.object.isRequired,
  openModal: PropTypes.func.isRequired,
}

class AddedItem extends Component {

  addItem(item, dropResult) {
    this.props.addItem(item);
  }

  openModal = (e) => {
    if ($(e.target).hasClass('icon-trash') ||
      $(e.target).hasClass('icon-clone')
    ) {
      return;
    }

    this.props.openModal(this.props.item.slug);
  }

  render() {
    const {isDragging, connectDragSource, connectDropTarget} = this.props;
    const {item} = this.props;
    const opacity = isDragging ? 0.4 : 1;

    return (
      connectDragSource(connectDropTarget(
        <li
          key={item.slug}
          className={item.printable_type}
          style={{opacity}}
          onClick={this.openModal}
        >
          <div className="number">{item.order_c + 1}</div>
          <div className="bloc">
            <div className="title">
              <span></span>
              <p>{item.name}</p>
            </div>
            <div className="actions">
              <a href="#"><span className="icon-arrows"></span></a>
              <a onClick={this.props.duplicateItem.bind(this, item.slug)}><span className="icon-clone"></span></a>
              <a onClick={this.props.removeItem.bind(this, item.slug)}><span className="icon-trash"></span></a>
            </div>
          </div>
        </li>
      ))
    );
  }
}

AddedItem.propTypes = propTypes;

export default _.flow(
  DropTarget(DND.ADDED_ITEM, itemTarget, (connect) => ({
    connectDropTarget: connect.dropTarget(),
  })),
  DragSource(DND.ADDED_ITEM, itemSource, (connect, monitor) => ({
    connectDragSource: connect.dragSource(),
    isDragging: monitor.isDragging(),
  }))
)(AddedItem);