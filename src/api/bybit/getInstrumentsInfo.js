import fetchWrapper from './fetchWrapper.js';

export default async function getInstrumentsInfo() {
  const path = '/market/instruments-info';
  const query = `category=linear&limit=1000`;
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
