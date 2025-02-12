import fetchWrapper from './fetchWrapper';
// https://bybit-exchange.github.io/docs/v5/position/leverage
export default async function setLeverage({ symbol, leverage }) {
  const path = '/position/set-leverage';
  const data = await fetchWrapper({
    path,
    isPrivate: true,
    method: 'POST',
    body: JSON.stringify({
      category: 'linear',
      symbol,
      buyLeverage: leverage,
      sellLeverage: leverage,
    }),
  });
  return data?.retMsg === 'OK';
}
