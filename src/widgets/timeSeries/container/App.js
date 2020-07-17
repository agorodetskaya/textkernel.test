import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip as RechartsTooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CircularProgress from '@material-ui/core/CircularProgress';
import FormControl from '@material-ui/core/FormControl';
import Grid from '@material-ui/core/Grid';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import PropTypes from 'prop-types';
import Select from '@material-ui/core/Select';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import moment from 'moment';

import * as timeSeriesActions from '../actions/timeSeries';
import {
  formatDateRange,
  generateColour,
  getDateRange,
} from '../utils/utils';
import {
  CUSTOM,
  DATE_RANGES,
  TODAY,
} from '../constants/dateRanges';

import ErrorSnackBar from 'components/ErrorSnackBar';

const styles = {
  chart: {
    height: '100%',
    marginTop: '42px',
  },
  dateRange: {
    minWidth: '150px',
  },
};

class App extends React.Component {
  constructor(props) {
    super(props);
    
    const today = formatDateRange(moment());
    
    this.state = {
      dateRangeType: TODAY,
      fromDate: today,
      toDate: today,
    };
  }
  
  componentDidMount() {
    this.refreshTimeSeries();
  }
  
  componentDidUpdate(prevProps, prevState) {
    const {
      fromDate,
      toDate,
    } = this.state;
    const {
      selectedStocks,
    } = this.props;
    
    if (
      fromDate !== prevState.fromDate
      || toDate !== prevState.toDate
      || selectedStocks !== prevProps.selectedStocks
    ) {
      this.refreshTimeSeries();
    }
  }
  
  refreshTimeSeries = () => {
    const {
      fromDate,
      toDate,
    } = this.state;
    const {
      selectedStocks,
    } = this.props;
    this.props.actions.fetchTimeSeries({
      fromDate,
      stocks: selectedStocks,
      toDate,
    });
  };
  
  render() {
    const {
      actions,
      apiError,
      classes,
      isLoading,
      selectedStocks,
      timeSeries,
    } = this.props;
    
    const {
      dateRangeType,
      fromDate,
      toDate,
    } = this.state;
    
    const colorMap = selectedStocks.reduce(
      (result, symbol) => {
        result[symbol] = generateColour(symbol);
        return result;
      },
      {},
    );
    
    return (
      <Grid alignItems="center" container direction="column">
        <Grid item>
          <FormControl className={classes.dateRange}>
            <InputLabel id="date-range">Date Range</InputLabel>
            <Select
              id="date-range"
              labelId="date-range"
              onChange={({ target }) => {
                const {
                  from,
                  to,
                } = getDateRange({
                  dateRangeType: target.value,
                  fromDate,
                  toDate,
                });
                
                this.setState({
                  dateRangeType: target.value,
                  fromDate: from,
                  toDate: to,
                });
              }}
              value={dateRangeType}
            >
              {DATE_RANGES.map(range => (
                <MenuItem
                  key={range.id}
                  value={range.id}
                >
                  {range.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        {dateRangeType === CUSTOM && (
          <Grid item>
            <Grid alignItems="center" container justify="center" spacing={4}>
              <Grid item>
                <TextField
                  InputLabelProps={{
                    shrink: true,
                  }}
                  format="YYYY-MM-DD"
                  id="from-date"
                  inputProps={{
                    max: toDate,
                  }}
                  label="From"
                  onChange={({ target }) =>
                    this.setState({
                      fromDate: target.value,
                    })
                  }
                  type="date"
                  value={fromDate}
                />
              </Grid>
              <Grid item>
                <TextField
                  InputLabelProps={{
                    shrink: true,
                  }}
                  format="YYYY-MM-DD"
                  id="to-date"
                  inputProps={{
                    max: moment(),
                    min: fromDate,
                  }}
                  label="To"
                  onChange={({ target }) =>
                    this.setState({
                      toDate: target.value,
                    })
                  }
                  type="date"
                  value={toDate}
                />
              </Grid>
            </Grid>
          </Grid>
        )}
        {!isLoading && (
          <Grid container item justify="flex-end">
            <Grid item>
              <Button
                color="primary"
                onClick={this.refreshTimeSeries}
                variant="contained"
              >
                Refresh
              </Button>
            </Grid>
          </Grid>
        )}
        <Grid className={classes.chart} container item justify="center">
          {isLoading && (
            <CircularProgress />
          )}
          {!isLoading && !timeSeries.length && (
            <Typography variant="h3">
              No Data. Please select another stocks or date range
            </Typography>
          )}
          {!!timeSeries.length && !isLoading && (
            <ResponsiveContainer maxHeight={900} minHeight={450}>
              <LineChart
                data={timeSeries}
                margin={{
                  bottom: 5,
                  left: 10,
                  right: 20,
                  top: 5,
                }}
                padding={{
                  bottom: 40,
                }}
              >
                <XAxis
                  dataKey="x"
                  padding={{
                    left: 16,
                    right: 16,
                  }}
                  tickCount={5}
                  tickFormatter={timestamp => moment.unix(timestamp).format('Do MMM HH:mm')}
                />
                <YAxis />
                <RechartsTooltip
                  content={({ active, label, payload }) => {
                    if (active) {
                      return (
                        <Card variant="elevation">
                          <CardContent>
                            <Grid container direction="column" spacing={2}>
                              <Grid item>
                                <Typography variant="h6">
                                  <strong>
                                    {moment.unix(label).format('YYYY Do MMM HH:mm')}
                                  </strong>
                                </Typography>
                              </Grid>
                              <Grid item>
                                {payload.map(data => (
                                  <Typography key={data.name}>
                                    <strong>{data.name}</strong><span>: {data.value}</span>
                                  </Typography>
                                ))}
                              </Grid>
                            </Grid>
                          </CardContent>
                        </Card>
                      );
                    }
                    
                    return null;
                  }}
                />
                {selectedStocks.map(stock => (
                  <Line
                    animationDuration={300}
                    connectNulls
                    dataKey={stock}
                    dot={null}
                    key={stock}
                    stroke={colorMap[stock]}
                  />
                ))}
                <Legend
                  margin={{ top: 40 }}
                />
              </LineChart>
            </ResponsiveContainer>
          )}
        </Grid>
        <ErrorSnackBar
          message={apiError}
          onClose={actions.hideApiError}
          open={!!apiError}
        />
      </Grid>
    );
  }
}

App.propTypes = {
  actions: PropTypes.object.isRequired,
  apiError: PropTypes.string.isRequired,
  classes: PropTypes.object.isRequired,
  isLoading: PropTypes.bool.isRequired,
  selectedStocks: PropTypes.array.isRequired,
  timeSeries: PropTypes.array.isRequired,
};

const mapStateToProps = (state) => ({
  apiError: state.apiError,
  isLoading: state.isLoading,
  timeSeries: state.timeSeries,
});

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(timeSeriesActions, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(App));
