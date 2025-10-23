import React from "react";
import { motion } from "framer-motion";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import "./DepChart.css";

const DepositsWithdrawalsChart = () => {
  const data = [
    { name: "JAN 1", deposits: 10000, withdrawals: 8000 },
    { name: "JAN 2", deposits: 1000, withdrawals: 12000 },
    { name: "JAN 3", deposits: 25000, withdrawals: 18000 },
    { name: "JAN 4", deposits: 55000, withdrawals: 35000 },
    { name: "JAN 5", deposits: 10000, withdrawals: 45000 },
    { name: "JAN 6", deposits: 100000, withdrawals: 75000 },
  ];

  return (
    <motion.div
      className="deposits-chart-container"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
    >
      <div className="chart-header">
        <h3 className="chart-title">Deposits vs Withdrawals</h3>
        <div className="header-line"></div>
        <div className="chart-controls">
          <div className="legend-container">
            <div className="legend-item">
              <div className="legend-dot withdrawals"></div>
              <span className="legend-text">Withdrawals</span>
            </div>
            <div className="legend-item">
              <div className="legend-dot deposits"></div>
              <span className="legend-text">Deposits</span>
            </div>
          </div>
          <div className="select-wrapper">
            <select className="time-selector">
              <option>Today</option>
              <option>This Week</option>
              <option>This Month</option>
            </select>
          </div>
        </div>
      </div>
      <div className="chart-wrapper">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={data}
            margin={{ top: 15, right: 30, left: -20, bottom: 5 }}
          >
            <XAxis
              dataKey="name"
              stroke="rgba(148, 148, 148, 1)"
              fontSize={11}
              fontFamily="Plus Jakarta Sans, sans-serif"
              fontWeight={500}
              axisLine={{ stroke: "#e5e5e5", strokeWidth: 1 }}
              tickLine={{ stroke: "#e5e5e5", strokeWidth: 1, tickSize: 8 }}
              tick={{
                textAnchor: "middle",
                fontVariant: "small-caps",
                letterSpacing: "1px",
                dy: 10,
              }}
              padding={{ left: 20, right: 20 }}
              interval="preserveStartEnd"
            />

            <YAxis
              stroke="rgba(148, 148, 148, 1)"
              fontSize={11}
              fontFamily="Plus Jakarta Sans, sans-serif"
              fontWeight={500}
              axisLine={{ stroke: "#e5e5e5", strokeWidth: 1 }}
              tickLine={{ stroke: "#e5e5e5", strokeWidth: 1, tickSize: 8 }}
              tickFormatter={(value) => `${value / 1000}K`}
              tick={{
                textAnchor: "end",
                fontVariant: "small-caps",
                letterSpacing: "1px",
                dx: -1,
              }}
              domain={[0, "auto"]}
              padding={{ top: 20, bottom: 20 }}
            />

            <Tooltip
              contentStyle={{
                backgroundColor: "white",
                border: "1px solid #e5e5e5",
                borderRadius: "8px",
              }}
              formatter={(value, name) => [`$${value.toLocaleString()}`, name]}
            />
            <Line
              type="monotone"
              dataKey="withdrawals"
              stroke="rgba(42, 168, 102, 1)"
              strokeWidth={3}
              dot={{ fill: "#10b981", strokeWidth: 0, r: 0 }}
              activeDot={{ r: 0, strokeWidth: 0 }}
            />
            <Line
              type="monotone"
              dataKey="deposits"
              stroke="rgba(127, 116, 231, 1)"
              strokeWidth={3}
              dot={{ fill: "#8b5cf6", strokeWidth: 0, r: 0 }}
              activeDot={{ r: 0, strokeWidth: 0 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
};

export default DepositsWithdrawalsChart;
