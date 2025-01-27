import fetchWrapper from './fetchWrapper';
// https://bybit-exchange.github.io/docs/v5/order/cancel-order
export default async function cancelOrder({ symbol, orderId }) {
  const path = '/order/cancel';
  const data = await fetchWrapper({
    path,
    isPrivate: true,
    method: 'POST',
    doby: JSON.stringify({
      category: 'linear',
      symbol,
      orderId,
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
