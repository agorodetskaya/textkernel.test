import configureMockStore from 'redux-mock-store';
import fetchMock from 'fetch-mock';
import moment from 'moment';
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
  
  it('fetchAllStocks do not request if exists in localstorage', () => {
    const removeItemFunc = jest.fn(id => expect(id).toEqual('ALL_STOCKS_STORAGE_ID'));
    const setItemFunc = jest.fn(() => null);
    const getItemFunc = jest.fn(() => JSON.stringify({
      expirationDate: moment().add(3, 'hour').unix(),
      payload: stocks,
    }));
    
    Object.defineProperty(window, 'localStorage', {
      value: {
        getItem: getItemFunc,
        removeItem: removeItemFunc,
        setItem: setItemFunc,
      },
      writable: true,
    });
    
    fetchMock.get('*', {
      body: {
        data: [],
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
        expect(removeItemFunc).not.toBeCalled();
        expect(setItemFunc).not.toBeCalled();
        expect(getItemFunc).toBeCalledWith('ALL_STOCKS_STORAGE_ID');
        expect(fetchMock.called()).toBeFalsy();
      });
  });
  
  it('fetchAllStocks delete-refetch-restore in localstorage', () => {
    const removeItemFunc = jest.fn(id => expect(id).toEqual('ALL_STOCKS_STORAGE_ID'));
    const setItemFunc = jest.fn(() => null);
    const getItemFunc = jest.fn(() => JSON.stringify({
      expirationDate: moment().subtract(3, 'hour').unix(),
      payload: stocks,
    }));
    
    Object.defineProperty(window, 'localStorage', {
      value: {
        getItem: getItemFunc,
        removeItem: removeItemFunc,
        setItem: setItemFunc,
      },
      writable: true,
    });
    
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
        expect(removeItemFunc).toBeCalledWith('ALL_STOCKS_STORAGE_ID');
        expect(getItemFunc).toBeCalledWith('ALL_STOCKS_STORAGE_ID');
        expect(setItemFunc).toBeCalled();
        expect(fetchMock.called()).toBeTruthy();
      });
  });
  
  it('fetchAllStocks calls ERROR_RECEIVE_ALL_STOCKS', () => {
    const removeItemFunc = jest.fn(() => null);
    const setItemFunc = jest.fn(() => null);
    const getItemFunc = jest.fn(() => null);
    
    Object.defineProperty(window, 'localStorage', {
      value: {
        getItem: getItemFunc,
        removeItem: removeItemFunc,
        setItem: setItemFunc,
      },
      writable: true,
    });
    
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
        expect(removeItemFunc).not.toBeCalled();
        expect(setItemFunc).not.toBeCalled();
        expect(getItemFunc).toBeCalled();
        expect(store.getActions()).toEqual(expectedActions);
        expect(fetchMock.called()).toBeTruthy();
      });
  });
  
  it('fetchAllStocks calls RECEIVE_ALL_STOCKS', () => {
    const removeItemFunc = jest.fn(() => null);
    const setItemFunc = jest.fn(() => null);
    const getItemFunc = jest.fn(() => null);
    
    Object.defineProperty(window, 'localStorage', {
      value: {
        getItem: getItemFunc,
        removeItem: removeItemFunc,
        setItem: setItemFunc,
      },
      writable: true,
    });
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
        expect(removeItemFunc).not.toBeCalled();
        expect(getItemFunc).toBeCalled();
        expect(setItemFunc).toBeCalled();
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
