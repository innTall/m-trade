/**
 * Calculates the order quantity based on the given amount, price, and lot size filter constraints.
 * Ensures the quantity adheres to min/max limits and base precision.
 *
 * @param {Object} params - The input parameters.
 * @param {number} params.amount - The total amount to be used for the order.
 * @param {number} params.price - The price per unit of the asset.
 * @param {Object} params.lotSizeFilter - The constraints for order quantity.
 * @param {string} params.lotSizeFilter.basePrecision - The precision allowed for order quantity.
 * @param {string} params.lotSizeFilter.minOrderQty - The minimum allowed order quantity.
 * @param {string} params.lotSizeFilter.maxOrderQty - The maximum allowed order quantity.
 * @param {string} params.lotSizeFilter.minOrderAmt - The minimum order amount allowed.
 * @param {string} params.lotSizeFilter.maxOrderAmt - The maximum order amount allowed.
 * @returns {string} - The calculated and validated order quantity as a string.
 * @throws {Error} - Throws an error if the amount or quantity is out of allowed bounds.
 *
 * Example:
 * calculateOrderQty({ amount: 100, price: 50, lotSizeFilter: { basePrecision: "0.01", minOrderQty: "0.1", maxOrderQty: "100", minOrderAmt: "10", maxOrderAmt: "5000" } })
 * -> "2.00"
 */
export default function calculateOrderQty({ amount, price, lotSizeFilter }) {
  // Destructure and convert lotSizeFilter values to numbers
  const { basePrecision, minOrderQty, maxOrderQty, minOrderAmt, maxOrderAmt } =
    lotSizeFilter;

  const parsedBasePrecision = parseFloat(basePrecision);
  const parsedMinOrderQty = parseFloat(minOrderQty);
  const parsedMaxOrderQty = parseFloat(maxOrderQty);
  const parsedMinOrderAmt = parseFloat(minOrderAmt);
  const parsedMaxOrderAmt = parseFloat(maxOrderAmt);

  // Ensure the amount is within the allowed min/max order amounts
  if (amount < parsedMinOrderAmt) {
    throw new Error(
      `Amount too small. Minimum order amount: ${parsedMinOrderAmt}`
    );
  }
  if (amount > parsedMaxOrderAmt) {
    throw new Error(
      `Amount too large. Maximum order amount: ${parsedMaxOrderAmt}`
    );
  }

  // Calculate raw quantity from amount and price
  const rawQty = amount / price;

  // Apply base precision by rounding down to the nearest allowed increment
  const precisionMultiplier = 1 / parsedBasePrecision;
  const preciseQty =
    Math.floor(rawQty * precisionMultiplier) / precisionMultiplier;

  // Ensure the quantity is within the allowed min/max order quantities
  const clampedQty = Math.max(
    parsedMinOrderQty,
    Math.min(preciseQty, parsedMaxOrderQty)
  );

  if (clampedQty < parsedMinOrderQty) {
    throw new Error(
      `Quantity too small. Minimum order quantity: ${parsedMinOrderQty}`
    );
  }
  if (clampedQty > parsedMaxOrderQty) {
    throw new Error(
      `Quantity too large. Maximum order quantity: ${parsedMaxOrderQty}`
    );
  }

  return clampedQty;
}
