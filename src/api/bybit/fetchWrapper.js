export default async function fetchWrapper({ path, options = {} }) {
  const url = `https://api.bybit.com/v5${path}`;
  try {
    const response = await fetch(url, {
      ...options,
    });
    return await response.json();
  } catch (error) {
    console.error('Error fetching ByBit:', error);
    return;
  }
}
