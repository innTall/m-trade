/**
 * Formats a given number to a specified precision, ensuring it aligns with the required decimal places.
 * Removes trailing zeros and floating-point precision errors.
 *
 * @param {number} value - The number to be formatted.
 * @param {number} precision - The required decimal precision (e.g., 0.01 -> 2 decimal places).
 * @returns {string} - The formatted number as a string with correct precision and no trailing zeros.
 *
 * Example Usage:
 * formatToPrecision(123.456789, 0.01)   -> "123.46"
 * formatToPrecision(123.400000, 0.0001) -> "123.4"
 * formatToPrecision(100.0000001, 0.01)  -> "100"
 */
export default function formatToPrecision(value, precision) {
  if (precision <= 0) {
    throw new Error('Precision must be greater than zero.');
  }

  // Determine the number of decimal places based on the precision
  const decimals = (precision.toString().split('.')[1] || '').length;

  // Format the value to the specified decimal places
  const formattedValue = value.toFixed(decimals);

  // Convert back to number to remove trailing zeros, then return as string
  return parseFloat(formattedValue).toString();
}
