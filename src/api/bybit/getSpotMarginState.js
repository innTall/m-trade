import fetchWrapper from './fetchWrapper.js';

export default async function getSpotMarginState() {
  const path = '/spot-margin-trade/state';
  const query = undefined;
  const data = await fetchWrapper({
    path,
    query,
    isPrivate: true,
  });

  if (!data?.result) return null;

  return data.result;
}
