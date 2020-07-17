import React from 'react';
import Proptypes from 'prop-types';
import { Typography } from '@material-ui/core';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import Snackbar from '@material-ui/core/Snackbar';

const ErrorSnackBar = ({
  message,
  onClose,
  open,
}) => (
  <Snackbar
    action={(
      <IconButton
        color="inherit"
        onClick={onClose}
      >
        <CloseIcon />
      </IconButton>
    )}
    message={(
      <>
        <Typography>An error occurred</Typography>
        <Typography>{message}</Typography>
      </>
    )}
    onClose={onClose}
    open={open}
  />
);

ErrorSnackBar.propTypes = {
  message: Proptypes.string,
  onClose: Proptypes.func,
  open: Proptypes.bool,
};

export default ErrorSnackBar;