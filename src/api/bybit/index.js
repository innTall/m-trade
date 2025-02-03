import getSymbols from './getSymbols';
import getKlines from './getKlines';
import getAccountInfo from './getAccountInfo';
import placeOrder from './placeOrder';
import cancelOrder from './cancelOrder';
import getOrderHistory from './getOrderHistory';
import getSpotMarginState from './getSpotMarginState';

const ByBit = {
  getKlines,
  getSymbols,
  getAccountInfo,
  placeOrder,
  cancelOrder,
  getOrderHistory,
  getSpotMarginState,
};

export default ByBit;
