import React from 'react';
import Navbar from './Navbar';

const Layout = ({ children, currentScreen, onNavigate, user, onLogout }) => {
  return (
    <>
      <Navbar 
        currentScreen={currentScreen} 
        onNavigate={onNavigate} 
        user={user}
        onLogout={onLogout}
      />
      <main className="app-content">
        {children}
      </main>
    </>
  );
};

export default Layout;
