"use client";

import { useQuery } from "@tanstack/react-query";
import axiosPublic from "@/lib/axios";

import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  BarChart,
  Bar,
} from "recharts";

import {
  FaUsers,
  FaGavel,
  FaBriefcase,
  FaMoneyBillWave,
  FaChartLine,
  FaCrown,
  FaHistory,
} from "react-icons/fa";

export default function AnalyticsPage() {
  // Single optimized API fetch for all unified data
  const { data, isLoading } = useQuery({
    queryKey: ["analytics"],
    queryFn: async () => {
      const res = await axiosPublic.get("/analytics");
      return res.data;
    },
  });

  if (isLoading) {
    return (
      <div className="min-h-[70vh] flex justify-center items-center">
        <span className="loading loading-spinner loading-lg text-amber-500"></span>
      </div>
    );
  }

  const cards = [
    {
      title: "Total Users",
      value: data?.totalUsers || 0,
      icon: <FaUsers />,
      color: "from-blue-500/10 to-blue-600/5",
      iconColor: "text-blue-400",
      borderColor: "hover:border-blue-500/30",
      mobileSpan: "col-span-2 sm:col-span-1", // Mobile: 1st line full width
    },
    {
      title: "Total Lawyers",
      value: data?.totalLawyers || 0,
      icon: <FaGavel />,
      color: "from-cyan-500/10 to-cyan-600/5",
      iconColor: "text-cyan-400",
      borderColor: "hover:border-cyan-500/30",
      mobileSpan: "col-span-1", // Mobile: 2nd line half width
    },
    {
      title: "Total Hires",
      value: data?.totalHires || 0,
      icon: <FaBriefcase />,
      color: "from-emerald-500/10 to-emerald-600/5",
      iconColor: "text-emerald-400",
      borderColor: "hover:border-emerald-500/30",
      mobileSpan: "col-span-1", // Mobile: 2nd line half width
    },
    {
      title: "Total Revenue",
      value: `৳ ${(data?.totalRevenue || 0).toLocaleString()}`,
      icon: <FaMoneyBillWave />,
      color: "from-amber-500/10 to-amber-600/5",
      iconColor: "text-amber-400",
      borderColor: "hover:border-amber-500/30",
      mobileSpan: "col-span-2 sm:col-span-1", // Mobile: 3rd line full width
    },
  ];

  // Custom premium tooltips for charts
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-[#0b0f19] border border-white/10 p-3 rounded-xl shadow-2xl backdrop-blur-md">
          <p className="text-xs text-slate-400 font-medium">{label}</p>
          <p className="text-sm font-bold text-white mt-0.5">
            {payload[0].name === "revenue" ? "৳ " : ""}
            {payload[0].value.toLocaleString()}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6 sm:space-y-8 pb-12 animate-in fade-in duration-500 w-full max-w-full overflow-x-hidden">
      {/* Header */}
      <div className="bg-white/[0.02] backdrop-blur-md border border-white/[0.06] rounded-2xl p-4 sm:p-6 shadow-xl">
        <div className="flex items-start gap-3">
          <span className="p-2.5 bg-amber-500/10 text-amber-500 rounded-xl border border-amber-500/20 shrink-0">
            <FaChartLine size={20} />
          </span>
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              Analytics Dashboard
            </h1>
            <p className="text-slate-400 text-xs sm:text-sm mt-1">
              Real-time platform growth, revenue tracking, and operational metrics.
            </p>
          </div>
        </div>
      </div>

      {/* Stats Cards - Configured Custom Mobile Layout */}
      <div className="grid grid-cols-2 sm:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-6">
        {cards.map((card) => (
          <div
            key={card.title}
            className={`bg-gradient-to-br ${card.color} ${card.mobileSpan} border border-white/[0.06] rounded-2xl p-5 sm:p-6 backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 ${card.borderColor} shadow-lg relative overflow-hidden group`}
          >
            <div className="flex justify-between items-center relative z-10">
              <div className="min-w-0 flex-1">
                <p className="text-slate-400 text-[10px] sm:text-xs font-bold uppercase tracking-wider truncate">
                  {card.title}
                </p>
                <h2 className="text-xl sm:text-3xl font-black text-white mt-1.5 sm:mt-2 tracking-tight truncate">
                  {card.value}
                </h2>
              </div>
              <div className={`h-10 w-10 sm:h-12 sm:w-12 rounded-xl bg-white/[0.04] border border-white/10 flex items-center justify-center ${card.iconColor} text-base sm:text-lg shadow-inner shrink-0 ml-3`}>
                {card.icon}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Main Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Trend */}
        <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-4 sm:p-6 backdrop-blur-md overflow-hidden">
          <h3 className="text-white font-bold mb-6 text-xs sm:text-sm uppercase tracking-wider text-slate-300">Monthly Revenue</h3>
          <div className="w-full h-[260px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data?.monthlyRevenue} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" />
                <XAxis dataKey="month" stroke="#64748b" fontSize={10} tickLine={false} />
                <YAxis stroke="#64748b" fontSize={10} tickLine={false} />
                <Tooltip content={<CustomTooltip />} cursor={{ stroke: "rgba(255,255,255,0.05)" }} />
                <Line type="monotone" dataKey="revenue" stroke="#f59e0b" strokeWidth={3} dot={{ fill: "#f59e0b", strokeWidth: 2 }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Hire Requests Trend */}
        <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-4 sm:p-6 backdrop-blur-md overflow-hidden">
          <h3 className="text-white font-bold mb-6 text-xs sm:text-sm uppercase tracking-wider text-slate-300">Hire Requests Trend</h3>
          <div className="w-full h-[260px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data?.monthlyHires} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" />
                <XAxis dataKey="month" stroke="#64748b" fontSize={10} tickLine={false} />
                <YAxis stroke="#64748b" fontSize={10} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Line type="monotone" dataKey="hires" stroke="#10b981" strokeWidth={3} dot={{ fill: "#10b981", strokeWidth: 2 }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* User Growth */}
        <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-4 sm:p-6 backdrop-blur-md overflow-hidden">
          <h3 className="text-white font-bold mb-6 text-xs sm:text-sm uppercase tracking-wider text-slate-300">User Signups Overview</h3>
          <div className="w-full h-[260px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data?.monthlyUsers} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" />
                <XAxis dataKey="month" stroke="#64748b" fontSize={10} tickLine={false} />
                <YAxis stroke="#64748b" fontSize={10} tickLine={false} />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(255,255,255,0.01)" }} />
                <Bar dataKey="users" fill="#8b5cf6" radius={[4, 4, 0, 0]} maxBarSize={30} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Lawyer Growth */}
        <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-4 sm:p-6 backdrop-blur-md overflow-hidden">
          <h3 className="text-white font-bold mb-6 text-xs sm:text-sm uppercase tracking-wider text-slate-300">Lawyer Registration Trend</h3>
          <div className="w-full h-[260px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data?.monthlyLawyers} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" />
                <XAxis dataKey="month" stroke="#64748b" fontSize={10} tickLine={false} />
                <YAxis stroke="#64748b" fontSize={10} tickLine={false} />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(255,255,255,0.01)" }} />
                <Bar dataKey="lawyers" fill="#06b6d4" radius={[4, 4, 0, 0]} maxBarSize={30} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Lists / Tables Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Top Lawyers */}
        <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-4 sm:p-6 lg:col-span-1">
          <h3 className="text-white font-bold mb-4 text-xs sm:text-sm uppercase tracking-wider flex items-center gap-2 text-amber-400">
            <FaCrown /> Top 5 Earners
          </h3>
          <div className="divide-y divide-white/5 max-h-[350px] overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-white/10">
            {data?.topLawyers?.map((lawyer: any, index: number) => (
              <div key={lawyer.email} className="py-3.5 flex items-center justify-between gap-2">
                <div className="flex items-center gap-3 min-w-0">
                  <span className={`h-5 w-5 sm:h-6 sm:w-6 rounded-full flex items-center justify-center text-[10px] sm:text-xs font-bold shrink-0 ${
                    index === 0 ? "bg-amber-500/20 text-amber-400" : "bg-white/5 text-slate-400"
                  }`}>
                    {index + 1}
                  </span>
                  <p className="text-xs sm:text-sm text-slate-300 truncate font-medium font-mono">{lawyer.email}</p>
                </div>
                <p className="text-xs sm:text-sm font-bold text-emerald-400 whitespace-nowrap pl-2">৳ {lawyer.revenue.toLocaleString()}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-4 sm:p-6 lg:col-span-2 overflow-hidden w-full">
          <h3 className="text-white font-bold mb-4 text-xs sm:text-sm uppercase tracking-wider flex items-center gap-2 text-purple-400">
            <FaHistory /> Recent Transactions
          </h3>
          <div className="overflow-x-auto w-full scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
            <table className="w-full text-left text-xs sm:text-sm min-w-[550px] md:min-w-full">
              <thead>
                <tr className="border-b border-white/10 text-slate-400 text-[11px] sm:text-xs font-semibold uppercase tracking-wider">
                  <th className="pb-3 font-bold">TxID</th>
                  <th className="pb-3 font-bold">User</th>
                  <th className="pb-3 font-bold">Lawyer</th>
                  <th className="pb-3 font-bold">Amount</th>
                  <th className="pb-3 font-bold text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {data?.recentTransactions?.map((transaction: any) => (
                  <tr key={transaction._id} className="text-slate-300 group hover:bg-white/[0.01] transition">
                    <td className="py-3 font-mono text-xs text-purple-400 whitespace-nowrap">
                      #{transaction._id?.slice(-8).toUpperCase()}
                    </td>
                    <td className="py-3 text-slate-300 max-w-[120px] truncate font-medium" title={transaction.userEmail}>
                      {transaction.userEmail}
                    </td>
                    <td className="py-3 text-slate-400 max-w-[120px] truncate font-medium" title={transaction.lawyerEmail}>
                      {transaction.lawyerEmail}
                    </td>
                    <td className="py-3 font-bold text-emerald-400 whitespace-nowrap">
                      ৳ {Number(transaction.amount || 0).toLocaleString()}
                    </td>
                    <td className="py-3 text-right whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] sm:text-xs font-semibold capitalize ${
                        transaction.status === "paid" || transaction.status === "completed"
                          ? "bg-emerald-500/10 text-emerald-400" 
                          : "bg-amber-500/10 text-amber-400"
                      }`}>
                        {transaction.status || "Paid"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}