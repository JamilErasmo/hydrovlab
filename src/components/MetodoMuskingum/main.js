'use client';
import React, { useState } from 'react';
import Table from './table';
import Chart from './Chart';
import FileUploader from './FileUploader';
import { calcularResultados, exportarExcel } from '@/utils/muskingumCalculations';

const MetodoMuskingum = () => {
  const [data, setData] = useState([]);
  const [inputs, setInputs] = useState({ Tiempo: '', X1: '', X2: '', X3: '', X4: '' });
  const [chartData, setChartData] = useState(null);
  const [resultadosK, setResultadosK] = useState({});

  const handleCalcular = () => {
    try {
      const { resultados, kValues } = calcularResultados(data, inputs);
      setData(resultados);
      setResultadosK(kValues);
    } catch (error) {
      alert(error.message);
    }
  };

  const handleExportar = () => {
    exportarExcel(data);
  };

  return (
    <div className="container mx-auto p-6 max-w-4xl bg-white border border-gray-300 rounded-lg shadow-md">
      {/* Encabezado */}
      <h1 className="text-2xl font-bold text-center text-blue-600 mb-6">Método Muskingum</h1>

      {/* Subida de Archivos */}
      <div className="mb-6">
        <FileUploader onDataLoad={(parsedData) => setData(parsedData)} />
      </div>

      {/* Tabla de Datos */}
      <div className="mb-6">
        <Table data={data} inputs={inputs} onInputChange={setInputs} />
      </div>

      {/* Botones de Acción */}
      <div className="flex justify-center gap-4 mb-6">
        <button
          onClick={handleCalcular}
          className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
        >
          Calcular
        </button>
        <button
          onClick={handleExportar}
          className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition"
        >
          Exportar a Excel
        </button>
      </div>

      {/* Gráfico */}
      {chartData && (
        <div className="mb-6">
          <Chart data={chartData} />
        </div>
      )}

      {/* Resultados de K */}
      {Object.keys(resultadosK).length > 0 && (
        <div className="bg-gray-100 p-4 rounded-md shadow-md">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Resultados de K</h3>
          <p className="text-gray-700">K1: {resultadosK.K1}</p>
          <p className="text-gray-700">K2: {resultadosK.K2}</p>
          <p className="text-gray-700">K3: {resultadosK.K3}</p>
          <p className="text-gray-700">K4: {resultadosK.K4}</p>
        </div>
      )}
    </div>

  );
};

export default MetodoMuskingum;
