import React, { useState } from 'react';
import ParameterViewer from './ParameterViewer';

const ResultsTable = ({ isData, results, onClean, option }) => {
  // State for checkbox status
  const [selectedResults, setSelectedResults] = useState([]);
  const [average, setAverage] = useState(null);

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedParams, setSelectedParams] = useState({});

  const handleSelectMethod = (method, params) => {
    setSelectedParams({ method, params });
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
  };

  // Function to toggle selection
  const toggleSelection = (method) => {
    setSelectedResults(prev => {
      if (prev.includes(method)) {
        return prev.filter(m => m !== method);
      } else {
        return [...prev, method];
      }
    });
  };

  // Function to calculate average
  const calculateAverage = () => {
    if (selectedResults.length < 2) {
      alert("Debe seleccionar  dos o mas valores para promediar");
      return;
    }

    let sum = 0;
    let count = 0;

    results.forEach(result => {
      if (selectedResults.includes(result.method)) {
        // Here, we're assuming we average based on 'value' for option 'B' and 'returnPeriod' for option 'A'
        const valueToAverage = option === 'A' ? parseFloat(result.returnPeriod) : parseFloat(result.value);
        if (!isNaN(valueToAverage)) {
          sum += valueToAverage;
          count++;
        }
      }
    });

    if (count > 0) {
      const avg = sum / count;
      setAverage(avg);
    } else {
      setAverage(null);
    }
  };

  const clearAverage = () => {
    setAverage(null);
    setSelectedResults([]);
  };

  return (
    <div className="p-6 bg-white border border-gray-300 rounded-lg shadow-lg max-w-4xl mx-auto">
      <h2 className="text-xl font-bold text-center mb-4">RESULTADOS</h2>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse border border-gray-300">
          <thead className="bg-gray-100">
            <tr>
              <th className="border border-gray-300 px-4 py-2">FUNCIÓN</th>
              <th className="border border-gray-300 px-4 py-2">PROBABILIDAD (%)</th>
              <th className="border border-gray-300 px-4 py-2">
                {option === 'A' ? 'Tr (Años)' : 'Valor Calculado'}
              </th>
              <th className="border border-gray-300 px-4 py-2">PARÁMETROS</th>
            </tr>
          </thead>
          <tbody>
            {results.map((result, index) => (
              <tr key={index} className="text-center">
                <td className="border border-gray-300 px-4 py-2 flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={selectedResults.includes(result.method)}
                    onChange={() => toggleSelection(result.method)}
                    className="mr-2"
                  />
                  {result.method}
                </td>
                <td className="border border-gray-300 px-4 py-2">{result.probability}</td>
                <td className="border border-gray-300 px-4 py-2">
                  {option === 'A' ? result.returnPeriod : result.value}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  <button
                    className={`px-4 py-2 rounded-lg transition ${!!isData && !!result?.method && !!result?.params
                      ? 'bg-blue-500 text-white hover:bg-blue-600'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      }`}
                    disabled={!(!!isData && !!result?.method && !!result?.params)}
                    onClick={() =>
                      !!result?.method && !!result?.params && handleSelectMethod(result.method, result.params)
                    }
                  >
                    Ver Parámetros
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex justify-center gap-4 mb-4 py-8">
        <button
          onClick={calculateAverage}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
        >
          PROMEDIAR
        </button>
        <button
          onClick={clearAverage}
          className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
        >
          LIMPIAR PROMEDIO
        </button>
        <button
          onClick={() => onClean()}
          className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition"
        >
          LIMPIAR
        </button>
      </div>

      <div className="bg-gray-100 border border-gray-200 rounded-lg shadow-md p-4 max-w-md mx-auto mt-4">
        <p className="text-lg font-semibold text-center text-gray-700">
          El promedio del {option === 'A' ? 'periodo de retorno es: ' : 'valor calculado es: '}
          <span className="text-blue-600">{average?.toFixed(2) || 'NaN'}</span>
          {option === 'A' ? ' Años' : ' m³/s'}
        </p>
      </div>


      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg transition-transform transform scale-95 sm:scale-100">
            {/* Botón de Cierre */}
            <button
              className="absolute top-3 right-3 text-gray-700 text-xl font-bold hover:bg-gray-300 rounded-full p-1"
              onClick={closeModal}
            >
              ×
            </button>

            {/* Contenido del Modal */}
            <ParameterViewer method={selectedParams.method} parameters={selectedParams.params} />
          </div>
        </div>
      )}


    </div>
  );
};

export default ResultsTable;