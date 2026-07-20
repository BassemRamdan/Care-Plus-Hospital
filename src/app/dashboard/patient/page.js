"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function PatientDashboard() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetch('/api/patient/appointments')
      .then(res => {
        if (res.status === 401) router.push('/login');
        return res.json();
      })
      .then(data => {
        if (data.success) {
          setAppointments(data.appointments);
        }
        setLoading(false);
      });
  }, [router]);

  return (
    <div className="dashboard-layout">
      <aside className="sidebar">
        <div className="sidebar-logo">Patient Portal</div>
        <nav>
          <Link href="/dashboard/patient" className="active">My Appointments</Link>
          <Link href="/booking">Book New Appointment</Link>
          <Link href="/">Back to Home</Link>
        </nav>
      </aside>
      <main className="dashboard-content">
        <header className="dashboard-header">
          <h1>My Appointments</h1>
          <button onClick={() => {
            document.cookie = 'auth_token=; Max-Age=0; path=/';
            router.push('/login');
          }} className="btn-secondary">Logout</button>
        </header>
        
        {loading ? <p>Loading...</p> : (
          <div className="table-container">
            {appointments.length === 0 ? (
              <p>You have no upcoming appointments.</p>
            ) : (
              <table style={{width: '100%', textAlign: 'left', borderCollapse: 'collapse'}}>
                <thead>
                  <tr style={{borderBottom: '2px solid #e2e8f0'}}>
                    <th style={{padding: '1rem'}}>Date & Time</th>
                    <th style={{padding: '1rem'}}>Doctor</th>
                    <th style={{padding: '1rem'}}>Department</th>
                    <th style={{padding: '1rem'}}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {appointments.map(app => (
                    <tr key={app.Appointment_ID} style={{borderBottom: '1px solid #e2e8f0'}}>
                      <td style={{padding: '1rem'}}>{new Date(app.AppointmentDate).toLocaleString()}</td>
                      <td style={{padding: '1rem'}}>Dr. {app.FirstName} {app.LastName}</td>
                      <td style={{padding: '1rem'}}>{app.Department || 'General'}</td>
                      <td style={{padding: '1rem'}}>
                        <span className={`status-badge ${app.Status?.toLowerCase() === 'pending' ? 'status-pending' : 'status-confirmed'}`}>
                          {app.Status || 'Pending'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
