// https://bybit-exchange.github.io/docs/v5/order/create-order
export default async function placeOrder({
  symbol,
  side,
  amount,
  price,
  takeProfit,
  stopLoss,
}) {
  const path = '/order/createe';
  const query = 'accountType=UNIFIED';
  const data = await fetchWrapper({
    path,
    query,
    isPrivate: true,
    method: 'POST',
    body: JSON.stringify({
      category: 'linear',
      symbol,
      side,
      isLeverage: 1,
      orderType: 'Limit',
      qty: amount,
      price,
      takeProfit,
      stopLoss,
      tpslMode: 'Full',
    }),
  });

  if (
    data?.result &&
    Array.isArray(data.result.list) &&
    data.result.list.length
  ) {
    return data.result.list;
  } else {
    return null;
  }
}
