import moment from 'moment';

import {
  formatDateRange,
  getInterval,
} from '../utils/utils';
import { RANGE_DATE_FORMAT } from '../constants/dateFormats';
import {
  ERROR_RECEIVE_TIME_SERIES,
  HIDE_API_ERROR,
  RECEIVE_TIME_SERIES,
  REQUEST_TIME_SERIES,
} from '../constants/actionTypes';

import config from 'config';

const TIME_ZONE = Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC';
const DEFAULT_HEADERS = {
  'Accept': 'application/json',
  'Content-Type': 'application/json',
};

export const fetchTimeSeries = ({
  fromDate,
  stocks,
  toDate,
}) => (dispatch) => {
  const interval = getInterval({
    fromDate,
    toDate,
  });
  
  dispatch({
    type: REQUEST_TIME_SERIES,
  });
  
  const adaptedToDate = formatDateRange(
    moment(toDate, RANGE_DATE_FORMAT)
      .add(1, 'day'),
  );
  
  return fetch(
    // eslint-disable-next-line max-len
    `${config.BASE_URL}/time_series?apikey=${config.API_KEY}&symbol=${stocks}&interval=${interval}&start_date=${fromDate}&end_date=${adaptedToDate}&timezone=${TIME_ZONE}&dp=2&order=ASC`,
    {
      headers: DEFAULT_HEADERS,
    },
  )
    .then(response => {
      if (!response.ok) {
        return response.json()
          .then(error => {
            throw new Error(`${response.status}: ${error.message}`);
          });
      }
      return response.json();
    })
    .then(response => {
      if (response.status === 'error') {
        if (response.code === 400) {
          return {};
        }
        return Promise.reject(`${response.code}: ${response.message}`);
      }
      return response;
    })
    .then(response => dispatch({
      fromDate,
      requestedStocks: stocks,
      timeSeries: response,
      toDate,
      type: RECEIVE_TIME_SERIES,
    }))
    .catch(error => dispatch({
      apiError: error.message || error,
      type: ERROR_RECEIVE_TIME_SERIES,
    }));
};

export const hideApiError = () => ({
  type: HIDE_API_ERROR,
});
