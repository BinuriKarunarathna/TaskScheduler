import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../App.css";

const NewTaskPage = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: "",
    dueDate: "",
    priority: "medium",
    description: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setMessage("");
    try {
      const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";
      const username = localStorage.getItem("username") || sessionStorage.getItem("username");
      const payload = { ...form, username };
  await axios.post(`${API_URL}/api/tasks`, payload);
      setMessage("✅ Task created successfully.");
      setTimeout(() => navigate("/dashboard"), 700);
    } catch (err) {
      setMessage(err.response?.data?.error || "Failed to create task");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="task-form">
      <header className="dash-header" style={{ paddingTop: 0 }}>
        <div>
          <h1>Create a New Task <span className="wave">📝</span></h1>
          <p className="muted">Add details below and plan it into your schedule.</p>
        </div>
        <button className="btn-outline" onClick={() => navigate(-1)}>Back</button>
      </header>

      <form onSubmit={onSubmit}>
        <div className="form-row">
          <label htmlFor="title">Title</label>
          <input id="title" name="title" type="text" value={form.title} onChange={onChange} placeholder="e.g., Finish report" required />
        </div>

        <div className="form-grid">
          <div className="form-row">
            <label htmlFor="dueDate">Due date</label>
            <input id="dueDate" name="dueDate" type="date" value={form.dueDate} onChange={onChange} />
          </div>
          <div className="form-row">
            <label htmlFor="priority">Priority</label>
            <select id="priority" name="priority" value={form.priority} onChange={onChange}>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>
        </div>

        <div className="form-row">
          <label htmlFor="description">Description</label>
          <textarea id="description" name="description" rows="4" value={form.description} onChange={onChange} placeholder="Optional notes or steps" />
        </div>

        {message && <p className="muted" role="status">{message}</p>}

        <div className="form-actions">
          <button type="button" className="btn-tertiary" onClick={() => navigate(-1)} disabled={submitting}>Cancel</button>
          <button type="submit" className="btn-primary" disabled={submitting}>{submitting ? "Creating..." : "Create Task"}</button>
        </div>
      </form>
    </div>
  );
};

export default NewTaskPage;
