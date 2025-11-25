import React, { useState, useEffect } from 'react';
import './Header.css';

const Header = ({ title }) => {
  const [userEmail, setUserEmail] = useState('');
  const [userName, setUserName] = useState('Administrator');
  const [initials, setInitials] = useState('');

  useEffect(() => {
    // Retrieve user data from localStorage (common auth storage)
    const getUserData = () => {
      try {
        // Check for user data in various common storage keys
        const authUser = localStorage.getItem('user');
        const authData = localStorage.getItem('authData');
        const userProfile = localStorage.getItem('userProfile');
        
        let userData = null;
        
        // Try parsing stored auth data
        if (authUser) {
          userData = JSON.parse(authUser);
        } else if (authData) {
          userData = JSON.parse(authData);
        } else if (userProfile) {
          userData = JSON.parse(userProfile);
        }
        
        // Extract email and name from userData
        if (userData) {
          const email = userData.email || userData.userEmail || '';
          const name = userData.name || userData.displayName || userData.username || 'Administrator';
          
          setUserEmail(email);
          setUserName(name);
          
          // Generate initials from name or email
          if (name && name !== 'Administrator') {
            const nameParts = name.split(' ');
            const firstInitial = nameParts[0]?.charAt(0).toUpperCase() || '';
            const lastInitial = nameParts[1]?.charAt(0).toUpperCase() || '';
            setInitials(firstInitial + lastInitial || firstInitial);
          } else if (email) {
            const emailName = email.split('@')[0];
            const emailParts = emailName.split(/[._-]/);
            const firstInitial = emailParts[0]?.charAt(0).toUpperCase() || '';
            const lastInitial = emailParts[1]?.charAt(0).toUpperCase() || '';
            setInitials(firstInitial + lastInitial || firstInitial + (emailParts[0]?.charAt(1).toUpperCase() || ''));
          }
        }
      } catch (error) {
        console.error('Error retrieving user data from storage:', error);
      }
    };

    getUserData();
  }, []);

  return (
    <header className='header'>
      <div className='header-container'>
        <h1 className='header-title'>{title}</h1>
        <div className='header-right'>
          <div className='header-user'>
            <div className='user-avatar'>
              <span className='avatar-text'>{initials || 'U'}</span>
            </div>
            <div className='user-info'>
              <div className='user-names'>{userName}</div>
              <div className='user-email'>{userEmail || 'user@example.com'}</div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;