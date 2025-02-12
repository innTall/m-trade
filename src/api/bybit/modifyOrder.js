import fetchWrapper from './fetchWrapper';
// https://bybit-exchange.github.io/docs/v5/order/cancel-all
export default async function modifyOrder({
  symbol,
  orderId,
  qty,
  price,
  takeProfit,
  stopLoss,
}) {
  const path = '/order/amend';
  const data = await fetchWrapper({
    path,
    isPrivate: true,
    method: 'POST',
    body: JSON.stringify({
      category: 'linear',
      symbol,
      orderId,
      qty,
      price,
      takeProfit,
      stopLoss,
    }),
  });

  return data?.result || null;
}
