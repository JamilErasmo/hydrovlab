/* eslint-disable @next/next/no-img-element */
'use client'
import React, { useState } from 'react';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import CalculateIcon from '@mui/icons-material/Calculate';
import DeleteIcon from '@mui/icons-material/Delete';
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
import { Line } from 'react-chartjs-2';
import '../App.css';

// Registro de elementos de Chart.js para las gráficas
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const EfectoPrecipitacion = () => {
  const [inputValues, setInputValues] = useState({
    areaCuenca: '',
    longitudCauce: '',
    pendienteMedia: '',
    duracionEfectiva: '',
    precipitacionEfectiva: '',
  });
  const [resultValues, setResultValues] = useState({
    kirpich: '',
    california: '',
    giandotti: '',
    temez: '',
    tiempoConcentracion: '',
  });
  const [hidrogramaValues, setHidrogramaValues] = useState({
    tiempoRetraso: '',
    tiempoPico: '',
    tiempoBase: '',
    caudalPico: '',
  });
  const [chartData, setChartData] = useState(null);
  // Estado para mensajes de error
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setInputValues({
      ...inputValues,
      [e.target.name]: e.target.value,
    });
    // Limpiar mensaje de error al modificar algún valor
    setError('');
  };

  const roundToThree = (num) => {
    return Math.round(num * 1000) / 1000;
  };

  const calcular = () => {
    const { areaCuenca, longitudCauce, pendienteMedia } = inputValues;
    const A = parseFloat(areaCuenca);
    const L = parseFloat(longitudCauce);
    const J = parseFloat(pendienteMedia);

    if (isNaN(A) || isNaN(L) || isNaN(J)) {
      setError('Por favor, ingrese valores numéricos válidos.');
      return;
    }
    setError('');
    const kirpich = (3.97 * Math.pow(L, 0.77) * Math.pow(J, -0.385)) / 60;
    const california = 0.066 * Math.pow(L / Math.pow(J, 0.5), 0.77);
    const giandotti = (4 * Math.sqrt(A) + 1.5 * L) / (25.3 * Math.sqrt(J * L));
    const temez = 0.3 * Math.pow(L / Math.pow(J, 0.25), 0.77);

    const kirpichRounded = roundToThree(kirpich);
    const californiaRounded = roundToThree(california);
    const giandottiRounded = roundToThree(giandotti);
    const temezRounded = roundToThree(temez);
    const tiempoConcentracion = Math.min(kirpichRounded, californiaRounded, giandottiRounded, temezRounded);

    setResultValues({
      kirpich: kirpichRounded,
      california: californiaRounded,
      giandotti: giandottiRounded,
      temez: temezRounded,
      tiempoConcentracion: roundToThree(tiempoConcentracion),
    });
  };

  const graficarHidrogramas = () => {
    const { areaCuenca } = inputValues;
    const A = parseFloat(areaCuenca);
    const Tc = parseFloat(resultValues.tiempoConcentracion);

    if (isNaN(A) || isNaN(Tc)) {
      setError('Por favor, asegúrese de que todos los valores de entrada y el tiempo de concentración sean válidos.');
      return;
    }
    setError('');
    const tr = 0.6 * Tc;
    const tp = parseFloat(inputValues.duracionEfectiva) / 2 + tr;
    const tb = 2.67 * tp;
    const qp = (0.208 * A) / tp;
    const Qpico = qp * parseFloat(inputValues.precipitacionEfectiva);

    setHidrogramaValues({
      tiempoRetraso: roundToThree(tr),
      tiempoPico: roundToThree(tp),
      tiempoBase: roundToThree(tb),
      caudalPico: roundToThree(Qpico),
    });

    const data = {
      labels: Array.from({ length: 101 }, (_, i) => roundToThree(i * tb / 100)),
      datasets: [
        {
          label: 'Hidrograma Triangular',
          data: Array.from({ length: 101 }, (_, i) => {
            const t = i * tb / 100;
            if (t <= tp) return roundToThree((Qpico / tp) * t);
            else return roundToThree((Qpico / (tb - tp)) * (tb - t));
          }),
          borderColor: 'rgba(75,192,192,1)',
          fill: false,
        },
      ],
    };

    setChartData(data);
  };

  const fillExampleValues = () => {
    setInputValues({
      areaCuenca: '23',
      longitudCauce: '11',
      pendienteMedia: '0.02',
      duracionEfectiva: '2.75',
      precipitacionEfectiva: '100',
    });
    setResultValues({
      kirpich: '',
      california: '',
      giandotti: '',
      temez: '',
      tiempoConcentracion: '',
    });
    setHidrogramaValues({
      tiempoRetraso: '',
      tiempoPico: '',
      tiempoBase: '',
      caudalPico: '',
    });
    setChartData(null);
    setError('');
  };

  const clearFields = () => {
    setInputValues({
      areaCuenca: '',
      longitudCauce: '',
      pendienteMedia: '',
      duracionEfectiva: '',
      precipitacionEfectiva: '',
    });
    setResultValues({
      kirpich: '',
      california: '',
      giandotti: '',
      temez: '',
      tiempoConcentracion: '',
    });
    setHidrogramaValues({
      tiempoRetraso: '',
      tiempoPico: '',
      tiempoBase: '',
      caudalPico: '',
    });
    setChartData(null);
    setError('');
  };

  return (
    <div className="container mx-auto max-w-3xl p-4">
      <BackButton />

      {/* Contenedor Principal */}
      <div className="bg-white p-6 shadow-md rounded-lg border border-gray-300">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4 text-center">
          Efecto de la precipitación efectiva en la tormenta
        </h2>

        {/* Sección de Entrada de Datos y Resultados */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Entrada de Datos */}
          <div className="bg-gray-50 p-6 rounded-lg shadow">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Entrada de Datos</h3>
            <div className="space-y-4">
              {[
                { label: "Área de la Cuenca (km²):", name: "areaCuenca", value: inputValues.areaCuenca },
                { label: "Longitud del Cauce (km):", name: "longitudCauce", value: inputValues.longitudCauce },
                { label: "Pendiente Media del Cauce (m/m):", name: "pendienteMedia", value: inputValues.pendienteMedia },
                { label: "Duración Efectiva (h):", name: "duracionEfectiva", value: inputValues.duracionEfectiva },
                { label: "Precipitación Efectiva (mm):", name: "precipitacionEfectiva", value: inputValues.precipitacionEfectiva }
              ].map((item, index) => (
                <div key={index} className="flex flex-col">
                  <label className="text-gray-700 font-medium">{item.label}</label>
                  <input
                    type="text"
                    name={item.name}
                    value={item.value}
                    onChange={handleChange}
                    className="w-full p-2 mt-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                  />
                </div>
              ))}
            </div>

            {/* Botón para calcular */}
            <button
              onClick={calcular}
              className="mt-6 w-full px-5 py-2 bg-green-500 text-white font-semibold rounded-lg shadow-md hover:bg-green-600 transition"
            >
              Calcular
            </button>

            {/* Botones secundarios */}
            <div className="mt-4 flex justify-between">
              <button
                onClick={fillExampleValues}
                className="flex items-center px-5 py-2 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-600 transition"
              >
                <CalculateIcon className="mr-2" />
                Ejemplo
              </button>
              <button
                onClick={clearFields}
                className="flex items-center px-5 py-2 bg-red-500 text-white font-semibold rounded-lg shadow-md hover:bg-red-600 transition"
              >
                <DeleteIcon className="mr-2" />
                Limpiar
              </button>
            </div>

            {/* Mensaje de Error */}
            {error && <p className="text-red-500 text-center mt-4">{error}</p>}
          </div>

          {/* Resultados */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Resultados</h3>
            <div className="space-y-4">
              {[
                { label: "Fórmula de Kirpich (h):", value: resultValues.kirpich },
                { label: "Fórmula Californiana del U.S.B.R (h):", value: resultValues.california },
                { label: "Fórmula de Giandotti (h):", value: resultValues.giandotti },
                { label: "Fórmula de Témez (h):", value: resultValues.temez },
                { label: "Tiempo de Concentración Definitivo (h):", value: resultValues.tiempoConcentracion }
              ].map((item, index) => (
                <div key={index} className="flex flex-col">
                  <label className="text-gray-700 font-medium">{item.label}</label>
                  <input
                    type="text"
                    value={item.value}
                    readOnly
                    className="w-full p-2 mt-1 border border-gray-300 rounded-lg bg-gray-100 text-center"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Sección de Parámetros y Gráficas */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white p-6 border border-gray-300 rounded-lg shadow-md max-w-5xl mx-auto mt-6">
        {/* Parámetros */}
        <div className="bg-gray-50 p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Parámetros para la Construcción del Hidrograma
          </h2>
          <div className="space-y-4">
            {[
              { label: "Tiempo de Retraso tr (h):", value: hidrogramaValues.tiempoRetraso },
              { label: "Tiempo Pico tp (h):", value: hidrogramaValues.tiempoPico },
              { label: "Tiempo Base tb (h):", value: hidrogramaValues.tiempoBase },
              { label: "Caudal Pico Qp (m³/s):", value: hidrogramaValues.caudalPico }
            ].map((item, index) => (
              <div key={index} className="flex flex-col">
                <label className="text-gray-700 font-medium">{item.label}</label>
                <input
                  type="text"
                  value={item.value}
                  readOnly
                  className="w-full p-2 mt-1 border border-gray-300 rounded-lg bg-gray-100 text-center"
                />
              </div>
            ))}
          </div>
          <button
            onClick={graficarHidrogramas}
            className="mt-6 w-full px-5 py-2 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-600 transition"
          >
            Graficar Hidrogramas
          </button>
        </div>

        {/* Gráfica */}
        <div className="bg-white p-6 rounded-lg shadow">
          {chartData ? (
            <div>
              <h3 className="text-lg font-semibold text-gray-700 mb-4 text-center">Hidrograma Triangular</h3>
              <Line data={chartData} />
            </div>
          ) : (
            <p className="text-center text-gray-500">No hay datos para graficar.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default EfectoPrecipitacion;
