import getInstrumentsInfo from './getInstrumentsInfo';
import getKlines from './getKlines';
import getAccountInfo from './getAccountInfo';
import placeOrder from './placeOrder';
import cancelOrder from './cancelOrder';
import getOrders from './getOrders';
import setLeverage from './setLeverage';
import cancelAllOrders from './cancelAllOrders';
import getPositionInfo from './getPositionInfo';

const ByBit = {
  getKlines,
  getInstrumentsInfo,
  getAccountInfo,
  placeOrder,
  cancelOrder,
  getOrders,
  setLeverage,
  cancelAllOrders,
  getPositionInfo,
};

export default ByBit;
