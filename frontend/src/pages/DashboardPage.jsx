import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../App.css";

const DashboardPage = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({ total: 0, completed: 0, dueSoon: 0, highPriority: 0 });

  const username = useMemo(() => {
    return localStorage.getItem("username") || sessionStorage.getItem("username");
  }, []);

  const API_URL = process.env.REACT_APP_API_URL || "http://13.235.8.85:5000";

  useEffect(() => {
    if (!username) {
      navigate("/", { replace: true });
      return;
    }

    const fetchStats = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/tasks?username=${username}`);
        const tasks = response.data;
        
        const now = new Date();
        const tomorrow = new Date();
        tomorrow.setDate(now.getDate() + 2);

        const calculation = tasks.reduce((acc, task) => {
          acc.total++;
          if (task.status === 'completed') acc.completed++;
          if (task.priority === 'high') acc.highPriority++;
          
          if (task.due_date) {
            const dueDate = new Date(task.due_date);
            if (dueDate > now && dueDate <= tomorrow) acc.dueSoon++;
          }
          return acc;
        }, { total: 0, completed: 0, dueSoon: 0, highPriority: 0 });

        setStats(calculation);
      } catch (err) {
        console.error("Failed to fetch dashboard stats", err);
      }
    };

    fetchStats();
  }, [username, navigate, API_URL]);

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
          <p className="stat-value">{stats.total}</p>
          <span className="muted">Total tasks</span>
        </div>
        <div className="stat-card success horizontal">
          <h3>Completed</h3>
          <p className="stat-value">{stats.completed}</p>
          <span className="muted">All time done</span>
        </div>
        <div className="stat-card warning horizontal">
          <h3>Due Soon</h3>
          <p className="stat-value">{stats.dueSoon}</p>
          <span className="muted">Within 48 hours</span>
        </div>
        <div className="stat-card accent horizontal">
          <h3>Priority</h3>
          <p className="stat-value">{stats.highPriority}</p>
          <span className="muted">High urgency</span>
        </div>
      </section>

      <section className="actions-row">
        <button className="btn-primary" onClick={() => navigate("/home")}>Plan New Schedule</button>
        <button className="btn-tertiary" onClick={() => navigate("/tasks")}>Manage Tasks</button>
      </section>
    </div>
  );
};

export default DashboardPage;
