// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './redux/store';
import Layout from './components/Layout/Layout';
import AdminDashboard from './components/Admin/AdminDashboard';
import UserDashboard from './components/User/UserDashboard';
import AnalyticsDashboard from './components/Analytics/AnalyticsDashboard';
import CompanySetup from './components/Admin/CompanySetup';
import CompanyList from './components/Admin/CompanyList';
import CompanyManagement from './components/Admin/CompanyManagement';

import CommunicationTracking from './components/User/CommunicationTracking';
import Calendar from './components/User/Calendar';

function App() {
  return (
    <Provider store={store}>
      <Router>
        <Layout>
          <Routes>
            {/* Admin Routes */}
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/companies" element={<CompanyList />} />
            <Route path="/admin/companies" element={<CompanyManagement />} />
          
            
            {/* User Routes */}
            <Route path="/dashboard" element={<UserDashboard />} />
            <Route path="/calendar" element={<Calendar />} />
            <Route path="/communications" element={<CommunicationTracking />} />
            <Route path="/analytics" element={<AnalyticsDashboard />} />
            
            {/* Default Route */}
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </Layout>
      </Router>
    </Provider>
  );
}

export default App;