import React, { useState, useEffect, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import "../App.css";

const EditTaskPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: "",
    dueDate: "",
    priority: "medium",
    description: "",
    status: "pending"
  });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");

  const username = useMemo(() => {
    return localStorage.getItem("username") || sessionStorage.getItem("username");
  }, []);

  const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

  useEffect(() => {
    const fetchTask = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/tasks/${id}?username=${username}`);
        const task = response.data;
        // Format date for input: YYYY-MM-DD
        const formattedDate = task.due_date ? new Date(task.due_date).toISOString().split('T')[0] : "";
        setForm({
          title: task.title,
          dueDate: formattedDate,
          priority: task.priority,
          description: task.description || "",
          status: task.status || "pending"
        });
      } catch (err) {
        setMessage("Failed to load task data.");
      } finally {
        setLoading(false);
      }
    };

    if (username) {
      fetchTask();
    } else {
      navigate("/");
    }
  }, [id, username, navigate, API_URL]);

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setMessage("");
    try {
      const payload = { ...form, username };
      await axios.put(`${API_URL}/api/tasks/${id}`, payload);
      setMessage("✅ Task updated successfully.");
      setTimeout(() => navigate("/tasks"), 700);
    } catch (err) {
      setMessage(err.response?.data?.error || "Failed to update task");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="task-form" style={{ maxWidth: '1000px', width: '95%', margin: '36px auto 80px' }}><p>Loading task details...</p></div>;

  return (
    <div className="task-form" style={{ maxWidth: '1000px', width: '95%', margin: '36px auto 80px', padding: '0 20px 40px' }}>
      <header className="dash-header" style={{ paddingTop: 0 }}>
        <div>
          <h1>Edit Task <span className="wave">✏️</span></h1>
          <p className="muted">Modify the details of your task.</p>
        </div>
        <button className="btn-outline" onClick={() => navigate(-1)}>Back</button>
      </header>

      <form onSubmit={onSubmit} style={{ padding: '40px 48px 50px', gap: '28px' }}>
        <div className="form-row">
          <label htmlFor="title">Title</label>
          <input id="title" name="title" type="text" value={form.title} onChange={onChange} required />
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
          <label htmlFor="status">Status</label>
          <select id="status" name="status" value={form.status} onChange={onChange}>
            <option value="pending">Pending</option>
            <option value="in_progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
        </div>

        <div className="form-row">
          <label htmlFor="description">Description</label>
          <textarea id="description" name="description" rows="4" value={form.description} onChange={onChange} />
        </div>

        {message && <p className="muted" role="status">{message}</p>}

        <div className="form-actions">
          <button type="button" className="btn-tertiary" onClick={() => navigate(-1)} disabled={submitting}>Cancel</button>
          <button type="submit" className="btn-primary" disabled={submitting}>{submitting ? "Saving..." : "Save Changes"}</button>
        </div>
      </form>
    </div>
  );
};

export default EditTaskPage;
