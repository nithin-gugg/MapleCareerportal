"use client";

import React from "react";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart, 
  Pie, 
  Cell, 
  AreaChart, 
  Area 
} from "recharts";

interface ChartProps {
  data: any[];
}

export function FunnelChart({ data }: ChartProps) {
  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#18181b" vertical={false} />
          <XAxis 
            dataKey="name" 
            stroke="#52525b" 
            fontSize={10} 
            fontWeight="bold"
            axisLine={false}
            tickLine={false}
          />
          <YAxis 
            stroke="#52525b" 
            fontSize={10} 
            fontWeight="bold"
            axisLine={false}
            tickLine={false}
          />
          <Tooltip 
            contentStyle={{ backgroundColor: "#09090b", border: "1px solid #27272a", borderRadius: "0" }}
            itemStyle={{ color: "#00DC82", fontSize: "10px", fontWeight: "900", textTransform: "uppercase" }}
            labelStyle={{ color: "#fff", fontSize: "10px", fontWeight: "900", textTransform: "uppercase", marginBottom: "4px" }}
          />
          <Bar 
            dataKey="value" 
            fill="#00DC82" 
            radius={[4, 4, 0, 0]}
            animationDuration={1500}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export function ResolutionPieChart({ data }: ChartProps) {
  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={80}
            paddingAngle={5}
            dataKey="value"
            stroke="none"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.fill} />
            ))}
          </Pie>
          <Tooltip 
            contentStyle={{ backgroundColor: "#09090b", border: "1px solid #27272a", borderRadius: "0" }}
            itemStyle={{ fontSize: "10px", fontWeight: "900", textTransform: "uppercase" }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

export function TrendAreaChart({ data }: ChartProps) {
  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data}>
          <defs>
            <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#00DC82" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#00DC82" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#18181b" vertical={false} />
          <XAxis 
            dataKey="date" 
            stroke="#52525b" 
            fontSize={10} 
            fontWeight="bold"
            axisLine={false}
            tickLine={false}
          />
          <YAxis 
            stroke="#52525b" 
            fontSize={10} 
            fontWeight="bold"
            axisLine={false}
            tickLine={false}
          />
          <Tooltip 
            contentStyle={{ backgroundColor: "#09090b", border: "1px solid #27272a", borderRadius: "0" }}
            itemStyle={{ color: "#00DC82", fontSize: "10px", fontWeight: "900", textTransform: "uppercase" }}
            labelStyle={{ color: "#fff", fontSize: "10px", fontWeight: "900", textTransform: "uppercase", marginBottom: "4px" }}
          />
          <Area 
            type="monotone" 
            dataKey="count" 
            stroke="#00DC82" 
            fillOpacity={1} 
            fill="url(#colorCount)" 
            strokeWidth={3}
            animationDuration={2000}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
