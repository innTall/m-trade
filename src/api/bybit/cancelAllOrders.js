import fetchWrapper from './fetchWrapper';
// https://bybit-exchange.github.io/docs/v5/order/cancel-all
export default async function cancelAllOrders({ symbol }) {
  const path = '/order/cancel-all';
  const data = await fetchWrapper({
    path,
    isPrivate: true,
    method: 'POST',
    body: JSON.stringify({
      category: 'linear',
      symbol,
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
