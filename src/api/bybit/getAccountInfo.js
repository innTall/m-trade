import fetchWrapper from './fetchWrapper.js';

async function generateSignature(secretKey, payload) {
  // Convert the secret key to a CryptoKey
  const encoder = new TextEncoder();
  const keyData = encoder.encode(secretKey);

  const cryptoKey = await crypto.subtle.importKey(
    'raw', // Raw key format
    keyData,
    { name: 'HMAC', hash: { name: 'SHA-256' } },
    false, // Not exportable
    ['sign'] // Key usage
  );

  // Sign the payload
  const payloadData = encoder.encode(payload);
  const signatureBuffer = await crypto.subtle.sign(
    'HMAC',
    cryptoKey,
    payloadData
  );

  // Convert the ArrayBuffer to a hexadecimal string
  const signatureArray = Array.from(new Uint8Array(signatureBuffer));
  const signatureHex = signatureArray
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');

  return signatureHex;
}

export default async function getAccountInfo() {
  const apiKey = '';
  const secretKey = '';
  const query = 'accountType=UNIFIED';
  const timestamp = Date.now().toString();
  const recvWindow = '5000';
  const payload = `${timestamp}${apiKey}${recvWindow}${query}`;
  const signature = await generateSignature(secretKey, payload);
  const data = await fetchWrapper({
    path: `/account/wallet-balance?${query}`,
    options: {
      headers: {
        'X-BAPI-SIGN': signature,
        'X-BAPI-API-KEY': apiKey,
        'X-BAPI-TIMESTAMP': timestamp,
        'X-BAPI-RECV-WINDOW': recvWindow,
      },
    },
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
