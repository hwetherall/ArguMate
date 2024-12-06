import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { scoreClaims } from '../services/apiClient';
import SummaryView from '../components/SummaryView';

function SummaryPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [scores, setScores] = useState(null);
  const claims = location.state?.claims;

  useEffect(() => {
    if (!claims) {
      navigate('/claims');
      return;
    }

    const getScores = async () => {
      try {
        const scoreResults = await scoreClaims(claims);
        setScores(scoreResults);
      } catch (error) {
        alert(error.message);
      } finally {
        setLoading(false);
      }
    };

    getScores();
  }, [claims, navigate]);

  if (loading) {
    return <div>Calculating scores...</div>;
  }

  return (
    <div className="summary-page">
      <SummaryView claims={claims} scores={scores} />
      <button onClick={() => navigate('/claims')}>Start New Analysis</button>
    </div>
  );
}

export default SummaryPage;
