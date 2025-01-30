import React from 'react';

const ResultTable = ({ results }) => {
  // This is a placeholder. You would need to adjust this based on your actual data structure.
  return (
    <table>
      <thead>
        <tr>
          <th>Distribution</th>
          <th>D_Max</th>
          <th>Rank</th>
        </tr>
      </thead>
      <tbody>
        {Object.entries(results).map(([distribution, { dMax, rank }]) => (
          <tr key={distribution}>
            <td>{distribution}</td>
            <td>{dMax}</td>
            <td>{rank}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default ResultTable;