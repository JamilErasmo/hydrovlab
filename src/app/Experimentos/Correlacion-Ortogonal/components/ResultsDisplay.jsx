import React, { useContext, useEffect, useState } from 'react';
import { AppContext } from '../page';
import { calculateAllResults } from '../functions/calculations';

const ResultsDisplay = () => {
  const { data, baseStation, analysisStation } = useContext(AppContext);
  const [results, setResults] = useState({});

  useEffect(() => {
    if (Object.keys(data).length > 0 && baseStation && analysisStation) {
      const calculatedResults = calculateAllResults(data, baseStation, analysisStation);
      setResults(calculatedResults);
    }
  }, [data, baseStation, analysisStation]);

  // Render component
  return (
    <div className="results-display">
      <div className="bg-white p-6 rounded-lg shadow-md border border-gray-300">
        {/* Título principal */}
        <h3 className="text-xl font-semibold text-gray-800 mb-4">
          Resultados del Análisis de CORRELACIÓN ORTOGONAL
        </h3>

        {/* Tabla de resultados */}
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-gray-300 rounded-lg shadow-md">
            <thead>
              <tr className="bg-gray-200 text-gray-800">
                <th className="p-3 border border-gray-300 text-left">Estadística</th>
                <th className="p-3 border border-gray-300 text-left">Valor</th>
              </tr>
            </thead>
            <tbody>
              {[
                ["Media de la Estación base", results.baseStationMean],
                ["Media de la Estación en Análisis", results.analysisStationMean],
                ["Varianza de la Estación base", results.baseStationVariance],
                ["Varianza de la Estación en Análisis", results.analysisStationVariance],
                ["Covarianza", results.covariance],
                ["Coeficiente λ", results.lambdaCoefficient],
                ["Pendiente de la recta (m)", results.slope],
                ["Coeficiente de Correlación de Pearson", results.pearsonCoefficient],
                ["Ecuación 1 (tramo recto)", results.equation1],
                ["Ecuación 2 (tramo parabólico)", results.equation2]
              ].map(([label, value], index) => (
                <tr key={index} className="odd:bg-gray-50">
                  <td className="p-3 border border-gray-300 text-gray-700 font-medium">{label}</td>
                  <td className="p-3 border border-gray-300 text-gray-900">
                    {typeof value === "number" ? value.toFixed(15) : value || "N/A"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className='py-8'>
        <div className="py-8 bg-white p-6 rounded-lg shadow-md border border-gray-300">
          {/* Título de la tabla */}
          <h4 className="text-lg font-semibold text-gray-800 mb-4">Datos Rellenados</h4>

          {/* Contenedor de la tabla con desplazamiento horizontal */}
          <div className="overflow-x-auto whitespace-nowrap">
            <table className="w-full border-collapse border border-gray-300 rounded-lg shadow-md">
              <thead>
                <tr className="bg-gray-200 text-gray-800">
                  <th className="p-2 border border-gray-300">X - UTM</th>
                  <th className="p-2 border border-gray-300">Y - UTM</th>
                  <th className="p-2 border border-gray-300">Cód.</th>
                  <th className="p-2 border border-gray-300">T.Dato</th>
                  <th className="p-2 border border-gray-300">Año</th>
                  {["ENE", "FEB", "MAR", "ABR", "MAY", "JUN", "JUL", "AGO", "SEP", "OCT", "NOV", "DIC", "SUMAT"].map(
                    (month, index) => (
                      <th key={index} className="p-2 border border-gray-300">{month}</th>
                    )
                  )}
                </tr>
              </thead>
              <tbody>
                {results.filledData && results.filledData.map((entry, index) => (
                  <tr key={index} className="odd:bg-gray-50">
                    <td className="p-2 border border-gray-300">{entry.xutm}</td>
                    <td className="p-2 border border-gray-300">{entry.yutm}</td>
                    <td className="p-2 border border-gray-300">{entry.code}</td>
                    <td className="p-2 border border-gray-300">{entry.dataType}</td>
                    <td className="p-2 border border-gray-300">{entry.year}</td>
                    {entry.data.map((value, idx) => (
                      <td key={idx} className="p-2 border border-gray-300">
                        {value === -100.0 ? "-100" : value.toFixed(1)}
                      </td>
                    ))}
                    <td className="p-2 border border-gray-300">{entry.total}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResultsDisplay;