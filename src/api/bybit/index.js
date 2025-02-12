import getInstrumentsInfo from './getInstrumentsInfo';
import getKlines from './getKlines';
import getAccountInfo from './getAccountInfo';
import placeOrder from './placeOrder';
import cancelOrder from './cancelOrder';
import getOrderHistory from './getOrderHistory';
import setLeverage from './setLeverage';

const ByBit = {
  getKlines,
  getInstrumentsInfo,
  getAccountInfo,
  placeOrder,
  cancelOrder,
  getOrderHistory,
  setLeverage,
};

export default ByBit;
