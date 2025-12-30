import { wssBaseUrl } from "@/service/api-service";
import { useEffect, useRef, useState } from "react";

/**
 * Hook to subscribe to live ticker updates (current price, volume, etc.)
 * @param {string} symbol - Trading pair symbol, e.g. "BTC/USDT"
 */
export const useWatchTicker = ({ symbol = "BTC/USDT" }) => {
  const [tickerData, setTickerData] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const wsRef = useRef(null);

  useEffect(() => {
    const ws = new WebSocket(wssBaseUrl);
    wsRef.current = ws;

    ws.onopen = () => {
      setIsConnected(true);
      console.log("WebSocket connected (Ticker)");

      const payload = {
        op: "subscribe",
        exchange: "binance",
        method: "watchTicker",
        symbol: symbol,
      };

      ws.send(JSON.stringify(payload));
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        setTickerData(data?.data);
      } catch (err) {
        console.error("Error parsing ticker data:", err);
      }
    };

    ws.onerror = (err) => console.error("WebSocket error (Ticker):", err);

    ws.onclose = () => {
      setIsConnected(false);
      console.log("WebSocket disconnected (Ticker)");
    };

    return () => {
      ws.close();
    };
  }, [symbol]);

  return { tickerData, isConnected };
};
