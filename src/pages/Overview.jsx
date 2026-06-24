import { useEffect, useState, useContext } from 'react';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';
import { Wallet, TrendingUp, Users, DollarSign } from 'lucide-react';
import Loader from '../components/Loader';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend 
} from 'recharts';

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

  if (!summary) return <div>
    {/* Loading dashboard... */}
    <Loader />
  </div>;

  // Format YYYY-MM-DD date strings for cleaner visualization (e.g. "Jun 25")
  const formattedChartData = summary.earningsChartData?.map(item => {
    const dateObj = new Date(item.date);
    const formattedDate = dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric', timeZone: 'UTC' });
    return {
      ...item,
      displayDate: formattedDate
    };
  }) || [];

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.875rem', paddingBottom: '1.4rem' }}>Dashboard Overview</h1>
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

      {/* Visual Analytics Charts Section */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem', marginTop: '2rem' }}>
        {/* Chart 1: Investment History */}
        <div className="card glass-panel" style={{ padding: '1.5rem', minWidth: 0 }}>
          <h3 style={{ fontSize: '1.25rem', marginBottom: '1.5rem', fontFamily: 'var(--font-heading)' }}>Investment History (Last 7 Days)</h3>
          <div style={{ width: '100%', height: 300 }}>
            <ResponsiveContainer width="100%" height={300} minWidth={0}>
              <AreaChart
                data={formattedChartData}
                margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="colorInvestment" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--success-color)" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="var(--success-color)" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
                <XAxis 
                  dataKey="displayDate" 
                  stroke="var(--text-secondary)" 
                  fontSize={12}
                  tickLine={false}
                />
                <YAxis 
                  stroke="var(--text-secondary)" 
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value) => `$${value}`}
                />
                <Tooltip 
                  contentStyle={{ 
                    background: 'var(--bg-surface)', 
                    border: '1px solid var(--border-color)', 
                    borderRadius: 'var(--radius-md)',
                    color: 'var(--text-primary)',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                  }}
                  formatter={(value) => [`$${Number(value).toFixed(2)}`]}
                />
                <Legend verticalAlign="top" height={36} iconType="circle" />
                <Area 
                  type="monotone" 
                  dataKey="investment" 
                  name="New Investments" 
                  stroke="var(--success-color)" 
                  fillOpacity={1} 
                  fill="url(#colorInvestment)" 
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Referral & ROI Earnings */}
        <div className="card glass-panel" style={{ padding: '1.5rem', minWidth: 0 }}>
          <h3 style={{ fontSize: '1.25rem', marginBottom: '1.5rem', fontFamily: 'var(--font-heading)' }}>Earnings History (Last 7 Days)</h3>
          <div style={{ width: '100%', height: 300 }}>
            <ResponsiveContainer width="100%" height={300} minWidth={0}>
              <AreaChart
                data={formattedChartData}
                margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="colorRoi" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--warning-color)" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="var(--warning-color)" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorReferral" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--secondary-color)" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="var(--secondary-color)" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
                <XAxis 
                  dataKey="displayDate" 
                  stroke="var(--text-secondary)" 
                  fontSize={12}
                  tickLine={false}
                />
                <YAxis 
                  stroke="var(--text-secondary)" 
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value) => `$${value}`}
                />
                <Tooltip 
                  contentStyle={{ 
                    background: 'var(--bg-surface)', 
                    border: '1px solid var(--border-color)', 
                    borderRadius: 'var(--radius-md)',
                    color: 'var(--text-primary)',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                  }}
                  formatter={(value) => [`$${Number(value).toFixed(2)}`]}
                />
                <Legend verticalAlign="top" height={36} iconType="circle" />
                <Area 
                  type="monotone" 
                  dataKey="roi" 
                  name="Daily ROI" 
                  stroke="var(--warning-color)" 
                  fillOpacity={1} 
                  fill="url(#colorRoi)" 
                  strokeWidth={2}
                />
                <Area 
                  type="monotone" 
                  dataKey="referral" 
                  name="Referral Level Income" 
                  stroke="var(--secondary-color)" 
                  fillOpacity={1} 
                  fill="url(#colorReferral)" 
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Overview;
