import React, { useState, useEffect, useRef } from "react";
import { Car, Calendar as CalendarIcon, X } from "lucide-react";
import Receipt from "./Receipt";
import "./TransactionsHistory.css";

const TransactionsHistory = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [showReceipt, setShowReceipt] = useState(false);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCalendar, setShowCalendar] = useState(false);
  const [selectedDateRange, setSelectedDateRange] = useState({
    start: null,
    end: null,
  });
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const calendarRef = useRef(null);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const token = localStorage.getItem("token");

        // Replace this URL with your actual car wash API endpoint
        // const response = await fetch('YOUR_API_ENDPOINT/carwash-history', {
        //   method: 'GET',
        //   headers: {
        //     'Authorization': `Bearer ${token}`,
        //     'Content-Type': 'application/json',
        //   },
        // });

        // if (!response.ok) {
        //   throw new Error('Failed to fetch transaction history');
        // }

        // const data = await response.json();

        // Mock data for demonstration - replace with actual API data
        const mockData = [
          {
            id: 1,
            vehicleType: "Car",
            plateNumber: "ABC-123",
            washerName: "Abbey",
            items: [
              { name: "Basic", price: 1200 },
              { name: "Roof", price: 800 },
            ],
            paymentMethod: "cash",
            createdAt: "2024-01-15T14:30:00Z",
            totalAmount: 2000,
            status: "completed",
          },
          {
            id: 2,
            vehicleType: "Jeep",
            plateNumber: "XYZ-456",
            washerName: "Shako",
            items: [
              { name: "Basic", price: 1500 },
              { name: "Roof", price: 800 },
              { name: "Boot", price: 800 },
            ],
            paymentMethod: "transfer",
            createdAt: "2024-01-14T10:15:00Z",
            totalAmount: 3100,
            status: "completed",
          },
          {
            id: 3,
            vehicleType: "Car",
            plateNumber: "DEF-789",
            washerName: "Ayo",
            items: [
              { name: "Basic", price: 1200 },
              { name: "Floor", price: 800 },
            ],
            paymentMethod: "cash",
            createdAt: "2024-01-13T16:45:00Z",
            totalAmount: 2000,
            status: "completed",
          },
          {
            id: 4,
            vehicleType: "Car",
            plateNumber: "GHI-321",
            washerName: "David",
            items: [
              { name: "Basic", price: 1200 },
              { name: "Roof", price: 800 },
            ],
            paymentMethod: "transfer",
            createdAt: "2024-01-12T09:20:00Z",
            totalAmount: 2000,
            status: "completed",
          },
        ];

        const transformedTransactions = mockData.map((transaction) => ({
          id: transaction.id,
          type: "carwash",
          title: transaction.vehicleType,
          washerName: transaction.washerName,
          date: formatDate(transaction.createdAt),
          amount: `₦${transaction.totalAmount.toLocaleString()}`,
          status:
            transaction.status === "pending"
              ? "Pending"
              : transaction.status === "completed"
              ? "Success"
              : "Failed",
          plateNumber: transaction.plateNumber,
          items: transaction.items,
          paymentMethod:
            transaction.paymentMethod === "cash" ? "Cash" : "Transfer",
          createdAt: transaction.createdAt,
          totalAmount: transaction.totalAmount,
        }));

        setTransactions(transformedTransactions);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
        console.error("Error fetching transactions:", err);
      }
    };

    fetchTransactions();
  }, []);

  // Close calendar when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (calendarRef.current && !calendarRef.current.contains(event.target)) {
        setShowCalendar(false);
      }
    };

    if (showCalendar) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showCalendar]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);

    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];

    const month = months[date.getMonth()];
    const day = date.getDate();
    const year = date.getFullYear();

    const getOrdinalSuffix = (day) => {
      if (day > 3 && day < 21) return "th";
      switch (day % 10) {
        case 1:
          return "st";
        case 2:
          return "nd";
        case 3:
          return "rd";
        default:
          return "th";
      }
    };

    const dayWithSuffix = `${day}${getOrdinalSuffix(day)}`;

    let hours = date.getHours();
    const minutes = date.getMinutes().toString().padStart(2, "0");
    const ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12;
    hours = hours ? hours : 12;

    return `${month} ${dayWithSuffix}, ${year} ${hours}:${minutes}${ampm}`;
  };

  const getTransactionIcon = () => {
    return (
      <div className="transaction-icon carwash-icon">
        <Car size={20} />
      </div>
    );
  };

  const handleTransactionClick = (transaction) => {
    setSelectedTransaction(transaction);
    setShowReceipt(true);
  };

  const handleBackToTransactions = () => {
    setShowReceipt(false);
    setSelectedTransaction(null);
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      handleBackToTransactions();
    }
  };

  const toggleCalendar = () => {
    setShowCalendar(!showCalendar);
  };

  const handleDateClick = (date) => {
    if (
      !selectedDateRange.start ||
      (selectedDateRange.start && selectedDateRange.end)
    ) {
      // Start new selection
      setSelectedDateRange({ start: date, end: null });
    } else {
      // Complete the range
      if (date < selectedDateRange.start) {
        setSelectedDateRange({ start: date, end: selectedDateRange.start });
      } else {
        setSelectedDateRange({ start: selectedDateRange.start, end: date });
      }
    }
  };

  const clearDateFilter = () => {
    setSelectedDateRange({ start: null, end: null });
    setShowCalendar(false);
  };

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    return { daysInMonth, startingDayOfWeek };
  };

  const isDateInRange = (date) => {
    if (!selectedDateRange.start) return false;
    if (!selectedDateRange.end) {
      return date.toDateString() === selectedDateRange.start.toDateString();
    }
    return date >= selectedDateRange.start && date <= selectedDateRange.end;
  };

  const isDateSelected = (date) => {
    if (!selectedDateRange.start) return false;
    if (date.toDateString() === selectedDateRange.start.toDateString())
      return true;
    if (
      selectedDateRange.end &&
      date.toDateString() === selectedDateRange.end.toDateString()
    )
      return true;
    return false;
  };

  const changeMonth = (offset) => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() + offset, 1)
    );
  };

  const renderCalendar = () => {
    const { daysInMonth, startingDayOfWeek } = getDaysInMonth(currentMonth);
    const days = [];
    const monthNames = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];

    // Empty cells for days before month starts
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(<div key={`empty-${i}`} className="calendar-day empty"></div>);
    }

    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(
        currentMonth.getFullYear(),
        currentMonth.getMonth(),
        day
      );
      const isInRange = isDateInRange(date);
      const isSelected = isDateSelected(date);

      days.push(
        <div
          key={day}
          className={`calendar-day ${isInRange ? "in-range" : ""} ${
            isSelected ? "selected" : ""
          }`}
          onClick={() => handleDateClick(date)}
        >
          {day}
        </div>
      );
    }

    return (
      <div className="calendar-dropdown" ref={calendarRef}>
        <div className="calendar-header">
          <button className="calendar-nav" onClick={() => changeMonth(-1)}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path
                d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"
                fill="currentColor"
              />
            </svg>
          </button>
          <span className="calendar-month">
            {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
          </span>
          <button className="calendar-nav" onClick={() => changeMonth(1)}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path
                d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"
                fill="currentColor"
              />
            </svg>
          </button>
        </div>
        <div className="calendar-weekdays">
          <div>Sun</div>
          <div>Mon</div>
          <div>Tue</div>
          <div>Wed</div>
          <div>Thu</div>
          <div>Fri</div>
          <div>Sat</div>
        </div>
        <div className="calendar-days">{days}</div>
        {(selectedDateRange.start || selectedDateRange.end) && (
          <div className="calendar-actions">
            <button className="clear-filter" onClick={clearDateFilter}>
              Clear Filter
            </button>
          </div>
        )}
      </div>
    );
  };

  const filterTransactionsByDate = (transactions) => {
    if (!selectedDateRange.start) return transactions;

    return transactions.filter((transaction) => {
      const transactionDate = new Date(transaction.createdAt);
      transactionDate.setHours(0, 0, 0, 0);

      if (!selectedDateRange.end) {
        const startDate = new Date(selectedDateRange.start);
        startDate.setHours(0, 0, 0, 0);
        return transactionDate.toDateString() === startDate.toDateString();
      }

      const startDate = new Date(selectedDateRange.start);
      const endDate = new Date(selectedDateRange.end);
      startDate.setHours(0, 0, 0, 0);
      endDate.setHours(23, 59, 59, 999);

      return transactionDate >= startDate && transactionDate <= endDate;
    });
  };

  const filteredTransactions = filterTransactionsByDate(
    transactions.filter(
      (transaction) =>
        transaction.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        transaction.plateNumber
          ?.toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        transaction.washerName
          ?.toLowerCase()
          .includes(searchQuery.toLowerCase())
    )
  );

  if (loading) {
    return (
      <div className="transaction-page">
        <div className="transaction-header">
          <h1>Transactions</h1>
        </div>
        <div className="loading-container">
          <p>Loading transactions...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="transaction-page">
        <div className="transaction-header">
          <h1>Transactions</h1>
        </div>
        <div className="error-container">
          <p>Error loading transactions: {error}</p>
          <button onClick={() => window.location.reload()}>Retry</button>
        </div>
      </div>
    );
  }

  return (
    <div className="transaction-page">
      <div className="transaction-header">
        <h1>Transactions</h1>
      </div>

      <div className="search-container">
        <div className="search-input-wrapper">
          <svg
            className="search-icon"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
          >
            <path
              d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"
              fill="currentColor"
            />
          </svg>
          <input
            type="text"
            placeholder="Search by vehicle type, plate number, or washer"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-inputs"
          />
        </div>
        <div className="filter-button-wrapper">
          <button
            className={`filter-button ${showCalendar ? "active" : ""}`}
            onClick={toggleCalendar}
          >
            <CalendarIcon size={20} />
          </button>
          {showCalendar && renderCalendar()}
        </div>
      </div>

      {(selectedDateRange.start || selectedDateRange.end) && (
        <div className="date-filter-badge">
          <span>
            {selectedDateRange.start?.toLocaleDateString()}
            {selectedDateRange.end &&
              ` - ${selectedDateRange.end.toLocaleDateString()}`}
          </span>
          <button onClick={clearDateFilter} className="clear-badge">
            <X size={16} />
          </button>
        </div>
      )}

      <div className="transaction-list">
        {filteredTransactions.length === 0 ? (
          <div className="no-transactions">
            <p>No transactions found</p>
          </div>
        ) : (
          filteredTransactions.map((transaction) => (
            <div
              key={transaction.id}
              className="transaction-item"
              onClick={() => handleTransactionClick(transaction)}
              style={{ cursor: "pointer" }}
            >
              {getTransactionIcon()}
              <div className="transactionss">
                <div className="transaction-details">
                  <h3 className="transaction-title">{transaction.title}</h3>
                  <h3 className="transaction-plate">
                    {transaction.plateNumber}
                  </h3>
                </div>
                <div className="transaction-detailss">
                  <p className="transaction-subtitle">
                    {transaction.washerName}
                  </p>
                  <p className="transaction-date">{transaction.date}</p>
                </div>
              </div>
              <div className="transaction-amount-status">
                <span className="transaction-amount">{transaction.amount}</span>
              </div>
            </div>
          ))
        )}
      </div>

      {showReceipt && (
        <div className="modal-overlay" onClick={handleOverlayClick}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <Receipt
              transaction={selectedTransaction}
              onBack={handleBackToTransactions}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default TransactionsHistory;
