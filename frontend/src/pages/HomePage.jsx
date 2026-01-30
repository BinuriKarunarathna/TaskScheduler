import React from "react";
import { useNavigate } from "react-router-dom";
import "../App.css";

const HomePage = () => {
  const navigate = useNavigate();
  return (
    <div className="home-container" style={{ 
      maxWidth: '800px', 
      padding: '60px 40px', 
      borderRadius: '32px', 
      background: 'rgba(255, 255, 255, 0.9)', 
      backdropFilter: 'blur(10px)',
      boxShadow: '0 20px 50px rgba(111, 79, 62, 0.15)',
      border: '1px solid rgba(255, 255, 255, 0.5)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '30px'
    }}>
      <h1 style={{ 
        fontSize: '3.5rem', 
        fontWeight: '800', 
        background: 'linear-gradient(135deg, #6f4f3e 0%, #d4a373 100%)', 
        WebkitBackgroundClip: 'text', 
        WebkitTextFillColor: 'transparent',
        margin: '0',
        letterSpacing: '-1px'
      }}>
        Smart Task Scheduler
      </h1>
      <h3 style={{ 
        fontSize: '1.2rem', 
        color: '#d4a373', 
        fontStyle: 'italic', 
        margin: '-20px 0 10px 0',
        fontWeight: '500',
        letterSpacing: '2px',
        textTransform: 'uppercase'
      }}>
        with Resource Optimization
      </h3>

      <p style={{ 
        fontSize: '1.15rem', 
        color: '#8c6b5d', 
        lineHeight: '1.8', 
        maxWidth: '600px', 
        textAlign: 'center' 
      }}>
        Welcome to <strong>Smart Task Scheduler</strong> – your intelligent
        assistant that organizes tasks, deadlines, and priorities for maximum
        productivity.
      </p>

      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', 
        gap: '20px', 
        width: '100%', 
        marginTop: '20px' 
      }}>
        {[
          { icon: '✨', text: 'Add tasks with deadlines & priority levels' },
          { icon: '🚀', text: 'Automatically get a recommended schedule' },
          { icon: '📊', text: 'Visualize everything in a clear timeline' },
          { icon: '✅', text: 'Stay on track with progress monitoring' }
        ].map((item, idx) => (
          <div key={idx} style={{
            background: '#fff8f2',
            padding: '24px',
            borderRadius: '20px',
            textAlign: 'center',
            transition: 'transform 0.3s ease',
            border: '1px solid #f0e0d1'
          }}>
            <span style={{ fontSize: '2rem', display: 'block', marginBottom: '12px' }}>{item.icon}</span>
            <p style={{ margin: 0, fontSize: '0.95rem', fontWeight: '500', color: '#6f4f3e' }}>{item.text}</p>
          </div>
        ))}
      </div>

      <button 
        style={{ 
          marginTop: '20px',
          padding: '18px 48px',
          fontSize: '1.1rem',
          fontWeight: '700',
          color: '#fff',
          background: 'linear-gradient(90deg, #d4a373 0%, #b28d7f 100%)',
          border: 'none',
          borderRadius: '50px',
          cursor: 'pointer',
          boxShadow: '0 10px 20px rgba(212, 163, 115, 0.3)',
          transition: 'all 0.3s ease'
        }}
        onMouseOver={(e) => {
          e.currentTarget.style.transform = 'translateY(-3px)';
          e.currentTarget.style.boxShadow = '0 15px 25px rgba(212, 163, 115, 0.4)';
        }}
        onMouseOut={(e) => {
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = '0 10px 20px rgba(212, 163, 115, 0.3)';
        }}
        onClick={() => navigate('/tasks/new')}
      >
        Get Started
      </button>
    </div>
  );
};

export default HomePage;
