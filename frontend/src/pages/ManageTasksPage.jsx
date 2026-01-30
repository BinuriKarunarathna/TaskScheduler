import React, { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../App.css";

const ManageTasksPage = () => {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const username = useMemo(() => {
    return localStorage.getItem("username") || sessionStorage.getItem("username");
  }, []);

  const API_URL = process.env.REACT_APP_API_URL || "http://13.235.8.85:5000";

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/tasks?username=${username}`);
        setTasks(response.data);
      } catch (err) {
        setError("Failed to fetch tasks.");
      } finally {
        setLoading(false);
      }
    };

    if (!username) {
      navigate("/", { replace: true });
    } else {
      fetchTasks();
    }
  }, [username, navigate, API_URL]);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this task?")) return;
    try {
      await axios.delete(`${API_URL}/api/tasks/${id}?username=${username}`);
      setTasks(tasks.filter((task) => task.id !== id));
    } catch (err) {
      alert("Failed to delete task.");
    }
  };

  return (
    <div className="dashboard">
      <header className="dash-header">
        <div>
          <h1>Manage Your Tasks <span className="wave">📋</span></h1>
          <p className="muted">Update or remove your scheduled activities here.</p>
        </div>
        <button className="btn-outline" onClick={() => navigate("/dashboard")}>Back to Dashboard</button>
      </header>

      {loading ? (
        <p>Loading tasks...</p>
      ) : error ? (
        <p className="error-text">{error}</p>
      ) : (
        <div className="task-list-container">
          {tasks.length === 0 ? (
            <div className="no-tasks">
              <p>No tasks found. Start by creating one!</p>
              <button className="btn-primary" onClick={() => navigate("/tasks/new")}>Create Task</button>
            </div>
          ) : (
            <div className="tasks-grid">
              {tasks.map((task) => (
                <div key={task.id} className={`task-card-mini priority-${task.priority}`}>
                  <div className="task-info">
                    <h3>{task.title}</h3>
                    <p className="task-meta">
                      <span className="badge">{task.priority}</span>
                      {task.due_date && <span> • Due: {new Date(task.due_date).toLocaleDateString()}</span>}
                    </p>
                  </div>
                  <div className="task-actions-mini">
                    <button className="btn-edit-small" onClick={() => navigate(`/tasks/edit/${task.id}`)}>Edit</button>
                    <button className="btn-delete-small" onClick={() => handleDelete(task.id)}>Delete</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ManageTasksPage;
