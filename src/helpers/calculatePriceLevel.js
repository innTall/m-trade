/**
 * Calculates the price level for Stop Loss (SL) or Take Profit (TP) based on the given factor.
 * Works correctly for both long and short positions.
 *
 * @param {number} price - The current price of the asset.
 * @param {number} factor - The factor used for calculation (totalFactorForSL or totalFactorForTP).
 * @param {boolean} isLong - Indicates whether the position is long (true) or short (false).
 * @param {boolean} isTakeProfit - If true, calculates TP; if false, calculates SL.
 * @returns {number | null} - The rounded price level or null if price is not provided.
 *
 * Example:
 * calculatePriceLevel(100, true, 1.05, 0.01, true)  -> 105.00 (Long TP)
 * calculatePriceLevel(100, true, 1.05, 0.01, false) -> 95.24 (Long SL)
 * calculatePriceLevel(100, false, 1.05, 0.01, true)  -> 95.24 (Short TP)
 * calculatePriceLevel(100, false, 1.05, 0.01, false) -> 105.00 (Short SL)
 */
export default function calculatePriceLevel(
  price,
  factor,
  isLong,
  isTakeProfit
) {
  if (!price) return null;

  return isLong
    ? isTakeProfit
      ? price * factor
      : price / factor // Long TP → multiply | Long SL → divide
    : isTakeProfit
      ? price / factor
      : price * factor; // Short TP → divide | Short SL → multiply
}
