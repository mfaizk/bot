import { wssBaseUrl } from "@/service/api-service";
import { useEffect, useRef, useState } from "react";
export const TIMEFRAMES = [
  { label: "1m", value: "1m" },
  { label: "5m", value: "5m" },
  { label: "15m", value: "15m" },
  { label: "1h", value: "60m" },
  { label: "1D", value: "1D" },
];
export const useWatchOHLCV = ({ symbol = "BTCUSDT", timeframe = "1m" }) => {
  const wsRef = useRef(null);
  const [data, setData] = useState(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const ws = new WebSocket(wssBaseUrl);
    wsRef.current = ws;
    ws.onopen = () => {
      setIsConnected(true);
      ws.send(
        JSON.stringify({
          type: "subscribe",
          symbol: symbol.replace("/", ""),
          timeframe,
        })
      );
    };

    ws.onmessage = (e) => {
      try {
        const c = JSON.parse(e.data);

        // IMPORTANT: time in SECONDS
        const bar = {
          time: c.time, // already seconds
          open: c.open,
          high: c.high,
          low: c.low,
          close: c.close,
          volume: c.volume,
        };

        setData(bar);
      } catch (err) {
        console.error("❌ Parse error", err);
      }
    };

    ws.onclose = () => setIsConnected(false);
    ws.onerror = (e) => console.error("❌ WSS error", e);

    return () => ws.close();
  }, [symbol, timeframe]);

  return { data, isConnected };
};
