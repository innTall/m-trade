import fetchWrapper from './fetchWrapper';
// https://bybit-exchange.github.io/docs/v5/order/create-order
export default async function placeOrder(order) {
  const path = '/order/create';
  const data = await fetchWrapper({
    path,
    isPrivate: true,
    method: 'POST',
    body: JSON.stringify(order),
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
