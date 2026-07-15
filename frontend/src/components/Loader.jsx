const Loader = ({ label = 'Loading' }) => (
  <div className="loader-wrap">
    <span className="loader-dot" />
    <span className="loader-dot" />
    <span className="loader-dot" />
    <span className="loader-label">{label}</span>
  </div>
);

export default Loader;
