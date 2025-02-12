import fetchWrapper from './fetchWrapper.js';
// https://bybit-exchange.github.io/docs/v5/order/open-order
export default async function getOrders({ symbol }) {
  const path = '/open-order';
  const query = `category=linear&symbol=${symbol}`;
  const data = await fetchWrapper({
    path,
    query,
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
