import moment from 'moment';

import {
  ERROR_RECEIVE_TIME_SERIES,
  HIDE_API_ERROR,
  RECEIVE_TIME_SERIES,
  REQUEST_TIME_SERIES,
} from '../constants/actionTypes';
import {
  RANGE_DATE_FORMAT,
} from '../constants/dateFormats';

export const initialState = {
  apiError: '',
  isLoading: true,
  timeSeries: [],
};

export default function (state = initialState, action) {
  switch (action.type) {
    case REQUEST_TIME_SERIES: {
      return {
        ...state,
        isLoading: true,
      };
    }
    
    case RECEIVE_TIME_SERIES: {
      const {
        fromDate,
        requestedStocks,
        timeSeries,
        toDate,
      } = action;
  
      const adaptedFromDate = moment(fromDate, RANGE_DATE_FORMAT)
        .startOf('day');
      const adaptedToDate = moment(toDate, RANGE_DATE_FORMAT)
        .endOf('day');
      
      const seriesByTimestamp = (
        requestedStocks.length > 1
          ? Object.entries(timeSeries)
          : [[requestedStocks[0], timeSeries]]
      )
        .filter(entry => entry[1].values)
        .reduce(
          (result, [key, value]) => {
            value.values.forEach(val => {
              const datetime = moment(val.datetime);
  
              // filter incorrect datetime points (sometimes Tilda returns wrong)
              if (
                datetime.isSameOrBefore(adaptedToDate)
                && datetime.isSameOrAfter(adaptedFromDate)
              ) {
                result[datetime.unix()] = {
                  ...result[datetime.unix()],
                  [key]: parseFloat(val.close),
                };
              }
            });
            return result;
          },
          {},
        );
  
      return {
        ...state,
        isLoading: false,
        timeSeries: Object.entries(seriesByTimestamp)
          .map(([key, value]) => ({
            x: parseInt(key, 10),
            ...value,
          })),
      };
    }
    
    case ERROR_RECEIVE_TIME_SERIES: {
      return {
        ...state,
        apiError: action.apiError,
        isLoading: false,
      };
    }
  
    case HIDE_API_ERROR: {
      return {
        ...state,
        apiError: '',
      };
    }
    
    default:
      return state;
  }
}
