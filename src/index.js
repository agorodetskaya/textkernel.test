import React from 'react';
import { Provider } from 'react-redux';
import { applyMiddleware, createStore, combineReducers } from 'redux';
import ReactDOM from 'react-dom';
import thunkMiddleware from 'redux-thunk';

import StocksPage from './pages/stocks/Page';
import ErrorBoundary from './components/ErrorBoundary';
import stocksReducer from './pages/stocks/reducers/stocks';

const reducers = combineReducers({
  stocks: stocksReducer,
});

ReactDOM.render(
  <React.StrictMode>
    <Provider store={applyMiddleware(thunkMiddleware)(createStore)(reducers)}>
      <ErrorBoundary>
        <StocksPage />
      </ErrorBoundary>
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
);
