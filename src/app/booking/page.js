"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Booking() {
  const router = useRouter();
  const [doctors, setDoctors] = useState([]);
  const [formData, setFormData] = useState({
    doctorId: '',
    appointmentDate: '',
    appointmentTime: ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    // Check if user is logged in
    const checkAuth = async () => {
       // Ideally read from cookies or context, for now we let the API reject if unauthorized
    };
    checkAuth();

    // Load doctors
    fetch('/api/doctors')
      .then(res => res.json())
      .then(data => {
        if (data.success) {
            setDoctors(data.doctors);
            // Pre-select if passed in URL
            const urlParams = new URLSearchParams(window.location.search);
            const docId = urlParams.get('doctor');
            if (docId) {
                setFormData(prev => ({ ...prev, doctorId: docId }));
            }
        }
      });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const res = await fetch('/api/booking', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      
      if (data.success) {
        setMessage('Appointment booked successfully!');
        setFormData({ doctorId: '', appointmentDate: '', appointmentTime: '' });
      } else {
        setMessage(`Error: ${data.message}`);
      }
    } catch (err) {
      setMessage('An error occurred while booking.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="page-container">
      <header className="page-header">
        <h1>Book an Appointment</h1>
        <p>Schedule your visit with our specialists</p>
      </header>

      <div className="content-section" style={{maxWidth: '600px', margin: '0 auto'}}>
        <div className="card">
          {message && <div className={message.includes('Error') ? 'error-message' : 'success-message'} style={{marginBottom: '1rem', padding: '1rem', backgroundColor: message.includes('Error') ? '#fee2e2' : '#dcfce7', color: message.includes('Error') ? '#991b1b' : '#166534', borderRadius: '0.5rem'}}>{message}</div>}
          
          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label>Select Doctor</label>
              <select name="doctorId" value={formData.doctorId} onChange={handleChange} required>
                <option value="" disabled>-- Choose a doctor --</option>
                {doctors.map(doc => (
                  <option key={doc.Doctor_ID} value={doc.Doctor_ID}>
                    Dr. {doc.FirstName} {doc.LastName} ({doc.Specialization})
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Date</label>
              <input type="date" name="appointmentDate" value={formData.appointmentDate} onChange={handleChange} required />
            </div>

            <div className="form-group">
              <label>Time</label>
              <input type="time" name="appointmentTime" value={formData.appointmentTime} onChange={handleChange} required />
            </div>

            <button type="submit" disabled={loading} className="btn-primary" style={{width: '100%', marginTop: '1rem'}}>
              {loading ? 'Processing...' : 'Confirm Booking'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
