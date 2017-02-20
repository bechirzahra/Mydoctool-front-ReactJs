"use strict";

import React, {Component, PropTypes} from 'react';
import {Link} from 'react-router';
import Formsy from 'formsy-react';

import UserBox from './UserBox';
import UserStore from '../../stores/userStore';
import ItemStore from '../../stores/itemStore';
import ItemActivityActionCreators from '../../actions/itemActivityActionCreators';
import {ITEM, CONFIG} from '../../constants/parameters';

import Loader from '../common/Loader';
import DocumentGrid from '../common/DocumentGrid';

import TaskBoxContent from './boxcontent/TaskBoxContent';
import NoticeBoxContent from './boxcontent/NoticeBoxContent';
import DataBoxContent from './boxcontent/DataBoxContent';
import SelectBoxContent from './boxcontent/SelectBoxContent';
import BoolBoxContent from './boxcontent/BoolBoxContent';
import LevelBoxContent from './boxcontent/LevelBoxContent';
import TextBoxContent from './boxcontent/TextBoxContent';

import Translator from '../../services/Translator';

const propTypes = {
  itemActivity: PropTypes.object.isRequired,
};

class ItemActivityBox extends Component {

  constructor(props) {
    super(props);

    this.state = {
      canSubmit: false,
      loading: false,
      open: false,
    };
  }

  componentWillReceiveProps(nextProps) {
    if (this.state.loading) {
      this.setState({loading: false});
    }
  }

  enableButton = () => {
    this.setState({canSubmit: true});
  }

  disableButton = () => {
    this.setState({canSubmit: false});
  }

  submit = (model) => {
    this.setState({loading: true});
    let slug = this.props.itemActivity.slug;
    ItemActivityActionCreators.answerItemActivity(slug, model);
  }

  toggleOverflow = () => {
    this.setState({open: !this.state.open});
  }

  render() {
    let {itemActivity} = this.props;
    let item = ItemStore.findBySlug(itemActivity.item_slug);

    let printableType = item.printable_type;
    let cN = '';
    let contentTemplate = null;
    let btnText = 'Ok';

    let contentProps = {
      item: item,
      itemActivity: itemActivity,
      files: this.state.files,
    };

    let title = '';

    switch (item.type) {
      case ITEM.TYPE_TASK:
        cN = printableType;
        contentTemplate = <TaskBoxContent {...contentProps} />;
        btnText = 'Fait';
        title = Translator.translate('TASK');
        break;
      case ITEM.TYPE_NOTICE:
        cN = printableType;
        contentTemplate = <NoticeBoxContent {...contentProps} />;
        title = Translator.translate('NOTICE');
        break;
      default:
        cN = 'question';
        btnText = 'Envoyer';
        title = Translator.translate('QUESTION');

        switch (item.question_type) {
          case ITEM.QUESTION_DATA:
            contentTemplate = <DataBoxContent {...contentProps} />;
            break;
          case ITEM.QUESTION_SELECT:
            contentTemplate = <SelectBoxContent {...contentProps} />;
            break;
          case ITEM.QUESTION_BOOL:
            contentTemplate = <BoolBoxContent {...contentProps} />;
            break;
          case ITEM.QUESTION_LEVEL:
            contentTemplate = <LevelBoxContent {...contentProps} />;
            break;
          case ITEM.QUESTION_TEXT:
            contentTemplate = <TextBoxContent {...contentProps} />;
            break;
        }
        break;
    }

    let renderDocument = (doc) => {
      const path = `${CONFIG.UPLOAD_ROOT}${doc.full_path}`;
      return (
        <li key={doc.slug}>
          <a href={path} target="_blank">
            <span className="icon icon-file"></span> <p>{doc.printable_name}</p>
          </a>
        </li>
      );
    };

    let doctor = UserStore.findById(item.owner_id);
    return (
      <Formsy.Form
          onValid={this.enableButton}
          onInvalid={this.disableButton}
          onValidSubmit={this.submit}
          className={`bloc ${cN} ${itemActivity.done ? 'done' : ''} ${this.state.open ? 'open' : ''}`}
          ref="myform"
        >

        {itemActivity.done ? (
          <div className="type"><span className="icon-check"></span> Effectué</div>
        ) : (
          <div className="type">{title}</div>
        )}

        <div className="header">
          <h4><span className={`icon icon-${printableType}`}></span>{item.name}</h4>
          <UserBox type="box"
            user={doctor}
            date={itemActivity.created_at}
          />
        </div>

        <div className="content" style={{position: 'relative'}}>
          {this.state.loading ? (
            <Loader/>
          ) : ''}

          {contentTemplate}

          <DocumentGrid documents={item.documents} />

          <ul className="filesDownload">
            {itemActivity.documents.map(renderDocument, this)}
          </ul>
        </div>

        {itemActivity.done || this.state.loading ? (
          <div className="overflow" onClick={this.toggleOverflow}></div>
        ) : (
          <div className="text-right">
            <button type="submit" className="btn">{btnText}</button>
          </div>
        )}

      </Formsy.Form>
    );
  }
}

ItemActivityBox.propTypes = propTypes;

export default ItemActivityBox;
