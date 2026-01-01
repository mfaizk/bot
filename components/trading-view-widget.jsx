"use client";
import {
  Chart,
  CandlestickSeries,
  TimeScale,
  TimeScaleFitContentTrigger,
} from "lightweight-charts-react-components";
import ActivityIndicator from "@/components/activity-indicator";
import { TIMEFRAMES, useWatchOHLCV } from "@/hooks/useWatchOHLCV";
import { memo, useEffect, useMemo, useRef, useState } from "react";
import clsx from "clsx";
import { useBars } from "@/queries/graph";
import moment from "moment";
const TradingViewWidget = ({ symbol }) => {
  const chartContainerRef = useRef(null);
  const [currentTimeFrame, setCurrentTimeFrame] = useState(
    TIMEFRAMES?.[0]?.value
  );

  const { data: historicalData } = useBars({
    symbol: String(symbol)?.replace("/", ""),
    from: moment().subtract(10, "days").unix(),
    to: moment().unix(),
    resolution: String(currentTimeFrame)?.replace("m", "")?.replace("D", ""),
  });

  const ohlcvData = useWatchOHLCV({
    symbol,
    timeframe: currentTimeFrame,
  });
  const [graphDataArray, setGraphDataArray] = useState([]);

  // 1️⃣ Load historical data once
  useEffect(() => {
    if (!historicalData || historicalData.length === 0) return;

    setGraphDataArray(historicalData.sort((a, b) => a.time - b.time));
  }, [historicalData]);

  // 2️⃣ Append live WebSocket data
  useEffect(() => {
    if (!ohlcvData?.data) return;

    setGraphDataArray((prev) => {
      // prevent duplicate times
      if (prev.some((c) => c.time === ohlcvData.data.time)) return prev;

      return [...prev, ohlcvData.data].sort((a, b) => a.time - b.time);
    });
  }, [ohlcvData?.data]);
  console.log(graphDataArray, "graphDataArray>>");

  return (
    <div ref={chartContainerRef} className="w-full h-[500px]">
      <div className="flex items-end justify-end mb-6">
        {TIMEFRAMES?.map((item, idx) => {
          return (
            <div
              key={idx}
              className={clsx(
                "px-4 py-2  border border-gray-800/90 cursor-pointer",
                item?.value == currentTimeFrame ? "bg-primary" : "bg-gray-900"
              )}
              onClick={() => {
                setCurrentTimeFrame(item?.value);
              }}
            >
              {item?.label}
            </div>
          );
        })}
      </div>
      {chartContainerRef?.current &&
      ohlcvData?.isConnected &&
      graphDataArray?.length > 1 ? (
        <Chart
          options={{
            timeScale: {
              timeVisible: true,
              secondsVisible: true,
            },
            width: chartContainerRef?.current?.offsetWidth || 400,
            height: chartContainerRef?.current?.offsetHeight || 400,
            autoSize: true,
            layout: {
              background: { type: "solid", color: "#0F0F0F" },
              textColor: "#ffffff",
            },
            grid: {
              vertLines: { color: "#2B2B2B" },
              horzLines: { color: "#2B2B2B" },
            },
            crosshair: {
              mode: 1,
            },
          }}
        >
          <CandlestickSeries
            data={graphDataArray}
            upColor="#26a69a"
            downColor="#ef5350"
            borderVisible={false}
            wickUpColor="#26a69a"
            wickDownColor="#ef5350"
          />
          <TimeScale>
            <TimeScaleFitContentTrigger deps={[]} />
          </TimeScale>
        </Chart>
      ) : (
        <div className="h-[500px] w-full flex items-center justify-center flex-col">
          <ActivityIndicator isLoading className={"h-14 w-14"} />
          <p>Getting Chart Data...</p>
        </div>
      )}
    </div>
  );
};

export default memo(TradingViewWidget);
