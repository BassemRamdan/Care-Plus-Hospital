"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function Register() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    firstName: '',
    lastName: '',
    dob: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await res.json();

      if (data.success) {
        router.push('/login?registered=true');
      } else {
        setError(data.message || 'Registration failed');
      }
    } catch (err) {
      setError('An error occurred during registration.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="layout-auth">
      <div className="auth-box">
        <h2 className="title">Create an Account</h2>
        <p className="subtitle">Register as a patient to book appointments</p>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-row">
            <div className="form-group">
              <label>First Name</label>
              <input type="text" name="firstName" required value={formData.firstName} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>Last Name</label>
              <input type="text" name="lastName" required value={formData.lastName} onChange={handleChange} />
            </div>
          </div>

          <div className="form-group">
            <label>Date of Birth</label>
            <input type="date" name="dob" required value={formData.dob} onChange={handleChange} />
          </div>

          <div className="form-group">
            <label>Username</label>
            <input type="text" name="username" required value={formData.username} onChange={handleChange} />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input type="password" name="password" required value={formData.password} onChange={handleChange} />
          </div>

          <button type="submit" disabled={loading} className="btn-primary" style={{ width: '100%', marginTop: '1rem' }}>
            {loading ? 'Registering...' : 'Register Account'}
          </button>
        </form>

        <p className="auth-switch">
          Already have an account? <Link href="/login">Login here</Link>
        </p>
      </div>
    </div>
  );
}
