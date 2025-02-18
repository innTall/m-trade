/**
 * Calculates the uniform order quantity per grid.
 *
 * @param {Object} params - The input parameters.
 * @param {number} params.fullQty - The total order quantity to be split.
 * @param {Object} params.lotSizeFilter - The constraints for order quantity.
 * @param {string} params.lotSizeFilter.qtyStep - The step size for quantity increments.
 * @param {string} params.lotSizeFilter.minOrderQty - The minimum allowed order quantity.
 * @param {string} params.lotSizeFilter.maxOrderQty - The maximum allowed order quantity.
 * @param {number} params.gridSize - The number of divisions for the order quantity.
 * @returns {Object} - An object containing fullQty and gridQty.
 * @throws {Error} - Throws an error if grid size is invalid or the quantity is out of allowed bounds.
 */
export default function calculateGridQty({ fullQty, lotSizeFilter, gridSize }) {
  // Validate gridSize
  if (!Number.isInteger(gridSize) || gridSize < 1 || gridSize > 10) {
    throw new Error('gridSize must be an integer between 1 and 10.');
  }

  // Destructure and convert lotSizeFilter values to numbers
  const { qtyStep, minOrderQty, maxOrderQty } = lotSizeFilter;
  const parsedQtyStep = parseFloat(qtyStep);
  const parsedMinOrderQty = parseFloat(minOrderQty);
  const parsedMaxOrderQty = parseFloat(maxOrderQty);

  // Ensure fullQty is within min/max limits
  if (fullQty < parsedMinOrderQty) {
    throw new Error(
      `Total quantity too small. Minimum order quantity: ${parsedMinOrderQty}`
    );
  }
  if (fullQty > parsedMaxOrderQty) {
    throw new Error(
      `Total quantity too large. Maximum order quantity: ${parsedMaxOrderQty}`
    );
  }

  // Calculate uniform grid quantity
  let gridQty = fullQty / gridSize;

  // Apply base precision by rounding down to the nearest allowed increment
  const precisionMultiplier = 1 / parsedQtyStep;
  gridQty = Math.floor(gridQty * precisionMultiplier) / precisionMultiplier;

  // Ensure gridQty is within allowed limits
  if (gridQty < parsedMinOrderQty) {
    throw new Error(
      `Each grid order too small. Minimum order quantity: ${parsedMinOrderQty}`
    );
  }
  if (gridQty > parsedMaxOrderQty) {
    throw new Error(
      `Each grid order too large. Maximum order quantity: ${parsedMaxOrderQty}`
    );
  }

  return {
    fullQty,
    gridQty, // All parts will have this same value
  };
}
