import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useContext, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { ThemeContext } from '../context/ThemeContext';
import { LayoutDashboard, TrendingUp, Users, LogOut, Menu, X, Sun, Moon } from 'lucide-react';
import toast from 'react-hot-toast';

const DashboardLayout = () => {
  const { logout } = useContext(AuthContext);
  const { theme, toggleTheme } = useContext(ThemeContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    setIsOpen(false);
    logout();
    toast.success('Logged out');
    navigate('/login');
  };

  const navItems = [
    { name: 'Overview', path: '/', icon: <LayoutDashboard size={20} /> },
    { name: 'Investments', path: '/investments', icon: <TrendingUp size={20} /> },
    { name: 'Network Tree', path: '/network', icon: <Users size={20} /> }
  ];

  return (
    <div className="app-container">
      {/* Mobile Top Header */}
      <header className="mobile-header">
        <button className="menu-toggle-btn" onClick={() => setIsOpen(true)}>
          <Menu size={24} />
        </button>
        <div className="mobile-logo">Nexa Invest</div>
        <button className="theme-toggle-btn" onClick={toggleTheme} aria-label="Toggle theme">
          {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
        </button>
      </header>

      {/* Sidebar Overlay */}
      {isOpen && <div className="sidebar-overlay" onClick={() => setIsOpen(false)}></div>}

      <aside className={`sidebar glass-panel ${isOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <div className="sidebar-logo">
            Nexa Invest
          </div>
          <button className="sidebar-close-btn" onClick={() => setIsOpen(false)}>
            <X size={24} />
          </button>
        </div>
        <nav style={{ flex: 1 }}>
          {navItems.map((item) => (
            <Link 
              key={item.path} 
              to={item.path} 
              className={`nav-link ${location.pathname === item.path ? 'active' : ''}`}
              onClick={() => setIsOpen(false)}
            >
              {item.icon}
              {item.name}
            </Link>
          ))}
        </nav>
        
        {/* Theme Toggle Button for Desktop */}
        <button onClick={toggleTheme} className="btn theme-sidebar-btn" style={{ justifyContent: 'flex-start', padding: '0.875rem 1rem', background: 'transparent', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
          {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
          {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
        </button>

        <button onClick={handleLogout} className="btn" style={{ justifyContent: 'flex-start', padding: '0.875rem 1rem', background: 'transparent', color: 'var(--danger-color)' }}>
          <LogOut size={20} />
          Logout
        </button>
      </aside>
      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
};

export default DashboardLayout;
