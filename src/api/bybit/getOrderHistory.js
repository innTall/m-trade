import fetchWrapper from './fetchWrapper';
// https://bybit-exchange.github.io/docs/v5/order/order-list
export default async function getOrderHistory({ symbol }) {
  const path = '/order/realtime';
  const query = `category=linear&symbol=${symbol}`;
  const data = await fetchWrapper({
    path,
    query,
    isPrivate: true,
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
