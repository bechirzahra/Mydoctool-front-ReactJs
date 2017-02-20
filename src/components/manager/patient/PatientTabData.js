'use strict';

import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import dateFormat from 'dateformat-light';
import isodate from "isodate";
import {Overlay} from 'react-bootstrap';
import {Line} from 'react-chartjs';

import UserStore from '../../../stores/userStore';
import MessageStore from '../../../stores/messageStore';
import AlertStore from '../../../stores/alertStore';
import ListingStore from '../../../stores/listingStore';
import ItemStore from '../../../stores/itemStore';
import ItemActivityStore from '../../../stores/itemActivityStore';
import {ITEM, CHART} from '../../../constants/parameters';

import ItemActivitiesChart from '../common/ItemActivitiesChart';

class PatientTabData extends Component {

  constructor(props) {
    super(props);

    this.state = {
      popoverShow: false,
      popoverItemActivity: null,
      popoverItem: null,
      popoverTop: 0,
      popoverWidth: 0,
      activitiesRange: CHART.TWO_WEEKS
    };
  }

  toggle = (iASlug, event) => {
    let iA = ItemActivityStore.findBySlug(iASlug);
    let item = ItemStore.findBySlug(iA.item_slug);

    let $clearfix = $(event.target).parents('.items').siblings('.clearfix');
    let height = $clearfix.offset().top + $clearfix.height();
    let baseHeight = $(this.refs.days).offset().top;
    let popoverTop = height - baseHeight + 5;

    this.setState({
      popoverShow: !this.state.popoverShow,
      popoverItem: item,
      popoverItemActivity: iA,
      popoverTop: popoverTop,
      popoverWidth: $clearfix.width()
    });
  }

  changeActivitiesRange = (event) => {
    this.setState({activitiesRange: parseInt(event.target.value, 10)});
  }

  render() {

    let {user, itemActivities} = this.props;

    // We should filter the active item activities by date
    // We have to group those activities by
    let groupedItemActivities = _.groupBy(itemActivities, (iA) => {
      let d = isodate(iA.created_at);
      return `${d.getFullYear()}${d.getUTCMonth()}${d.getUTCDate()}`;
    });

    // let's sort those activities by date, DESC
    groupedItemActivities = _.sortByOrder(groupedItemActivities, (iAA, k) => {
      return isodate(iAA[0].created_at).getTime();
    }, 'desc');



    let renderItemActivity = (iA) => {
      let item = ItemStore.findBySlug(iA.item_slug);

      if (!item) {
        return '';
      }

      // Let's find if this item has an alert associated
      let alert = AlertStore.findByItemActivitySlug(iA.slug);

      let content = '';

      let itemClassName = 'item';
      let contentClassName = 'content';

      switch (item.type) {
        case ITEM.TYPE_TASK:
          if (alert && alert !== null) {
            itemClassName += ' alertTask';
          }
          content = item.text;
          break;

        case ITEM.TYPE_NOTICE:
          content = item.text;
          break;

        default:
          if (alert && alert !== null) {
            itemClassName += ' alertQuestion';
          }

          if (!iA.done) {
            content = '?';
            contentClassName += " number";
          } else {
          switch (item.question_type) {
            case ITEM.QUESTION_DATA:
              contentClassName += " number";
              content = `${iA.answer}<span>${item.unit}</span>`;
              break;

            case ITEM.QUESTION_LEVEL:
              contentClassName += " number";
              content = `${iA.answer}<span>${item.max}</span>`;
              break;

            case ITEM.QUESTION_BOOL:
              contentClassName += " number";
              content = iA.answer ? 'Oui' : 'Non';
              break;

            case ITEM.QUESTION_SELECT:
              _.each(iA.answer, (v, k) => {
                if (v) {
                  let option = _.find(item.options, (opt) => {
                    return opt.value === k;
                  });
                  if (option) {
                    content += `<p>${option.label}</p>`;
                  }
                }
              });
              break;

            default:
              content = iA.answer;
              break;
          }
        }
      }

      if (this.state.popoverItemActivity !== null && iA.slug === this.state.popoverItemActivity.slug) {
        itemClassName += ' active';
      }

      return (
        <li key={iA.slug} className={itemClassName} onClick={this.toggle.bind(this, iA.slug)}>
          <p className="title">{item.name}</p>
          <div className={contentClassName} dangerouslySetInnerHTML={{__html: content}} />
        </li>
      );
    };



    let renderDailyItemActivity = (iAs, iADate) => {

      return (
        <li className="day" key={iADate}>
          <div className="lane"></div>
          <div className="puce"></div>
          <div className="date">{dateFormat(isodate(iAs[0].created_at), 'd mmmm yyyy')}</div>

          <ul className="items">
            {iAs.map(renderItemActivity, this)}
          </ul>
          <div className="clearfix"></div>
        </li>
      );
    };



    let renderPopover = () => {
      if (!this.state.popoverShow || this.state.popoverItem === null) {
        return (
          <div id="popoverItemPatient" className="popover" style={{marginTop: -10000}}>
          </div>
        );
      }

      const style = {
        marginTop: this.state.popoverTop + 'px',
        width: this.state.popoverWidth,
      };

      let {user} = this.props,
        item = this.state.popoverItem,
        more = '';

      let iAs = ItemActivityStore.filterDoneByItemSlugAndUserId(item.slug, user.id);

      // Sort from oldest to newest
      iAs = _.sortBy(iAs, (iA) => {
        return iA.created_at;
      });

      switch (item.type) {
        case ITEM.TYPE_TASK:
          break;

        case ITEM.TYPE_NOTICE:
          break;

        default:
          switch (item.question_type) {
            case ITEM.QUESTION_TEXT:
              more = (
                <p>{iAs[iAs.length - 1].answer}</p>
              );
              break;

            default:
              more = (
                <div>
                  <div className="col-sm-3 col-md-2 col-lg-2">
                    <select name="activities-range" onChange={this.changeActivitiesRange.bind(this)} value={this.state.activitiesRange}>
                      <option value={CHART.TWO_WEEKS}>2 semaines</option>
                      <option value={CHART.ONE_MONTH}>1 mois</option>
                      <option value={CHART.THREE_MONTHS}>3 mois</option>
                      <option value={CHART.SIX_MONTHS}>6 mois</option>
                      <option value={CHART.ONE_YEAR}>1 an</option>
                    </select>
                  </div>
                  <div className="col-sm-9 col-md-10 col-lg-10" style={{height: 150}}>
                    <ItemActivitiesChart
                      item={item}
                      itemActivities={iAs}
                      showTooltips={true}
                      activitiesRange={this.state.activitiesRange}
                      width={200}
                      height={150}
                    />
                  </div>
                </div>
              );
              break;
          }
          break;
      }

      return (
        <div id="popoverItemPatient" className="popover" style={style}>
          <div className="title">{this.state.popoverItem.name}</div>
          <div className="date">Répondu le {dateFormat(isodate(this.state.popoverItemActivity.updated_at), 'dddd d mmmm yyyy')}</div>
          <div className="content">
            {more}
          </div>
        </div>
        );
    };


    /**
    * MAIN return method
    */
    return (
      <div className="timelineContent">
        <div className="row types">
          <div className="col-lg-12">
            <div className="alerts">
              <p>Questions</p>
              <p className="number">{AlertStore.getOpenQuestionAlerts(user.id).length}</p>
            </div>
            <div className="tasks">
              <p>Tâches</p>
              <p className="number">{AlertStore.getOpenTaskAlerts(user.id).length}</p>
            </div>
          </div>
        </div>

        <div className="row timeline">
          <div className="col-lg-12">
            <ul className="days" ref="days">
              {groupedItemActivities.map(renderDailyItemActivity, this)}
            </ul>

            <Overlay
              show={this.state.popoverShow}
              onHide={() => this.setState({ popoverShow: false, popoverItemActivity: null, popoverItem: null })}
              placement="bottom"
              container={this.refs.days}
              rootClose={true}
            >
              {renderPopover()}
            </Overlay>
          </div>
        </div>
      </div>
    );
  }
}

export default PatientTabData;
