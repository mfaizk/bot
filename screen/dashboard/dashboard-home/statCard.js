"use client";
import { useEffect, useState } from "react";

export default function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  currency,
  currencyIcon,
  duration = 900, 
}) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const end = typeof value === "number" ? value : parseFloat(value);
    if (isNaN(end)) return;

    const increment = end / (duration / 16); 

    const handle = setInterval(() => {
      start += increment;
      if (start >= end) {
        clearInterval(handle);
        setCount(end);
      } else {
        setCount(Math.floor(start));
      }
    }, 5);

    return () => clearInterval(handle);
  }, [value, duration]);

  return (
    <div className="bg-[#12121a] border border-gray-800/50 rounded-2xl p-6 overflow-hidden">
      <div className="flex items-start justify-between mb-4">
        <h3 className="text-gray-400 text-sm font-normal">{title}</h3>
        <div className="bg-gray-800/30 p-2 rounded-lg">
          <Icon className="w-5 h-5 text-primary" />
        </div>
      </div>
      <div className="space-y-2">
        <div className="flex items-baseline gap-2">
        
          <span
            className={`text-4xl font-semibold ${
              title === "Total Profit & Loss"
                ? value >= 0
                  ? "text-green-500"
                  : "text-red-500"
                : "text-white"
            }`}
          >
           {currencyIcon && currencyIcon}{count.toLocaleString()}
          </span>

          {currency && (
            <span className="text-gray-400 text-lg">{currency}</span>
          )}
        </div>
        {subtitle && <p className="text-gray-500 text-sm">{subtitle}</p>}
      </div>
    </div>
  );
}
