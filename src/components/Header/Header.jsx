import React, { useState, useEffect } from 'react';
import './Header.css';

const Header = ({ title }) => {
  const [userData, setUserData] = useState({
    name: 'Administrator',
    email: 'topmostcarwash@gmail.com',
    initials: 'PE'
  });

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

  return (
    <header className='header'>
      <div className='header-container'>
        <h1 className='header-title'>{title}</h1>
        <div className='header-right'>
          {/* <div className='notification-icon'>
            <img src={NotificationImg} alt="Notification" className="notification-bg-image" />
          </div> */}
          <div className='header-user'>
            <div className='user-avatar'>
              <span className='avatar-text'>{userData.initials}</span>
            </div>
            <div className='user-info'>
              <div className='user-names'>{userData.name}</div>
              <div className='user-email'>{userData.email}</div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;