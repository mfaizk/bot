"use client";
import { useState, useEffect } from "react";
import CustomDatePicker from "../../../../components/date-modal";
import Dropdown from "../../../../components/dropdown";
import DataTable from "../../../../components/common-table";
import CommingSoon from "@/components/comming-soon";

export default function ActiveTrade() {
  const [filters, setFilters] = useState({
    from: "",
    to: "",
    tradeType: "",
    exchange: "",
  });

  const [filteredData, setFilteredData] = useState([]);

  const columns = [
    { key: "exchange", label: "Exchange" },
    { key: "capital", label: "Capital" },
    { key: "invested", label: "Invested" },
    { key: "pnl", label: "PNL" },
    { key: "profit", label: "Profit" },
    { key: "strategy", label: "Strategy" },
    { key: "dateTime", label: "Date & Time" },
  ];

  const dummyData = [
    {
      exchange: "Binance",
      capital: 1000,
      invested: 800,
      pnl: 120,
      profit: 15,
      strategy: "Scalping",
      dateTime: "2025-10-05T14:00:00",
      tradeType: "Spot",
    },
    {
      exchange: "Binance",
      capital: 2000,
      invested: 1500,
      pnl: -50,
      profit: -3,
      strategy: "Swing",
      dateTime: "2025-10-07T10:30:00",
      tradeType: "Futures",
    },
    {
      exchange: "Coinbase",
      capital: 500,
      invested: 400,
      pnl: 20,
      profit: 5,
      strategy: "Day Trade",
      dateTime: "2025-10-08T09:15:00",
      tradeType: "Spot",
    },
  ];

  const applyFilters = (currentFilters) => {
    let data = dummyData;

    if (currentFilters.from) {
      const fromDate = new Date(currentFilters.from);
      data = data.filter((item) => new Date(item.dateTime) >= fromDate);
    }

    if (currentFilters.to) {
      const toDate = new Date(currentFilters.to);
      data = data.filter((item) => new Date(item.dateTime) <= toDate);
    }

    if (currentFilters.tradeType) {
      data = data.filter(
        (item) =>
          item.tradeType.toLowerCase() ===
          currentFilters.tradeType.toLowerCase()
      );
    }

    if (currentFilters.exchange) {
      data = data.filter(
        (item) =>
          item.exchange.toLowerCase() === currentFilters.exchange.toLowerCase()
      );
    }

    setFilteredData(data);
  };

  useEffect(() => {
    setFilteredData(dummyData);
  }, []);

  const exportToCSV = () => {
    if (filteredData.length === 0) {
      alert("No data to export!");
      return;
    }

    const header = columns.map((col) => col.label).join(",");
    const rows = filteredData
      .map((row) => columns.map((col) => `"${row[col.key] ?? ""}"`).join(","))
      .join("\n");

    const csvContent = `${header}\n${rows}`;
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "active_trades.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const TableFilter = ({ filters, setFilters, onApply }) => {
    const tradeTypeOptions = [
      { label: "Spot", value: "spot" },
   
    ];

    const exchangeOptions = [
      { label: "Mexc", value: "mexc", icon: "/assets/homepage/mexc.png" },
      { label: "Bybit", value: "bybit", icon: "/assets/homepage/bybit.webp" },
    ];

    const handleChange = (key, value) => {
      setFilters((prev) => ({ ...prev, [key]: value }));
    };

    const handleReset = () => {
      const resetFilters = {
        from: "",
        to: "",
        tradeType: "",
        exchange: "",
      };
      setFilters(resetFilters);
      onApply(resetFilters);
    };

    return (
      <div className="bg-[#12121d] p-4 rounded-xl mb-6 flex flex-wrap gap-4 items-end">
        <div className="flex flex-col">
          <label className="text-sm text-gray-400 mb-1">From</label>
          <CustomDatePicker
            value={filters.from}
            onChange={(date) => handleChange("from", date)}
          />
        </div>

        <div className="flex flex-col">
          <label className="text-sm text-gray-400 mb-1">To</label>
          <CustomDatePicker
            value={filters.to}
            onChange={(date) => handleChange("to", date)}
          />
        </div>

        <Dropdown
          label="Trade Type"
          options={tradeTypeOptions}
          value={filters.tradeType}
          onSelect={(val) => handleChange("tradeType", val)}
          className="w-56"
        />

        <Dropdown
          label="Exchange"
          options={exchangeOptions}
          value={filters.exchange}
          onSelect={(val) => handleChange("exchange", val)}
          className="w-56"
        />

        <button
          onClick={() => onApply(filters)}
          className="bg-primary px-6 py-2 rounded-md font-semibold"
        >
          Apply
        </button>
        <button
          onClick={handleReset}
          className="bg-gray-700 px-6 py-2 rounded-md font-semibold"
        >
          Reset
        </button>

        <button
          onClick={exportToCSV}
          className="bg-green-600 px-6 py-2 rounded-md font-semibold"
        >
          Export CSV
        </button>
      </div>
    );
  };

  return (
    <div className="p-6 text-white min-h-screen">
      <TableFilter
        filters={filters}
        setFilters={setFilters}
        onApply={applyFilters}
      />
      {/* <DataTable columns={columns} data={filteredData} /> */}
      <div className="min-h-96 flex items-center justify-center">
        <p className="mt-3 text-xl text-gray-400">
          This module is currently in active development
        </p>
      </div>
    </div>
  );
}
