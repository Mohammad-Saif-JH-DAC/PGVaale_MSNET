import React, { useState, useEffect } from 'react';
import {
  PieChart,
  Pie,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell
} from 'recharts';
import api from '../api';

const DashboardStats = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      const response = await api.get('/admin/dashboard-stats');
      setStats(response.data);
    } catch (err) {
      setError('Failed to load dashboard statistics');
      console.error('Error fetching dashboard stats:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center p-4">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-danger" role="alert">
        {error}
      </div>
    );
  }

  if (!stats) {
    return null;
  }

  // Data for Pie Chart (User Types)
  // const pieData = [
  //   { name: 'Users', value: stats.totalUsers, color: '#8884d8' },
  //   { name: 'Owners', value: stats.totalOwners, color: '#82ca9d' },
  //   { name: 'Tiffin Providers', value: stats.totalTiffinProviders, color: '#ffc658' },
  //   { name: 'Maids', value: stats.totalMaids, color: '#ff7300' }
  // ];
  const pieData = [
  ...(stats.totalUsers > 0 ? [{ name: 'Users', value: stats.totalUsers, color: '#8884d8' }] : []),
  ...(stats.totalOwners > 0 ? [{ name: 'Owners', value: stats.totalOwners, color: '#82ca9d' }] : []),
  ...(stats.totalTiffinProviders > 0 ? [{ name: 'Tiffin Providers', value: stats.totalTiffinProviders, color: '#ffc658' }] : []),
  ...(stats.totalMaids > 0 ? [{ name: 'Maids', value: stats.totalMaids, color: '#ff7300' }] : []),
];


  // Data for Bar Chart (Detailed Statistics)
  const barData = [
    { name: 'Users', count: stats.totalUsers, color: '#8884d8' },
    { name: 'Owners', count: stats.totalOwners, color: '#82ca9d' },
    { name: 'Tiffin Providers', count: stats.totalTiffinProviders, color: '#ffc658' },
    { name: 'Maids', count: stats.totalMaids, color: '#ff7300' },
    { name: 'PGs', count: stats.totalPGs, color: '#8dd1e1' },
    { name: 'Pending Maids', count: stats.pendingMaids, color: '#d084d0' },
    { name: 'Pending Tiffins', count: stats.pendingTiffins, color: '#ff8042' }
  ];

  return (
    <div className="container-fluid">
      <div className="row mb-4">
        <div className="col-12">
          <h3 className="text-center mb-4">Dashboard Statistics</h3>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="row mb-4">
        <div className="col-md-3">
          <div className="card bg-primary text-white">
            <div className="card-body text-center">
              <h5 className="card-title">Total Users</h5>
              <h2 className="card-text">{stats.totalUsers}</h2>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card bg-success text-white">
            <div className="card-body text-center">
              <h5 className="card-title">Total Owners</h5>
              <h2 className="card-text">{stats.totalOwners}</h2>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card bg-warning text-white">
            <div className="card-body text-center">
              <h5 className="card-title">Tiffin Providers</h5>
              <h2 className="card-text">{stats.totalTiffinProviders}</h2>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card bg-info text-white">
            <div className="card-body text-center">
              <h5 className="card-title">Maids</h5>
              <h2 className="card-text">{stats.totalMaids}</h2>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Row */}
      <div className="row">
        {/* Pie Chart */}
        <div className="col-md-6">
          <div className="card">
            <div className="card-header">
              <h5 className="card-title mb-0">User Distribution</h5>
            </div>
            <div className="card-body">
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Bar Chart */}
        <div className="col-md-6">
          <div className="card">
            <div className="card-header">
              <h5 className="card-title mb-0">Detailed Statistics</h5>
            </div>
            <div className="card-body">
              <ResponsiveContainer width="100%" height={300}>
                <BarChart
                  data={barData}
                  margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="count" fill="#8884d8">
                    {barData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>

      {/* Additional Statistics */}
      <div className="row mt-4">
        <div className="col-md-6">
          <div className="card">
            <div className="card-header">
              <h5 className="card-title mb-0">Pending Approvals</h5>
            </div>
            <div className="card-body">
              <div className="row">
                <div className="col-6">
                  <div className="text-center">
                    <h4 className="text-warning">{stats.pendingMaids}</h4>
                    <p className="text-muted">Pending Maids</p>
                  </div>
                </div>
                <div className="col-6">
                  <div className="text-center">
                    <h4 className="text-warning">{stats.pendingTiffins}</h4>
                    <p className="text-muted">Pending Tiffins</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-6">
          <div className="card">
            <div className="card-header">
              <h5 className="card-title mb-0">System Overview</h5>
            </div>
            <div className="card-body">
              <div className="row">
                <div className="col-6">
                  <div className="text-center">
                    <h4 className="text-primary">{stats.totalServiceProviders}</h4>
                    <p className="text-muted">Service Providers</p>
                  </div>
                </div>
                <div className="col-6">
                  <div className="text-center">
                    <h4 className="text-success">{stats.totalPGs}</h4>
                    <p className="text-muted">Total PGs</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardStats; 