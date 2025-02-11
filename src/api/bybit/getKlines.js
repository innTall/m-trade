import fetchWrapper from './fetchWrapper.js';

export default async function getKlines(symbol, interval) {
  const path = '/market/kline';
  const query = `category=linear&symbol=${symbol}&interval=${interval}`;
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
