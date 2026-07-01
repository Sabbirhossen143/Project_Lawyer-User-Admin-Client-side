"use client";

import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import axiosPublic from "@/lib/axios";

import {
  FaMoneyBillWave,
  FaSearch,
  FaCheckCircle,
  FaClock,
} from "react-icons/fa";

export default function TransactionsPage() {
  const [search, setSearch] = useState("");

  const { data: transactions = [], isLoading } = useQuery({
    queryKey: ["transactions"],
    queryFn: async () => {
      const res = await axiosPublic.get("/transactions");
      return res.data;
    },
  });

  const filteredTransactions = useMemo(() => {
    return transactions.filter(
      (item: any) =>
        item._id?.toLowerCase().includes(search.toLowerCase()) ||
        item.userEmail?.toLowerCase().includes(search.toLowerCase()) ||
        item.lawyerEmail?.toLowerCase().includes(search.toLowerCase())
    );
  }, [transactions, search]);

  const totalRevenue = transactions.reduce(
    (sum: number, item: any) =>
      sum + Number(item.amount || item.fee || 0),
    0
  );

  if (isLoading) {
    return (
      <div className="min-h-[70vh] flex justify-center items-center">
        <div className="relative w-12 h-12">
          <div className="absolute inset-0 rounded-full border-4 border-emerald-500/20"></div>
          <div className="absolute inset-0 rounded-full border-4 border-t-emerald-500 animate-spin"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-500 w-full max-w-full overflow-x-hidden">

      {/* Header */}
      <div className="bg-white/[0.02] backdrop-blur-md border border-white/[0.06] rounded-2xl p-4 sm:p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex items-start gap-3">
          <span className="shrink-0 text-xl sm:text-2xl mt-0.5">
            <FaMoneyBillWave className="text-emerald-400 animate-pulse" />
          </span>
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              Transactions
            </h1>
            <p className="text-slate-400 text-xs sm:text-sm mt-1">
              Monitor platform payments and transaction history.
            </p>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative w-full md:w-80 group">
          <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 text-xs group-focus-within:text-emerald-400 transition-colors" />
          <input
            type="text"
            placeholder="Search by Email or TxID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-white/[0.03] border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-xs sm:text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/30 transition shadow-inner"
          />
        </div>
      </div>

      {/* Stats Section - Configured Responsive Row Flow */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-6">

        {/* Card 1: Total Revenue (Takes full row on mobile) */}
        <div className="rounded-2xl p-4 sm:p-6 border border-emerald-500/20 bg-emerald-500/10 shadow-lg transition hover:border-emerald-500/30 col-span-2 md:col-span-1">
          <h3 className="text-[10px] sm:text-xs font-bold uppercase text-emerald-400 tracking-wider">
            Total Revenue
          </h3>
          <h2 className="text-lg sm:text-4xl font-black text-white mt-1 sm:mt-2 truncate">
            ৳ {totalRevenue.toLocaleString()}
          </h2>
        </div>

        {/* Card 2: Total Transactions */}
        <div className="rounded-2xl p-4 sm:p-6 border border-purple-500/20 bg-purple-500/10 shadow-lg transition hover:border-purple-500/30 col-span-1">
          <h3 className="text-[10px] sm:text-xs font-bold uppercase text-purple-400 tracking-wider">
            Transactions
          </h3>
          <h2 className="text-lg sm:text-4xl font-black text-white mt-1 sm:mt-2">
            {transactions.length}
          </h2>
        </div>

        {/* Card 3: Successful */}
        <div className="rounded-2xl p-4 sm:p-6 border border-amber-500/20 bg-amber-500/10 shadow-lg transition hover:border-amber-500/30 col-span-1">
          <h3 className="text-[10px] sm:text-xs font-bold uppercase text-amber-400 tracking-wider">
            Successful
          </h3>
          <h2 className="text-lg sm:text-4xl font-black text-white mt-1 sm:mt-2">
            {
              transactions.filter(
                (t: any) =>
                  t.status === "paid" ||
                  t.status === "completed"
              ).length
            }
          </h2>
        </div>

      </div>

      {/* Modern Glass Table */}
      <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl overflow-hidden backdrop-blur-md shadow-xl w-full">
        <div className="overflow-x-auto w-full scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
          <table className="w-full text-left text-xs sm:text-sm border-collapse min-w-[850px] md:min-w-full">
            <thead>
              <tr className="border-b border-white/10 text-slate-400 text-[11px] sm:text-xs font-semibold uppercase tracking-wider bg-white/[0.01]">
                <th className="px-4 sm:px-6 py-4 font-bold">Transaction ID</th>
                <th className="px-4 sm:px-6 py-4 font-bold">User Email</th>
                <th className="px-4 sm:px-6 py-4 font-bold">Lawyer Email</th>
                <th className="px-4 sm:px-6 py-4 font-bold">Amount</th>
                <th className="px-4 sm:px-6 py-4 font-bold">Status</th>
                <th className="px-4 sm:px-6 py-4 font-bold">Date</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-white/5">
              {filteredTransactions.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 sm:px-6 py-12 text-center text-slate-500 font-medium text-xs sm:text-sm">
                    No transactions logs matching the current search state.
                  </td>
                </tr>
              ) : (
                filteredTransactions.map((transaction: any) => (
                  <tr
                    key={transaction._id}
                    className="text-slate-300 hover:bg-white/[0.02] transition group"
                  >
                    <td className="px-4 sm:px-6 py-4 font-mono text-xs text-purple-400 tracking-wider whitespace-nowrap">
                      <span className="bg-purple-500/10 border border-purple-500/20 px-2 py-1 rounded-md" title={transaction._id}>
                        #{transaction._id ? transaction._id.slice(-8).toUpperCase() : "N/A"}
                      </span>
                    </td>

                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                      <p className="text-slate-200 font-medium max-w-[180px] md:max-w-none truncate">
                        {transaction.userEmail || "N/A"}
                      </p>
                    </td>

                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                      <p className="text-slate-200 font-medium max-w-[180px] md:max-w-none truncate">
                        {transaction.lawyerEmail || "N/A"}
                      </p>
                    </td>

                    <td className="px-4 sm:px-6 py-4 font-bold text-emerald-400 whitespace-nowrap">
                      ৳ {(Number(transaction.amount || transaction.fee || 0)).toLocaleString()}
                    </td>

                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                      {transaction.status === "paid" || transaction.status === "completed" ? (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] sm:text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                          <FaCheckCircle className="text-[10px] sm:text-[11px]" />
                          Paid
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] sm:text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                          <FaClock className="text-[10px] sm:text-[11px]" />
                          Pending
                        </span>
                      )}
                    </td>

                    <td className="px-4 sm:px-6 py-4 text-slate-400 text-[11px] sm:text-xs font-medium whitespace-nowrap">
                      {transaction.paidAt ? new Date(transaction.paidAt).toLocaleDateString() : "N/A"}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}