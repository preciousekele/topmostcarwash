import React, { useState, useEffect, useRef } from "react";
import { ChevronDown, ChevronUp, Calendar as CalendarIcon } from "lucide-react";
import "./Company.css";
import Header from "../../../../components/Header/Header";
import { getCompanySummaryAllBranches } from "../../../../api/createRecordApi";

const Company = () => {
  const [expandedRows, setExpandedRows] = useState({});
  const [expandedBranches, setExpandedBranches] = useState({});
  const [searchQuery, setSearchQuery] = useState("");
  const [showCalendar, setShowCalendar] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState(new Date());
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [companyData, setCompanyData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const calendarRef = useRef(null);

  // Format price with thousand separators
  const formatPrice = (amount) => {
    return amount.toLocaleString('en-NG', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  };

  // Format date to "22 November, 2025" format
  const formatDateToShortFormat = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  // Format date to YYYY-MM-DD for API
  const formatDateForAPI = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // Get all dates in a month
  const getDatesInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    
    const dates = [];
    for (let day = 1; day <= daysInMonth; day++) {
      dates.push(new Date(year, month, day));
    }
    return dates;
  };

  // Fetch company summary data for entire month (all branches)
  const fetchMonthlyData = async (month) => {
    try {
      setLoading(true);
      setError(null);
      
      const dates = getDatesInMonth(month);
      const monthlyData = [];

      // Fetch data for each date in the month
      for (const date of dates) {
        const dateString = formatDateForAPI(date);
        
        try {
          const response = await getCompanySummaryAllBranches(dateString);
          const responseData = response.data || response;

          if (responseData && responseData.branches) {
            const { branches, overallTotals, date: responseDate } = responseData;

            // Create a record for this date with all branches
            const dateRecord = {
              id: dateString,
              date: formatDateToShortFormat(dateString),
              rawDate: dateString,
              totalEarnings: overallTotals.totalEarnings,
              companyShare: overallTotals.companyShare,
              branches: branches.map(branchData => ({
                branch: branchData.branch,
                totalEarnings: branchData.summary.totalEarnings,
                companyShare: branchData.summary.companyShare,
                items: branchData.itemsWashed
              }))
            };

            monthlyData.push(dateRecord);
          }
        } catch (err) {
          console.log(`No data for ${dateString}`);
        }
      }

      // Sort by date descending (most recent first)
      monthlyData.sort((a, b) => new Date(b.rawDate) - new Date(a.rawDate));
      
      setCompanyData(monthlyData);
      setLoading(false);
    } catch (err) {
      setError(err.message || "Failed to fetch company data");
      setLoading(false);
      console.error("Error fetching monthly data:", err);
    }
  };

  // Fetch data when component mounts or selected month changes
  useEffect(() => {
    fetchMonthlyData(selectedMonth);
  }, [selectedMonth]);

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

  const toggleRow = (id) => {
    setExpandedRows((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const toggleBranch = (dateId, branchId) => {
    const key = `${dateId}-${branchId}`;
    setExpandedBranches((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const toggleCalendar = () => {
    setShowCalendar(!showCalendar);
  };

  const handleMonthSelect = (date) => {
    setSelectedMonth(new Date(date.getFullYear(), date.getMonth(), 1));
    setShowCalendar(false);
  };

  const clearDateFilter = () => {
    setSelectedMonth(new Date());
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

  const changeMonth = (offset) => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() + offset, 1)
    );
  };

  const formatDateHeader = () => {
    const monthNames = [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ];
    
    return `${monthNames[selectedMonth.getMonth()]}, ${selectedMonth.getFullYear()}`;
  };

  const renderCalendar = () => {
    const { daysInMonth, startingDayOfWeek } = getDaysInMonth(currentMonth);
    const days = [];
    const monthNames = [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ];

    const isCurrentMonth = 
      currentMonth.getMonth() === selectedMonth.getMonth() &&
      currentMonth.getFullYear() === selectedMonth.getFullYear();

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

      days.push(
        <div
          key={day}
          className={`calendar-day ${isCurrentMonth ? "selected" : ""}`}
          onClick={() => handleMonthSelect(date)}
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
        <div className="calendar-actions">
          <button className="clear-filter" onClick={clearDateFilter}>
            Clear Filter
          </button>
        </div>
      </div>
    );
  };

  const filteredCompanies = companyData.filter((company) =>
    company.date.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="account-overview">
      <Header title="Company" />

      <div className="transaction-section">
        <div className="company-header">
          <h1>{formatDateHeader()}</h1>
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
              placeholder="Search by date"
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

        <div className="company-table-container">
          {loading ? (
            <div className="loading-container">
              <div className="loading-spinner"></div>
            </div>
          ) : error ? (
            <div className="error-container">
              <p>Error loading company data: {error}</p>
              <button onClick={() => fetchMonthlyData(selectedMonth)}>Retry</button>
            </div>
          ) : (
            <table className="company-table">
              <thead>
                <tr>
                  <th>
                    <div className="header-with-icon washer">
                      <span>Date / Branch</span>
                    </div>
                  </th>
                  <th>
                    <div className="header-with-icon">
                      <span>Total Pay</span>
                    </div>
                  </th>
                  <th>
                    <div className="header-with-icon">
                      <span>Company Pay</span>
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredCompanies.length === 0 ? (
                  <tr>
                    <td colSpan="3" className="no-companies">
                      <p>{companyData.length === 0 ? "No company data available for selected month" : "No dates found matching your search"}</p>
                    </td>
                  </tr>
                ) : (
                  filteredCompanies.map((company) => (
                    <React.Fragment key={company.id}>
                      {/* Date Row */}
                      <tr className="company-row date-row">
                        <td>
                          <div className="company-date-cell">
                            <button
                              className={`expand-btn ${
                                expandedRows[company.id] ? "expanded" : ""
                              }`}
                              onClick={() => toggleRow(company.id)}
                            >
                              {expandedRows[company.id] ? (
                                <ChevronUp size={18} />
                              ) : (
                                <ChevronDown size={18} />
                              )}
                            </button>
                            <span className="company-date">{company.date}</span>
                          </div>
                        </td>
                        <td>₦{formatPrice(company.totalEarnings)}</td>
                        <td>₦{formatPrice(company.companyShare)}</td>
                      </tr>

                      {/* Branches Rows */}
                      {expandedRows[company.id] && company.branches.map((branchData, idx) => (
                        <React.Fragment key={`${company.id}-branch-${idx}`}>
                          <tr className="company-row branch-row">
                            <td>
                              <div className="company-name-cell branch-name-cell">
                                <button
                                  className={`expand-btn ${
                                    expandedBranches[`${company.id}-${branchData.branch.id}`] ? "expanded" : ""
                                  }`}
                                  onClick={() => toggleBranch(company.id, branchData.branch.id)}
                                >
                                  {expandedBranches[`${company.id}-${branchData.branch.id}`] ? (
                                    <ChevronUp size={18} />
                                  ) : (
                                    <ChevronDown size={18} />
                                  )}
                                </button>
                                <span className="branch-name-text">{branchData.branch.name}</span>
                              </div>
                            </td>
                            <td>₦{formatPrice(branchData.totalEarnings)}</td>
                            <td>₦{formatPrice(branchData.companyShare)}</td>
                          </tr>

                          {/* Items for this branch */}
                          {expandedBranches[`${company.id}-${branchData.branch.id}`] && (
                            <tr className="expanded-row">
                              <td colSpan="3">
                                <div className="service-details-container">
                                  <div className="service-details-header">
                                    <div className="detail-cell item">Items Washed</div>
                                    <div className="detail-cell quantity">Quantity</div>
                                    <div className="detail-cell company-earning">Company</div>
                                  </div>
                                  {branchData.items && branchData.items.length > 0 ? (
                                    branchData.items.map((detail, itemIdx) => (
                                      <div key={itemIdx} className="service-detail-row">
                                        <div className="detail-cell item">
                                          {detail.itemName}
                                        </div>
                                        <div className="detail-cell quantity">
                                          {detail.quantity}
                                        </div>
                                        <div className="detail-cell company-earning">
                                          ₦{formatPrice(detail.companyEarning)}
                                        </div>
                                      </div>
                                    ))
                                  ) : (
                                    <div className="service-detail-row">
                                      <div className="detail-cell" style={{gridColumn: '1 / -1', textAlign: 'center'}}>
                                        No items found for this branch
                                      </div>
                                    </div>
                                  )}
                                </div>
                              </td>
                            </tr>
                          )}
                        </React.Fragment>
                      ))}
                    </React.Fragment>
                  ))
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default Company;