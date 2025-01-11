export async function fetchKlineData(
  baseAsset,
  quoteAsset = "USDT",
  interval = "15",
  limit = "200"
) {
  if (!baseAsset || !quoteAsset) {
    console.error("Base asset or quote asset is not set!");
    return null; // Return null to handle gracefully
  }
  const baseUrl = "https://api.bybit.com/v5/market/kline";
  const params = {
    category: "linear",
    symbol: `${baseAsset.toUpperCase()}${quoteAsset.toUpperCase()}`, // Concatenate baseAsset and quoteAsset
    interval, // Interval in minutes
    limit, // Number of records
  };
  console.log("Fetching data for symbol:", params.symbol); // Debug log
  const queryString = new URLSearchParams(params).toString();
  const url = `${baseUrl}?${queryString}`;
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Error: ${response.status} - ${response.statusText}`);
    }
    const data = await response.json();
    // Ensure the response contains expected data
    if (!data || !data.result || !Array.isArray(data.result.list)) {
      console.error("Unexpected data format from API:", data);
      return null;
    }
    // Convert the raw data into Lightweight Charts format
    const formattedData = data.result.list.map((kline) => {
      return {
        time: Math.floor(kline[0] / 1000), // Convert milliseconds to seconds
        open: parseFloat(kline[1]), // Open price
        high: parseFloat(kline[2]), // High price
        low: parseFloat(kline[3]), // Low price
        close: parseFloat(kline[4]), // Close price
      };
    });
    return formattedData; // Return formatted data
  } catch (error) {
    console.error("Failed to fetch Kline data:", error);
    return null; // Return null in case of error
  }
}
