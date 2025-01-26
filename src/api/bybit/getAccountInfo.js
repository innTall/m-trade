import fetchWrapper from './fetchWrapper.js';

export default async function getAccountInfo() {
  const path = '/account/wallet-balance';
  const query = 'accountType=UNIFIED';
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
