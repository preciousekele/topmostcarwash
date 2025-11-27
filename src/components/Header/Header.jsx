import React, { useState, useEffect } from 'react';
import './Header.css';
import { LucideLogOut } from 'lucide-react';

const Header = ({ title }) => {
  const [userData, setUserData] = useState({
    name: 'Administrator',
    email: 'topmostcarwash@gmail.com',
    initials: 'PE'
  });
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  useEffect(() => {
    // Fetch data from auth storage
    const authData = localStorage.getItem('auth-storage');
    
    if (authData) {
      try {
        const parsedData = JSON.parse(authData);
        const user = parsedData?.state?.user;
        
        if (user) {
          // Generate initials from name
          const getInitials = (name) => {
            if (!name) return 'PE';
            const names = name.trim().split(' ');
            if (names.length >= 2) {
              return `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase();
            }
            return name.substring(0, 2).toUpperCase();
          };

          setUserData({
            name: user.name || 'Administrator',
            email: user.email || 'topmostcarwash@gmail.com',
            initials: getInitials(user.name)
          });
        }
      } catch (error) {
        console.error('Error parsing auth data:', error);
      }
    }
  }, []);

  const handleLogoutClick = () => {
    setShowLogoutModal(true);
  };

  const handleLogoutConfirm = () => {
    // Clear auth data
    localStorage.removeItem('auth-storage');
    // Redirect to login page
    window.location.href = '/login';
  };

  const handleLogoutCancel = () => {
    setShowLogoutModal(false);
  };

  return (
    <>
      <header className='header'>
        <div className='header-container'>
          <h1 className='header-title'>{title}</h1>
          <div className='header-right'>
            <div className='header-user'>
              <div className='user-avatar'>
                <span className='avatar-text'>{userData.initials}</span>
              </div>
              <div className='user-info'>
                <div className='user-names'>{userData.name}</div>
                <div className='user-email'>{userData.email}</div>
              </div>
            </div>
            <div className="logout-section">
              <button 
                className="logout-button" 
                title="Log Out"
                onClick={handleLogoutClick}
              >
                <LucideLogOut size={20} />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Logout Confirmation Modal */}
      {showLogoutModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2 className="modal-title">Confirm Logout</h2>
            <p className="modal-message">Are you sure you want to log out?</p>
            <div className="modal-actions">
              <button 
                className="modal-button modal-button-cancel" 
                onClick={handleLogoutCancel}
              >
                Cancel
              </button>
              <button 
                className="modal-button modal-button-confirm" 
                onClick={handleLogoutConfirm}
              >
                Log Out
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Header;