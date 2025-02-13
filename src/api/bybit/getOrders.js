import fetchWrapper from './fetchWrapper';
// https://bybit-exchange.github.io/docs/v5/order/realtime
export default async function getOrders() {
  const path = '/order/realtime';
  const query = `category=linear&settleCoin=USDT`;
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
