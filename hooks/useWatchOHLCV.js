import { wssBaseUrl } from "@/service/api-service";
import { useEffect, useRef, useState } from "react";

/**
 * Hook to subscribe to live OHLCV (candlestick) data
 * @param {Object} params
 * @param {string} params.symbol - Trading pair symbol, e.g. "BTC/USDT"
 * @param {string} params.timeframe - Time interval, e.g. "1m", "5m", "1h"
 * @param {number} params.limit - Number of candles to fetch
 */
export const useWatchOHLCV = ({
  symbol = "BTC/USDT",
  timeframe = "1m",
  limit = 100,
  exchange = "binance",
}) => {
  const [ohlcvData, setOhlcvData] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const wsRef = useRef(null);

  useEffect(() => {
    const ws = new WebSocket(wssBaseUrl);
    wsRef.current = ws;

    ws.onopen = () => {
      setIsConnected(true);
      console.log("WebSocket connected (OHLCV)");

      const payload = {
        op: "subscribe",
        exchange: exchange,
        method: "watchOHLCV",
        symbol,
        timeframe,
        limit,
      };

      ws.send(JSON.stringify(payload));
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);

        setOhlcvData(data?.data);
      } catch (err) {
        console.log("Error parsing OHLCV data:", err);
      }
    };

    ws.onerror = (err) => console.log("WebSocket error (OHLCV):", err);

    ws.onclose = () => {
      setIsConnected(false);
      console.log("🔌 WebSocket disconnected (OHLCV)");
    };

    return () => {
      ws.close();
    };
  }, [symbol, timeframe, limit, exchange]);

  return { ohlcvData, isConnected };
};
