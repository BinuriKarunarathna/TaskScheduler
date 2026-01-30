import React from "react";
import { useNavigate } from "react-router-dom";
import "../App.css";

const HomePage = () => {
  const navigate = useNavigate();
  return (
    <div className="home-container">
      <h1>Smart Task Scheduler</h1>
      <h3 className="tagline">with Resource Optimization</h3>

      <p>
        Welcome to <strong>Smart Task Scheduler</strong> – your intelligent
        assistant that organizes tasks, deadlines, and priorities for maximum
        productivity.
      </p>

      <div className="features" style={{ textAlign: 'center', width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <p style={{ paddingLeft: 0, position: 'static' }}>✨ Add tasks with deadlines & priority levels</p>
        <p style={{ paddingLeft: 0, position: 'static' }}>✨ Automatically get a recommended schedule</p>
        <p style={{ paddingLeft: 0, position: 'static' }}>✨ Visualize everything in a clear timeline</p>
        <p style={{ paddingLeft: 0, position: 'static' }}>✨ Stay on track with progress monitoring</p>
      </div>

      <button className="get-started-btn" onClick={() => navigate('/tasks/new')}>Get Started</button>
    </div>
  );
};

export default HomePage;
