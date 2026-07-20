"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function Doctors() {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/doctors')
      .then(res => res.json())
      .then(data => {
        if (data.success) setDoctors(data.doctors);
        setLoading(false);
      });
  }, []);

  return (
    <div className="page-container">
      <header className="page-header">
        <h1>Our Specialists</h1>
        <p>Meet our highly qualified medical team</p>
      </header>

      <div className="content-section">
        {loading ? (
          <div className="loading">Loading doctors...</div>
        ) : (
          <div className="grid-list">
            {doctors.map(doc => (
              <div key={doc.Doctor_ID} className="card doctor-card">
                <div className="card-icon">👨‍⚕️</div>
                <h3>Dr. {doc.FirstName} {doc.LastName}</h3>
                <p className="highlight-text">{doc.Specialization}</p>
                <p className="sub-text">Department: {doc.Department || 'General'}</p>
                <Link href={`/booking?doctor=${doc.Doctor_ID}`} className="btn-secondary" style={{display: 'inline-block', marginTop: '1rem'}}>
                  Book Appointment
                </Link>
              </div>
            ))}
            {doctors.length === 0 && <p>No doctors available at the moment.</p>}
          </div>
        )}
      </div>
    </div>
  );
}
