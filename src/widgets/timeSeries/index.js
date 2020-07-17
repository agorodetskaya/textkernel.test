import React from 'react';
import PropTypes from 'prop-types';
import { Provider } from 'react-redux';
import {
  applyMiddleware,
  createStore,
} from 'redux';
import thunkMiddleware from 'redux-thunk';

import timeSeriesReducer from './reducers/timeSeries';
import App from './container/App';

class Index extends React.PureComponent {
  
  constructor(props) {
    super(props);
    this.store = applyMiddleware(thunkMiddleware)(createStore)(timeSeriesReducer);
  }
  
  render() {
    return (
      <Provider store={this.store}>
        <App {...this.props} />
      </Provider>
    );
  }
}

Index.propTypes = {
  selectedStocks: PropTypes.array.isRequired,
};

export default Index;