import React from 'react';
import './Header.css';

const Header = ({ title }) => {
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
              <span className='avatar-text'>PE</span>
            </div>
            <div className='user-info'>
              <div className='user-names'>Administrator</div>
              <div className='user-email'>preshekele@gmail.com</div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;

