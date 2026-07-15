import { useEffect, useState } from 'react';
import API from '../api/axios';
import Loader from '../components/Loader';
import EmptyState from '../components/EmptyState';
import RequestCard from '../components/RequestCard';

const Requests = () => {
  const [tab, setTab] = useState('received');
  const [data, setData] = useState({ sent: [], received: [] });
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState(null);

  const load = async () => {
    const { data: res } = await API.get('/requests');
    setData(res);
  };

  useEffect(() => {
    load().finally(() => setLoading(false));
  }, []);

  const handleAccept = async (requestId) => {
    setBusyId(requestId);
    try {
      await API.put('/accept', { requestId });
      await load();
    } finally {
      setBusyId(null);
    }
  };

  const handleReject = async (requestId) => {
    setBusyId(requestId);
    try {
      await API.put('/reject', { requestId });
      await load();
    } finally {
      setBusyId(null);
    }
  };

  if (loading) return <Loader label="Loding Request" />;

  const list = tab === 'received' ? data.received : data.sent;
  const pendingReceivedCount = data.received.filter((r) => r.status === 'pending').length;

  return (
    <div className="page">
      <header className="page-header">
        <h1>Swap requests</h1>
        <p>Accept the request to receive a Google Meet link and begin your session</p>
      </header>

      <div className="tabs">
        <button className={`tab ${tab === 'received' ? 'tab-active' : ''}`} onClick={() => setTab('received')}>
          Received
          {pendingReceivedCount > 0 && <span className="tab-badge">{pendingReceivedCount}</span>}
        </button>
        <button className={`tab ${tab === 'sent' ? 'tab-active' : ''}`} onClick={() => setTab('sent')}>
          Sent
        </button>
      </div>

      {list.length === 0 ? (
        <EmptyState
          title={tab === 'received' ? "You haven't received any requests yet" : 'No requests sent'}
          message={
            tab === 'received'
              ? 'When a student sends you a swap request, it will appear here.'
              : 'Send a swap request to a student from the Matches tab.'
          }
        />
      ) : (
        <div className="request-list">
          {list.map((r) => (
            <RequestCard
              key={r._id}
              request={r}
              direction={tab}
              onAccept={handleAccept}
              onReject={handleReject}
              busy={busyId === r._id}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Requests;
