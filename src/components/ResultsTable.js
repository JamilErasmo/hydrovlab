import React from 'react';

const ResultsTable = ({ data }) => {
  return (
    <div className="border p-4 rounded-lg mb-6">
      <h2 className="text-lg font-semibold mb-4">Resultados de la Simulación</h2>
      <div className="overflow-auto max-h-64">
        <table className="table-auto w-full text-left text-sm border-collapse border border-gray-200">
          <thead className="bg-gray-200 sticky top-0">
            <tr>
              <th className="border px-4 py-2">Mes</th>
              <th className="border px-4 py-2">Caudal Observado (m³/s)</th>
              <th className="border px-4 py-2">Caudal Simulado (m³/s)</th>
            </tr>
          </thead>
          <tbody>
            {data.map((row, index) => (
              <tr key={index} className="hover:bg-gray-100">
                <td className="border px-4 py-2">{row.month}</td>
                <td className="border px-4 py-2">{row.observedFlow.toFixed(2)}</td>
                <td className="border px-4 py-2">{row.simulatedFlow.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ResultsTable;
