'use strict';

import {UNIT} from '../constants/parameters';

class Utils {

  generateUid(prefix = '') {
    return prefix + Math.random().toString(36).substr(2);
  }

  capitalizeFirstLetter(string) {
    if (string) {
      return string.charAt(0).toUpperCase() + string.slice(1);
    } else {
      return '';
    }
  }

  addTimeIntervalToDate(date, tValue, tUnit) {

    let daysToAdd = parseInt(tValue, 10);

    switch(tUnit) {
      case UNIT.WEEK:
        daysToAdd = daysToAdd * 7;
        break;

      case UNIT.MONTH:
        daysToAdd = daysToAdd * 30;
        break;

      case UNIT.YEAR:
        daysToAdd = daysToAdd * 365;
        break;
    }

    let newDate = new Date(date.getTime() + daysToAdd*24*60*60*1000);
    return newDate;
  }

  isValidDate(d) {
    if ( Object.prototype.toString.call(d) !== "[object Date]" )
      return false;
    return !isNaN(d.getTime());
  }

  treatAsUTC(date) {
      var result = new Date(date);
      result.setMinutes(result.getMinutes() - result.getTimezoneOffset());
      return result;
  }

  daysBetween(startDate, endDate) {
    var millisecondsPerDay = 24 * 60 * 60 * 1000;
    return (this.treatAsUTC(endDate) - this.treatAsUTC(startDate)) / millisecondsPerDay;
  }

}

export default new Utils();