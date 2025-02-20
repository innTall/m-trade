import APP_CONFIG from '@/config';
import { prepareAuthHeaders } from './utils';

const isTest = false;
// this should be from some secure storage
const apiKey = APP_CONFIG.exchange.bybit.apiKey;
const secretKey = APP_CONFIG.exchange.bybit.secretKey;

export default async function fetchWrapper({
  path,
  query,
  method,
  body,
  isPrivate = false,
}) {
  const queryString = query ? `?${query}` : '';
  const url = `${APP_CONFIG.exchange.bybit.getURL(isTest)}${path}${queryString}`;

  try {
    const response = await fetch(url, {
      method,
      headers: {
        ...(isPrivate &&
          (await prepareAuthHeaders({
            apiKey,
            secretKey,
            query: query || body || '',
          }))),
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
