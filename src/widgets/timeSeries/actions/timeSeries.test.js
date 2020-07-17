import configureMockStore from 'redux-mock-store';
import fetchMock from 'fetch-mock';
import thunk from 'redux-thunk';

import * as actions from './timeSeries';
import * as actionTypes from '../constants/actionTypes';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

const timeSeries = {
  meta: {
    symbol: 'TSLA',
  },
  values: [
    {
      close: '100.37',
      datetime: '2020-07-13 16:30:00',
      high: '100.18',
      low: '100.97',
      open: '100.37',
      volume: '1373353',
    },
  ],
};

describe('Stocks actions', () => {
  afterEach(() => {
    fetchMock.restore();
  });
  
  it('fetchTimeSeries calls RECEIVE_TIME_SERIES', () => {
    const toDate = '2020-07-13';
    const requestedStocks = ['TSLA'];
    const fromDate = '2020-07-13';
    
    fetchMock.get('*', {
      body: timeSeries,
      headers: { 'content-type': 'application/json' },
    });
    
    const expectedActions = [
      {
        type: actionTypes.REQUEST_TIME_SERIES,
      },
      {
        fromDate,
        requestedStocks,
        timeSeries,
        toDate,
        type: actionTypes.RECEIVE_TIME_SERIES,
      },
    ];
    
    const store = mockStore({});
    
    return store.dispatch(actions.fetchTimeSeries({
      fromDate,
      stocks: requestedStocks,
      toDate,
    }))
      .then(() => {
        expect(store.getActions()).toEqual(expectedActions);
        expect(fetchMock.called()).toBeTruthy();
      });
  });
  
  it('fetchTimeSeries calls ERROR_RECEIVE_TIME_SERIES', () => {
    const toDate = '2020-07-13';
    const requestedStocks = ['TSLA'];
    const fromDate = '2020-07-13';
    
    fetchMock.get('*', {
      body: {
        code: 429,
        message: 'no-no-no',
        status: 'error',
      },
      headers: { 'content-type': 'application/json' },
    });
    
    const expectedActions = [
      {
        type: actionTypes.REQUEST_TIME_SERIES,
      },
      {
        apiError: `${429}: no-no-no`,
        type: actionTypes.ERROR_RECEIVE_TIME_SERIES,
      },
    ];
    
    const store = mockStore({});
    
    return store.dispatch(actions.fetchTimeSeries({
      fromDate,
      stocks: requestedStocks,
      toDate,
    }))
      .then(() => {
        expect(store.getActions()).toEqual(expectedActions);
        expect(fetchMock.called()).toBeTruthy();
      });
  });
  
  it('fetchTimeSeries ignore 400 error', () => {
    const toDate = '2020-07-13';
    const requestedStocks = ['TSLA'];
    const fromDate = '2020-07-13';
    
    fetchMock.get('*', {
      body: {
        code: 400,
        message: 'no-no-no',
        status: 'error',
      },
      headers: { 'content-type': 'application/json' },
    });
    
    const expectedActions = [
      {
        type: actionTypes.REQUEST_TIME_SERIES,
      },
      {
        fromDate,
        requestedStocks,
        timeSeries: {},
        toDate,
        type: actionTypes.RECEIVE_TIME_SERIES,
      },
    ];
    
    const store = mockStore({});
    
    return store.dispatch(actions.fetchTimeSeries({
      fromDate,
      stocks: requestedStocks,
      toDate,
    }))
      .then(() => {
        expect(store.getActions()).toEqual(expectedActions);
        expect(fetchMock.called()).toBeTruthy();
      });
  });
});
