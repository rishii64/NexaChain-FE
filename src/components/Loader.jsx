import './Loader.css';

const Loader = ({ height = '100vh' }) => {
  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      height: height 
    }}>
      <div className="nexa-loader">Nexa</div>
    </div>
  );
};

export default Loader;