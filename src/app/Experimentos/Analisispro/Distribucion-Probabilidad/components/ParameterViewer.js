import React from 'react';

const ParameterViewer = ({ method, parameters }) => {
  return (
    <div>
      <h3>Parameters for {method} Method:</h3>
      {Object.entries(parameters).map(([key, value]) => (
        <p key={key}>{key}: {value}</p>
      ))}
    </div>
  );
};

export default ParameterViewer;