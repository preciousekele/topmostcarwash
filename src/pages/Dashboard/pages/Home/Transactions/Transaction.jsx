import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Copy,
  Calendar,
  X,
  Check,
  ChevronsUpDown,
  MoveUpRight,
  MoveUpLeft,
  MoveDownLeft,
} from "lucide-react";
import "./Transaction.css";

// Mock data
const mockTransactions = [
  {
    id: 1,
    date: "Sept 11, 2025",
    time: "12:45pm",
    details: "Transfer to Olabanji David",
    accountNumber: "1999902002",
    method: "Bank Transfer",
    status: "Successful",
    amount: "-$10,000.00",
  },
  {
    id: 2,
    date: "Sept 11, 2025",
    time: "12:45pm",
    details: "Transfer to Olabanji David",
    accountNumber: "1999902002",
    method: "Card Payment",
    status: "Failed",
    amount: "-$10,000.00",
  },
  {
    id: 3,
    date: "Sept 11, 2025",
    time: "12:45pm",
    details: "Income to Olabanji David",
    accountNumber: "1999902002",
    method: "Bank Transfer",
    status: "Pending",
    amount: "$10,000.00",
  },
  {
    id: 4,
    date: "Sept 10, 2025",
    time: "10:30am",
    details: "Transfer to John Smith",
    accountNumber: "1999902003",
    method: "Card Payment",
    status: "Successful",
    amount: "-$5,000.00",
  },
  {
    id: 5,
    date: "Sept 09, 2025",
    time: "3:20pm",
    details: "Income from Sarah Wilson",
    accountNumber: "1999902004",
    method: "Bank Transfer",
    status: "Pending",
    amount: "$15,000.00",
  },
];

const Transaction = () => {
  const [transactions, setTransactions] = useState(mockTransactions);
  const [filteredTransactions, setFilteredTransactions] =
    useState(mockTransactions);
  const [activeModal, setActiveModal] = useState(null);
  const [copiedId, setCopiedId] = useState(null);
  const [filters, setFilters] = useState({
    status: "",
    method: "",
    date: "",
  });

  const statusOptions = ["All", "Successful", "Failed", "Pending"];
  const methodOptions = ["All", "Bank Transfer", "Card Payment"];

  const handleFilterChange = (filterType, value) => {
    const newFilters = {
      ...filters,
      [filterType]: value === "All" ? "" : value,
    };
    setFilters(newFilters);

    let filtered = mockTransactions;

    if (newFilters.status) {
      filtered = filtered.filter((t) => t.status === newFilters.status);
    }

    if (newFilters.method) {
      filtered = filtered.filter((t) => t.method === newFilters.method);
    }

    setFilteredTransactions(filtered);
    setActiveModal(null);
  };

  const copyToClipboard = (accountNumber, id) => {
    navigator.clipboard.writeText(accountNumber);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const getTransactionIcon = (transaction) => {
    const { details, status } = transaction;
    const isIncome = details.includes("Income");
    
    let iconClass = "transaction-icon";
    let IconComponent = isIncome ? MoveDownLeft : MoveUpRight;
    
    // Set icon color based on status
    if (status === "Successful") {
      iconClass += " successful";
    } else if (status === "Failed") {
      iconClass += " failed";
    } else if (status === "Pending") {
      iconClass += " pending";
    }

    return (
      <div className={iconClass}>
        <motion.div
          initial={{ y: 5 }}
          animate={{ y: 0 }}
          transition={{ duration: 0.3 }}
        >
         <IconComponent className="transaction-icon-svg" />
        </motion.div>
      </div>
    );
  };

  return (
    <motion.div
      className="transactions-container"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.5 }}
    >
      <h2 className="transactions-title">Transactions</h2>

      <div className="transactions-table">
        <div className="table-header">
          <div
            className="header-cell date-header"
            onClick={() => setActiveModal("date")}
          >
            <ChevronsUpDown size={16} />
            <span>Transaction Date</span>
          </div>
          <div className="header-cell details">Transaction Details</div>
          <div
            className="header-cell method-header"
            onClick={() => setActiveModal("method")}
          >
            <ChevronsUpDown size={16} />
            <span>Transaction Method</span>
          </div>
          <div
            className="header-cell status-header"
            onClick={() => setActiveModal("status")}
          >
            <ChevronsUpDown size={16} />
            <span>Status</span>
          </div>
          <div className="header-cell">Available balance</div>
        </div>

        <motion.div className="table-body">
          <AnimatePresence>
            {filteredTransactions.map((transaction, index) => (
              <motion.div
                key={transaction.id}
                className="table-row"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <div className="cell date-cell">
                  {getTransactionIcon(transaction)}
                  <div>
                    <div className="date">{transaction.date}</div>
                    <div className="time">{transaction.time}</div>
                  </div>
                </div>

                <div className="cell details-cell">
                  <div className="transaction-details">
                    {transaction.details}
                  </div>
                  <div className="account-number">
                    {transaction.accountNumber}
                    <motion.button
                      className="copy-btn"
                      onClick={() =>
                        copyToClipboard(
                          transaction.accountNumber,
                          transaction.id
                        )
                      }
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      {copiedId === transaction.id ? (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="copied-indicator"
                        >
                          <Check size={12} />
                          <span className="copied-text">Copied</span>
                        </motion.div>
                      ) : (
                        <Copy size={12} />
                      )}
                    </motion.button>
                  </div>
                </div>

                <div className="cell method-cell">{transaction.method}</div>

                <div className="cell status-cell">
                  <span
                    className="status-badge"
                    data-status={transaction.status}
                  >
                    {transaction.status}
                  </span>
                </div>

                <div className="cell amount-cell">
                  <span
                    className={
                      transaction.amount.includes("-")
                        ? "negative-amount"
                        : "positive-amount"
                    }
                  >
                    {transaction.amount}
                  </span>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Modals */}
      <AnimatePresence>
        {activeModal === "status" && (
          <motion.div
            className="modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setActiveModal(null)}
          >
            <motion.div
              className="modal-content"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="modal-header">
                <h3>Filter by Status</h3>
                <button onClick={() => setActiveModal(null)}>
                  <X size={20} />
                </button>
              </div>
              <div className="filter-options">
                {statusOptions.map((option) => (
                  <motion.button
                    key={option}
                    className={`filter-option ${
                      filters.status === option ||
                      (option === "All" && !filters.status)
                        ? "active"
                        : ""
                    }`}
                    onClick={() => handleFilterChange("status", option)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {option}
                  </motion.button>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}

        {activeModal === "method" && (
          <motion.div
            className="modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setActiveModal(null)}
          >
            <motion.div
              className="modal-content"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="modal-header">
                <h3>Filter by Method</h3>
                <button onClick={() => setActiveModal(null)}>
                  <X size={20} />
                </button>
              </div>
              <div className="filter-options">
                {methodOptions.map((option) => (
                  <motion.button
                    key={option}
                    className={`filter-option ${
                      filters.method === option ||
                      (option === "All" && !filters.method)
                        ? "active"
                        : ""
                    }`}
                    onClick={() => handleFilterChange("method", option)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {option}
                  </motion.button>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}

        {activeModal === "date" && (
          <motion.div
            className="modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setActiveModal(null)}
          >
            <motion.div
              className="modal-content"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="modal-header">
                <h3>Filter by Date</h3>
                <button onClick={() => setActiveModal(null)}>
                  <X size={20} />
                </button>
              </div>
              <div className="date-filter">
                <input
                  type="date"
                  className="date-input"
                  onChange={(e) => handleFilterChange("date", e.target.value)}
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default Transaction;