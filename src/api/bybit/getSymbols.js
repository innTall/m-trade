import fetchWrapper from './fetchWrapper.js';

export default async function getSymbols() {
  const data = await fetchWrapper({
    path: `/market/instruments-info?category=spot`,
  });

  if (data?.result && Array.isArray(data.result.list) && data.result.list.length) {
    return data.result.list
  } else { 
    return null
  }
}
