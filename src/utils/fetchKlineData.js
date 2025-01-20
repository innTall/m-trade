export async function fetchKlineData(
  baseAsset = "BTC",
  quoteAsset = "USDT",
  interval = "15",
  limit = "200"
) {
  if (!baseAsset || !quoteAsset) {
    console.error("Base asset or quote asset is not set!");
    return null;
  }
  const baseUrl = "https://api.bybit.com/v5/market/kline";
  const params = {
    category: "linear",
    symbol: `${baseAsset.toUpperCase()}${quoteAsset.toUpperCase()}`,
    interval,
    limit,
  };
  const queryString = new URLSearchParams(params).toString();
  const url = `${baseUrl}?${queryString}`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Error: ${response.status} - ${response.statusText}`);
    }
    const data = await response.json();
    if (!data || !data.result || !Array.isArray(data.result.list)) {
      console.error("Unexpected data format from API:", data);
      return null;
    }
    const formattedData = data.result.list.map((kline) => ({
      time: Math.floor(kline[0] / 1000),
      open: parseFloat(kline[1]),
      high: parseFloat(kline[2]),
      low: parseFloat(kline[3]),
      close: parseFloat(kline[4]),
    }));
    formattedData.sort((a, b) => a.time - b.time);
    return formattedData;
  } catch (error) {
    console.error("Failed to fetch Kline data:", error);
    return null;
  }
}
