import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import "./TransactionDashboard.css";
import Header from "../../../../components/Header/Header";
import TransactionStats from "./TransactionsStats/TransactionsStats";
import TransactionsTable from "./TransactionsHistory/TransactionsHistory";

const TransactionDashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 1509,
    premiumUsers: 1509,
    activeUsers: 1200,
    pendingKyc: 509,
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Fetch data from your API
    // Example:
    // const fetchStats = async () => {
    //   try {
    //     const response = await fetch('/api/account-stats');
    //     const data = await response.json();
    //     setStats(data);
    //   } catch (error) {
    //     console.error('Error fetching stats:', error);
    //   }
    // };
    // fetchStats();
  }, []);

  return (
    <div className="account-overview">
      <Header title="Transactions" />

      {/* <main className="user-main-content"> */}
        {/* Total Funds Section */}
        {/* <TransactionStats /> */}

        {/* Stats Cards */}
        <motion.div
          className="stats-grid"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          
        </motion.div>

        <div className="daily-transaction-section">
            <TransactionsTable />
          </div>

        {loading && (
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Loading data...</p>
          </div>
        )}
      {/* </main> */}
    </div>
  );
};

export default TransactionDashboard;
