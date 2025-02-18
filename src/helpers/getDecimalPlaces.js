/**
 * Determines the number of decimal places in a given precision value.
 *
 * @param {number|string} precision - The precision value (e.g., "0.01" or 0.0001).
 * @returns {number} - The number of decimal places in the given precision.
 */
export default function getDecimalPlaces(precision) {
  // Convert the precision to a string to handle cases where it's a number
  const precisionStr = precision.toString();

  // Split the string by the decimal point to extract the fractional part
  const decimalPart = precisionStr.split('.')[1] || '';

  // Return the length of the decimal part, which represents the number of decimal places
  return decimalPart.length;
}
