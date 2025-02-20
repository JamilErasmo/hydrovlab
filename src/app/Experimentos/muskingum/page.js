'use client';
import React, { useState } from 'react';
import { Line } from 'react-chartjs-2';
import BackButton from "@/components/BackButton"; // Ajusta la ruta según la ubicación
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

// Registro de componentes de Chart.js
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const EstimacionesKYX = () => {
  const [data, setData] = useState([]);
  const [inputValues, setInputValues] = useState({
    Tiempo: '',
    X1: '',
    X2: '',
    X3: '',
    X4: '',
  });
  const [modalValues, setModalValues] = useState({ Qe: '', Qs: '' });
  const [showModal, setShowModal] = useState(false);
  const [chartData, setChartData] = useState(null);
  const [resultadosK, setResultadosK] = useState({ K1: '', K2: '', K3: '', K4: '', X: '', K: '' });
  const [mejorSerie, setMejorSerie] = useState(null);

  // Función para calcular regresión lineal y R² de un conjunto de datos
  const computeRegression = (dataPoints) => {
    if (!dataPoints || dataPoints.length === 0) return { slope: 0, intercept: 0, rSquared: 0 };
    const n = dataPoints.length;
    let sumX = 0,
      sumY = 0;
    dataPoints.forEach((pt) => {
      sumX += pt.x;
      sumY += pt.y;
    });
    const meanX = sumX / n;
    const meanY = sumY / n;

    let numerator = 0,
      denominator = 0;
    dataPoints.forEach((pt) => {
      numerator += (pt.x - meanX) * (pt.y - meanY);
      denominator += Math.pow(pt.x - meanX, 2);
    });
    const slope = denominator === 0 ? 0 : numerator / denominator;
    const intercept = meanY - slope * meanX;

    // Calcular R² utilizando la fórmula de correlación
    let sumSqX = 0,
      sumSqY = 0;
    dataPoints.forEach((pt) => {
      sumSqX += Math.pow(pt.x - meanX, 2);
      sumSqY += Math.pow(pt.y - meanY, 2);
    });
    const rSquared = sumSqX * sumSqY === 0 ? 0 : Math.pow(numerator, 2) / (sumSqX * sumSqY);
    return { slope, intercept, rSquared };
  };

  // Función para cargar los datos del ejemplo
  const handleEjemplo = () => {
    const exampleData = [
      { Qe: 2.2, Qs: 2.0 },
      { Qe: 14.5, Qs: 7.0 },
      { Qe: 28.4, Qs: 11.7 },
      { Qe: 31.8, Qs: 16.5 },
      { Qe: 29.7, Qs: 24.0 },
      { Qe: 25.3, Qs: 29.1 },
      { Qe: 20.4, Qs: 28.4 },
      { Qe: 16.3, Qs: 23.8 },
      { Qe: 12.6, Qs: 19.4 },
      { Qe: 9.3, Qs: 15.3 },
      { Qe: 6.7, Qs: 11.2 },
      { Qe: 5.0, Qs: 8.2 },
      { Qe: 4.1, Qs: 6.4 },
      { Qe: 3.6, Qs: 5.2 },
      { Qe: 2.4, Qs: 4.6 },
    ];
    setData(
      exampleData.map((row, index) => ({
        ...row,
        Tiempo: index === 0 ? 0 : null,
        S: 0,
        X1: 0,
        X2: 0,
        X3: 0,
        X4: 0,
      }))
    );

    setInputValues({
      Tiempo: 0.5,
      X1: 0,
      X2: 0.1,
      X3: 0.2,
      X4: 0.3,
    });

    setResultadosK({ K1: '', K2: '', K3: '', K4: '', X: '', K: '' });
    setChartData(null);
    setMejorSerie(null);
  };

  // Función para calcular los valores
  const handleCalcular = () => {
    const xValues = [
      parseFloat(inputValues.X1) || 0,
      parseFloat(inputValues.X2) || 0.1,
      parseFloat(inputValues.X3) || 0.2,
      parseFloat(inputValues.X4) || 0.3,
    ];

    if (xValues.some((x) => x < 0 || x > 0.5)) {
      alert('Los valores de X deben cumplir con la condición 0 <= X <= 0.5.');
      return;
    }

    const deltaT = parseFloat(inputValues.Tiempo) || 0.5;
    let acumuladoTiempo = 0;
    let almacenamientoAnterior = 0;
    let maxAlmacenamiento = 0;
    let indexMax = 0;

    const resultados = data.map((row, index) => {
      if (index === 0) {
        return {
          ...row,
          Tiempo: acumuladoTiempo.toFixed(2),
          S: almacenamientoAnterior.toFixed(2),
          X1: 0,
          X2: 0,
          X3: 0,
          X4: 0,
        };
      }

      acumuladoTiempo += deltaT;
      const prevRow = data[index - 1];

      const S =
        almacenamientoAnterior +
        (deltaT / 2) *
        ((parseFloat(prevRow.Qe) || 0) +
          (parseFloat(row.Qe) || 0) -
          (parseFloat(prevRow.Qs) || 0) -
          (parseFloat(row.Qs) || 0));

      almacenamientoAnterior = S;

      if (S > maxAlmacenamiento) {
        maxAlmacenamiento = S;
        indexMax = index;
      }

      return {
        ...row,
        Tiempo: acumuladoTiempo.toFixed(2),
        S: S.toFixed(2),
        X1: (
          xValues[0] * (parseFloat(row.Qe) || 0) +
          (1 - xValues[0]) * (parseFloat(row.Qs) || 0)
        ).toFixed(2),
        X2: (
          xValues[1] * (parseFloat(row.Qe) || 0) +
          (1 - xValues[1]) * (parseFloat(row.Qs) || 0)
        ).toFixed(2),
        X3: (
          xValues[2] * (parseFloat(row.Qe) || 0) +
          (1 - xValues[2]) * (parseFloat(row.Qs) || 0)
        ).toFixed(2),
        X4: (
          xValues[3] * (parseFloat(row.Qe) || 0) +
          (1 - xValues[3]) * (parseFloat(row.Qs) || 0)
        ).toFixed(2),
      };
    });

    const kValues = {
      K1: (maxAlmacenamiento / resultados[indexMax].X1).toFixed(2),
      K2: (maxAlmacenamiento / resultados[indexMax].X2).toFixed(2),
      K3: (maxAlmacenamiento / resultados[indexMax].X3).toFixed(2),
      K4: (maxAlmacenamiento / resultados[indexMax].X4).toFixed(2),
    };

    setData(resultados);
    setResultadosK(kValues);
  };

  // Función para limpiar los datos
  const handleLimpiar = () => {
    setData([]);
    setInputValues({
      Tiempo: '',
      X1: '',
      X2: '',
      X3: '',
      X4: '',
    });
    setResultadosK({ K1: '', K2: '', K3: '', K4: '', X: '', K: '' });
    setChartData(null);
    setMejorSerie(null);
  };

  // Manejar cambios en los valores de entrada
  const handleInputChange = (field, value) => {
    setInputValues({ ...inputValues, [field]: value });
  };

  // Manejar cambios en los valores del modal
  const handleModalChange = (field, value) => {
    setModalValues({ ...modalValues, [field]: value });
  };

  // Función para agregar un nuevo registro desde el modal
  const handleAgregarDato = () => {
    if (modalValues.Qe === '' || modalValues.Qs === '') {
      alert('Por favor, ingrese valores para Qe y Qs.');
      return;
    }

    setData([
      ...data,
      {
        Qe: parseFloat(modalValues.Qe),
        Qs: parseFloat(modalValues.Qs),
        Tiempo: null,
        S: 0,
        X1: 0,
        X2: 0,
        X3: 0,
        X4: 0,
      },
    ]);
    setModalValues({ Qe: '', Qs: '' });
  };

  // Función para generar la gráfica consolidada y determinar la serie más lineal
  const handleVerGraficas = () => {
    if (data.length === 0) {
      alert('No hay datos para graficar.');
      return;
    }

    // Se generan 4 datasets (para X1, X2, X3 y X4)
    const datasets = [1, 2, 3, 4].map((idx) => {
      return {
        label: `X${idx}`,
        data: data.map((row) => {
          const xValue = parseFloat(row[`X${idx}`]) || 0;
          const yValue = parseFloat(row.S) || 0;
          return { x: xValue, y: yValue };
        }),
        borderColor: `rgba(${75 * idx}, 192, 192, 0.8)`,
        backgroundColor: `rgba(${75 * idx}, 192, 192, 0.3)`,
        fill: false,
        tension: 0.1,
      };
    });

    // Determinamos cuál serie tiene mayor linealidad (mayor R²)
    let mejor = { label: '', rSquared: 0 };
    datasets.forEach((ds) => {
      const reg = computeRegression(ds.data);
      if (reg.rSquared > mejor.rSquared) {
        mejor = { label: ds.label, rSquared: reg.rSquared };
      }
    });
    setMejorSerie(mejor);

    setChartData({ datasets });
  };

  // Opciones para la gráfica consolidada
  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Relación Flujo Ponderado vs Almacenamiento',
      },
    },
    scales: {
      x: {
        type: 'linear',
        position: 'bottom',
        title: {
          display: true,
          text: 'Flujo Ponderado (m³/s)',
        },
      },
      y: {
        title: {
          display: true,
          text: 'Almacenamiento (m³/s)-d',
        },
      },
    },
  };

  return (
    <div className='py-8'>
            <BackButton />
      <div className='py-12 w-full text-center'>
        <h1 className="text-2xl font-bold mb-4">Estimaciones de K y X</h1>
        <div className="flex justify-center">
          <div className="mb-4 flex flex-wrap gap-2 justify-center items-center py-6">
            <button
              onClick={handleEjemplo}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition duration-300 ease-in-out"
            >
              Ejemplo
            </button>
            <button
              onClick={handleCalcular}
              className="px-4 py-2 bg-green-600 text-white rounded-lg shadow-md hover:bg-green-700 transition duration-300 ease-in-out"
            >
              Calcular
            </button>
            <button
              onClick={handleLimpiar}
              className="px-4 py-2 bg-red-600 text-white rounded-lg shadow-md hover:bg-red-700 transition duration-300 ease-in-out"
            >
              Limpiar
            </button>
            <button
              onClick={() => setShowModal(true)}
              className="px-4 py-2 bg-yellow-600 text-white rounded-lg shadow-md hover:bg-yellow-700 transition duration-300 ease-in-out"
            >
              Ingreso de Datos
            </button>
            <button
              onClick={handleVerGraficas}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg shadow-md hover:bg-indigo-700 transition duration-300 ease-in-out"
            >
              Ver Gráficas
            </button>
          </div>
        </div>


        {/* Tabla de datos */}
        <div className="overflow-x-auto">
          <table className="mx-auto text-center border-collapse border border-gray-300 shadow-lg w-full max-w-4xl">
            <thead>
              <tr className="bg-gray-700 text-white">
                <th className="p-2 border border-gray-400">Qe (m³/s)</th>
                <th className="p-2 border border-gray-400">Qs (m³/s)</th>
                <th className="p-2 border border-gray-400">
                  Tiempo (días)
                  <br />
                  <input
                    type="number"
                    value={inputValues.Tiempo}
                    onChange={(e) => handleInputChange('Tiempo', e.target.value)}
                    className="w-16 text-center border border-gray-400 rounded-md p-1"
                  />
                </th>
                <th className="p-2 border border-gray-400">Almacenamiento (S) (m³/s)-d</th>
                {[1, 2, 3, 4].map((num) => (
                  <th key={num} className="p-2 border border-gray-400">
                    X ({num})
                    <br />
                    <input
                      type="number"
                      value={inputValues[`X${num}`]}
                      onChange={(e) => handleInputChange(`X${num}`, e.target.value)}
                      className="w-16 text-center border border-gray-400 rounded-md p-1"
                    />
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.map((row, index) => (
                <tr key={index} className="odd:bg-gray-100 even:bg-white hover:bg-gray-200">
                  <td className="p-2 border border-gray-300">{row.Qe}</td>
                  <td className="p-2 border border-gray-300">{row.Qs}</td>
                  <td className="p-2 border border-gray-300">{row.Tiempo}</td>
                  <td className="p-2 border border-gray-300">{row.S}</td>
                  <td className="p-2 border border-gray-300">{row.X1}</td>
                  <td className="p-2 border border-gray-300">{row.X2}</td>
                  <td className="p-2 border border-gray-300">{row.X3}</td>
                  <td className="p-2 border border-gray-300">{row.X4}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {/* Gráfica consolidada */}
        {chartData && (
          <div className="max-w-2xl mx-auto bg-white p-6 rounded-lg shadow-md border border-gray-300 mt-6">
            <Line data={chartData} options={chartOptions} />
          </div>
        )}

        {/* Mostrar cuál serie es la más lineal para estimar K */}
        {mejorSerie && (
          <div className="max-w-2xl mx-auto bg-gray-100 p-6 rounded-lg shadow-md border border-gray-300 mt-4">
            <p className="text-gray-700 text-lg text-center">
              La serie <strong className="text-blue-600">{mejorSerie.label}</strong> es la que más se asemeja a una recta
              (R² = <span className="font-semibold">{mejorSerie.rSquared.toFixed(2)}</span>) y se recomienda usarla para estimar K.
            </p>
          </div>
        )}
        {/* Resultados de K */}
        {Object.values(resultadosK).some((k) => k) && (
          <div className="max-w-xl mx-auto bg-gray-100 p-6 rounded-lg shadow-md border border-gray-300 mt-6 text-center">
            <h3 className="text-xl font-semibold text-gray-800">Valores de K</h3>
            <p className="text-gray-700 mt-2">K1 = {resultadosK.K1}</p>
            <p className="text-gray-700">K2 = {resultadosK.K2}</p>
            <p className="text-gray-700">K3 = {resultadosK.K3}</p>
            <p className="text-gray-700">K4 = {resultadosK.K4}</p>
            <p className="text-gray-600 mt-3 text-sm italic">
              Recuerda: en las gráficas se debe escoger la X que más se asemeje a una recta para poder estimar el K.
            </p>
          </div>
        )}

        {/* Modal de ingreso de datos */}
        {showModal && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-96 relative">
              <button
                className="absolute top-3 right-3 text-gray-700 hover:text-gray-900"
                onClick={() => setShowModal(false)}
              >
                ✖
              </button>
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Ingreso de Datos</h3>

              <label className="block text-gray-700 font-medium">Qe:</label>
              <input
                type="number"
                value={modalValues.Qe}
                onChange={(e) => handleModalChange('Qe', e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md mb-2"
              />

              <label className="block text-gray-700 font-medium">Qs:</label>
              <input
                type="number"
                value={modalValues.Qs}
                onChange={(e) => handleModalChange('Qs', e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md mb-4"
              />

              <div className="flex justify-between">
                <button
                  className="px-4 py-2 bg-blue-600 text-white rounded-md shadow-md hover:bg-blue-700 transition"
                  onClick={handleAgregarDato}
                >
                  Agregar
                </button>
                <button
                  className="px-4 py-2 bg-gray-500 text-white rounded-md shadow-md hover:bg-gray-600 transition"
                  onClick={() => setShowModal(false)}
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default EstimacionesKYX;
