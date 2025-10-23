import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import "./Home.css";
import Header from "../../../../components/Header/Header";
import TotalFunds from "./TotalFunds/TotaFunds";
import UserStatsCard from "./UserStats/UserStats";
import DepositsWithdrawalsChart from "./Depchart/DepChart";
import ZakatDistributionChart from "./Zakat/Zakat";
import Transaction from "./Transactions/Transaction";

const Home = () => {
  const [stats, setStats] = useState({
    totalUsers: 1509,
    premiumUsers: 1509,
    activeUsers: 1200,
    pendingKyc: 509,
  });

  const [loading, setLoading] = useState(false);

  // You can add your API calls here
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
      <Header title="Account Overview" />

      <main className="user-main-content">
        {/* Total Funds Section */}
        <TotalFunds />

        {/* Stats Cards */}
        <motion.div
          className="stats-grid"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <UserStatsCard
            value={stats.totalUsers.toLocaleString()}
            label="TOTAL USERS"
            delay={0.2}
          />
          <UserStatsCard
            value={stats.premiumUsers.toLocaleString()}
            label="PREMIUM USERS"
            delay={0.25}
          />
          <UserStatsCard
            value={stats.activeUsers.toLocaleString()}
            label="ACTIVE USERS"
            delay={0.3}
          />
          <UserStatsCard
            value={stats.pendingKyc.toLocaleString()}
            label="PENDING KYC"
            delay={0.35}
          />
        </motion.div>

        {/* Charts Section */}
        <div className="charts-grid">
          <div className="chart-large">
            <DepositsWithdrawalsChart />
          </div>
          <div className="chart-small">
            <ZakatDistributionChart />
          </div>
        </div>

        <div className="transaction-section">
            <Transaction />
          </div>

        {loading && (
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Loading data...</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default Home;
