import { ChevronsUpDown } from "lucide-react";
import  { useState } from "react";
import "./userData.css";
import view from "/usermanagement/profile-circle.svg";
import suspend from "/usermanagement/profile-tick.svg";
import deleteIcon from "/usermanagement/profile-delete.svg";

const UserData = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [openMenuId, setOpenMenuId] = useState(null);

  // Sample data - updated with pending status
  const transactions = [
    {
      id: 1,
      fullName: "Adeola Johnson",
      email: "adeola.johnson@yahoo.com",
      phoneNumber: "703 555 0123",
      status: "Active",
      balanceNaira: "₦10,000.00",
      balanceDollar: "$10,000.00",
      verified: true,
      profileImage:
        "https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=150&h=150&fit=crop&crop=face",
    },
    {
      id: 2,
      fullName: "Chinedu Okoro",
      email: "chinedu.okoro@gmail.com",
      phoneNumber: "812 474 8890",
      status: "Inactive",
      balanceNaira: "₦5,500.00",
      balanceDollar: "$5,500.00",
      verified: false,
      profileImage:
        "https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=150&h=150&fit=crop&crop=face",
    },
    {
      id: 3,
      fullName: "Funmi Adebayo",
      email: "funmi.adebayo@outlook.com",
      phoneNumber: "705 623 4517",
      status: "Inactive",
      balanceNaira: "₦10,000.00",
      balanceDollar: "$10,000.00",
      verified: false,
      profileImage:
        "https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=150&h=150&fit=crop&crop=face",
    },
    {
      id: 4,
      fullName: "Emeka Nwosu",
      email: "emeka.nwosu@hotmail.com",
      phoneNumber: "814 332 9876",
      status: "Closed",
      balanceNaira: "₦10,000.00",
      balanceDollar: "$10,000.00",
      verified: false,
      profileImage:
        "https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=150&h=150&fit=crop&crop=face",
    },
    {
      id: 5,
      fullName: "Bola Hassan",
      email: "bola.hassan@gmail.com",
      phoneNumber: "802 745 3366",
      status: "Active",
      balanceNaira: "₦10,000.00",
      balanceDollar: "$10,000.00",
      verified: true,
      profileImage:
        "https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=150&h=150&fit=crop&crop=face",
    },
    {
      id: 6,
      fullName: "Tunde Lawal",
      email: "tunde.lawal@yahoo.com",
      phoneNumber: "706 888 2244",
      status: "Closed",
      balanceNaira: "₦10,000.00",
      balanceDollar: "$10,000.00",
      verified: false,
      profileImage:
        "https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=150&h=150&fit=crop&crop=face",
    },
    {
      id: 7,
      fullName: "Kemi Olatunji",
      email: "kemi.olatunji@gmail.com",
      phoneNumber: "803 567 8901",
      status: "Inactive",
      balanceNaira: "₦2,750.00",
      balanceDollar: "$2,750.00",
      verified: false,
      profileImage:
        "https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=150&h=150&fit=crop&crop=face",
    },
    {
      id: 8,
      fullName: "Adamu Ibrahim",
      email: "adamu.ibrahim@outlook.com",
      phoneNumber: "809 123 4567",
      status: "Inactive",
      balanceNaira: "₦7,200.00",
      balanceDollar: "$7,200.00",
      verified: false,
      profileImage:
        "https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=150&h=150&fit=crop&crop=face",
    },
  ];

  // Filter transactions based on search query
  const filteredTransactions = transactions.filter(
    (transaction) =>
      transaction.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      transaction.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      transaction.phoneNumber.includes(searchQuery)
  );

  const handleMenuClick = (id) => {
    setOpenMenuId(openMenuId === id ? null : id);
  };

  const SearchIcon = () => (
    <svg
      className="search-icon"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="m21 21-6-6m2-5a7 7 0 1 1-14 0 7 7 0 0 1 14 0Z"
      />
    </svg>
  );

  const MenuIcon = () => (
    <svg
      className="menu-icon"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
      />
    </svg>
  );

  return (
    <div className="user-container">
      {/* Search Bar */}
      <div className="search-container">
        <div className="search-wrapper">
          <SearchIcon />
          <input
            type="text"
            placeholder="Search for a user..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
        </div>
      </div>

      {/* Table Container */}
      <div className="user-table-container">
        <table className="user-table">
          {/* Table Header */}
          <thead className="user-table-header">
            <tr>
              <th className="user-name-header-cell">
                <div className="grey-box"></div>
                <div className="user-name-header-content">
                  <ChevronsUpDown className="chevron-icon" />
                  <span>Full Name</span>
                </div>
              </th>
              <th className="user-header-cell">
                <div className="user-header-content">
                  <ChevronsUpDown className="chevron-icon" />
                  <span>Email Address</span>
                </div>
              </th>
              <th className="user-header-cell">
                <div className="user-header-content">
                  <ChevronsUpDown className="chevron-icon" />
                  <span>Phone</span>
                </div>
              </th>
              <th className="user-header-cell">
                <div className="user-header-content">
                  <ChevronsUpDown className="chevron-icon" />
                  <span>Status</span>
                </div>
              </th>
              <th className="user-header-cell-balance">Available Balance (₦)</th>
              <th className="user-header-cell-balance">Available Balance ($)</th>
              <th className="user-header-cell header-center">
                {/* Actions */}
              </th>
            </tr>
          </thead>

          {/* Table Body */}
          <tbody className="user-table-body">
            {filteredTransactions.map((transaction) => (
              <tr key={transaction.id} className="user-table-row">
                {/* Full Name */}
                <td className="user-table-cell">
                  <div className="userdata-info">
                    <div className="grey-box"></div>
                    <div className="avatar">
                      <img
                        src={transaction.profileImage}
                        alt={transaction.fullName}
                        className="user-profile-image"
                      />
                    </div>
                    <div className="user-details">
                      <div className="user-name">{transaction.fullName}</div>
                      {transaction.verified && (
                        <div className="status-text verified">Verified</div>
                      )}
                      {!transaction.verified &&
                        transaction.status === "Closed" && (
                          <div className="status-text declined">Declined</div>
                        )}
                      {!transaction.verified &&
                        transaction.status === "Inactive" && (
                          <div className="status-text pending">Pending</div>
                        )}
                    </div>
                  </div>
                </td>

                {/* Email Address */}
                <td className="user-table-cell">{transaction.email}</td>

                {/* Phone Number */}
                <td className="user-table-cell">{transaction.phoneNumber}</td>

                {/* Status */}
                <td className="user-table-cell">
                  <span
                    className={`user-status-badge status-${transaction.status.toLowerCase()}`}
                  >
                    {transaction.status}
                  </span>
                </td>

                {/* Available Balance (Naira) */}
                <td className="user-table-cell balance">
                  {transaction.balanceNaira}
                </td>

                {/* Available Balance (Dollar) */}
                <td className="user-table-cell balance">
                  {transaction.balanceDollar}
                </td>

                {/* Actions Menu */}
                <td className="user-table-cell table-cell-center">
                  <div className="menu-container">
                    <button
                      onClick={() => handleMenuClick(transaction.id)}
                      className="menu-button"
                    >
                      <MenuIcon />
                    </button>

                    {/* Dropdown Menu */}
                    {openMenuId === transaction.id && (
                      <div className="dropdown-menu">
                        <div className="menu-items">
                          <button className="menu-item">
                            <img src={view} alt="View" className="menu-icon" />
                            <span>View User Account</span>
                          </button>

                          <button className="menu-item menu-item-suspend">
                            <img
                              src={suspend}
                              alt="Suspend"
                              className="menu-icon"
                            />
                            <span>Suspend Account</span>
                          </button>

                          <button className="menu-item menu-item-danger">
                            <img
                              src={deleteIcon}
                              alt="Delete"
                              className="menu-icon"
                            />
                            <span>Delete Account</span>
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* No Results Message */}
      {filteredTransactions.length === 0 && (
        <div className="no-results">
          No transactions found matching your search.
        </div>
      )}

      {/* Click outside to close menu */}
      {openMenuId && (
        <div className="overlay" onClick={() => setOpenMenuId(null)}></div>
      )}
    </div>
  );
};

export default UserData;
