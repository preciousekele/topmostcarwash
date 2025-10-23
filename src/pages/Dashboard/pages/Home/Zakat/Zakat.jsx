import { motion } from "framer-motion";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import "./Zakat.css";

const ZakatDistributionChart = () => {
  const data = [
    { name: "Poor", value: 25, color: "rgba(34, 134, 82, 1)" },
    { name: "Education", value: 20, color: "rgba(42, 168, 102, 1)" },
    { name: "Healthcare", value: 15, color: "rgba(189, 228, 208, 1)" },
    { name: "Debt relief", value: 10, color: "rgba(223, 242, 232, 1)" },
  ];

  const renderCustomLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    percent,
    name,
    payload,
  }) => {
    const RADIAN = Math.PI / 180;
    const radius = (innerRadius + outerRadius) / 2;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    // Function to determine text color based on RGBA background color
    const getTextColor = (rgbaColor) => {
      // Extract RGB values from rgba string
      const rgbaMatch = rgbaColor.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
      if (!rgbaMatch) return "white";

      const r = parseInt(rgbaMatch[1]);
      const g = parseInt(rgbaMatch[2]);
      const b = parseInt(rgbaMatch[3]);

      // Calculate relative luminance using the standard formula
      const brightness = (r * 299 + g * 587 + b * 114) / 1000;

      // Return appropriate color based on brightness
      if (brightness > 180) return "rgba(42, 168, 102, 1)"; // Dark green for light backgrounds
      if (brightness > 120) return "rgba(234, 246, 240, 1)"; // Light color for medium backgrounds
      return "rgba(234, 246, 240, 1)"; // Light color for dark backgrounds
    };

    // Function to determine background color for percentage box
    const getBackgroundColor = (rgbaColor) => {
      // Extract RGB values from rgba string
      const rgbaMatch = rgbaColor.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
      if (!rgbaMatch) return "rgba(42, 168, 102, 1)";

      const r = parseInt(rgbaMatch[1]);
      const g = parseInt(rgbaMatch[2]);
      const b = parseInt(rgbaMatch[3]);

      // Calculate relative luminance using the standard formula
      const brightness = (r * 299 + g * 587 + b * 114) / 1000;

      // Return appropriate background color based on slice brightness
      if (brightness < 80) return "rgba(42, 168, 102, 1)"; // Deepest green
      if (brightness < 120) return "rgba(38, 151, 92, 1)"; // Green
      if (brightness < 200) return "rgba(38, 151, 92, 1)"; // Light green
      if (brightness <= 220) return "rgba(42, 168, 102, 1)"; // Light green
      return "rgba(189, 228, 208, 1)"; // Lightest green
    };

    // Function to determine percentage text color based on background
    const getPercentageTextColor = (backgroundColor) => {
      // For lighter backgrounds, use dark text; for darker backgrounds, use white text
      const rgbaMatch = backgroundColor.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
      if (!rgbaMatch) return "white";

      const r = parseInt(rgbaMatch[1]);
      const g = parseInt(rgbaMatch[2]);
      const b = parseInt(rgbaMatch[3]);

      const brightness = (r * 299 + g * 587 + b * 114) / 1000;

      return brightness > 160
        ? "rgba(42, 168, 102, 1)"
        : "rgba(223, 242, 232, 1)";
    };

    const textColor = getTextColor(payload.color);
    const backgroundColor = getBackgroundColor(payload.color);
    const percentageTextColor = getPercentageTextColor(backgroundColor);

    // Calculate background box dimensions and position
    const percentageText = `${(percent * 100).toFixed(1)}%`;
    const boxWidth = percentageText.length * 8 + 8; // Approximate width with padding
    const boxHeight = 18;
    const boxX = x - boxWidth / 2;
    const boxY = y + 0.75 * 16 - boxHeight / 2; // Position for the percentage line

    return (
      <g>
        {/* Background rectangle for percentage */}
        <rect
          x={boxX}
          y={boxY}
          width={boxWidth}
          height={boxHeight}
          rx={4}
          ry={4}
          fill={backgroundColor}
        />
        {/* Text elements */}
        <text x={x} y={y} textAnchor="middle" dominantBaseline="central">
          <tspan
            x={x}
            dy="-0.4em"
            className="chart-label-name"
            fill={textColor}
          >
            {name}
          </tspan>
          <tspan
            x={x}
            dy="1.45em"
            className="chart-label-percentage"
            fill={percentageTextColor}
          >
            {percentageText}
          </tspan>
        </text>
      </g>
    );
  };

  return (
    <motion.div
      className="zakat-chart-container"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.5 }}
    >
      <h3 className="zakat-title">Zakat Distributions</h3>
      <div className="zakat-total">
        <span className="zakat-label">Total Zakat Collected:</span>
        <span className="zakat-amount">₦15,000,000.00</span>
      </div>
      <div className="zakat-chart-wrapper">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={45}
              outerRadius={110}
              paddingAngle={0}
              dataKey="value"
              labelLine={false}
              label={renderCustomLabel}
              stroke="none"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
              ))}
            </Pie>
            <Tooltip
              formatter={(value) => [`${value}%`, "Percentage"]}
              contentStyle={{
                backgroundColor: "rgba(223, 242, 232, 1)",
                borderRadius: "8px",
                border: "none",
              }}
              labelStyle={{
                fontSize: "12px",
                color: "rgba(42, 168, 102, 1)",
                fontWeight: "500",
                fontFamily: "'Plus Jakarta Sans', sans-serif",
              }}
              itemStyle={{
                fontSize: "12px",
                color: "rgba(42, 168, 102, 1)",
                fontWeight: "500",
                fontFamily: "'Plus Jakarta Sans', sans-serif",
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
};

export default ZakatDistributionChart;
