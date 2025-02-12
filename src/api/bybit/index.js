import getInstrumentsInfo from './getInstrumentsInfo';
import getKlines from './getKlines';
import getAccountInfo from './getAccountInfo';
import placeOrder from './placeOrder';
import cancelOrder from './cancelOrder';
import getOrderHistory from './getOrderHistory';
import setLeverage from './setLeverage';
import cancelAllOrders from './cancelAllOrders';

const ByBit = {
  getKlines,
  getInstrumentsInfo,
  getAccountInfo,
  placeOrder,
  cancelOrder,
  getOrderHistory,
  setLeverage,
  cancelAllOrders,
};

export default ByBit;
