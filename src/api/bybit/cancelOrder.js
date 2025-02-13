import fetchWrapper from './fetchWrapper';
// https://bybit-exchange.github.io/docs/v5/order/cancel
export default async function cancelOrder({ symbol, orderId }) {
  const path = '/order/cancel';
  const data = await fetchWrapper({
    path,
    isPrivate: true,
    method: 'POST',
    body: JSON.stringify({
      category: 'linear',
      symbol,
      orderId,
    }),
  });

  return data.retMsg === 'OK';
}
