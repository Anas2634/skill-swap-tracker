import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import API from '../api/axios';
import Loader from '../components/Loader';
import EmptyState from '../components/EmptyState';
import MatchCard from '../components/MatchCard';

const Matches = () => {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [requestStates, setRequestStates] = useState({});

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await API.get('/matches');
        setMatches(data);
      } catch (err) {
        setError(err.response?.data?.message || 'Matches load nahi ho sake');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const handleRequest = async (receiverId) => {
    setRequestStates((prev) => ({ ...prev, [receiverId]: 'sending' }));
    try {
      await API.post('/request', { receiverId });
      setRequestStates((prev) => ({ ...prev, [receiverId]: 'sent' }));
    } catch (err) {
      setRequestStates((prev) => ({ ...prev, [receiverId]: undefined }));
    }
  };

  if (loading) return <Loader label="Finding your perfect skill matches..." />;

  return (
    <div className="page">
      <header className="page-header">
        <h1>Your matches</h1>
        <p>These students match your teach and learn skills.</p>
      </header>

      {error && (
        <EmptyState
          title="Skills not added yet."
          message={error}
          action={
            <Link className="btn btn-primary" to="/dashboard">
              Skills added
            </Link>
          }
        />
      )}

      {!error && matches.length === 0 && (
        <EmptyState
          title="Matches not added yet."
          message="When a student with matching teach/learn skills joins, they will appear here."
        />
      )}

      {!error && matches.length > 0 && (
        <div className="match-grid">
          {matches.map((m) => (
            <MatchCard
              key={m.user._id}
              match={m}
              onRequest={handleRequest}
              requestState={requestStates[m.user._id]}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Matches;
