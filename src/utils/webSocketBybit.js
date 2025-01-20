export function setupWebSocket(
  baseAsset,
  quoteAsset,
  interval,
  onMessageCallback
) {
  const symbol = `${baseAsset.toUpperCase()}${quoteAsset.toUpperCase()}`;
  const wsUrl = "wss://stream.bybit.com/v5/public/linear";
  let ws = null;
  const connect = () => {
    ws = new WebSocket(wsUrl);
    ws.onopen = () => {
      console.log("WebSocket connected to:", wsUrl);
      ws.send(
        JSON.stringify({
          op: "subscribe",
          args: [`kline.${interval}.${symbol}`],
        })
      );
    };
    ws.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data);
        if (
          message &&
          message.topic === `kline.${interval}.${symbol}` &&
          Array.isArray(message.data) &&
          message.data.length > 0
        ) {
          onMessageCallback(message.data);
        }
      } catch (error) {
        console.error("Failed to process WebSocket message:", error);
      }
    };
    ws.onerror = (error) => {
      console.error("WebSocket error:", error);
    };
    ws.onclose = (e) => {
      console.warn("WebSocket closed. Reconnecting in 5 seconds...", e);
      setTimeout(connect, 5000); // Retry connection after 5 seconds
    };
  };
  connect();
  return ws;
}
