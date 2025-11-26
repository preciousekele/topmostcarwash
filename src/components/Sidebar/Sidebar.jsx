import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import { useLogout } from "../../hooks/useAuth";
import "./Sidebar.css";
import bgImg from '/bg.jpg';
import premiumImg from '/menu/premium.svg'

// Menu item images
const MENU_IMAGES = {
  overview: "/menu/convertshape.svg",
  transactions: "/menu/transaction.svg", 
  staffPayment: "/menu/profile-2user.svg",
  savings: "/menu/moneys.svg",
  investment: "/menu/moneys.svg",
  cardManagement: "/menu/cards.svg",
  zakat: "/menu/convertshape.svg",
  kyc: "/menu/security-user.svg",
  adminSettings: "/menu/eye-menu.svg",
};

const SIDEBAR_ITEMS = [
  { name: "Entry Page", image: MENU_IMAGES.overview, href: "/dashboard/entry" },
  { name: "Transactions", image: MENU_IMAGES.transactions, href: "/dashboard/transactions" },
  { name: "Staff Payment", image: MENU_IMAGES.staffPayment, href: "/dashboard/staffpayment" },
  { name: "Company", image: MENU_IMAGES.investment, href: "/dashboard/company" },
];

const SETTINGS_ITEMS = [];

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const logoutMutation = useLogout();
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 800);
  const [isCollapsed, setIsCollapsed] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      const mobile = window.innerWidth <= 800;
      setIsMobile(mobile);
      console.log('Screen size check:', { 
        width: window.innerWidth, 
        isMobile: mobile,
        pathname: location.pathname 
      });
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);

    return () => window.removeEventListener('resize', checkScreenSize);
  }, [location.pathname]);

  // Debug: Log when component renders
  useEffect(() => {
    console.log('Sidebar rendered at:', location.pathname);
  }, [location.pathname]);

  const handleLogout = async () => {
    try {
      await logoutMutation.mutateAsync();
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  // Check if current path matches or is a child of menu item
  const isActiveRoute = (href) => {
    if (href === "/dashboard/entry") {
      // For entry page, also mark as active for child routes
      return location.pathname === href || location.pathname.startsWith(href + "/");
    }
    return location.pathname === href;
  };

  return (
    <div 
      className={`sidebar-container ${isMobile ? 'mobile' : 'desktop'} ${isCollapsed ? 'collapsed' : ''}`}
      style={{ display: 'block' }} // Force display for debugging
    >
      <img src={bgImg} alt="Sidebar Background" className="dashboard-bg-image" />
      
      <div className="dashboard-green-overlay"></div>
      
      <div className="sidebar-content">
        <div className="sidebar-header">
          <div className="dashboard-logo">
            {!isCollapsed && (
              <span className="dashboard-logo-text">
                <h1 className="company-names-title">Top-Most Carwash</h1>
              </span>
            )}
          </div>
          
          {!isMobile && (
            <button onClick={toggleSidebar} className="toggle-button">
              <ChevronLeft className={`toggle-icon ${isCollapsed ? 'rotated' : ''}`} size={24} />
            </button>
          )}
          
          <div className="premium-icon">
            <img src={premiumImg} alt="premium icon" className="crown-icon" />
          </div>
        </div>

        <div className="admin-badge">
          <div className="admin-avatar">AD</div>
          {!isCollapsed && <span className="admin-text">Administrator</span>}
        </div>

        <div className="menu-label">MENU</div>

        {/* Navigation Items */}
        <nav className="nav-menu">
          {SIDEBAR_ITEMS.map((item) => (
            <Link
              key={item.href}
              to={item.href}
              className={isActiveRoute(item.href) ? "active-nav-item" : ""}
            >
              <div className="nav-item">
                <img 
                  src={item.image} 
                  alt={item.name}
                  className="nav-icon-image"
                />
                {!isCollapsed && <span className="item-name">{item.name}</span>}
              </div>
            </Link>
          ))}
        </nav>

        {/* Settings Section - Hidden for now */}
        {SETTINGS_ITEMS.length > 0 && (
          <div className="settings-section">
            <div className="settings-label">SETTINGS</div>
            {SETTINGS_ITEMS.map((item) => (
              <Link key={item.href} to={item.href}>
                <div className="nav-item">
                  <img 
                    src={item.image} 
                    alt={item.name}
                    className="nav-icon-image"
                  />
                  {!isCollapsed && <span className="item-name">{item.name}</span>}
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Sidebar;