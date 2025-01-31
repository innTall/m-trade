/**
 * Calculates the total factor based on an array of percentage-based factors.
 *
 * @param {number[]} factorsArray - An array containing percentage values for different factors.
 * @returns {number} - The total factor, calculated as (1 + sum of all factors divided by 100).
 *
 * Example:
 * calculateTotalFactor([10, 5, 3]) -> 1.18
 * calculateTotalFactor([8, 2, 4, 6, 1]) -> 1.21
 */
export default function calculateTotalFactor(factorsArray) {
  // Sum all values in the array and divide by 100 to convert percentage to a decimal factor
  const totalFactors =
    factorsArray.reduce((sum, factor) => sum + factor, 0) / 100;

  // Add 1 to the totalFactors to get the final factor
  return 1 + totalFactors;
}
