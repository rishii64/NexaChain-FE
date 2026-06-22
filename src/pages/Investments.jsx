import { useEffect, useState } from 'react';
import api from '../services/api';

const Investments = () => {
  const [investments, setInvestments] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ amount: 100, planDetails: 'Basic Plan', durationDays: 30, dailyRoiPercentage: 1.5 });

  const fetchInvestments = async () => {
    try {
      const { data } = await api.get('/investments/me');
      setInvestments(data);
    } catch (error) {
      console.error('Failed to fetch investments', error);
    }
  };

  useEffect(() => {
    fetchInvestments();
  }, []);

  const handleCreateInvestment = async (e) => {
    e.preventDefault();
    try {
      await api.post('/investments', formData);
      setShowModal(false);
      fetchInvestments();
    } catch (error) {
      alert('Failed to create investment');
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '1.875rem', paddingBottom:'1.4rem' }}>My Investments</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Manage your active and past investment plans.</p>
        </div>
        <button className="btn btn-primary" style={{ width: 'auto' }} onClick={() => setShowModal(true)}>
          New Investment
        </button>
      </div>

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Plan</th>
              <th>Amount</th>
              <th>Daily ROI</th>
              <th>Start Date</th>
              <th>End Date</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {investments.map((inv) => (
              <tr key={inv._id}>
                <td>{inv.planDetails}</td>
                <td style={{ fontWeight: 600 }}>${inv.amount.toFixed(2)}</td>
                <td>{inv.dailyRoiPercentage}%</td>
                <td>{new Date(inv.startDate).toLocaleDateString()}</td>
                <td>{new Date(inv.endDate).toLocaleDateString()}</td>
                <td>
                  <span className={`badge badge-${inv.status.toLowerCase()}`}>{inv.status}</span>
                </td>
              </tr>
            ))}
            {investments.length === 0 && (
              <tr>
                <td colSpan="6" style={{ textAlign: 'center', color: 'var(--text-secondary)' }}>No investments found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50 }}>
          <div className="card glass-panel" style={{ width: '400px' }}>
            <h2 style={{ marginBottom: '1.5rem' }}>Create Investment</h2>
            <form onSubmit={handleCreateInvestment}>
              <div className="form-group">
                <label className="form-label">Plan Details</label>
                <input className="form-input" value={formData.planDetails} onChange={(e) => setFormData({...formData, planDetails: e.target.value})} />
              </div>
              <div className="form-group">
                <label className="form-label">Amount ($)</label>
                <input type="number" className="form-input" value={formData.amount} onChange={(e) => setFormData({...formData, amount: Number(e.target.value)})} />
              </div>
              <div className="form-group">
                <label className="form-label">Duration (Days)</label>
                <input type="number" className="form-input" value={formData.durationDays} onChange={(e) => setFormData({...formData, durationDays: Number(e.target.value)})} />
              </div>
              <div className="form-group">
                <label className="form-label">Daily ROI (%)</label>
                <input type="number" step="0.1" className="form-input" value={formData.dailyRoiPercentage} onChange={(e) => setFormData({...formData, dailyRoiPercentage: Number(e.target.value)})} />
              </div>
              <div style={{ display: 'flex', gap: '1rem' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Invest Now</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Investments;
