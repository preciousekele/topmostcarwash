import { motion } from "framer-motion";
import "./TransactionsStats.css";
import { Car, Truck, Bus } from "lucide-react";

const TransactionStats = () => {
  const stats = [
    { icon: Car, label: "CAR", value: 3, color: "#10B981" },
    { icon: Truck, label: "JEEP", value: 1, color: "#3B82F6" },
    { icon: Truck, label: "PICK-UP", value: 0, color: "#F59E0B" },
    { icon: Bus, label: "BUS", value: 0, color: "#06B6D4" },
  ];

  return (
    <div className="total-funds-container">
      {stats.map((stat, index) => {
        const IconComponent = stat.icon;
        return (
          <motion.div
            key={stat.label}
            className="funds-card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <div
              className="icon-container"
              style={{ backgroundColor: `${stat.color}15` }}
            >
              <IconComponent size={24} color={stat.color} strokeWidth={2} />
            </div>
            <div className="funds-labels">{stat.value} { stat.label}</div>
          </motion.div>
        );
      })}
    </div>
  );
};

export default TransactionStats;
