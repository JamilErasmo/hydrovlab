import React, { useState } from 'react';

const ParameterInputs = ({ onSimulate }) => {
  const [params, setParams] = useState({
    Hmax: 100,
    Po: 10,
    C: 0.5,
    alpha: 0.1,
  });

  const handleChange = (e) => {
    setParams({ ...params, [e.target.name]: parseFloat(e.target.value) });
  };

  const handleSimulate = () => {
    onSimulate(params);
  };

  return (
    <div className="border p-4 rounded-lg mb-6">
      <h2 className="text-lg font-semibold mb-4">Parámetros del Modelo</h2>
      <div className="grid grid-cols-2 gap-4">
        {Object.keys(params).map((param) => (
          <div key={param}>
            <label className="block mb-2 font-medium">{param}</label>
            <input
              type="number"
              name={param}
              value={params[param]}
              onChange={handleChange}
              className="w-full border p-2 rounded"
            />
          </div>
        ))}
      </div>
      <button
        onClick={handleSimulate}
        className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-600"
      >
        Simular
      </button>
    </div>
  );
};

export default ParameterInputs;
