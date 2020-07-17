import reducer, { initialState } from './stocks';
import {
  ERROR_RECEIVE_ALL_STOCKS,
  ERROR_RECEIVE_PRICE,
  HIDE_API_ERROR,
  RECEIVE_ALL_STOCKS,
  RECEIVE_PRICE,
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
  
  it('RECEIVE_ALL_STOCKS should convert correctly to stocksMap', () => {
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
    const action = {
      stocks: stocks,
      type: RECEIVE_ALL_STOCKS,
    };
    
    const expectedState = {
      ...baseState,
      isLoading: false,
      stocksMap: {
        ['APELY']: {
          country: 'United States',
          exchange: 'OTC',
          name: 'Alps Alpine Co Ltd.',
          symbol: 'APELY',
          type: 'American Depositary Receipt',
        },
        ['APL']: {
          country: 'Canada',
          exchange: 'TSXV',
          name: 'Appulse Corp',
          symbol: 'APL',
          type: 'Common Stock',
        },
      },
    };
    
    expect(reducer(baseState, action)).toEqual(expectedState);
  });
  
  it('RECEIVE_PRICE should correctly convert to prices. Requested 2', () => {
    const prices = {
      'AAPL': {
        price: '391.02',
      },
      'TSLA': {
        price: '1546.88',
      },
    };
    const action = {
      prices,
      requestedStocks: ['AAPL', 'TSLA'],
      type: RECEIVE_PRICE,
    };
    
    // AAPL: price is different to new price, so it should appears in new state as "prevPrice"
    // TSLA: doesn't exist in prev state, so should be added to new state
    const prevState = {
      ...baseState,
      prices: {
        'AAPL': {
          price: '10.33',
        },
      },
    };
    const expectedState = {
      ...baseState,
      prices: {
        'AAPL': {
          prevPrice: '10.33',
          price: '391.02',
        },
        'TSLA': {
          price: '1546.88',
        },
      },
    };
    
    expect(reducer(prevState, action)).toEqual(expectedState);
  });
  
  it('RECEIVE_PRICE should correctly convert to prices when requested 1', () => {
    const prices = {
      price: '391.02',
    };
    const action = {
      prices,
      requestedStocks: ['TSLA'],
      type: RECEIVE_PRICE,
    };
    
    const expectedState = {
      ...baseState,
      prices: {
        'TSLA': {
          price: '391.02',
        },
      },
    };
    
    expect(reducer(baseState, action)).toEqual(expectedState);
  });
  
  it('ERROR_RECEIVE_ALL_STOCKS set loading flag to false and add apiError', () => {
    const action = {
      apiError: 'My error!',
      type: ERROR_RECEIVE_ALL_STOCKS,
    };
    
    const expectedState = {
      ...baseState,
      apiError: 'My error!',
      isLoading: false,
    };
    
    expect(reducer(baseState, action)).toEqual(expectedState);
  });
  
  it('ERROR_RECEIVE_PRICE set apiError', () => {
    const action = {
      apiError: 'My error price!',
      type: ERROR_RECEIVE_PRICE,
    };
    
    const expectedState = {
      ...baseState,
      apiError: 'My error price!',
    };
    
    expect(reducer(baseState, action)).toEqual(expectedState);
  });
  
})
;
