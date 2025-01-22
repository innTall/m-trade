import fetchWrapper from './fetchWrapper.js';

export default function getKlines(symbol, interval) {
  return fetchWrapper({
    path: `/market/kline?category=linear&symbol=${symbol}&interval=${interval}`,
  });
}
