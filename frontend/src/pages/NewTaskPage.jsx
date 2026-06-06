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
      const API_URL = process.env.REACT_APP_API_URL || "http://13.60.190.19:5000";
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
    <div className="task-form" style={{ 
      maxWidth: '750px', 
      width: '90%', 
      margin: '40px auto', 
      padding: '0', 
      display: 'flex', 
      flexDirection: 'column' 
    }}>
      <form onSubmit={onSubmit} style={{ 
        padding: '50px 60px', 
        borderRadius: '32px', 
        background: 'rgba(255, 255, 255, 0.95)', 
        backdropFilter: 'blur(10px)',
        boxShadow: '0 25px 50px rgba(111, 79, 62, 0.15)',
        border: '1px solid rgba(255, 255, 255, 0.6)',
        display: 'flex', 
        flexDirection: 'column', 
        gap: '24px' 
      }}>
        <div style={{ marginBottom: '10px' }}>
          <h2 style={{ margin: 0, color: '#6f4f3e', fontSize: '1.8rem', fontWeight: '800' }}>Create Task</h2>
          <p style={{ margin: '5px 0 0 0', color: '#8c6b5d', fontSize: '0.95rem' }}>Plan your next milestone properly.</p>
        </div>

        <div className="form-row" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <label htmlFor="title" style={{ fontSize: '0.8rem', fontWeight: '700', color: '#b28d7f', textTransform: 'uppercase', letterSpacing: '1px' }}>Title</label>
          <input id="title" name="title" type="text" value={form.title} onChange={onChange} placeholder="e.g., Finish report" required style={{ width: '100%', boxSizing: 'border-box', padding: '14px 18px', borderRadius: '15px', border: '1px solid #e2d5c8', background: '#fff' }} />
        </div>

        <div className="form-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' }}>
          <div className="form-row" style={{ display: 'flex', flexDirection: 'column', gap: '8px', minWidth: '0' }}>
            <label htmlFor="dueDate" style={{ fontSize: '0.8rem', fontWeight: '700', color: '#b28d7f', textTransform: 'uppercase', letterSpacing: '1px' }}>Due date</label>
            <input id="dueDate" name="dueDate" type="date" value={form.dueDate} onChange={onChange} style={{ width: '100%', boxSizing: 'border-box', padding: '14px 18px', borderRadius: '15px', border: '1px solid #e2d5c8', background: '#fff' }} />
          </div>
          <div className="form-row" style={{ display: 'flex', flexDirection: 'column', gap: '8px', minWidth: '0' }}>
            <label htmlFor="priority" style={{ fontSize: '0.8rem', fontWeight: '700', color: '#b28d7f', textTransform: 'uppercase', letterSpacing: '1px' }}>Priority</label>
            <select id="priority" name="priority" value={form.priority} onChange={onChange} style={{ width: '100%', boxSizing: 'border-box', padding: '14px 18px', borderRadius: '15px', border: '1px solid #e2d5c8', background: '#fff' }}>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>
        </div>

        <div className="form-row" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <label htmlFor="description" style={{ fontSize: '0.8rem', fontWeight: '700', color: '#b28d7f', textTransform: 'uppercase', letterSpacing: '1px' }}>Description</label>
          <textarea id="description" name="description" rows="4" value={form.description} onChange={onChange} placeholder="Optional notes or steps" style={{ width: '100%', boxSizing: 'border-box', padding: '14px 18px', borderRadius: '15px', border: '1px solid #e2d5c8', background: '#fff', minHeight: '100px' }} />
        </div>

        {message && <p style={{ color: '#6f4f3e', fontWeight: '600', textAlign: 'center' }} role="status">{message}</p>}

        <div className="form-actions" style={{ display: 'flex', gap: '15px', marginTop: '10px' }}>
          <button type="button" onClick={() => navigate(-1)} disabled={submitting} style={{ flex: 1, padding: '14px', borderRadius: '50px', border: '1px solid #e2d5c8', background: 'transparent', color: '#8c6b5d', fontWeight: '700', cursor: 'pointer' }}>Cancel</button>
          <button type="submit" disabled={submitting} style={{ 
            flex: 2, 
            padding: '14px', 
            borderRadius: '50px', 
            border: 'none', 
            background: 'linear-gradient(90deg, #d4a373 0%, #b28d7f 100%)', 
            color: '#fff', 
            fontWeight: '700', 
            cursor: 'pointer',
            boxShadow: '0 10px 20px rgba(212, 163, 115, 0.2)'
          }}>
            {submitting ? "Creating..." : "Create Task"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default NewTaskPage;
