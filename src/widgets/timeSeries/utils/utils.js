import moment from 'moment';

import {
  CUSTOM,
  THIS_MONTH,
  THIS_WEEK,
  THIS_YEAR,
  TODAY,
  YESTERDAY,
} from '../constants/dateRanges';
import {
  RANGE_DATE_FORMAT,
} from '../constants/dateFormats';

/**
 * Returns adaptive interval depending on time delta between from and to
 */
export const getInterval = ({
  fromDate,
  toDate,
}) => {
  const diff = moment(toDate).diff(moment(fromDate), 'days');
  if (diff === 0) {
    return '1min';
  }
  if (diff <= 1) {
    return '5min';
  }
  if (diff <= 3) {
    return '15min';
  }
  if (diff <= 4) {
    return '30min';
  }
  if (diff <= 6) {
    return '45min';
  }
  if (diff <= 10) {
    return '1h';
  }
  if (diff <= 15) {
    return '4h';
  }
  if (diff <= 90) {
    return '1day';
  }
  if (diff <= 500) {
    return '1week';
  }
  return '1month';
};

/**
 * Returns exact from and to dates for given date range type
 */
export const getDateRange = ({
  dateRangeType,
  fromDate,
  toDate,
}) => {
  switch (dateRangeType) {
    case (TODAY): {
      const today = moment();
      return ({
        from: formatDateRange(today),
        to: formatDateRange(today),
      });
    }
    
    case (YESTERDAY): {
      const yesterday = moment().subtract(1, 'days');
      return ({
        from: formatDateRange(yesterday),
        to: formatDateRange(yesterday),
      });
    }
    
    case (THIS_WEEK): {
      return ({
        from: formatDateRange(moment().startOf('week')),
        to: formatDateRange(moment()),
      });
    }
    
    case (THIS_MONTH): {
      return ({
        from: formatDateRange(moment().startOf('month')),
        to: formatDateRange(moment()),
      });
    }
    
    case (THIS_YEAR): {
      return ({
        from: formatDateRange(moment().startOf('year')),
        to: formatDateRange(moment()),
      });
    }
    
    case (CUSTOM): {
      return ({
        from: fromDate,
        to: toDate,
      });
    }
  }
};

export const formatDateRange = date => {
  return moment.isMoment(date)
    ? date.format(RANGE_DATE_FORMAT)
    : moment(date).format(RANGE_DATE_FORMAT);
};

/**
 * Generates random color for a given stock
 * Colors generated for the same stock are consistent
 */
export const generateColour = str => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  let colour = '#';
  for (let i = 0; i < 3; i++) {
    const value = (hash >> (i * 8)) & 0xFF;
    colour += ('00' + value.toString(16)).substr(-2);
  }
  return colour;
};
