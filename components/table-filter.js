"use client";
import { useState, useEffect } from "react";
import CustomDatePicker from "../../../components/date-modal";
import Dropdown from "../../../components/dropdown";
import DataTable from "../../../components/common-table";

export default function PlanManagement() {
  const [filters, setFilters] = useState({
    search: "",
    from: "",
    to: "",
    status: "",
    paymentStatus: "",
  });

  const [filteredData, setFilteredData] = useState([]);

  const columns = [
    { key: "sr", label: "Sr" },
    { key: "planName", label: "Plan Name" },
    { key: "planAmount", label: "Plan Amount" },
    { key: "paidAmount", label: "Paid Amount" },
    { key: "paymentOrderId", label: "Payment Order ID" },
    { key: "duration", label: "Duration" },
    { key: "paymentStatus", label: "Payment Status" },
    { key: "planStatus", label: "Plan Status" },
    { key: "startTime", label: "Start Time" },
    { key: "endTime", label: "End Time" },
    { key: "payAddress", label: "Pay Address" },
  ];

  const dummyData = [
    {
      sr: 1,
      planName: "Free Trial",
      planAmount: 0,
      paidAmount: 0,
      paymentOrderId: "ORD-J36C5529L2",
      duration: "7 DAYS",
      paymentStatus: "Finished",
      planStatus: "Inactive",
      startTime: "2025-09-24T20:40:00",
      endTime: "2025-10-01T20:40:00",
      payAddress: "...",
    },
    {
      sr: 2,
      planName: "Pro Plan",
      planAmount: 99,
      paidAmount: 99,
      paymentOrderId: "ORD-XY12345",
      duration: "30 DAYS",
      paymentStatus: "Pending",
      planStatus: "Active",
      startTime: "2025-09-15T10:00:00",
      endTime: "2025-10-15T10:00:00",
      payAddress: "...",
    },
  ];

  const applyFilters = (currentFilters) => {
    let data = dummyData;

    if (currentFilters.search) {
      data = data.filter((item) =>
        item.planName.toLowerCase().includes(currentFilters.search.toLowerCase())
      );
    }

    if (currentFilters.from) {
      const fromDate = new Date(currentFilters.from);
      data = data.filter((item) => new Date(item.startTime) >= fromDate);
    }

    if (currentFilters.to) {
      const toDate = new Date(currentFilters.to);
      data = data.filter((item) => new Date(item.endTime) <= toDate);
    }

    if (currentFilters.status) {
      data = data.filter(
        (item) => item.planStatus.toLowerCase() === currentFilters.status.toLowerCase()
      );
    }

    if (currentFilters.paymentStatus) {
      data = data.filter(
        (item) =>
          item.paymentStatus.toLowerCase() === currentFilters.paymentStatus.toLowerCase()
      );
    }

    setFilteredData(data);
  };

  useEffect(() => {
    setFilteredData(dummyData);
  }, []);

  const TableFilter = ({ filters, setFilters, onApply }) => {
    const statusOptions = [
      { label: "Active", value: "active" },
      { label: "Inactive", value: "inactive" },
      { label: "Pending", value: "pending" },
    ];

    const paymentOptions = [
      { label: "Finished", value: "finished" },
      { label: "Pending", value: "pending" },
    ];

    const handleChange = (key, value) => {
      setFilters((prev) => ({ ...prev, [key]: value }));
    };

    const handleReset = () => {
      const resetFilters = {
        search: "",
        from: "",
        to: "",
        status: "",
        paymentStatus: "",
      };
      setFilters(resetFilters);
      onApply(resetFilters);
    };

    return (
      <div className="bg-[#12121d] p-4 rounded-xl mb-6 flex flex-wrap gap-4 items-end">
        <div className="flex flex-col w-full md:w-1/4">
          <label className="text-sm text-gray-400 mb-1">Search</label>
          <input
            type="text"
            placeholder="Search by plan name"
            className="bg-[#1a1a25] rounded-md px-3 py-2 text-white focus:outline-none focus:border-primary"
            value={filters.search || ""}
            onChange={(e) => handleChange("search", e.target.value)}
          />
        </div>

        <div className="flex flex-col">
          <label className="text-sm text-gray-400 mb-1">From</label>
          <CustomDatePicker
            value={filters.from || ""}
            onChange={(date) => handleChange("from", date)}
          />
        </div>

        <div className="flex flex-col">
          <label className="text-sm text-gray-400 mb-1">To</label>
          <CustomDatePicker
            value={filters.to || ""}
            onChange={(date) => handleChange("to", date)}
          />
        </div>

        <Dropdown
          label="Plan Status"
          options={statusOptions}
          value={filters.status || ""}
          onSelect={(val) => handleChange("status", val)}
          className="w-56"
        />

        <Dropdown
          label="Payment Status"
          options={paymentOptions}
          value={filters.paymentStatus || ""}
          onSelect={(val) => handleChange("paymentStatus", val)}
          className="w-56"
        />

        <div className="flex gap-2">
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
        </div>
      </div>
    );
  };

  return (
    <div className="p-6 text-white min-h-screen">
      <TableFilter filters={filters} setFilters={setFilters} onApply={applyFilters} />
      <DataTable columns={columns} data={filteredData} />
    </div>
  );
}
