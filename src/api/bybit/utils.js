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

function queryFromParams(params) {
  return Object.keys(params)
    .sort()
    .map(key => `${key}=${params[key]}`)
    .join('&');
}

async function prepareAuthHeaders({ apiKey, secretKey, query }) {
  const timestamp = Date.now().toString();
  const recvWindow = '5000';
  const payload = `${timestamp}${apiKey}${recvWindow}${query}`;
  const signature = await generateSignature(secretKey, payload);

  return {
    'X-BAPI-SIGN': signature,
    'X-BAPI-API-KEY': apiKey,
    'X-BAPI-TIMESTAMP': timestamp,
    'X-BAPI-RECV-WINDOW': recvWindow,
  };
}

function calculateOrderQty({ budget, price, lotSizeFilter }) {
  // Convert string values to numbers
  const minOrderQty = parseFloat(lotSizeFilter.minOrderQty);
  const maxOrderQty = parseFloat(lotSizeFilter.maxOrderQty);
  const qtyStep = parseFloat(lotSizeFilter.qtyStep);
  const minNotional = parseFloat(lotSizeFilter.minNotionalValue);

  // 1. Check minimum notional value
  if (budget < minNotional) {
    throw new Error(`Budget too small. Minimum required: $${minNotional}`);
  }

  // 2. Calculate raw quantity
  const rawQty = budget / price;

  // 3. Apply quantity step precision
  const steppedQty = Math.floor(rawQty / qtyStep) * qtyStep;

  // 4. Clamp between min/max order quantities
  let finalQty = Math.max(minOrderQty, Math.min(steppedQty, maxOrderQty));

  // 5. Final validation checks
  const finalNotional = finalQty * price;

  if (finalQty < minOrderQty) {
    throw new Error(`Quantity below minimum. Min: ${minOrderQty}`);
  }

  if (finalQty > maxOrderQty) {
    throw new Error(`Quantity exceeds maximum. Max: ${maxOrderQty}`);
  }

  if (finalNotional < minNotional) {
    throw new Error(`Notional value too small. Min: $${minNotional}`);
  }

  // Return formatted quantity with proper precision
  const decimals = (qtyStep.toString().split('.')[1] || '').length;
  return finalQty.toFixed(decimals);
}

function roundToTickSize(price, tickSize) {
  return Math.round(price / tickSize) * tickSize;
}

function calculateStopLossPrice({ stopLossAmount, price, amount, tickSize }) {
  try {
    // Validate required dependencies
    if (!t_SlVolume.value || !buyPrice.value || !t_Amount.value) {
      return null;
    }

    // Destructure for clarity
    const stopLossVolume = parseFloat(t_SlVolume.value);
    const entryPrice = parseFloat(buyPrice.value);
    const positionSize = parseFloat(t_Amount.value);

    // Calculate components
    const positionValue = entryPrice * positionSize;
    const stopLossDifference = positionValue - stopLossVolume;

    // Avoid division by zero
    if (positionSize === 0) {
      console.error('Invalid position size (zero)');
      return null;
    }

    // Calculate raw price
    const rawPrice = stopLossDifference / positionSize;

    // Format to required precision
    return roundToTickSize(price, tickSize);
  } catch (error) {
    console.error('Error calculating stop loss price:', error);
    return null;
  }
}

export {
  prepareAuthHeaders,
  queryFromParams,
  calculateOrderQty,
  calculateStopLossPrice,
};
