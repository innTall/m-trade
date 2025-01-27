import getSymbols from './getSymbols';
import getKlines from './getKlines';
import getAccountInfo from './getAccountInfo';
import placeOrder from './placeOrder';
import cancelOrder from './cancelOrder';
import getOrderHistory from './getOrderHistory';

const ByBit = {
  getKlines,
  getSymbols,
  getAccountInfo,
  placeOrder,
  cancelOrder,
  getOrderHistory,
};

export default ByBit;
