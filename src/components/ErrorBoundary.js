import React from 'react';
import Proptypes from 'prop-types';
import { Typography } from '@material-ui/core';

/**
 * Component to catch unhandled errors during rendering.
 */
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      message: '',
    };
  }
  
  static getDerivedStateFromError(error) {
    return {
      hasError: true,
      message: error?.message,
    };
  }
  
  render() {
    const {
      hasError,
      message,
    } = this.state;
    if (hasError) {
      return (
        <>
          <h1>An error occurred</h1>
          <Typography>{message}</Typography>
        </>
      );
    }
    
    return this.props.children;
  }
}

ErrorBoundary.propTypes = {
  children: Proptypes.node,
};

export default ErrorBoundary;