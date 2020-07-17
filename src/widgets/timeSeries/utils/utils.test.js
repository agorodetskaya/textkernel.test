import moment from 'moment';

import {
  DATE_FORMAT,
  generateColour,
  getInterval,
} from './utils';

describe('Stocks utils', () => {
  
  // delta 0
  it('getInterval edges for 1min', () => {
    const now = moment().format(DATE_FORMAT);
    const interval = getInterval({
      fromDate: now,
      toDate: now,
    });
    expect(interval).toEqual('1min');
    
    // check smaller interval out of edge
    const biggerInterval = getInterval({
      fromDate: moment().subtract(1, 'day').format(DATE_FORMAT),
      toDate: now,
    });
    expect(biggerInterval).not.toEqual('1min');
  });
  
  // delta 1
  it('getInterval edges for 5min', () => {
    const interval = getInterval({
      fromDate: moment().subtract(1, 'day').format(DATE_FORMAT),
      toDate: moment(),
    });
    expect(interval).toEqual('5min');
    
    // check another intervals out of edge
    const topOtOfEdgeInterval = getInterval({
      fromDate: moment().subtract(2, 'day').format(DATE_FORMAT),
      toDate: moment(),
    });
    const bottomOutOfEdgeInterval = getInterval({
      fromDate: moment(),
      toDate: moment(),
    });
    expect(topOtOfEdgeInterval).not.toEqual('5min');
    expect(bottomOutOfEdgeInterval).not.toEqual('5min');
  });
  
  // delta 2-3
  it('getInterval edges for 15min', () => {
    const topEdgeInterval = getInterval({
      fromDate: moment().subtract(3, 'day').format(DATE_FORMAT),
      toDate: moment().format(DATE_FORMAT),
    });
    const bottomEdgeInterval = getInterval({
      fromDate: moment().subtract(2, 'day').format(DATE_FORMAT),
      toDate: moment().format(DATE_FORMAT),
    });
    expect(topEdgeInterval).toEqual('15min');
    expect(bottomEdgeInterval).toEqual('15min');
    
    // check another intervals out of edge
    const topOtOfEdgeInterval = getInterval({
      fromDate: moment().subtract(4, 'day').format(DATE_FORMAT),
      toDate: moment(),
    });
    const bottomOutOfEdgeInterval = getInterval({
      fromDate: moment().subtract(1, 'day').format(DATE_FORMAT),
      toDate: moment(),
    });
    expect(topOtOfEdgeInterval).not.toEqual('15min');
    expect(bottomOutOfEdgeInterval).not.toEqual('15min');
  });
  
  // delta 4
  it('getInterval edges for 30min', () => {
    const interval = getInterval({
      fromDate: moment().subtract(4, 'day').format(DATE_FORMAT),
      toDate: moment().format(DATE_FORMAT),
    });
    expect(interval).toEqual('30min');
    
    // check another intervals out of edge
    const topOtOfEdgeInterval = getInterval({
      fromDate: moment().subtract(5, 'day').format(DATE_FORMAT),
      toDate: moment(),
    });
    const bottomOutOfEdgeInterval = getInterval({
      fromDate: moment().subtract(3, 'day').format(DATE_FORMAT),
      toDate: moment(),
    });
    expect(topOtOfEdgeInterval).not.toEqual('30min');
    expect(bottomOutOfEdgeInterval).not.toEqual('30min');
  });
  
  // delta 5-6
  it('getInterval edges for 45min', () => {
    const topEdgeInterval = getInterval({
      fromDate: moment().subtract(6, 'day').format(DATE_FORMAT),
      toDate: moment().format(DATE_FORMAT),
    });
    const bottomEdgeInterval = getInterval({
      fromDate: moment().subtract(5, 'day').format(DATE_FORMAT),
      toDate: moment().format(DATE_FORMAT),
    });
    expect(topEdgeInterval).toEqual('45min');
    expect(bottomEdgeInterval).toEqual('45min');
    
    // check another intervals out of edge
    const topOtOfEdgeInterval = getInterval({
      fromDate: moment().subtract(7, 'day').format(DATE_FORMAT),
      toDate: moment(),
    });
    const bottomOutOfEdgeInterval = getInterval({
      fromDate: moment().subtract(4, 'day').format(DATE_FORMAT),
      toDate: moment(),
    });
    expect(topOtOfEdgeInterval).not.toEqual('45min');
    expect(bottomOutOfEdgeInterval).not.toEqual('45min');
  });
  
  // delta 7 -10
  it('getInterval edges for 1h', () => {
    const topEdgeInterval = getInterval({
      fromDate: moment().subtract(10, 'day').format(DATE_FORMAT),
      toDate: moment().format(DATE_FORMAT),
    });
    const bottomEdgeInterval = getInterval({
      fromDate: moment().subtract(7, 'day').format(DATE_FORMAT),
      toDate: moment().format(DATE_FORMAT),
    });
    expect(topEdgeInterval).toEqual('1h');
    expect(bottomEdgeInterval).toEqual('1h');
    
    // check another intervals out of edge
    const topOtOfEdgeInterval = getInterval({
      fromDate: moment().subtract(11, 'day').format(DATE_FORMAT),
      toDate: moment(),
    });
    const bottomOutOfEdgeInterval = getInterval({
      fromDate: moment().subtract(6, 'day').format(DATE_FORMAT),
      toDate: moment(),
    });
    expect(topOtOfEdgeInterval).not.toEqual('1h');
    expect(bottomOutOfEdgeInterval).not.toEqual('1h');
  });
  
  // delta 11-15
  it('getInterval edges for 4h', () => {
    const topEdgeInterval = getInterval({
      fromDate: moment().subtract(15, 'day').format(DATE_FORMAT),
      toDate: moment().format(DATE_FORMAT),
    });
    const bottomEdgeInterval = getInterval({
      fromDate: moment().subtract(11, 'day').format(DATE_FORMAT),
      toDate: moment().format(DATE_FORMAT),
    });
    expect(topEdgeInterval).toEqual('4h');
    expect(bottomEdgeInterval).toEqual('4h');
    
    // check another intervals out of edge
    const topOtOfEdgeInterval = getInterval({
      fromDate: moment().subtract(16, 'day').format(DATE_FORMAT),
      toDate: moment(),
    });
    const bottomOutOfEdgeInterval = getInterval({
      fromDate: moment().subtract(10, 'day').format(DATE_FORMAT),
      toDate: moment(),
    });
    expect(topOtOfEdgeInterval).not.toEqual('4h');
    expect(bottomOutOfEdgeInterval).not.toEqual('4h');
  });
  
  // delta 16-90
  it('getInterval edges for 1day', () => {
    const topEdgeInterval = getInterval({
      fromDate: moment().subtract(90, 'day').format(DATE_FORMAT),
      toDate: moment().format(DATE_FORMAT),
    });
    const bottomEdgeInterval = getInterval({
      fromDate: moment().subtract(16, 'day').format(DATE_FORMAT),
      toDate: moment().format(DATE_FORMAT),
    });
    expect(topEdgeInterval).toEqual('1day');
    expect(bottomEdgeInterval).toEqual('1day');
    
    // check another intervals out of edge
    const topOtOfEdgeInterval = getInterval({
      fromDate: moment().subtract(91, 'day').format(DATE_FORMAT),
      toDate: moment(),
    });
    const bottomOutOfEdgeInterval = getInterval({
      fromDate: moment().subtract(15, 'day').format(DATE_FORMAT),
      toDate: moment(),
    });
    expect(topOtOfEdgeInterval).not.toEqual('1day');
    expect(bottomOutOfEdgeInterval).not.toEqual('1day');
  });
  
  // delta 91-500
  it('getInterval edges for 1week', () => {
    const topEdgeInterval = getInterval({
      fromDate: moment().subtract(500, 'day').format(DATE_FORMAT),
      toDate: moment().format(DATE_FORMAT),
    });
    const bottomEdgeInterval = getInterval({
      fromDate: moment().subtract(91, 'day').format(DATE_FORMAT),
      toDate: moment().format(DATE_FORMAT),
    });
    expect(topEdgeInterval).toEqual('1week');
    expect(bottomEdgeInterval).toEqual('1week');
    
    // check another intervals out of edge
    const topOtOfEdgeInterval = getInterval({
      fromDate: moment().subtract(501, 'day').format(DATE_FORMAT),
      toDate: moment(),
    });
    const bottomOutOfEdgeInterval = getInterval({
      fromDate: moment().subtract(89, 'day').format(DATE_FORMAT),
      toDate: moment(),
    });
    expect(topOtOfEdgeInterval).not.toEqual('1week');
    expect(bottomOutOfEdgeInterval).not.toEqual('1week');
  });
  
  // delta >= 501
  it('getInterval edges for 1month', () => {
    const interval = getInterval({
      fromDate: moment().subtract(501, 'day').format(DATE_FORMAT),
      toDate: moment().format(DATE_FORMAT),
    });
    const unrealBigInterval = getInterval({
      fromDate: moment().subtract(5000, 'day').format(DATE_FORMAT),
      toDate: moment().format(DATE_FORMAT),
    });
    expect(interval).toEqual('1month');
    expect(unrealBigInterval).toEqual('1month');
    
    // check another intervals out of edge
    const bottomOutOfEdgeInterval = getInterval({
      fromDate: moment().subtract(500, 'day').format(DATE_FORMAT),
      toDate: moment(),
    });
    expect(bottomOutOfEdgeInterval).not.toEqual('1month');
  });
  
  it('generateColour the same color for the same string', () => {
    expect(generateColour('Blabla')).toEqual(generateColour('Blabla'));
  });
  
  it('generateColour different color for different strings', () => {
    expect(generateColour('Blabla')).not.toEqual(generateColour('Blabla2'));
  });
  
})
;
