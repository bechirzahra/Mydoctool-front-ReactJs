'use strict';

import React from 'react';
import Utils from '../../../services/utils';
import dateFormat from 'dateformat-light';
import {UNIT} from '../../../constants/parameters';
import isodate from "isodate";

class ListingProgress extends React.Component {
  render() {
    let {UserListing, listing} = this.props;
    let startDate = isodate(UserListing.created_at);
    let endDate = Utils.addTimeIntervalToDate(startDate, listing.duration_value, listing.duration_unit);
    let totalTime = new Date(endDate.getTime() - startDate.getTime()).getTime();
    let todayTime = new Date(new Date().getTime() - startDate.getTime()).getTime();
    let percent = Math.min(100, Math.max(0, Math.ceil(todayTime/totalTime * 100)));

    let cN = this.props.className || 'row';

    if (listing.duration_unit == UNIT.END) {
      return (
        <div className="row">
          <div className="col-sm-12 dateFrom">
            <p>Commencé le {dateFormat(startDate, 'dd/mm')}</p>
          </div>
        </div>
      );
    }

    return (
      <div className={cN}>
        <div className="col-sm-2 dateFrom">
          <p>{dateFormat(startDate, 'dd/mm')}</p>
        </div>
        <div className="col-sm-8">
          <div className="percent">
            <div className="current" style={{width: `${percent}%`}}></div>
          </div>
        </div>
        <div className="col-sm-2 dateTo">
          <p>{dateFormat(endDate, 'dd/mm')}</p>
        </div>
      </div>
    );
  }
}

export default ListingProgress;