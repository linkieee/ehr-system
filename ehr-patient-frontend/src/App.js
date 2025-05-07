import React, { useEffect, useState } from 'react';
import {
  User, Calendar, FileText, DollarSign, Pill,
  Settings, LogOut, Search, Mail
} from 'lucide-react';
import './App.css';

function PatientDashboard() {
  const patientId = '681ad9dbdf7f5659c2631456';

  const [profile, setProfile] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [records, setRecords] = useState([]);
  const [bills, setBills] = useState([]);
  const [medications, setMedications] = useState([]);

  useEffect(() => {
    fetch(`http://localhost:3000/api/patients/${patientId}`)
      .then(res => res.json())
      .then(data => {
        console.log("✅ profile:", data);
        setProfile(data);
      })
      .catch(err => console.error("❌ Lỗi profile:", err));

    fetch(`http://localhost:3000/api/records?patient_id=${patientId}`)
      .then(res => res.json())
      .then(setRecords)
      .catch(err => console.error('Lỗi records:', err));
  }, []);


  if (!profile) return <p>Đang tải dữ liệu...</p>;

  return (
    <div className="dashboard-layout">
      <aside className="sidebar">
        <div className="logo">MedCare</div>
        <nav className="nav-menu">
          <a className="active"><User size={20} /> Profile</a>
          <a><Calendar size={20} /> Appointments</a>
          <a><DollarSign size={20} /> Medical Bills</a>
          <a><FileText size={20} /> Medical Records</a>
          <a><Pill size={20} /> Medications</a>
        </nav>

        <div className="sidebar-bottom">
          <a><Settings size={20} /> Settings</a>
          <a><LogOut size={20} /> Log Out</a>
        </div>

      </aside>

      <main className="main-content">
        <header className="top-bar">
          <div className="search-box">
            <input type="text" placeholder="Search..." />
            <button><Search size={16} /></button>
          </div>
          <div className="top-bar-info">
            <span>{new Date().toLocaleTimeString()} – {new Date().toLocaleDateString()}</span>
            <Mail size={20} />
            <img src="https://randomuser.me/api/portraits/women/44.jpg" alt="avatar" className="avatar" />
          </div>

        </header>

        <h2>Profile</h2>

        <div className="profile-grid">
          <div className="profile-card">
            <img src="https://randomuser.me/api/portraits/women/44.jpg" alt="avatar" />
            <div>
              <h3>{profile.full_name}</h3>
              <p><b>Role:</b> Patient</p>
              <p><b>Email:</b> {profile.email}</p>
              <p><b>Phone:</b> {profile.phone_number}</p>
              <p><b>Birth date:</b> {new Date(profile.date_of_birth).toLocaleDateString()}</p>
              <p><b>Address:</b> {profile.address}</p>
              <p><b>ID:</b> {profile.national_id}</p>
            </div>
          </div>
        </div>

        <div className="widget">
          <div className="widget-header">
            <h3>Medical Records</h3>
          </div>
          <table>
            <thead>
              <tr><th>Date</th><th>Doctor</th><th>Diagnosis</th><th>Prescription</th><th>Note</th></tr>
            </thead>
            <tbody>
              {records.map((rec, i) => (
                <tr key={i}>
                  <td>{new Date(rec.date).toLocaleDateString()}</td>
                  <td>{rec.doctor_id?.full_name || 'N/A'}</td>
                  <td>{rec.diagnosis}</td>
                  <td>{rec.prescription}</td>
                  <td>{rec.note}</td>
                </tr>
              ))}
            </tbody>

          </table>
        </div>

        <div className="widget">
          <div className="widget-header">
            <h3>Medical Bills</h3>
          </div>
          <table>
            <thead>
              <tr><th>Date</th><th>Amount</th><th>Status</th></tr>
            </thead>
            <tbody>
              {bills.map((b, i) => (
                <tr key={i}>
                  <td>{new Date(b.date).toLocaleDateString()}</td>
                  <td>${b.amount.toFixed(2)}</td>
                  <td>{b.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="widget">
          <div className="widget-header">
            <h3>Medications</h3>
          </div>
          <table>
            <thead>
              <tr><th>Name</th><th>Dose</th><th>Frequency</th><th>Condition</th></tr>
            </thead>
            <tbody>
              {medications.map((m, i) => (
                <tr key={i}>
                  <td>{m.name}</td>
                  <td>{m.dose}</td>
                  <td>{m.frequency}</td>
                  <td>{m.condition}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}

export default PatientDashboard;
