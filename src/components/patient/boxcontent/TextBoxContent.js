'use strict';

import React, {Component, PropTypes} from 'react';

import Dropzone from 'react-dropzone';

import TextareaMDT from '../../common/TextareaMDT';
import InputMDT from '../../common/InputMDT';
import FileMDT from '../../common/FileMDT';
import Autolinker from 'autolinker';

const propTypes = {
  item: PropTypes.object.isRequired,
  done: PropTypes.bool
};

const defaultProps = {
  done: false
};

class TextBoxContent extends Component {

  render() {
    let {itemActivity, item} = this.props;
    let done = itemActivity.done;
    let templateInput = '';
    let htmlContent = Autolinker.link(item.text.replace(/(?:\r\n|\r|\n)/g, '<br />'));

    if (!done) {
      templateInput = item.text_answer_short ? (
        <InputMDT type="text"
          layout="timeline"
          name="answerText"
          value={itemActivity.answerText}
          label=""
          placeholder="Saisissez la réponse"
          required
        />
      ) : (
        <TextareaMDT
          name="answerText"
          value={itemActivity.answerText}
          label=""
          placeholder="Saisissez la réponse"
          required
        />
      );
    } else {
      templateInput = (
        <div>{itemActivity.answer}</div>
      );
    }

    let renderFile = (file) => {
      return (
        <div className="col-md-4" key={"fi" + file.lastModified + file.size}>
          <div className="item attachement">
            <span className="icon-close"></span>
            <span className="icon-file"></span>
            <p>{file.name}</p>
          </div>
        </div>
      );
    };

    return (
      <div>
          {!done ? (
            <div className="form-group noPadding">
              <label dangerouslySetInnerHTML={{__html: htmlContent}} />
            </div>
          ) : ''}


          {templateInput}

          {!done ? (
            <div className="filesActions row">
              <FileMDT
                name="answerFile"
                layout="answer"
              />
            </div>
          ) : ''}
      </div>
    );
  }
}

TextBoxContent.propTypes = propTypes;
TextBoxContent.defaultProps = defaultProps;

export default TextBoxContent;
