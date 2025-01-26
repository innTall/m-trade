import ByBitConfig from './config';
import { prepareAuthHeaders } from './utils';
// this should be userCOnfig
const isTest = true;
// this should be from some secure storage
const apiKey = '';
const secretKey = '';

export default async function fetchWrapper({
  path,
  query,
  method,
  body,
  isPrivate = false,
}) {
  const url = `${ByBitConfig.getURL(isTest)}${path}?${query}`;

  try {
    const response = await fetch(url, {
      method,
      headers: {
        ...(isPrivate &&
          (await prepareAuthHeaders({ apiKey, secretKey, query }))),
        ...(method === 'POST' && {
          'Content-Type': 'application/json',
        }),
      },
      body,
    });
    return await response.json();
  } catch (error) {
    console.error('Error fetching ByBit:', error);
    return;
  }
}
