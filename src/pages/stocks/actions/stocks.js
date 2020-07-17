import moment from 'moment';

import {
  ERROR_RECEIVE_ALL_STOCKS,
  ERROR_RECEIVE_PRICE,
  HIDE_API_ERROR,
  RECEIVE_ALL_STOCKS,
  RECEIVE_PRICE,
} from '../constants/actionTypes';

import config from 'config';

const ALL_STOCKS_STORAGE_ID = 'ALL_STOCKS_STORAGE_ID';
const DEFAULT_HEADERS = {
  'Accept': 'application/json',
  'Content-Type': 'application/json',
};

export const fetchAllStocks =
  () => dispatch => {
    const storedData = localStorage.getItem(ALL_STOCKS_STORAGE_ID);
    if (storedData) {
      const stocksData = JSON.parse(storedData);
      if (
        moment.unix(stocksData.expirationDate).isAfter(moment())
        && stocksData.payload?.length
      ) {
        dispatch({
          stocks: stocksData.payload,
          type: RECEIVE_ALL_STOCKS,
        });
        return Promise.resolve();
      } else {
        localStorage.removeItem(ALL_STOCKS_STORAGE_ID);
      }
    }
    
    return fetch(
      `${config.BASE_URL}/stocks?apikey=${config.API_KEY}`,
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
          return Promise.reject(`${response.code}: ${response.message}`);
        }
  
        localStorage.setItem(
          ALL_STOCKS_STORAGE_ID,
          JSON.stringify({
            expirationDate: moment().add(3, 'hour').unix(),
            payload: response.data,
          }),
        );
      
        return dispatch({
          stocks: response.data,
          type: RECEIVE_ALL_STOCKS,
        });
      })
      .catch(error => dispatch({
        apiError: error.message || error,
        type: ERROR_RECEIVE_ALL_STOCKS,
      }));
  };

export const fetchPrice = ({
  stocks,
}) => (dispatch) =>
  fetch(
    `${config.BASE_URL}/price?apikey=${config.API_KEY}&symbol=${stocks}&dp=2`,
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
    .then(response => {
      return dispatch({
        prices: response,
        requestedStocks: stocks,
        type: RECEIVE_PRICE,
      });
    })
    .catch(error => dispatch({
      apiError: error.message || error,
      type: ERROR_RECEIVE_PRICE,
    }));

export const hideApiError = () => ({
  type: HIDE_API_ERROR,
});
