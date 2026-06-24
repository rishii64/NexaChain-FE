import { useEffect, useState } from 'react';
import api from '../services/api';
import Loader from '../components/Loader';

const ReferralNode = ({ user }) => {
  return (
    <div className="tree-node">
      <div className="tree-content">
        <h4>{user.fullName}</h4>
        <p>{user.email}</p>
        <p>Status: <span className={`badge badge-${user.accountStatus.toLowerCase()}`} style={{ fontSize: '0.65rem' }}>{user.accountStatus}</span></p>
        <p style={{ fontSize: '0.75rem', marginTop: '0.25rem' }}>Level {user.level}</p>
      </div>
      {user.children && user.children.length > 0 && (
        <div className="children-container">
          {user.children.map((child) => (
            <ReferralNode key={child._id} user={child} />
          ))}
        </div>
      )}
    </div>
  );
};

const ReferralTree = () => {
  const [tree, setTree] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTree = async () => {
      try {
        const { data } = await api.get('/referrals/tree');
        setTree(data);
      } catch (error) {
        console.error('Failed to fetch tree', error);
      } finally {
        setLoading(false);
      }
    };
    fetchTree();
  }, []);

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.875rem', paddingBottom: '1.4rem' }}>Network Tree</h1>
        <p style={{ color: 'var(--text-secondary)' }}>View your multi-level referral hierarchy.</p>
      </div>

      <div className="tree-container">
        {loading ? (
          <div>
            {/* Loading network tree... */}
            <Loader height='500px' />
          </div>
        ) : tree.length > 0 ? (
          <div>
            <h3 style={{ marginBottom: '1rem', color: 'var(--primary-color)' }}>My Direct Referrals:</h3>
            {tree.map(node => (
              <ReferralNode key={node._id} user={node} />
            ))}
          </div>
        ) : (
          <div style={{ color: 'var(--text-secondary)', textAlign: "center", paddingTop: '10rem' }}>You don't have any referrals yet. Share your referral code to start building your network!</div>
        )}
      </div>
    </div>
  );
};

export default ReferralTree;
