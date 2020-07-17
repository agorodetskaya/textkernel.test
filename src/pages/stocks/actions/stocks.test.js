import configureMockStore from 'redux-mock-store';
import fetchMock from 'fetch-mock';
import thunk from 'redux-thunk';

import * as actions from './stocks';
import * as actionTypes from '../constants/actionTypes';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

const stocks = [
  {
    country: 'Canada',
    exchange: 'TSXV',
    name: 'Appulse Corp',
    symbol: 'APL',
    type: 'Common Stock',
  },
  {
    country: 'United States',
    exchange: 'OTC',
    name: 'Alps Alpine Co Ltd.',
    symbol: 'APELY',
    type: 'American Depositary Receipt',
  },
];
const prices = {
  'AAPL': {
    price: '391.02',
  },
  'TSLA': {
    price: '1546.88',
  },
};

describe('Stocks actions', () => {
  afterEach(() => {
    fetchMock.restore();
  });
  
  it('fetchAllStocks calls ERROR_RECEIVE_ALL_STOCKS', () => {
    fetchMock.getOnce('*', {
      body: {
        code: 429,
        message: 'My message',
        status: 'error',
      },
      headers: { 'content-type': 'application/json' },
    });
    
    const expectedActions = [
      {
        apiError: `${429}: My message`,
        type: actionTypes.ERROR_RECEIVE_ALL_STOCKS,
      },
    ];
    
    const store = mockStore({});
    
    return store.dispatch(actions.fetchAllStocks())
      .then(() => {
        expect(store.getActions()).toEqual(expectedActions);
        expect(fetchMock.called()).toBeTruthy();
      });
  });
  
  it('fetchAllStocks calls RECEIVE_ALL_STOCKS', () => {
    fetchMock.getOnce('*', {
      body: {
        data: stocks,
        status: 'ok',
      },
      headers: { 'content-type': 'application/json' },
    });
    
    const expectedActions = [
      {
        stocks,
        type: actionTypes.RECEIVE_ALL_STOCKS,
      },
    ];
    
    const store = mockStore({});
    
    return store.dispatch(actions.fetchAllStocks())
      .then(() => {
        expect(store.getActions()).toEqual(expectedActions);
        expect(fetchMock.called()).toBeTruthy();
      });
  });
  
  it('fetchPrice calls RECEIVE_PRICE', () => {
    const requestedStocks = ['TSLA', 'AAPL'];
    
    fetchMock.get('*', {
      body: prices,
      headers: { 'content-type': 'application/json' },
    });
    
    const expectedActions = [
      {
        prices,
        requestedStocks,
        type: actionTypes.RECEIVE_PRICE,
      },
    ];
    
    const store = mockStore({});
    
    return store.dispatch(actions.fetchPrice({ stocks: requestedStocks }))
      .then(() => {
        expect(store.getActions()).toEqual(expectedActions);
        expect(fetchMock.called()).toBeTruthy();
      });
  });
  
  it('fetchPrice calls ERROR_RECEIVE_PRICE', () => {
    const requestedStocks = ['TSLA'];
    
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
        apiError: `${429}: no-no-no`,
        type: actionTypes.ERROR_RECEIVE_PRICE,
      },
    ];
    
    const store = mockStore({});
    
    return store.dispatch(actions.fetchPrice({ stocks: requestedStocks }))
      .then(() => {
        expect(store.getActions()).toEqual(expectedActions);
        expect(fetchMock.called()).toBeTruthy();
      });
  });
});
