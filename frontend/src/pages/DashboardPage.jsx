import React, { useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import "../App.css";

const DashboardPage = () => {
  const navigate = useNavigate();

  const username = useMemo(() => {
    return localStorage.getItem("username") || sessionStorage.getItem("username");
  }, []);

  useEffect(() => {
    if (!username) {
      navigate("/", { replace: true });
    }
  }, [username, navigate]);

  const logout = () => {
    localStorage.removeItem("username");
    sessionStorage.removeItem("username");
    navigate("/", { replace: true });
  };

  return (
    <div className="dashboard">
      <header className="dash-header">
        <div>
          <h1>Welcome{username ? <span className="username-highlight">,&nbsp;{username}</span> : ""} <span className="wave">👋</span></h1>
          <p className="muted">Here’s a quick overview of your Smart Task Scheduler.</p>
        </div>
        <button className="btn-outline" onClick={logout}>Logout</button>
      </header>

      <section className="stats-grid">
        <div className="stat-card primary horizontal">
          <h3>Tasks</h3>
          <p className="stat-value">12</p>
          <span className="muted">Total tasks</span>
        </div>
        <div className="stat-card success horizontal">
          <h3>Completed</h3>
          <p className="stat-value">7</p>
          <span className="muted">Done this week</span>
        </div>
        <div className="stat-card warning horizontal">
          <h3>Due Soon</h3>
          <p className="stat-value">3</p>
          <span className="muted">Within 48 hours</span>
        </div>
        <div className="stat-card accent horizontal">
          <h3>Priority</h3>
          <p className="stat-value">2</p>
          <span className="muted">High urgency</span>
        </div>
      </section>

      <section className="actions-row">
        <button className="btn-primary" onClick={() => navigate("/home")}>Plan New Schedule</button>
        <button className="btn-secondary">View Timeline</button>
        <button className="btn-tertiary">Manage Tasks</button>
      </section>
    </div>
  );
};

export default DashboardPage;
