import getInstrumentsInfo from './getInstrumentsInfo';
import getKlines from './getKlines';
import getAccountInfo from './getAccountInfo';
import placeOrder from './placeOrder';
import cancelOrder from './cancelOrder';
import getOpenOrders from './getOpenOrders';
import setLeverage from './setLeverage';
import cancelAllOrders from './cancelAllOrders';
import getPositionInfo from './getPositionInfo';
import placeOrderBatch from './placeOrderBatch';

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
  placeOrderBatch,
};

export default ByBit;
