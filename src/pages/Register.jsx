import { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Loader2 } from 'lucide-react';

const Register = () => {
  const [formData, setFormData] = useState({
    fullName: '', email: '', mobileNumber: '', password: '', referredByCode: ''
  });
  const [loading, setLoading] = useState(false);
  const { register } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await register(formData);
      toast.success('Registration successful');
      setTimeout(() => { navigate('/'); }, 800);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Registration failed');
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({...formData, [e.target.name]: e.target.value});
  }

  return (
    <div className="auth-container">
      <div className="auth-card glass-panel" style={{ maxWidth: '500px' }}>
        <h2 className="auth-title">Create Account</h2>
        <p className="auth-subtitle">Join the Nexa-Invest AI network</p>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Full Name</label>
            <input name="fullName" type="text" className="form-input" onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input name="email" type="email" className="form-input" onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label className="form-label">Mobile Number</label>
            <input name="mobileNumber" type="text" className="form-input" onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label className="form-label">Password</label>
            <input name="password" type="password" className="form-input" onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label className="form-label">Referral Code (Optional)</label>
            <input name="referredByCode" type="text" className="form-input" onChange={handleChange} />
          </div>
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="spin" size={18} />
                Creating Account...
              </>
            ) : (
              'Sign Up'
            )}
          </button>
        </form>
        <p style={{ marginTop: '1.5rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
          Already have an account? <Link to="/login" style={{ color: 'var(--primary-color)' }}>Login</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
