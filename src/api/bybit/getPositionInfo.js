import fetchWrapper from './fetchWrapper.js';
// https://bybit-exchange.github.io/docs/v5/position
export default async function getPositionInfo() {
  const path = '/position/list';
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
