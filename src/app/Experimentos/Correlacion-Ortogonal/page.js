'use client';
import React, { createContext, useEffect, useState } from 'react';
import CronogramaGraph from './components/CronogramaGraph';
import DataFillingStationsGraph from './components/DataFillingStationsGraph';
import DataFillingStationsSelector from './components/DataFillingStationsSelector';
import DoubleMassGraph from './components/DoubleMassGraph';
import FileUpload from './components/FileUpload';
import HomogeneousGroupSelector from './components/HomogeneousGroupSelector';
import ResultsDisplay from './components/ResultsDisplay';
import StationSelector from './components/StationSelector';
import TimeSeriesGraph from './components/TimeSeriesGraph';

export const AppContext = createContext();

function CorrelacionOrtogonal() {
  const [stations, setStations] = useState([]);
  const [selectedStation, setSelectedStation] = useState(null);
  const [selectedStationsForFilling, setSelectedStationsForFilling] = useState([]);
  const [baseStation, setBaseStation] = useState(null);
  const [analysisStation, setAnalysisStation] = useState(null);

  const [data, setData] = useState({});
  const [fileUploaded, setFileUploaded] = useState(false);
  const [correlationResults, setCorrelationResults] = useState({});
  const [showData, setShowData] = useState(false);

  const handleFileUpload = async (file) => {
    const reader = new FileReader();

    reader.onload = (event) => {
      const content = event.target.result;
      const lines = content.split('\n').filter(line => line.trim() !== '');

      const newStations = new Set();
      const newData = {};

      lines.forEach((line, index) => {
        const columns = line.split('\t').map(col => col.trim());
        if (columns.length >= 3) {
          const stationCode = columns[2];
          newStations.add(stationCode);

          if (!newData[stationCode]) {
            newData[stationCode] = {
              coordinates: [columns[0], columns[1]],
              data: {}
            };
          }

          const year = columns[4];
          // Keep -100.0 as is, don't convert it to null
          const monthlyData = columns.slice(5, 17).map(val => {
            if (val === '-100.0') return -100.0;
            return val === '' || val === '.' ? 0 : parseFloat(val);
          });
          const total = columns[17] === '-100.0' ? -100.0 : (parseFloat(columns[17]) || null);

          newData[stationCode].data[year] = {
            monthly: monthlyData,
            total: total
          };
        }
      });

      setStations(Array.from(newStations));
      setData(newData);
      setFileUploaded(true);
    };

    reader.readAsText(file);
  };

  // Function to toggle visibility of data
  const toggleDataVisibility = () => {
    setShowData(!showData);
  };

  // Render data in a row format
  const renderData = () => {
    if (Object.keys(data).length === 0) return <p>No data loaded yet.</p>;

    return (
      <div className="overflow-x-auto whitespace-nowrap p-4 bg-white rounded-lg shadow-md border border-gray-300">
        {Object.entries(data).map(([station, stationData]) => (
          <div key={station} className="inline-block mr-5 p-4 bg-gray-50 rounded-lg shadow">
            <h4 className="text-lg font-semibold text-gray-800">{station}</h4>
            <p className="text-gray-700">Coordenadas: {stationData.coordinates.join(', ')}</p>
            <ul className="list-disc list-inside text-gray-700">
              {Object.entries(stationData.data).map(([year, yearData]) => (
                <li key={year} className="mt-2">
                  <span className="font-medium text-gray-900">{year}:</span> {yearData.monthly.join(', ')}
                  <span className="text-gray-600"> (Total: {yearData.total || 'N/A'})</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

    );
  };

  // Simulated data filling process
  const handleDataFilling = () => {
    if (baseStation && analysisStation && Object.keys(data).length > 0) {
      const baseStationData = data[baseStation]?.data;
      const analysisStationData = data[analysisStation]?.data;

      if (baseStationData && analysisStationData) {
        const years = Object.keys(baseStationData);
        let baseSum = 0, analysisSum = 0;
        let baseMax = 0, analysisMax = 0;

        // Calculating sums and max values
        years.forEach(year => {
          if (baseStationData[year].total !== -100.0 && analysisStationData[year].total !== -100.0) {
            baseSum += baseStationData[year].total;
            analysisSum += analysisStationData[year].total;
            baseMax = Math.max(baseMax, baseSum);
            analysisMax = Math.max(analysisMax, analysisSum);
          }
        });

        // Simulating results (real calculations would go here)
        const results = {
          baseStationMean: baseSum / years.length,
          analysisStationMean: analysisSum / years.length,
          baseStationVariance: 0, // Placeholder
          analysisStationVariance: 0, // Placeholder
          covariance: 0, // Placeholder
          lambdaCoefficient: 0, // Placeholder
          slope: 0, // Placeholder
          pearsonCoefficient: 0, // Placeholder
          equation1: "y = mx + b", // Placeholder
          equation2: "y = ax^2 + bx + c", // Placeholder,
          filledData: years.map(year => ({
            year: year,
            data: baseStationData[year].monthly.map((_, idx) =>
              analysisStationData[year].monthly[idx] !== -100.0 ?
                analysisStationData[year].monthly[idx] :
                baseStationData[year].monthly[idx])
          }))
        };

        // Set the results in context
        setCorrelationResults(results);
      } else {
        alert("No data available for the selected stations.");
      }
    } else {
      alert("Por favor, seleccione ambas estaciones y asegúrese de que el archivo ha sido cargado.");
    }
  };

  useEffect(() => {
    // Make handleDataFilling available in the context
    AppContext.handleDataFilling = handleDataFilling;
  }, [baseStation, analysisStation, data]);

  return (
    <AppContext.Provider value={{
      stations,
      setStations,
      selectedStation,
      setSelectedStation,
      data,
      setData,
      fileUploaded,
      setFileUploaded,
      correlationResults,
      setCorrelationResults,
      handleFileUpload,
      baseStation,
      setBaseStation,
      analysisStation,
      setAnalysisStation
    }}>
      <div className='py-10 '>
        <div className="max-w-6xl mx-auto p-8 bg-white shadow-lg rounded-xl">
          {/* Título Principal */}
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-800">
              Relleno de datos de precipitación mediante Correlación Ortogonal
            </h2>
          </div>

          {/* Subida de Archivo */}
          <div className="mb-6">
            <FileUpload />
          </div>

          {/* Botón para Mostrar/Ocultar Datos */}
          <div className="mb-6 flex justify-center">
            <button
              onClick={toggleDataVisibility}
              className="px-6 py-3 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-600 transition"
            >
              {showData ? "Ocultar Datos" : "Mostrar Datos"}
            </button>
          </div>

          {/* Contenedor de Datos */}
          {showData && (
            <div className="border border-gray-300 p-6 bg-gray-100 rounded-lg shadow-md">
              {renderData()}
            </div>
          )}

          {/* Sección de Datos de Entrada */}
          <div className="mb-8">
            <h3 className="text-xl font-semibold text-gray-700 mb-4">Datos de Entrada</h3>
            <StationSelector stations={stations} onSelect={setSelectedStation} />
            <div className="mt-4">
              <TimeSeriesGraph station={selectedStation} />
            </div>
          </div>

          {/* Sección de Cronograma */}
          <div className="mb-8">
            <h3 className="text-xl font-semibold text-gray-700 mb-4">Cronograma</h3>
            <CronogramaGraph stations={stations} />
          </div>

          {/* Grupo de Estaciones Homogéneas */}
          <div className="mb-8">
            <h3 className="text-xl font-semibold text-gray-700 mb-4">Grupo de Estaciones Homogéneas</h3>
            <HomogeneousGroupSelector stations={stations} onSelect={setSelectedStationsForFilling} />
            <div className="mt-4">
              <DoubleMassGraph selectedStations={selectedStationsForFilling} />
            </div>
          </div>

          {/* Selección de Estaciones para el Relleno de Datos */}
          <div className="mb-8">
            <h3 className="text-xl font-semibold text-gray-700 mb-4">Estaciones para el Relleno de Datos</h3>
            <DataFillingStationsSelector stations={stations} onSelect={setSelectedStationsForFilling} />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <select
                value={baseStation}
                onChange={(e) => setBaseStation(e.target.value)}
                disabled={selectedStationsForFilling.length === 0}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
              >
                <option value="">Seleccione la Estación Base</option>
                {selectedStationsForFilling.map((station) => (
                  <option key={station} value={station}>{station}</option>
                ))}
              </select>

              <select
                value={analysisStation}
                onChange={(e) => setAnalysisStation(e.target.value)}
                disabled={selectedStationsForFilling.length === 0}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
              >
                <option value="">Seleccione la Estación en Análisis</option>
                {selectedStationsForFilling.map((station) => (
                  <option key={station} value={station}>{station}</option>
                ))}
              </select>
            </div>

            <div className="mt-4">
              <DataFillingStationsGraph stationAnalysis={analysisStation} stationBase={baseStation} />
            </div>
          </div>

          {/* Resultados */}
          <div className="mt-8">
            <ResultsDisplay />
          </div>
        </div>
      </div>

    </AppContext.Provider>
  );
}

export default CorrelacionOrtogonal;