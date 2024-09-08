// src/App.js
import React from 'react';
import Sidebar from './components/Sidebar';
import './App.css'; // Import CSS for the main layout

const App = () => {
  return (
    <div className="app-container">
      <Sidebar />
      <div className="main-content">
        <h1>Main Content Area</h1>
        <p>Here is where your main content will go.</p>
      </div>
    </div>
  );
};


export default App;
