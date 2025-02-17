'use client';
import React, { useCallback, useState } from 'react';
import { calculateGoodnessOfFit, getCriticalValue } from './functions/calculations';

function BondadAjuste() {
  const [data, setData] = useState(null);
  const [message, setMessage] = useState('');
  const [results, setResults] = useState({});
  const [alpha, setAlpha] = useState('0.05');
  const [dCritical, setDCritical] = useState(0);
  const [showResultTable, setShowResultTable] = useState(false);
  const [showData, setShowData] = useState(false); // New state to toggle data display

  // File Upload Handler
  const handleFileUpload = useCallback((event) => {
    const file = event.target.files[0];
    if (file && file.type === 'text/plain') {
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target.result;
        setData(text.split('\n').map(Number).filter(n => !isNaN(n)));
        setMessage('Archivo cargado con éxito');
      };
      reader.readAsText(file);
    } else {
      setMessage('Error!!...La extensión del archivo debe ser .txt');
    }
  }, []);

  // Execute Analysis Handler
  const handleExecute = useCallback(() => {
    if (data && data.length > 0) {
      const newResults = calculateGoodnessOfFit(data, alpha);
      const newDCritical = getCriticalValue(data.length, alpha);
      setResults(newResults);
      setDCritical(newDCritical);
      setMessage('Análisis exitoso');
    } else {
      setMessage('Seleccione un archivo para realizar los cálculos');
    }
  }, [data, alpha]);

  // Clear Data Handler
  const handleClear = useCallback(() => {
    setData(null);
    setResults({});
    setMessage('');
    setDCritical(0);
    setShowResultTable(false);
    setShowData(false); // Reset data visibility
  }, []);

  // Example Data Handler
  const handleExample = useCallback(() => {
    const exampleData = [
      7430, 7061, 6900, 6267, 6000, 5971, 5565, 4744, 4240, 4060,
      3706, 3682, 3220, 3130, 2737, 2675, 2489, 2414, 2367, 2350,
      2246, 2230, 2070, 1804, 1796
    ];

    setData(exampleData);
    setMessage('Ejemplo cargado...');
    setAlpha('0.05'); // Default alpha for example
  }, []);

  // Toggle Show Result Table
  const toggleResultTable = useCallback(() => {
    setShowResultTable(!showResultTable);
  }, [showResultTable]);

  // Toggle Show Data
  const toggleDataDisplay = useCallback(() => {
    setShowData(!showData);
  }, [showData]);

  return (
    <div className="p-6 max-w-5xl mx-auto">
      {/* Título Principal */}
      <h1 className="text-3xl font-bold text-center mb-4">
        Funciones de Distribución de Probabilidad
      </h1>
      <h2 className="text-2xl text-center font-semibold text-blue-600 mb-6">
        Kolmogorov-Smirnov
      </h2>

      {/* Botón Descargar Manual */}
      <div className="flex justify-center mb-6">
        <button
          onClick={() => window.open('URL_TO_MANUAL', '_blank')}
          className="px-6 py-3 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600 transition"
        >
          Descargar Manual
        </button>
      </div>

      {/* Datos de Entrada */}
      <div className="bg-gray-100 p-6 rounded-lg shadow-md mb-6">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">Datos de Entrada</h3>

        <input
          type="file"
          onChange={handleFileUpload}
          accept=".txt"
          className="border p-2 rounded w-full mb-4"
        />

        <p className="text-gray-600">{message}</p>

        <button
          onClick={handleExecute}
          disabled={!data}
          className="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition mb-4"
        >
          Cargar Archivo
        </button>

        {/* Selección de Alpha */}
        <select value={alpha} onChange={(e) => setAlpha(e.target.value)} className="border p-2 rounded w-full">
          <option value="0.10">0.10</option>
          <option value="0.05">0.05</option> 
          <option value="0.01">0.01</option>
        </select>

        {/* Botones de acción */}
        <div className="flex justify-between mt-4">
          <button
            onClick={handleExample}
            className="px-6 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition"
          >
            Ejemplo
          </button>
          <button
            onClick={handleExecute}
            disabled={!data}
            className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
          >
            Ejecutar Análisis
          </button>
          <button
            onClick={handleClear}
            className="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
          >
            Limpiar
          </button>
        </div>

        {/* Mostrar Datos */}
        {data && (
          <div className="mt-4">
            <button
              onClick={toggleDataDisplay}
              className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition"
            >
              {showData ? 'Ocultar Datos' : 'Mostrar Datos'}
            </button>
            {showData && (
              <pre className="bg-gray-200 p-4 mt-4 rounded-lg text-sm">
                {data.map((datum, index) => (
                  <div key={index}>{datum}</div>
                ))}
              </pre>
            )}
          </div>
        )}
      </div>

      {/* Resultados */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">Resultados</h3>

        {/* Tabla de Resultados */}
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-200">
                <th className="border border-gray-300 px-4 py-2">FUNCIÓN</th>
                <th className="border border-gray-300 px-4 py-2">KOLMOGOROV</th>
                <th className="border border-gray-300 px-4 py-2">D_Máx</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(results).map(([dist, { dMax, rank }]) => (
                <tr key={dist} className="text-center">
                  <td className="border border-gray-300 px-4 py-2">{dist}</td>
                  <td className="border border-gray-300 px-4 py-2">{rank}</td>
                  <td className="border border-gray-300 px-4 py-2">{dMax.toFixed(4)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p className="mt-4 text-gray-700">Número de datos = {data ? data.length : 0}</p>
        <p className="text-gray-700">Valor crítico d = {dCritical}</p>
        <p className="text-gray-700">
          {results.gumbel?.dMax === Math.min(...Object.values(results).map(r => r.dMax))
            ? "La función que mejor se ajusta a los datos es Gumbel"
            : "No hay datos para determinar la mejor función"}
        </p>

        {/* Botón para ver tabla detallada */}
        <button
          onClick={toggleResultTable}
          className="px-6 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition mt-4"
        >
          Ver Tabla
        </button>
      </div>

      {/* Resultados Detallados */}
      {showResultTable && (
        <div className="bg-gray-100 p-6 rounded-lg shadow-md mt-6 text-center">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Resultados Detallados</h3>
          <textarea
            readOnly
            // value="Here would be the detailed results"
            rows="8"
            className="w-full border p-2 rounded-lg"
          />
          <button
            onClick={toggleResultTable}
            className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition mt-4"
          >
            Aceptar
          </button>
        </div>
      )}

    </div>
  );
}

export default BondadAjuste;