"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function AdminDashboard() {
  const [stats, setStats] = useState({ doctors: 0, patients: 0, appointments: 0 });
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // In a real app, we'd fetch stats from an API. For now, static or mock.
    // Let's create an API call for stats
    fetch('/api/admin/stats')
      .then(res => {
        if (res.status === 401) router.push('/login');
        return res.json();
      })
      .then(data => {
        if (data.success) {
          setStats(data.stats);
        }
        setLoading(false);
      });
  }, [router]);

  return (
    <div className="dashboard-layout">
      <aside className="sidebar">
        <div className="sidebar-logo">CarePlus Admin</div>
        <nav>
          <Link href="/dashboard/admin" className="active">Overview</Link>
          <Link href="/doctors">Manage Doctors</Link>
          <Link href="/">Back to Home</Link>
        </nav>
      </aside>
      <main className="dashboard-content">
        <header className="dashboard-header">
          <h1>Admin Overview</h1>
          <button onClick={() => {
            // Delete cookie and logout
            document.cookie = 'auth_token=; Max-Age=0; path=/';
            router.push('/login');
          }} className="btn-secondary">Logout</button>
        </header>
        
        {loading ? <p>Loading stats...</p> : (
          <div className="stats-grid">
            <div className="stat-card">
              <h3>Total Doctors</h3>
              <p className="stat-number">{stats.doctors}</p>
            </div>
            <div className="stat-card">
              <h3>Total Patients</h3>
              <p className="stat-number">{stats.patients}</p>
            </div>
            <div className="stat-card">
              <h3>Appointments</h3>
              <p className="stat-number">{stats.appointments}</p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
