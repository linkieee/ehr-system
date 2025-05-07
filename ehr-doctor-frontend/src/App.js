import React, { useEffect, useState } from 'react';
import {
  BarChart2, Calendar, LayoutDashboard, LogOut,
  Mail, MessageSquare, Search, Settings, User
} from 'lucide-react';
import './App.css';

function Dashboard() {
  const [appointments, setAppointments] = useState([]);
  const [patientList, setPatientList] = useState([]);
  const [activeTab, setActiveTab] = useState('dashboard');

  useEffect(() => {
    fetch('http://localhost:3000/api/records')
      .then(res => res.json())
      .then(data => setAppointments(data))
      .catch(err => console.error('Lỗi khi tải records:', err));

    fetch('http://localhost:3000/api/patients')
      .then(res => res.json())
      .then(data => setPatientList(data))
      .catch(err => console.error('Lỗi khi tải patients:', err));
  }, []);

  return (
    <div className="dashboard-layout">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="logo">MedCare</div>
        <nav className="nav-menu">
          <a href="#" className={activeTab === 'dashboard' ? 'active' : ''} onClick={() => setActiveTab('dashboard')}>
            <LayoutDashboard size={20} /> Dashboard
          </a>
          <a href="#" className={activeTab === 'patients' ? 'active' : ''} onClick={() => setActiveTab('patients')}>
            <User size={20} /> Patients
          </a>
          <a href="#"><Calendar size={20} /> Scheduling</a>
          <a href="#"><BarChart2 size={20} /> Reports</a>
          <a href="#"><MessageSquare size={20} /> Messages</a>
        </nav>
        <div className="sidebar-bottom">
          <a href="#"><Settings size={20} /> Settings</a>
          <a href="#"><LogOut size={20} /> Log Out</a>
        </div>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        <header className="top-bar">
          <div className="search-box">
            <input type="text" placeholder="Search..." />
            <button><Search size={16} /></button>
          </div>
          <div className="top-bar-info">
            <span>{new Date().toLocaleTimeString()} – {new Date().toLocaleDateString()}</span>
            <Mail size={20} />
            <img src="https://randomuser.me/api/portraits/men/75.jpg" alt="avatar" className="avatar" />
          </div>
        </header>

        <section className="dashboard-widgets">
          {/* DASHBOARD VIEW */}
          {activeTab === 'dashboard' && (
            <>
              <div className="widget appointments">
                <div className="widget-header">
                  <h3>Appointments</h3>
                  <button>Browse All</button>
                </div>
                <table>
                  <thead>
                    <tr>
                      <th>Patient</th><th>Diagnosis</th><th>Date</th><th>Doctor</th><th>Prescription</th><th>Note</th>
                    </tr>
                  </thead>
                  <tbody>
                    {appointments.map((rec, index) => (
                      <tr key={index}>
                        <td>{rec.patient_id?.full_name || 'N/A'}</td>
                        <td>{rec.diagnosis}</td>
                        <td>{new Date(rec.date).toLocaleDateString()}</td>
                        <td>{rec.doctor_id?.full_name || 'N/A'}</td>
                        <td>{rec.prescription}</td>
                        <td>{rec.note}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="widget labs">
                <div className="widget-header">
                  <h3>Labs</h3>
                  <button>Browse All</button>
                </div>
                <table>
                  <thead>
                    <tr><th>Name</th><th>Test</th><th>Result</th><th>Date</th><th>Actions</th></tr>
                  </thead>
                  <tbody>
                    <tr><td>Melissa Charles</td><td>Prolactin</td><td>26</td><td>04/09/2020</td><td>...</td></tr>
                    <tr><td>Jimmy Chu</td><td>Testosterone</td><td>5.98</td><td>04/09/2020</td><td>...</td></tr>
                  </tbody>
                </table>
              </div>

              <div className="widget billings">
                <div className="widget-header">
                  <h3>Billings</h3>
                  <button>Browse All</button>
                </div>
                <table>
                  <thead>
                    <tr><th>Date</th><th>Patient</th><th>Claim ID</th><th>Provider</th><th>Payer</th><th>Amount</th></tr>
                  </thead>
                  <tbody>
                    <tr><td>04/09/2020</td><td>Melissa Charles</td><td>6785HG</td><td>Billing</td><td>Medicaid of NY</td><td>$70.00</td></tr>
                    <tr><td>04/09/2020</td><td>Jimmy Chu</td><td>8957FJ</td><td>Billing</td><td>Medicaid of NY</td><td>$40.00</td></tr>
                  </tbody>
                </table>
              </div>
            </>
          )}

          {/* PATIENTS VIEW */}
          {activeTab === 'patients' && (
            <div className="widget patients">
              <div className="widget-header">
                <h3>Patient</h3>
              </div>
              <table>
                <thead>
                  <tr><th>Full name</th><th>Gender</th><th>Date of Birth</th><th>Phone number</th><th>Email</th></tr>
                </thead>
                <tbody>
                  {patientList.map((pat, idx) => (
                    <tr key={idx}>
                      <td>{pat.full_name}</td>
                      <td>{pat.gender}</td>
                      <td>{new Date(pat.date_of_birth).toLocaleDateString()}</td>
                      <td>{pat.phone_number}</td>
                      <td>{pat.email}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

export default Dashboard;
