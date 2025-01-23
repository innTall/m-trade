import fetchWrapper from './fetchWrapper.js';

export default async function getKlines(symbol, interval) {
  const data = await fetchWrapper({
    path: `/market/kline?category=spot&symbol=${symbol}&interval=${interval}`,
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
