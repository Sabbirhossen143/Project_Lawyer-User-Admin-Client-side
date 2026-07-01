"use client";

import { useContext } from "react";
import { AuthContext } from "@/contexts/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { getTransactionsByLawyer } from "@/services/transactions";

export default function PaymentHistoryPage() {
  const { user } = useContext(AuthContext);

  const { data: transactions = [], isLoading } = useQuery({
    queryKey: ["transactions", user?.email],
    queryFn: () => getTransactionsByLawyer(user!.email!),
    enabled: !!user?.email,
  });

  const today = new Date().toDateString();
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();

  // Filter Today Earnings safely
  const todayEarnings = transactions
    .filter((item: any) => new Date(item.paidAt).toDateString() === today)
    .reduce((sum: number, item: any) => sum + Number(item.amount || 0), 0);

  // Filter Total Earnings safely
  const totalEarnings = transactions.reduce(
    (sum: number, item: any) => sum + Number(item.amount || 0),
    0
  );

  // Filter This Month Earnings safely (Ensuring year matches to prevent past year overlaps)
  const monthlyEarnings = transactions
    .filter((item: any) => {
      const paidDate = new Date(item.paidAt);
      return paidDate.getMonth() === currentMonth && paidDate.getFullYear() === currentYear;
    })
    .reduce((sum: number, item: any) => sum + Number(item.amount || 0), 0);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#020408] flex items-center justify-center p-4">
        <div className="text-amber-400 font-bold tracking-widest animate-pulse text-sm sm:text-base text-center">
          LOADING WORKSPACE TRANSACTIONS...
        </div>
      </div>
    );
  }

  return (
    <div
      className="
      min-h-screen
      bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))]
      from-[#0f172a]
      via-[#05070f]
      to-[#020408]
      p-4
      sm:p-6
      md:p-10
      space-y-6
      md:space-y-8
      "
    >
      <div className="max-w-7xl mx-auto space-y-6 md:space-y-8">
        {/* Header Section */}
        <div className="bg-slate-900/40 backdrop-blur-md border border-slate-800/80 rounded-[2rem] p-5 sm:p-6 md:p-8 shadow-[0_20px_40px_rgba(0,0,0,0.5)]">
          <span
            className="
            inline-flex
            items-center
            gap-2
            px-4
            py-1.5
            rounded-full
            bg-gradient-to-r
            from-emerald-500/10
            to-emerald-600/5
            border
            border-emerald-500/30
            text-emerald-400
            text-xs
            font-semibold
            tracking-wide
            uppercase
            mb-4
            "
          >
            💳 Financial Records
          </span>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-white tracking-tight">
            Earnings & <span className="bg-gradient-to-r from-amber-200 via-amber-400 to-amber-500 bg-clip-text text-transparent">Dashboard</span>
          </h1>
          <p className="text-slate-400 mt-2 text-xs sm:text-sm md:text-base max-w-2xl leading-relaxed">
            Track clear analytics of your incoming consultation balances, legal retainers, and real-time transaction processing.
          </p>
        </div>

        {/* Analytics Grid Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
          {[
            { label: "Total Earnings", val: `৳${totalEarnings.toLocaleString()}`, unit: "All-Time Balance", borderColor: "border-emerald-500/30", txtColor: "text-emerald-400" },
            { label: "Today Earnings", val: `৳${todayEarnings.toLocaleString()}`, unit: "Real-time Processing", borderColor: "border-emerald-500/20", txtColor: "text-emerald-400" },
            { label: "This Month", val: `৳${monthlyEarnings.toLocaleString()}`, unit: "Current Billing Cycle", borderColor: "border-amber-500/20", txtColor: "text-amber-400" },
            { label: "Total Transactions", val: transactions.length, unit: "Completed Events", borderColor: "border-blue-500/20", txtColor: "text-blue-400" }
          ].map((stat, idx) => (
            <div
              key={idx}
              className={`bg-slate-900/50 backdrop-blur-md border ${stat.borderColor} rounded-2xl p-4 sm:p-5 shadow-[0_10px_30px_rgba(0,0,0,0.4)] flex flex-col justify-between transition-all duration-300 hover:scale-[1.02] min-w-0`}
            >
              <h3 className="text-slate-400 text-[10px] sm:text-xs font-semibold uppercase tracking-wider truncate">{stat.label}</h3>
              <h2 className={`text-2xl sm:text-3xl font-black mt-2 sm:mt-3 tracking-tight ${stat.txtColor} truncate`}>
                {stat.val}
              </h2>
              <p className="text-slate-500 text-[10px] sm:text-[11px] mt-1 font-medium truncate">{stat.unit}</p>
            </div>
          ))}
        </div>

        {/* Transaction History Section */}
        <div className="pt-2 space-y-4">
          <div className="px-1">
            <h3 className="text-lg sm:text-xl font-bold text-white tracking-tight">Transaction History</h3>
            <p className="text-slate-500 text-xs mt-0.5">See all completed payments and transaction details.</p>
          </div>

          {transactions.length === 0 ? (
            <div className="rounded-[2rem] border border-slate-800/80 bg-slate-900/30 backdrop-blur-sm p-10 sm:p-16 text-center max-w-2xl mx-auto space-y-4 shadow-[0_20px_40px_rgba(0,0,0,0.4)]">
              <div className="text-3xl sm:text-4xl">🧾</div>
              <h4 className="text-lg sm:text-xl font-bold text-white tracking-tight">No Financial Events Recorded</h4>
              <p className="text-slate-400 text-xs sm:text-sm max-w-sm mx-auto leading-relaxed">
                When clients finalize invoice transactions, structural settlement tracking rows will append here automatically.
              </p>
            </div>
          ) : (
            <div
              className="
              bg-slate-900/40
              backdrop-blur-md
              border
              border-slate-800/90
              rounded-2xl
              sm:rounded-3xl
              overflow-hidden
              shadow-[0_15px_35px_rgba(0,0,0,0.5)]
              "
            >
              <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-slate-800">
                <table className="w-full border-collapse text-left min-w-[600px] sm:min-w-full">
                  <thead>
                    <tr className="border-b border-slate-800/80 bg-slate-950/40 text-[11px] sm:text-xs uppercase font-bold tracking-wider text-slate-400">
                      <th className="p-4 sm:p-5">Client Identity</th>
                      <th className="p-4 sm:p-5">Amount</th>
                      <th className="p-4 sm:p-5">Payment Date</th>
                      <th className="p-4 sm:p-5 text-right">Status State</th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-slate-800/50 text-xs sm:text-sm">
                    {transactions.map((item: any) => (
                      <tr
                        key={item._id}
                        className="transition-colors duration-200 hover:bg-slate-900/30"
                      >
                        {/* Client Identity Cell */}
                        <td className="p-4 sm:p-5 font-bold text-slate-200">
                          <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
                            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-slate-950 border border-slate-800 flex items-center justify-center text-[11px] sm:text-xs text-amber-400 font-black flex-shrink-0">
                              {(item.userName || "C").charAt(0).toUpperCase()}
                            </div>
                            <span className="truncate max-w-[140px] sm:max-w-[200px]">
                              {item.userName || "Anonymous Client"}
                            </span>
                          </div>
                        </td>

                        {/* Amount Cell */}
                        <td className="p-4 sm:p-5 text-emerald-400 font-bold tracking-wide whitespace-nowrap">
                          ৳{Number(item.amount || 0).toLocaleString()}
                        </td>

                        {/* Payment Date Cell */}
                        <td className="p-4 sm:p-5 text-slate-400 font-medium whitespace-nowrap">
                          {new Date(item.paidAt).toLocaleDateString("en-GB", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          })}
                        </td>

                        {/* Status Token Badge Cell */}
                        <td className="p-4 sm:p-5 text-right whitespace-nowrap">
                          <span
                            className="
                            inline-flex
                            px-2.5
                            py-0.5
                            sm:px-3
                            sm:py-1
                            rounded-full
                            bg-emerald-500/10
                            border
                            border-emerald-500/30
                            text-emerald-400
                            text-[10px]
                            sm:text-[11px]
                            font-bold
                            uppercase
                            tracking-wider
                            "
                          >
                            Success
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}