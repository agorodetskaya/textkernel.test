import {
  ERROR_RECEIVE_ALL_STOCKS,
  ERROR_RECEIVE_PRICE,
  HIDE_API_ERROR,
  RECEIVE_ALL_STOCKS,
  RECEIVE_PRICE,
} from '../constants/actionTypes';

export const initialState = {
  apiError: '',
  isLoading: true,
  prices: {},
  stocksMap: {},
};

export default function (state = initialState, action) {
  switch (action.type) {
    case RECEIVE_ALL_STOCKS: {
      return {
        ...state,
        isLoading: false,
        stocksMap: action.stocks.reduce(
          (result, stock) => {
            result[stock.symbol] = stock;
            return result;
          },
          {},
        ),
      };
    }
    
    case ERROR_RECEIVE_ALL_STOCKS: {
      return {
        ...state,
        apiError: action.apiError,
        isLoading: false,
      };
    }
    
    case RECEIVE_PRICE: {
      let prices = action.prices;
      
      if (action.requestedStocks.length === 1) {
        prices = {
          [action.requestedStocks[0]]: action.prices,
        };
      }
      
      return {
        ...state,
        prices: Object.entries(prices).reduce(
          (result, [key, value]) => {
            result[key] = {
              ...value,
              prevPrice: value.price !== state.prices[key]?.price
                ? state.prices[key]?.price
                : state.prices[key]?.prevPrice,
            };
            return result;
          },
          {},
        ),
      };
    }
    
    case ERROR_RECEIVE_PRICE: {
      return {
        ...state,
        apiError: action.apiError,
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
