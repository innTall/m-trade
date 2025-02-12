/**
 * Calculates the order quantity based on the given amount, price, lot size filter constraints,
 * and gridSize (which divides the total order quantity into multiple parts).
 * Ensures each part adheres to min/max limits and base precision.
 *
 * @param {Object} params - The input parameters.
 * @param {number} params.amount - The total amount to be used for the order.
 * @param {number} params.price - The price per unit of the asset.
 * @param {Object} params.lotSizeFilter - The constraints for order quantity.
 * @param {string} params.lotSizeFilter.qtyStep - The step size for quantity increments.
 * @param {string} params.lotSizeFilter.minOrderQty - The minimum allowed order quantity.
 * @param {string} params.lotSizeFilter.maxOrderQty - The maximum allowed order quantity.
 * @param {string} params.lotSizeFilter.minOrderAmt - The minimum order amount allowed.
 * @param {string} params.lotSizeFilter.maxOrderAmt - The maximum order amount allowed.
 * @param {number} params.gridSize - The number of divisions for the order quantity (1-10).
 * @returns {Object} - An object containing fullQty and partialQtyList.
 * @throws {Error} - Throws an error if the amount or quantity is out of allowed bounds.
 *
 * Example:
 * calculateOrderQty({
 *   amount: 100,
 *   price: 50,
 *   lotSizeFilter: {
 *     qtyStep: "0.01",
 *     minOrderQty: "0.1",
 *     maxOrderQty: "100",
 *     minOrderAmt: "10",
 *     maxOrderAmt: "5000"
 *   },
 *   gridSize: 2
 * })
 * -> { fullQty: "2.00", partialQtyList: ["1.00", "1.00"] }
 */
export default function calculateOrderQty({
  amount,
  price,
  lotSizeFilter,
  gridSize,
}) {
  // Validate gridSize
  // Validate gridSize
  if (!Number.isInteger(gridSize) || gridSize < 1 || gridSize > 10) {
    throw new Error('gridSize must be an integer between 1 and 10.');
  }

  // Destructure and convert lotSizeFilter values to numbers
  const { qtyStep, minOrderQty, maxOrderQty, minNotionalValue } = lotSizeFilter;

  const parsedQtyStep = parseFloat(qtyStep);
  const parsedMinOrderQty = parseFloat(minOrderQty);
  const parsedMaxOrderQty = parseFloat(maxOrderQty);
  const parsedMinNotionalValue = parseFloat(minNotionalValue);

  // Ensure the total amount is within the allowed min/max order amounts
  if (amount < parsedMinNotionalValue) {
    throw new Error(
      `Amount too small. Minimum order amount: ${parsedMinNotionalValue}`
    );
  }

  // Calculate total quantity from amount and price
  let fullQty = amount / price;

  // Ensure the full quantity is within min/max limits
  if (fullQty < parsedMinOrderQty) {
    throw new Error(
      `Quantity too small. Minimum order quantity: ${parsedMinOrderQty}`
    );
  }
  if (fullQty > parsedMaxOrderQty) {
    throw new Error(
      `Quantity too large. Maximum order quantity: ${parsedMaxOrderQty}`
    );
  }

  // Apply base precision by rounding down to the nearest allowed increment
  const precisionMultiplier = 1 / parsedQtyStep;
  fullQty = Math.floor(fullQty * precisionMultiplier) / precisionMultiplier;

  // Calculate base order quantity per grid
  let gridQty = fullQty / gridSize;
  gridQty = Math.floor(gridQty * precisionMultiplier) / precisionMultiplier;

  // Ensure each gridQty is within min/max constraints
  if (gridQty < parsedMinOrderQty) {
    throw new Error(
      `Grid quantity too small. Each order must be at least ${parsedMinOrderQty}`
    );
  }
  if (gridQty > parsedMaxOrderQty) {
    throw new Error(
      `Grid quantity too large. Each order must be at most ${parsedMaxOrderQty}`
    );
  }

  // Adjust fullQty to ensure it is divisible by gridSize and matches the sum of gridQty
  fullQty = gridQty * gridSize;

  // Return full quantity and split order list
  return {
    fullQty,
    gridQty,
  };
}
