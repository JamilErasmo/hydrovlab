import React from 'react';

const DataDisplay = ({ alpha, setAlpha, results, dCritical, onExecute, onToggleTable }) => {
  return (
    <div>
      <select value={alpha} onChange={(e) => setAlpha(e.target.value)}>
        <option value="0.10">0.10</option>
        <option value="0.05" selected>0.05</option>
        <option value="0.01">0.01</option>
      </select>
      <button onClick={onExecute}>Execute Analysis</button>
      {Object.keys(results).map((distribution) => (
        <div key={distribution}>
          <h3>{distribution}</h3>
          <p>D_Max: {results[distribution]?.dMax || 'N/A'}</p>
          <p>Rank: {results[distribution]?.rank || 'N/A'}</p>
        </div>
      ))}
      <p>Critical D: {dCritical}</p>
      <button onClick={onToggleTable}>View Table</button>
    </div>
  );
};

export default DataDisplay;