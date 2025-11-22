import React, { useState, useEffect, useRef } from "react";
import { ChevronDown, ChevronsUpDown, ChevronUp, Calendar as CalendarIcon, X } from "lucide-react";
import "./userData.css";

import washer1Img from "/usermanagement/profile-tick.svg";
import { getDailySummary } from "../../../../../api/createRecordApi";

const UserData = () => {
  const [expandedRows, setExpandedRows] = useState({});
  const [searchQuery, setSearchQuery] = useState("");
  const [showCalendar, setShowCalendar] = useState(false);
  const [selectedDateRange, setSelectedDateRange] = useState({
    start: null,
    end: null,
  });
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [washerData, setWasherData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const calendarRef = useRef(null);

  // Fetch daily summary with all washers' data
  const fetchWasherData = async (dateString = null) => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('Fetching daily summary for date:', dateString); // Debug log
      
      const response = await getDailySummary(dateString);

      console.log('API Response:', response); // Debug log

      if (response.success && response.data && response.data.washerPayments) {
        const transformedData = response.data.washerPayments.map((washer) => ({
          id: washer.washerId,
          name: washer.washerName,
          phone: washer.washerPhone,
          image: washer1Img,
          workerPay: `₦${washer.washerEarnings.toFixed(2)}`,
          companyPay: `₦${washer.companyEarnings.toFixed(2)}`,
          totalJobs: washer.itemsWashed,
          carsWashed: washer.carsWashed,
          createdAt: response.data.date,
          // Store raw numbers for sorting if needed
          workerPayRaw: washer.washerEarnings,
          companyPayRaw: washer.companyEarnings,
          // Store items directly in the washer object
          items: washer.items,
        }));

        console.log('Transformed washers:', transformedData.length); // Debug log
        setWasherData(transformedData);
      } else {
        setWasherData([]);
      }
      setLoading(false);
    } catch (err) {
      setError(err.message || "Failed to fetch washer data");
      setLoading(false);
      console.error("Error fetching washer data:", err);
    }
  };

  // Process washer details from already fetched data
  const getWasherDetails = (washer) => {
    if (!washer.items || washer.items.length === 0) {
      return [];
    }

    // Group items by service type and calculate totals
    const itemsMap = {};
    
    washer.items.forEach(item => {
      const serviceItem = item.serviceItem;
      
      if (!itemsMap[serviceItem]) {
        itemsMap[serviceItem] = {
          service: serviceItem,
          quantity: 0,
          workerEarning: 0,
          companyEarning: 0,
        };
      }
      
      itemsMap[serviceItem].quantity += 1;
      itemsMap[serviceItem].workerEarning += item.washerShare;
      itemsMap[serviceItem].companyEarning += item.companyShare;
    });

    // Convert to array and format
    return Object.values(itemsMap).map(item => ({
      service: item.service,
      quantity: item.quantity,
      workerEarning: `₦${item.workerEarning.toFixed(2)}`,
      companyEarning: `₦${item.companyEarning.toFixed(2)}`,
    }));
  };

  // Fetch data when component mounts or date range changes
  useEffect(() => {
    const dateString = selectedDateRange.start 
      ? formatDateForAPI(selectedDateRange.start)
      : null;
    
    fetchWasherData(dateString);
  }, [selectedDateRange]);

  // Format date to YYYY-MM-DD for API
  const formatDateForAPI = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

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

  const toggleRow = (washerId) => {
    setExpandedRows((prev) => ({
      ...prev,
      [washerId]: !prev[washerId],
    }));
  };

  const toggleCalendar = () => {
    setShowCalendar(!showCalendar);
  };

  const handleDateClick = (date) => {
    // Single date selection only for now
    setSelectedDateRange({ start: date, end: null });
    setShowCalendar(false);
  };

  const clearDateFilter = () => {
    console.log('Clearing date filter'); // Debug log
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

  const formatDateHeader = () => {
    if (!selectedDateRange.start && !selectedDateRange.end) {
      return new Date().toLocaleDateString('en-US', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      });
    }
    
    if (selectedDateRange.start && !selectedDateRange.end) {
      return selectedDateRange.start.toLocaleDateString('en-US', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      });
    }
    
    if (selectedDateRange.start && selectedDateRange.end) {
      return `${selectedDateRange.start.toLocaleDateString()} - ${selectedDateRange.end.toLocaleDateString()}`;
    }
    
    return "Payment Summary";
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

  const filteredWashers = washerData.filter((washer) =>
    washer.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="washer-page">
      <div className="washer-header">
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
            placeholder="Search by washer name"
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

      <div className="washer-table-container">
        {loading ? (
          <div className="loading-container">
            <div className="loading-spinner"></div>
          </div>
        ) : error ? (
          <div className="error-container">
            <p>Error loading payment data: {error}</p>
            <button onClick={() => fetchWasherData()}>Retry</button>
          </div>
        ) : (
          <table className="washer-table">
            <thead>
              <tr>
                <th>
                  <div className="header-with-icon washer">
                    <span>Washer Name</span>
                  </div>
                </th>
                <th>
                  <div className="header-with-icon">
                    <ChevronsUpDown size={14} className="sort-icon-left" />
                    <span>Worker Pay</span>
                  </div>
                </th>
                <th>
                  <div className="header-with-icon">
                    <ChevronsUpDown size={14} className="sort-icon-left" />
                    <span>Company Pay</span>
                  </div>
                </th>
                  {/* <div className="header-with-icon">
                    <ChevronsUpDown size={14} className="sort-icon-left" />
                    <span>Total Jobs</span>
                  </div> */}
                
              </tr>
            </thead>
            <tbody>
              {filteredWashers.length === 0 ? (
                <tr>
                  <td colSpan="4" className="no-washers">
                    <p>{washerData.length === 0 ? "No payment data available for selected date" : "No washers found matching your search"}</p>
                  </td>
                </tr>
              ) : (
                filteredWashers.map((washer) => (
                  <React.Fragment key={washer.id}>
                    <tr className="washer-row">
                      <td>
                        <div className="washer-name-cell">
                          <button
                            className={`expand-btn ${
                              expandedRows[washer.id] ? "expanded" : ""
                            }`}
                            onClick={() => toggleRow(washer.id)}
                          >
                            {expandedRows[washer.id] ? (
                              <ChevronUp size={18} />
                            ) : (
                              <ChevronDown size={18} />
                            )}
                          </button>
                          {washer.image && (
                            <img
                              src={washer.image}
                              alt={washer.name}
                              className="washer-icon"
                            />
                          )}
                          <span className="washer-name">{washer.name}</span>
                        </div>
                      </td>
                      <td>{washer.workerPay}</td>
                      <td>{washer.companyPay}</td>
                      {/* <td>{washer.totalJobs}</td> */}
                    </tr>

                    {expandedRows[washer.id] && (
                      <tr className="expanded-row">
                        <td colSpan="4">
                          <div className="wash-details-container">
                            <div className="wash-details-header">
                              <div className="detail-cell service">Service Type</div>
                              <div className="detail-cell quantity">Quantity</div>
                              <div className="detail-cell worker-earning">Worker Earning</div>
                              <div className="detail-cell company-earning">Company Earning</div>
                            </div>
                            {(() => {
                              const details = getWasherDetails(washer);
                              return details.length > 0 ? (
                                details.map((detail, idx) => (
                                  <div key={idx} className="wash-detail-row">
                                    <div className="detail-cell service">
                                      {detail.service}
                                    </div>
                                    <div className="detail-cell quantity">
                                      {detail.quantity}
                                    </div>
                                    <div className="detail-cell worker-earning">
                                      {detail.workerEarning}
                                    </div>
                                    <div className="detail-cell company-earning">
                                      {detail.companyEarning}
                                    </div>
                                  </div>
                                ))
                              ) : (
                                <div className="wash-detail-row">
                                  <div className="detail-cell" style={{gridColumn: '1 / -1', textAlign: 'center'}}>
                                    No items found for this washer
                                  </div>
                                </div>
                              );
                            })()}
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default UserData;