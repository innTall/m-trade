import fetchWrapper from "./fetchWrapper.js";

export default async function getKlines(symbol, interval) {
  await fetchWrapper({
    path: `/market/kline?category=linear&symbol=${symbol}&interval=${interval}`
  })
}
