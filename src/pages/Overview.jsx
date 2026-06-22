import { useEffect, useState, useContext } from 'react';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';
import { Wallet, TrendingUp, Users, DollarSign } from 'lucide-react';

const Overview = () => {
  const [summary, setSummary] = useState(null);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const { data } = await api.get('/dashboard/summary');
        setSummary(data);
      } catch (error) {
        console.error('Failed to fetch summary', error);
      }
    };
    fetchSummary();
  }, []);

  if (!summary) return <div>Loading dashboard...</div>;

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.875rem', paddingBottom:'1.4rem' }}>Dashboard Overview</h1>
        <p style={{ color: 'var(--text-secondary)' }}>Welcome back, {user?.fullName}. Here's what's happening today.</p>
        <p style={{ color: 'var(--primary-color)', fontWeight: 'bold', marginTop: '0.5rem' }}>Your Referral Code: {user?.referralCode}</p>
      </div>

      <div className="dashboard-grid">
        <div className="card stat-card glass-panel">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span className="stat-title">Wallet Balance</span>
            <Wallet color="var(--primary-color)" />
          </div>
          <span className="stat-value">${summary.walletBalance?.toFixed(2) || '0.00'}</span>
        </div>
        
        <div className="card stat-card glass-panel">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span className="stat-title">Total Investments</span>
            <TrendingUp color="var(--success-color)" />
          </div>
          <span className="stat-value">${summary.totalInvestedAmount?.toFixed(2) || '0.00'}</span>
          <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>{summary.activeInvestmentsCount} Active Plans</span>
        </div>

        <div className="card stat-card glass-panel">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span className="stat-title">Total ROI Earned</span>
            <DollarSign color="var(--warning-color)" />
          </div>
          <span className="stat-value">${summary.totalRoiEarned?.toFixed(2) || '0.00'}</span>
        </div>

        <div className="card stat-card glass-panel">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span className="stat-title">Level Income</span>
            <Users color="var(--secondary-color)" />
          </div>
          <span className="stat-value">${summary.totalLevelIncomeEarned?.toFixed(2) || '0.00'}</span>
        </div>
      </div>
    </div>
  );
};

export default Overview;
