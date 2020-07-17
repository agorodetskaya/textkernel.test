import React from 'react';
import {
  AutoSizer,
  List,
} from 'react-virtualized';
import { withStyles } from '@material-ui/styles';
import Button from '@material-ui/core/Button';
import Chip from '@material-ui/core/Chip';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import Grid from '@material-ui/core/Grid';
import MenuItem from '@material-ui/core/MenuItem';
import PropTypes from 'prop-types';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';

const MAX_SELECTED_COUNT = 3;
const SEARCHING_DELAY = 400;

const styles = {
  actions: {
    flex: 1,
  },
  actionsGroup: {
    padding: '8px 20px',
  },
};

class StocksSelector extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      filterText: '',
      filteredList: props.list,
      isOpen: false,
      selectedSymbols: props.selectedSymbols,
      timerId: null,
    };
  }
  
  onSearch(value) {
    const {
      timerId,
    } = this.state;
    const {
      list,
    } = this.props;
    const normalizedValue = value.toLowerCase();
    
    clearTimeout(timerId);
    const newTimerId = setTimeout(
      () => {
        this.setState({
          filteredList: value
            ? list.filter(stock =>
              stock.name.toLowerCase().match(normalizedValue)
              || stock.symbol.toLowerCase().match(normalizedValue),
            )
            : list,
          timerId: null,
        });
      },
      SEARCHING_DELAY,
    );
    
    this.setState({ timerId: newTimerId });
  }
  
  onOpen = () => {
    this.setState({
      filterText: '',
      filteredList: this.props.list,
      isOpen: true,
      selectedSymbols: this.props.selectedSymbols,
    });
  };
  
  onClose = () => {
    clearTimeout(this.state.timerId);
    this.setState({
      isOpen: false,
      timerId: null,
    });
  };
  
  componentWillUnmount() {
    const {
      timerId,
    } = this.state;
    clearTimeout(timerId);
  }
  
  render() {
    const {
      filterText,
      filteredList,
      isOpen,
      selectedSymbols,
    } = this.state;
    
    const {
      classes,
      list,
      onApply,
    } = this.props;
    
    return (
      <>
        <Button
          color="primary"
          disabled={!list.length}
          onClick={this.onOpen}
          variant="contained"
        >
          Select stock type
        </Button>
        <Dialog
          fullWidth
          onClose={() => this.setState({ isOpen: false })}
          open={isOpen}
        >
          <DialogContent>
            <Grid container direction="column" spacing={2}>
              <Grid item>
                <TextField
                  autoFocus
                  fullWidth
                  onChange={({ target }) => {
                    const value = target.value;
                    this.setState({
                      filterText: value,
                    });
                    this.onSearch(value);
                  }}
                  value={filterText}
                />
              </Grid>
              <Grid item>
                <Typography variant="caption">
                  Available stocks: {filteredList.length}
                </Typography>
              </Grid>
              {!!selectedSymbols.length && (
                <Grid item>
                  <Grid container spacing={1}>
                    {selectedSymbols.map(symbol => (
                      <Grid item key={symbol}>
                        <Chip
                          color="primary"
                          label={<Typography>{symbol}</Typography>}
                          onDelete={() =>
                            this.setState({
                              selectedSymbols: selectedSymbols.filter(selected => selected !== symbol),
                            })
                          }
                        />
                      </Grid>
                    ))}
                  </Grid>
                </Grid>
              )}
              <Grid item>
                <AutoSizer disableHeight>
                  {({ width }) => (
                    <List
                      height={384}
                      rowCount={filteredList.length}
                      rowHeight={48}
                      rowRenderer={({
                        index,
                        key,
                        style,
                      }) => {
                        let stock = filteredList[index];
                        const isSelected = selectedSymbols.includes(stock.symbol);
                        return (
                          <MenuItem
                            key={key}
                            onClick={() => {
                              if (isSelected || MAX_SELECTED_COUNT !== selectedSymbols.length) {
                                const newSelected = isSelected
                                  ? selectedSymbols.filter(symbol => symbol !== stock.symbol)
                                  : [...selectedSymbols, stock.symbol];
                                this.setState({ selectedSymbols: newSelected });
                              }
                            }}
                            selected={isSelected}
                            style={style}
                          >
                            {stock.symbol} ({stock.name})
                          </MenuItem>
                        );
                      }}
                      width={width}
                    />
                  )}
                </AutoSizer>
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Grid
              alignItems="center"
              className={classes.actionsGroup}
              container
              justify="space-between"
              spacing={1}
            >
              <Grid item>
                {MAX_SELECTED_COUNT === selectedSymbols.length && (
                  <Typography color="error">
                    Maximum {MAX_SELECTED_COUNT}
                  </Typography>
                )}
              </Grid>
              <Grid className={classes.actions} item>
                <Grid container direction="row" justify="flex-end" spacing={3}>
                  <Grid item>
                    <Button
                      color="default"
                      onClick={this.onClose}
                      variant="contained"
                    >
                      Cancel
                    </Button>
                  </Grid>
                  <Grid item>
                    <Button
                      color="primary"
                      onClick={() => {
                        onApply(selectedSymbols);
                        this.onClose();
                      }}
                      variant="contained"
                    >
                      Apply
                    </Button>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </DialogActions>
        </Dialog>
      </>
    );
  }
}

StocksSelector.propTypes = {
  classes: PropTypes.object,
  list: PropTypes.array,
  onApply: PropTypes.func.isRequired,
  selectedSymbols: PropTypes.array,
};

StocksSelector.defaultProps = {
  list: [],
  selectedSymbols: [],
};

export default withStyles(styles)(StocksSelector);
