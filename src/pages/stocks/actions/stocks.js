import {
  ERROR_RECEIVE_ALL_STOCKS,
  ERROR_RECEIVE_PRICE,
  HIDE_API_ERROR,
  RECEIVE_ALL_STOCKS,
  RECEIVE_PRICE,
} from '../constants/actionTypes';

import config from 'config';

const DEFAULT_HEADERS = {
  'Accept': 'application/json',
  'Content-Type': 'application/json',
};

export const fetchAllStocks =
  () => dispatch =>
    fetch(
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
        
        return dispatch({
          stocks: response.data,
          type: RECEIVE_ALL_STOCKS,
        });
      })
      .catch(error => dispatch({
        apiError: error.message || error,
        type: ERROR_RECEIVE_ALL_STOCKS,
      }));

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
