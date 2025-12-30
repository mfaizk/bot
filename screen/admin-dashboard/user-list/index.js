"use client";
import React, { useState, useEffect, useMemo } from "react";
import CustomDatePicker from "../../../components/date-modal";
import Dropdown from "../../../components/dropdown";
import DataTable from "../../../components/common-table";

import { useGetAllSubscription } from "@/queries/plan-management";
import { useGetAllUserList } from "@/queries/admin";
import ActivityIndicator from "@/components/activity-indicator";

export default function Users() {
  const [filters, setFilters] = useState({
    search: "",
    from: "",
    to: "",
    status: "",
    paymentStatus: "",
  });

  const [page, setPage] = useState(1);
  const limit = 10;

  const { data: userList, isLoading: userListPending } = useGetAllUserList({
    page,
    limit,
  });

  // totalPages is expected from the response as "pages" (or fallback to 1)
  const totalPages = useMemo(() => {
    return Number(userList?.pages ?? 1);
  }, [userList]);

  console.log(userList, "userListuserList");

  const columns = useMemo(
    () => [
      { key: "sr", label: "Sr" },
      { key: "name", label: "Name" },
      { key: "email", label: "Email" },
      { key: "mobileNumber", label: "Phone number" },
      { key: "status", label: "Status" },
      { key: "actions", label: "Action" }, 
    ],
    []
  );
  

  // Support both shaped responses: either an array or an object with `data` array
  const items = useMemo(() => {
    if (Array.isArray(userList?.docs)) return userList?.docs;
    return Array.isArray(userList?.docs) ? userList.docs : [];
  }, [userList]);

  const formatteduserList = useMemo(() => {
    if (!Array.isArray(items)) return [];

    return items?.map((item, index) => ({
      sr: (page - 1) * limit + index + 1,
      name: item?.name ?? "--",
      email: item?.email ?? "--",
      mobileNumber: item?.mobileNumber ?? "--",
      status: item?.status ?? "--",
      id: item?.id, 
    }));
  }, [items, page]);

  const [filteredData, setFilteredData] = useState([]);

  // Options for dropdowns (adjust labels/values as needed)
  const statusOptions = ["", "Active", "Inactive"];
  const paymentOptions = ["", "Finished", "Pending"];

  const applyFilters = (currentFilters, sourceData) => {
    let data = Array.isArray(sourceData) ? [...sourceData] : [];

    if (currentFilters.search) {
      const q = currentFilters.search.toLowerCase();
      data = data.filter((item) =>
        String(item.name || "").toLowerCase().includes(q)
      );
    }

    if (currentFilters.from) {
      const fromDate = new Date(currentFilters.from);
      data = data.filter((item) => {
        const st = new Date(item.startTime);
        return !Number.isNaN(st.getTime()) && st >= fromDate;
      });
    }

    if (currentFilters.to) {
      const toDate = new Date(currentFilters.to);
      data = data.filter((item) => {
        const et = new Date(item.endTime);
        return !Number.isNaN(et.getTime()) && et <= toDate;
      });
    }

    if (currentFilters.status) {
      data = data.filter(
        (item) =>
          String(item.planStatus).toLowerCase() ===
          String(currentFilters.status).toLowerCase()
      );
    }

    if (currentFilters.paymentStatus) {
      data = data.filter(
        (item) =>
          String(item.paymentStatus).toLowerCase() ===
          String(currentFilters.paymentStatus).toLowerCase()
      );
    }

    setFilteredData(data);
  };

  // handlers used by the filter UI you provided
  const handleChange = (key, value) => {
    setFilters((s) => ({ ...s, [key]: value }));
  };

  const handleReset = () => {
    const empty = {
      search: "",
      from: "",
      to: "",
      status: "",
      paymentStatus: "",
    };
    setFilters(empty);
    applyFilters(empty, formatteduserList);
  };

  const onApply = (currentFilters) => {
    applyFilters(currentFilters, formatteduserList);
  };

  // Re-apply filters whenever the source data changes so table stays in sync
  useEffect(() => {
    applyFilters(filters, formatteduserList);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formatteduserList]);

  useEffect(() => {
    // initialize when component mounts or when formatted data first arrives
    applyFilters(filters, formatteduserList);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (userListPending) {
    return (
      <div className=" min-h-screen flex flex-col justify-center items-center gap-4">
      <ActivityIndicator isLoading className={"h-12 w-12"} />
      <p className="text-2xl font-semibold">Getting Data...</p>
    </div>
    );
  }

  

  // Simple pagination controls
  const Pagination = () => {
    const pages = [];
    const maxPagesToShow = 7; // keeps the UI compact for large totals
    let start = 1;
    let end = totalPages;

    if (totalPages > maxPagesToShow) {
      const half = Math.floor(maxPagesToShow / 2);
      start = Math.max(1, page - half);
      end = Math.min(totalPages, start + maxPagesToShow - 1);
      if (end - start + 1 < maxPagesToShow) {
        start = Math.max(1, end - maxPagesToShow + 1);
      }
    }

    for (let i = start; i <= end; i++) pages.push(i);

    return (
      <div className="mt-6 flex items-center justify-end">
      

        <nav className="inline-flex items-center gap-2">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className={`px-3 py-1 rounded-md font-medium ${
              page === 1 ? "bg-gray-700/40" : "bg-primary"
            }`}
            aria-label="Previous page"
          >
            Prev
          </button>

          {start > 1 && (
            <button
              onClick={() => setPage(1)}
              className="px-3 py-1 rounded-md font-medium bg-[#1a1a25]"
            >
              1
            </button>
          )}

          {start > 2 && <span className="px-2">...</span>}

          {pages.map((p) => (
            <button
              key={p}
              onClick={() => setPage(p)}
              className={`px-3 py-1 rounded-md font-medium ${
                p === page ? "bg-primary text-black" : "bg-[#1a1a25]"
              }`}
            >
              {p}
            </button>
          ))}

          {end < totalPages - 1 && <span className="px-2">...</span>}

          {end < totalPages && (
            <button
              onClick={() => setPage(totalPages)}
              className="px-3 py-1 rounded-md font-medium bg-[#1a1a25]"
            >
              {totalPages}
            </button>
          )}

          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className={`px-3 py-1 rounded-md font-medium ${
              page === totalPages ? "bg-gray-700/40" : "bg-primary"
            }`}
            aria-label="Next page"
          >
            Next
          </button>
        </nav>
      </div>
    );
  };

  return (
    <div className="p-6 text-white min-h-screen">
      <h3 className="text-2xl font-bold mb-4">Users</h3>

      <DataTable columns={columns} data={filteredData} />

      {/* Pagination */}
      <Pagination />
    </div>
  );
}


