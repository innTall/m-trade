import fetchWrapper from './fetchWrapper';
// https://bybit-exchange.github.io/docs/v5/order/create-order
export default async function placeOrderBatch(batch) {
  const path = '/order/create-batch';
  console.log(batch);
  const data = await fetchWrapper({
    path,
    isPrivate: true,
    method: 'POST',
    body: JSON.stringify(batch),
  });

  return data.retMsg === 'OK';
}
