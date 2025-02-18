import getInstrumentsInfo from './getInstrumentsInfo';
import getKlines from './getKlines';
import getAccountInfo from './getAccountInfo';
import placeOrder from './placeOrder';
import cancelOrder from './cancelOrder';
import getOpenOrders from './getOpenOrders';
import setLeverage from './setLeverage';
import cancelAllOrders from './cancelAllOrders';
import getPositionInfo from './getPositionInfo';

const ByBit = {
  getKlines,
  getInstrumentsInfo,
  getAccountInfo,
  placeOrder,
  cancelOrder,
  getOpenOrders,
  setLeverage,
  cancelAllOrders,
  getPositionInfo,
};

export default ByBit;
