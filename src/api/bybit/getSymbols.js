import fetchWrapper from './fetchWrapper.js';

export default async function getSymbols() {
  const path = '/market/instruments-info';
  const query = `category=spot`; // change to linear
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
