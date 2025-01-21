export async function fetchKlineData(symbol, interval) {
  const url = `https://api.bybit.com/v5/market/kline?category=linear&symbol=${symbol}&interval=${interval}`;

  try {
    const response = await fetch(url);
    const data = await response.json();
    if (data.result && data.result.list) {
      const formattedData = data.result.list.map((kline) => ({
        time: Math.floor(kline[0] / 1000),
        open: parseFloat(kline[1]),
        high: parseFloat(kline[2]),
        low: parseFloat(kline[3]),
        close: parseFloat(kline[4]),
      }));
      formattedData.sort((a, b) => a.time - b.time);
      return formattedData;
    }
    throw new Error("Invalid data format");
  } catch (error) {
    console.error("Error fetching Kline data:", error);
    return [];
  }
}
