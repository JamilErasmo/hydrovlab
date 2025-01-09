import React from 'react';

const ValidationParameters = ({ r2, ef, rmse }) => {
  const formatValue = (value) => (value !== undefined && value !== null ? value.toFixed(6) : 'N/A');

  return (
    <div className="border p-4 rounded-lg mb-6">
      <h2 className="text-lg font-semibold mb-4">Parámetros de Validación</h2>
      <ul className="list-disc pl-6">
        <li>
          <strong>Coeficiente de Correlación (R²):</strong> {formatValue(r2)}
        </li>
        <li>
          <strong>Coeficiente de Eficiencia de Nash & Sutcliffe (EF):</strong> {formatValue(ef)}
        </li>
        <li>
          <strong>Error Cuadrático Medio (RMSE):</strong> {formatValue(rmse)}
        </li>
      </ul>
    </div>
  );
};

export default ValidationParameters;
