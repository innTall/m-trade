export function initializeWebSocket(symbol, interval, onMessageCallback) {
  const wsUrl = "wss://stream.bybit.com/v5/public/linear";
  let ws = null;

  const connect = () => {
    ws = new WebSocket(wsUrl);

    ws.onopen = () => {
      console.log("WebSocket connection opened.");
      const payload = {
        op: "subscribe",
        args: [`kline.${interval}.${symbol}`],
      };
      ws.send(JSON.stringify(payload));
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
          const rawData = message.data[0];
          const formattedData = {
            time: Math.floor(rawData.start / 1000),
            open: parseFloat(rawData.open),
            high: parseFloat(rawData.high),
            low: parseFloat(rawData.low),
            close: parseFloat(rawData.close),
          };
          onMessageCallback(formattedData);
        }
      } catch (error) {
        console.error("Failed to process WebSocket message:", error);
      }
    };

    ws.onclose = () => {
      console.log("WebSocket connection closed.");
    };

    ws.onerror = (error) => {
      console.error("WebSocket error:", error);
    };
  };
  connect();
  return ws;
}
