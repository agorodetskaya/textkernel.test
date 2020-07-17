import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { withStyles } from '@material-ui/core/styles';
import Backdrop from '@material-ui/core/Backdrop';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CircularProgress from '@material-ui/core/CircularProgress';
import CloseIcon from '@material-ui/icons/Close';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import PropTypes from 'prop-types';
import Switch from '@material-ui/core/Switch';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';

import StocksSelector from './components/StocksSelector';
import * as stocksActions from './actions/stocks';

import TimeSeriesWidget from 'widgets/timeSeries';
import ErrorSnackBar from 'components/ErrorSnackBar';

const styles = {
  chart: {
    width: '100%',
  },
  negative: {
    color: 'red',
    fontSize: 10,
    paddingLeft: '8px',
  },
  positive: {
    color: 'green',
    fontSize: 10,
    paddingLeft: '8px',
  },
  root: {
    padding: '8px',
  },
  stockInfo: {
    minWidth: '200px',
  },
};

class Page extends React.Component {
  constructor(props) {
    super(props);
    
    this.state = {
      needRefreshPrices: true,
      selectedStocks: [],
      timerId: null,
    };
  }
  
  componentDidMount() {
    this.props.actions.fetchAllStocks();
  }
  
  componentDidUpdate(prevProps, prevState) {
    const {
      needRefreshPrices,
      selectedStocks,
    } = this.state;
    
    if (
      (needRefreshPrices && !prevState.needRefreshPrices)
      || (
        selectedStocks.length
        && selectedStocks !== prevState.selectedStocks
      )
    ) {
      this.refreshPrices();
    }
  }
  
  refreshPrices() {
    const {
      needRefreshPrices,
      selectedStocks,
      timerId,
    } = this.state;
    
    clearTimeout(timerId);
    
    this.props.actions.fetchPrice({
      stocks: selectedStocks,
    }).then(() => {
      if (needRefreshPrices) {
        this.setState({
          timerId: setTimeout(() => this.refreshPrices(), 30 * 1000),
        });
      }
    });
  }
  
  changeRefreshPricesState = () => {
    const {
      needRefreshPrices,
      timerId,
    } = this.state;
    
    if (needRefreshPrices) {
      clearTimeout(timerId);
    } else {
      this.refreshPrices();
    }
    
    this.setState({
      needRefreshPrices: !needRefreshPrices,
    });
  };
  
  componentWillUnmount() {
    const {
      timerId,
    } = this.state;
    
    if (timerId) {
      clearTimeout(timerId);
    }
  }
  
  render() {
    const {
      actions,
      apiError,
      classes,
      isLoading,
      prices,
      stocksMap,
    } = this.props;
    
    const {
      needRefreshPrices,
      selectedStocks,
    } = this.state;
    
    return (
      <Grid className={classes.root} container direction="column">
        <Backdrop open={isLoading}>
          <CircularProgress color="primary" />
        </Backdrop>
        {!isLoading && (
          <Grid item>
            <Grid
              alignItems="center"
              container
              direction="column"
              spacing={2}
            >
              <Grid item>
                <StocksSelector
                  list={Object.values(stocksMap)}
                  onApply={selected => this.setState({ selectedStocks: selected })}
                  selectedSymbols={selectedStocks}
                />
              </Grid>
              {!!selectedStocks.length && (
                <>
                  <Grid item>
                    <FormControlLabel
                      control={(
                        <Switch
                          checked={needRefreshPrices}
                          color="primary"
                          onChange={this.changeRefreshPricesState}
                        />
                      )}
                      label="Refresh prices automatically"
                    />
                  </Grid>
                  <Grid item>
                    <Grid container direction="row" justify="center" spacing={2}>
                      {selectedStocks.map(symbol => {
                        let delta;
                        if (
                          prices[symbol]?.prevPrice
                          && prices[symbol]?.prevPrice !== prices[symbol]?.price
                        ) {
                          delta = Number(prices[symbol].price - prices[symbol].prevPrice)
                            .toFixed(2);
                        }
                        return (
                          <Grid item key={symbol}>
                            <Card className={classes.stockInfo}>
                              <CardContent>
                                <Grid container direction="column" spacing={1}>
                                  <Grid
                                    alignItems="center"
                                    container
                                    item
                                    justify="space-between"
                                    spacing={2}
                                  >
                                    <Grid item>
                                      <Tooltip placement="bottom-start" title={stocksMap[symbol]?.name}>
                                        <Typography color="primary">
                                          <strong>{symbol}</strong>
                                        </Typography>
                                      </Tooltip>
                                    </Grid>
                                    <Grid item>
                                      <IconButton
                                        onClick={() =>
                                          this.setState({
                                            selectedStocks: selectedStocks
                                              .filter(selected => selected !== symbol),
                                          })
                                        }
                                        size="small"
                                      >
                                        <CloseIcon fontSize="small" />
                                      </IconButton>
                                    </Grid>
                                  </Grid>
                                  <Grid item>
                                    <Typography variant="caption">Current price:</Typography>
                                  </Grid>
                                  <Grid item>
                                    <Typography variant="h6">
                                      <Typography>
                                        {prices[symbol]?.price || '-/-'}
                                        {!!delta && (
                                          <span
                                            className={delta > 0
                                              ? classes.positive
                                              : classes.negative}
                                          >
                                            {
                                              delta > 0
                                                ? `+${delta}`
                                                : delta
                                            }
                                          </span>
                                        )}
                                      </Typography>
                                    </Typography>
                                  </Grid>
                                </Grid>
                              </CardContent>
                            </Card>
                          </Grid>
                        );
                      })}
                    </Grid>
                  </Grid>
                  {!!selectedStocks.length && (
                    <Grid className={classes.chart} item>
                      <TimeSeriesWidget selectedStocks={selectedStocks} />
                    </Grid>
                  )}
                </>
              )}
            </Grid>
          </Grid>
        )}
        <ErrorSnackBar
          message={apiError}
          onClose={actions.hideApiError}
          open={!!apiError}
        />
      </Grid>
    );
  }
}

Page.propTypes = {
  actions: PropTypes.object.isRequired,
  apiError: PropTypes.string.isRequired,
  classes: PropTypes.object.isRequired,
  isLoading: PropTypes.bool.isRequired,
  prices: PropTypes.object.isRequired,
  stocksMap: PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
  apiError: state.stocks.apiError,
  isLoading: state.stocks.isLoading,
  prices: state.stocks.prices,
  stocksMap: state.stocks.stocksMap,
});

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(stocksActions, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(Page));
