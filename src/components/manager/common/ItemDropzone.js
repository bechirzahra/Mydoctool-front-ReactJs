'use strict';

import React, {Component} from 'react';
import {DropTarget} from 'react-dnd';
import {DND} from '../../../constants/parameters';

const itemTarget = {
  drop(props, monitor, component) {
    return {name: 'ItemDropzone', mkey: component.props.mkey};
  }
};

class ItemDropzone extends Component {

  render() {
    const {connectDropTarget, isOver, canDrop} = this.props;
    const isActive = isOver && canDrop;

    let defaultClass = 'dnd';
    if (isActive) {
      defaultClass = defaultClass + ' dnd-active';
    } else if (canDrop) {
      defaultClass = defaultClass + ' dnd-candrop';
    }

    return connectDropTarget(
      <div className={`add ${defaultClass}`}>
        Glissez un élément (Tâche, Information ou Question) à ajouter dans votre protocole
      </div>
    );
  }

}

export default DropTarget(DND.EMPTY_ITEM, itemTarget, (connect, monitor) => ({
  connectDropTarget: connect.dropTarget(),
  isOver: monitor.isOver(),
  canDrop: monitor.canDrop()
}))(ItemDropzone);