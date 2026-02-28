"use client";

import {
  Chart,
  CandlestickSeries,
  HistogramSeries,
  LineSeries,
  TimeScale,
  TimeScaleFitContentTrigger,
} from "lightweight-charts-react-components";
import ActivityIndicator from "@/components/activity-indicator";
import { TIMEFRAMES, useWatchOHLCV } from "@/hooks/useWatchOHLCV";
import { memo, useEffect, useRef, useState } from "react";
import clsx from "clsx";
import { useBars } from "@/queries/graph";
import moment from "moment";

/**
 * UI timeframe → backend resolution
 */
const RESOLUTION_MAP = {
  "1m": "1",
  "5m": "5",
  "15m": "15",
  "60m": "60",
  "1d": "1D",
};

/**
 * Time range per timeframe (seconds)
 */
const RANGE_MAP = {
  "1m": 2 * 24 * 60 * 60,
  "5m": 7 * 24 * 60 * 60,
  "15m": 14 * 24 * 60 * 60,
  "60m": 30 * 24 * 60 * 60,
  "1d": 180 * 24 * 60 * 60,
};

const TradingViewWidget = ({
  symbol = "",
  gridLower,
  gridUpper,
  lowerStopLossPrice,
  upperStopLossPrice,
}) => {
  /** refs & state */
  const containerRef = useRef(null);
  // const seriesRef = useRef();
  const seriesRef = useRef(null);
  const priceLinesRef = useRef([]);
  const [width, setWidth] = useState(0);
  const [mounted, setMounted] = useState(false);
  const [currentTimeFrame, setCurrentTimeFrame] = useState(
    TIMEFRAMES[0].value
  );

  /** safe symbol */
  const safeSymbol = String(symbol || "").replace("/", "");

  /** timeframe helpers */
  const tfKey = currentTimeFrame.toLowerCase();
  const resolution = RESOLUTION_MAP[tfKey];
  const to = Math.floor(Date.now() / 1000);
  const from = to - RANGE_MAP[tfKey];

  /** REST bars */
  const { data = [], isLoading } = useBars({
    symbol: safeSymbol,
    resolution,
    from,
    to,
  });

  /** WebSocket OHLCV */
  const ohlcvData = useWatchOHLCV({
    symbol,
    timeframe: currentTimeFrame,
  });

  /** merged rows (single source of truth) */
  const [rows, setRows] = useState([]);

  /** mark mounted */
  useEffect(() => {
    setMounted(true);
  }, []);
useEffect(() => {
  setRows([]);
}, [currentTimeFrame]);
  /** measure width */
  useEffect(() => {
    if (!containerRef.current) return;

    const resize = () => {
      setWidth(containerRef.current?.offsetWidth || 0);
    };

    resize();
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, []);
  // useEffect(() => {
  //   if (!seriesRef.current) return;

  //   const series = seriesRef.current;

  //   // remove existing price lines
  //   priceLinesRef.current.forEach((line) => {
  //     series.removePriceLine(line);
  //   });

  //   priceLinesRef.current = [];

  //   // helper to create line
  //   const addLine = (price, color, width, style, title) => {
  //     if (!price) return;

  //     const line = series.createPriceLine({
  //       price: Number(price),
  //       color,
  //       lineWidth: width,
  //       lineStyle: style,
  //       axisLabelVisible: true,
  //       title,
  //     });

  //     priceLinesRef.current.push(line);
  //   };

  //   // grid lines
  //   addLine(gridLower, "#3b82f6", 1, 2, "Grid Lower");
  //   addLine(gridUpper, "#3b82f6", 1, 2, "Grid Upper");

  //   // stop loss lines
  //   addLine(lowerStopLossPrice, "#ef4444", 2, 0, "Lower SL");
  //   addLine(upperStopLossPrice, "#ef4444", 2, 0, "Upper SL");

  // }, [gridLower, gridUpper, lowerStopLossPrice, upperStopLossPrice, rows]);
  /** load historical REST data */
  useEffect(() => {
    if (!data.length) return;

    const formatted = data.map((c) => {
      // if (currentTimeFrame === "1D") {
      //   const d = moment.unix(Number(c.time));
      //   return {
      //     time: {
      //       year: d.year(),
      //       month: d.month() + 1,
      //       day: d.date(),
      //     },
      //     open: Number(c.open),
      //     high: Number(c.high),
      //     low: Number(c.low),
      //     close: Number(c.close),
      //     volume: Number(c.volume),
      //   };
      // }


      return {
        time: Number(c.time),
        open: Number(c.open),
        high: Number(c.high),
        low: Number(c.low),
        close: Number(c.close),
        volume: Number(c.volume),
      };
    });

    setRows(formatted);
  }, [data, currentTimeFrame]);

  /** 🔴 realtime updates (1m only) */
  useEffect(() => {
    if (!ohlcvData?.data) return;
    if (currentTimeFrame !== "1m") return;

    setRows((prev) => {
      if (!prev.length) return prev;

      const last = prev[prev.length - 1];
      const incoming = ohlcvData.data;

      /** update current candle */
      if (last.time === incoming.time) {
        const updated = [...prev];
        updated[updated.length - 1] = {
          ...last,
          high: Math.max(last.high, incoming.high),
          low: Math.min(last.low, incoming.low),
          close: incoming.close,
          volume: (last.volume || 0) + (incoming.volume || 0),
        };
        return updated;
      }

      /** append new candle */
      if (incoming.time > last.time) {
        return [...prev, incoming];
      }

      return prev;
    });
  }, [ohlcvData?.data, currentTimeFrame]);

  /** split series */
  const candleData = rows.map(({ time, open, high, low, close }) => ({
    time,
    open,
    high,
    low,
    close,
  }));

  const volumeData = rows.map(({ time, volume, open, close }) => ({
    time,
    value: volume,
    color: close >= open ? "#26a69a" : "#ef5350",
  }));
  const createHorizontalLine = (price) => {
    if (!rows.length) return [];

    const first = rows[0];
    const last = rows[rows.length - 1];

    return [
      { time: first.time, value: Number(price) },
      { time: last.time, value: Number(price) },
    ];
  };
  return (
    <div ref={containerRef} className="w-full">
      {/* timeframe buttons */}
      <div className="flex justify-end mb-4">
        {TIMEFRAMES.map((tf) => (
          <button
            key={tf.value}
            onClick={() => setCurrentTimeFrame(tf.value)}
            className={clsx(
              "px-4 py-2 border border-gray-800",
              tf.value === currentTimeFrame ? "bg-primary" : "bg-gray-900"
            )}
          >
            {tf.label}
          </button>
        ))}
      </div>

      {!mounted || width === 0 || isLoading ? (
        <div className="h-[500px] flex items-center justify-center">
          <ActivityIndicator isLoading />
        </div>
      ) : (
        <>
          {/* PRICE CHART */}
          <Chart
            key={`price-${currentTimeFrame}`}
            options={{
              width,
              height: 360,
              layout: {
                background: { color: "#0F0F0F" },
                textColor: "#ffffff",
              },
              grid: {
                vertLines: { color: "#2B2B2B" },
                horzLines: { color: "#2B2B2B" },
              },
            }}
          >
            <CandlestickSeries
              ref={seriesRef}
              data={candleData}
              upColor="#26a69a"
              downColor="#ef5350"
              borderVisible={false}
              wickUpColor="#26a69a"
              wickDownColor="#ef5350"

            />
            {/* GRID LOWER */}
            {gridLower && rows.length > 0 && (
              <LineSeries
                key={`gridLower-${gridLower}`}
                data={createHorizontalLine(gridLower)}
                options={{
                  color: "#6cef44ff",
                  lineWidth: 3,
                  lineStyle: 2, // dotted
                  crosshairMarkerVisible: false,
                  lastValueVisible: false,
                  priceLineVisible: false,
                }}
              />
            )}

            {/* GRID UPPER */}
            {gridUpper && rows.length > 0 && (
              <LineSeries
                key={`gridUpper-${gridUpper}`}
                data={createHorizontalLine(gridUpper)}
                options={{
                  color: "#6cef44ff",
                  lineWidth: 3,
                  lineStyle: 2, // dotted
                  crosshairMarkerVisible: false,
                  lastValueVisible: false,
                  priceLineVisible: false,
                }}
              />
            )}

            {/* LOWER STOP LOSS */}
            {lowerStopLossPrice && rows.length > 0 && (
              <LineSeries
                key={`lowerSL-${lowerStopLossPrice}`}
                data={createHorizontalLine(lowerStopLossPrice)}
                options={{
                  color: "#ef4444",
                  lineWidth: 3,
                  lineStyle: 2, // dotted
                  crosshairMarkerVisible: false,
                  lastValueVisible: false,
                  priceLineVisible: false,
                }}
              />
            )}

            {/* UPPER STOP LOSS */}
            {upperStopLossPrice && rows.length > 0 && (
              <LineSeries
                key={`upperSL-${upperStopLossPrice}`}
                data={createHorizontalLine(upperStopLossPrice)}
                options={{
                  color: "#ef4444",
                  lineWidth: 3,
                  lineStyle: 2,
                  crosshairMarkerVisible: false,
                  lastValueVisible: false,
                  priceLineVisible: false,
                }}
              />
            )}
            <TimeScale>
              <TimeScaleFitContentTrigger deps={[candleData.length]} />
            </TimeScale>
          </Chart>

          {/* VOLUME CHART */}
          <Chart
            key={`volume-${currentTimeFrame}`}
            options={{
              width,
              height: 140,
              layout: {
                background: { color: "#0F0F0F" },
                textColor: "#ffffff",
              },
              grid: {
                vertLines: { color: "#2B2B2B" },
                horzLines: { color: "#2B2B2B" },
              },
              timeScale: { visible: false },
            }}
          >
            <HistogramSeries
              data={volumeData}
              priceFormat={{ type: "volume" }}
            />
            <TimeScale>
              <TimeScaleFitContentTrigger deps={[volumeData.length]} />
            </TimeScale>
          </Chart>
        </>
      )}
    </div>
  );
};

export default memo(TradingViewWidget);
