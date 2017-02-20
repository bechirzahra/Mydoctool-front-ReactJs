'use strict';

import React, {Component} from 'react';
import {ITEM, CHART} from '../../../constants/parameters';
import dateFormat from 'dateformat-light';
import ItemActivitiesChart from './ItemActivitiesChart';
import utils from '../../../services/utils';
import ItemActivityStore from '../../../stores/itemActivityStore';
import isodate from "isodate";

class ItemActivityBlock extends Component {
  render() {

    let {item, user} = this.props;
    let itemActivities = [];
    let itemActivity = null;

    let more = '';
    let cN = '';

    switch(item.type) {
      case ITEM.TYPE_NOTICE:
        more = '';
        break;

      // TASK case: we should check if done or not.
      case ITEM.TYPE_TASK:

        // We should check the number of days between the last time this Task was done, and now
        itemActivities = ItemActivityStore.filterByItemSlugAndUserId(item.slug, user.id);

        itemActivities = _.sortBy(itemActivities, (iA) => {
          return iA.updated_at;
        });

        // console.log(itemActivities);

        let i = 0;
        while (itemActivity === null && i < itemActivities.length) {
          // We take the first not done itemActivity (the older one)
          if (itemActivities[i] && !itemActivities[i].done) {
            itemActivity = itemActivities[i];
          }
          i++;
        }

        // Just in case we have no match, we display the last one
        if (itemActivity === null) {
          itemActivity = itemActivities[itemActivities.length - 1];
        }

        if (item.alerts && item.alerts[0].conditions) {
          let days = item.alerts[0].conditions[0].answer.value;
          var daysBetween = Math.ceil(utils.daysBetween(isodate(itemActivity.created_at), new Date()));

          if (daysBetween >= days) {
            cN = 'noResponse';
          }
        }

        return (
          <div className={"row response " + cN}>
            <div className="col-xs-5">
              <p className="question">{item.name}</p>
            </div>

            <div className="col-xs-7">
              <p className="textError">Tâche non effectuée</p>
              <p className="lateNumber">{daysBetween} jours de retard</p>
            </div>
          </div>
        );

        break;

      default:
        cN = 'col-xs-3 kpi';

        itemActivities = ItemActivityStore.filterDoneByItemSlugAndUserId(item.slug, user.id);

        // Sort from oldest to newest
        itemActivities = _.sortBy(itemActivities, (iA) => {
          return iA.updated_at;
        });

        if (itemActivities[itemActivities.length - 1]) {
          itemActivity = itemActivities[itemActivities.length - 1];
        }

        switch(item.question_type) {

          case ITEM.QUESTION_DATA:
            more = `${itemActivity.answer}<span class="sup">${item.unit}</span>`;
            break;

          case ITEM.QUESTION_LEVEL:
            more = `${itemActivity.answer}<span class="sup">/${item.max}</span>`;
            break;

          case ITEM.QUESTION_BOOL:
            more = itemActivity.answer ? 'Oui' : 'Non';
            cN = cN + ' txt';
            break;

          default:
            more = `${itemActivity.answer}`;
            break;
        }
    }

    return (
      <div className="row response">
        <div className="col-xs-5">
          <p className="question">{item.name}</p>
          <p className="date">{itemActivity !== null ? dateFormat(isodate(itemActivity.updated_at), 'dddd d mmmm yyyy') : '-'}</p>
        </div>

        <div className={cN} dangerouslySetInnerHTML={{__html: more}} />

        <div className="col-xs-4 no-padding">
          <ItemActivitiesChart
            item={item}
            itemActivities={itemActivities}
            width={140}
            height={35}
            activitiesRange={CHART.TWO_WEEKS}
          />
        </div>
      </div>
    );
  }
}

export default ItemActivityBlock;