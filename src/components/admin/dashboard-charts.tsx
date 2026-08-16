"use client";

import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { formatIQD } from "@/lib/utils";

type DayPoint = {
  date: string;
  label: string;
  revenue: number;
  orders: number;
  users: number;
};

export function RevenueChart({ data }: { data: DayPoint[] }) {
  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data}>
          <defs>
            <linearGradient id="rev" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#1a56db" stopOpacity={0.35} />
              <stop offset="100%" stopColor="#1a56db" stopOpacity={0.02} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#e6e8ec" />
          <XAxis dataKey="label" tick={{ fontSize: 11 }} stroke="#98a2b3" />
          <YAxis
            tick={{ fontSize: 11 }}
            stroke="#98a2b3"
            tickFormatter={(v) => `${Math.round(v / 1000)}k`}
          />
          <Tooltip
            formatter={(value) => formatIQD(Number(value ?? 0))}
            labelFormatter={(label) => `Day ${label}`}
          />
          <Area
            type="monotone"
            dataKey="revenue"
            stroke="#1a56db"
            fill="url(#rev)"
            strokeWidth={2}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

export function OrdersUsersChart({ data }: { data: DayPoint[] }) {
  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e6e8ec" />
          <XAxis dataKey="label" tick={{ fontSize: 11 }} stroke="#98a2b3" />
          <YAxis allowDecimals={false} tick={{ fontSize: 11 }} stroke="#98a2b3" />
          <Tooltip />
          <Bar dataKey="orders" fill="#1a56db" radius={[4, 4, 0, 0]} name="Orders" />
          <Bar dataKey="users" fill="#8b5e3c" radius={[4, 4, 0, 0]} name="New users" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
