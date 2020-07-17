import moment from 'moment';

import reducer, { initialState } from './timeSeries';
import {
  ERROR_RECEIVE_TIME_SERIES,
  HIDE_API_ERROR,
  RECEIVE_TIME_SERIES,
  REQUEST_TIME_SERIES,
} from '../constants/actionTypes';

const baseState = JSON.parse(JSON.stringify(initialState));

describe('Stocks reducer', () => {
  
  // must be exactly the same object
  it('transit action must not make changes', () => {
    const action = {
      type: 'SOME_OTHER_ACTION',
    };
    
    expect(baseState === reducer(baseState, action)).toBeTruthy();
  });
  
  it('HIDE_API_ERROR should hide apiError', () => {
    const currentBaseState = {
      ...baseState,
      apiError: 'My error',
    };
    
    const action = { type: HIDE_API_ERROR };
    const expectedState = {
      ...baseState,
      apiError: '',
    };
    
    expect(reducer(currentBaseState, action)).toEqual(expectedState);
  });
  
  // must group points by timestamp
  // must filter incorrect timestamps
  it('RECEIVE_TIME_SERIES should correctly convert to timeSeries. Requested 2 pages.stocks', () => {
    const commonDatetime = '2020-07-13 16:30:00';
    const aaplDatetime = '2020-07-13 21:45:00';
    // out of requested date range
    const tslaWrongDatetime = '2010-07-22 21:40:00';
    const aaplClose1 = '111.11';
    const aaplClose2 = '111.22';
    const tslaClose = '111.33';
    
    const timeSeries = {
      'AAPL': {
        values: [
          // datetime for both AAPL and TSLA
          {
            close: aaplClose1,
            datetime: commonDatetime,
            high: '100.18',
            low: '100.97',
            open: '100.37',
            volume: '1373353',
          },
          // datetime only for AAPL
          {
            close: aaplClose2,
            datetime: aaplDatetime,
            high: '100.47',
            low: '100.11',
            open: '100.38',
            volume: '0',
          },
        ],
      },
      'TSLA': {
        values: [
          // datetime for both AAPL and TSLA
          {
            close: tslaClose,
            datetime: commonDatetime,
            high: '100.82',
            low: '100.83',
            open: '100.08',
            volume: '0',
          },
          // wrong datetime
          {
            close: tslaClose,
            datetime: tslaWrongDatetime,
            high: '100.82',
            low: '100.83',
            open: '100.08',
            volume: '0',
          },
        ],
      },
    };
    const action = {
      fromDate: '2020-07-13',
      requestedStocks: ['AAPL', 'TSLA'],
      timeSeries,
      toDate: '2020-07-13',
      type: RECEIVE_TIME_SERIES,
    };
    
    const prevState = {
      ...baseState,
      isLoading: true,
    };
    
    const expectedState = {
      ...baseState,
      isLoading: false,
      timeSeries: [
        {
          ['AAPL']: parseFloat(aaplClose1),
          ['TSLA']: parseFloat(tslaClose),
          x: moment(commonDatetime).unix(),
        },
        {
          ['AAPL']: parseFloat(aaplClose2),
          x: moment(aaplDatetime).unix(),
        },
      ],
    };
    
    expect(reducer(prevState, action)).toEqual(expectedState);
  });
  
  // for 1 stock it return another response structure
  it('RECEIVE_TIME_SERIES should correctly convert to timeSeries. Requested 1 stock', () => {
    const datetime1 = '2020-07-13 00:00:00';
    const datetime2 = '2020-07-13 23:59:59';
    const datetimeWrong = '2020-07-14 00:00:00';
    const close1 = '111.11';
    const close2 = '111.22';
    
    const timeSeries = {
      meta: {
        symbol: 'TSLA',
      },
      values: [
        {
          close: close1,
          datetime: datetime1,
          high: '100.18',
          low: '100.97',
          open: '100.37',
          volume: '1373353',
        },
        {
          close: close2,
          datetime: datetime2,
          high: '100.18',
          low: '100.97',
          open: '100.37',
          volume: '1373353',
        },
        // wrong date
        {
          close: '100.18',
          datetime: datetimeWrong,
          high: '100.18',
          low: '100.97',
          open: '100.37',
          volume: '1373353',
        },
      ],
    };
    const action = {
      fromDate: '2020-07-13',
      requestedStocks: ['TSLA'],
      timeSeries,
      toDate: '2020-07-13',
      type: RECEIVE_TIME_SERIES,
    };
    
    const prevState = {
      ...baseState,
      isLoading: true,
    };
    
    const expectedState = {
      ...baseState,
      isLoading: false,
      timeSeries: [
        {
          ['TSLA']: parseFloat(close1),
          x: moment(datetime1).unix(),
        },
        {
          ['TSLA']: parseFloat(close2),
          x: moment(datetime2).unix(),
        },
      ],
    };
    
    expect(reducer(prevState, action)).toEqual(expectedState);
  });
  
  it('REQUEST_TIME_SERIES set loading flag', () => {
    const action = {
      type: REQUEST_TIME_SERIES,
    };
    
    const expectedState = {
      ...baseState,
      isLoading: true,
    };
    
    expect(reducer(baseState, action)).toEqual(expectedState);
  });
  
  it('ERROR_RECEIVE_TIME_SERIES set loading flag to false and add apiError', () => {
    const action = {
      apiError: 'My error time series!',
      type: ERROR_RECEIVE_TIME_SERIES,
    };
    
    const prevState = {
      ...baseState,
      isLoading: true,
    };
    
    const expectedState = {
      ...baseState,
      apiError: 'My error time series!',
      isLoading: false,
    };
    
    expect(reducer(prevState, action)).toEqual(expectedState);
  });
  
})
;
