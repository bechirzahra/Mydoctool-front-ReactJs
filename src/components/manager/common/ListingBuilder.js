'use strict';

import React, {Component, PropTypes} from 'react';

import ItemDropzone from '../common/ItemDropzone';
import {DND} from '../../../constants/parameters';
import EmptyItem from '../common/EmptyItem';
import AddedItem from '../common/AddedItem';

class ListingBuilder extends Component {

  componentDidMount() {
    $(window).resize(this.onResize);
    this.onResize();
  }

  componentWillUnmount() {
    $(window).off("resize");
  }

  onResize = () => {
    const topBar = 68, form = 231;
    let height = $(window).height();

    if (this.refs.questionsWrapper) {
      $(this.refs.questionsWrapper).css('min-height', `${height - topBar - form}px`);
    }
  }

  render() {
    let {listing, ...other} = this.props;

    let renderItem = (item, key) => {
      return <AddedItem
        key={item.slug}
        item={item}
        removeItem={this.props.removeItem}
        moveItem={this.props.moveItem}
        openModal={this.props.openModal}
        duplicateItem={this.props.duplicateItem}
      />
    };

    return (
      <div className="container-fluid">
        <div className="row">
          <div id="sidebar">
            <nav>
              <EmptyItem {...other} type={{id: DND.TASK, label: 'Tâche'}} icon="task"/>
              <EmptyItem {...other} type={{id: DND.NOTICE, label: 'Info'}} icon="notice"/>
            </nav>
            <h3>Questions:</h3>
            <nav className="types">
              <EmptyItem {...other} type={{id: DND.DATA, label: 'Donnée'}} icon="data"/>
              <EmptyItem {...other} type={{id: DND.SELECT, label: 'Choix multiple'}} icon="select"/>
              <EmptyItem {...other} type={{id: DND.BOOL, label: 'Oui / Non'}} icon="bool"/>
              <EmptyItem {...other} type={{id: DND.LEVEL, label: 'Niveau'}} icon="level"/>
              <EmptyItem {...other} type={{id: DND.TEXT, label: 'Texte'}} icon="text"/>
            </nav>

          {/*
            <div className="group-input-custom search">
              <input type="text" required />
              <span className="highlight"></span>
              <span className="bar"></span>
              <label>Rechercher ...</label>
              <span className="iconRight icon-search"></span>
            </div>
            <nav className="questions">
              <a href="#">Douleur ?</a>
            </nav>
            */}
          </div>

          <div className="bgGradientWrapperProtocole questionsWrapper" id="questionsWrapper" ref="questionsWrapper">

            <ItemDropzone mkey="up"/>

            {this.props.items.length > 0 ? (
              <div>
              <ul className="items">
                {this.props.items.map(renderItem, this)}
              </ul>

              <ItemDropzone mkey="down"/>
              </div>
            ) : (
              <div className="empty-items">
                Pour commencer, glissez un premier élément dans la zone ci-dessus.
              </div>
            )}

          </div>
        </div>
      </div>
    );
  }
}

ListingBuilder.propTypes = {
  listing: PropTypes.object.isRequired,
};

export default ListingBuilder;