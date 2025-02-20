'use client';
import React, { useState } from 'react';
import BackButton from "@/components/BackButton"; // Ajusta la ruta según la ubicación
import CalculateIcon from '@mui/icons-material/Calculate';
import DeleteIcon from '@mui/icons-material/Delete';

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

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const HidrogramaUnitario = () => {
  const [inputValues, setInputValues] = useState({
    areaCuenca: '',
    longitudCauce: '',
    pendienteMedia: '',
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
    duracionExceso: '',
    tiempoPico: '',
    tiempoBase: '',
    caudalPico: '',
  });
  const [chartData, setChartData] = useState({
    triangular: null,
    scs: null,
  });

  const handleChange = (e) => {
    setInputValues({
      ...inputValues,
      [e.target.name]: e.target.value,
    });
  };

  const fillExampleValues = () => {
    setInputValues({
      areaCuenca: 15,
      longitudCauce: 5,
      pendienteMedia: 0.01,
    });
  };

  const calculate = () => {
    const { areaCuenca, longitudCauce, pendienteMedia } = inputValues;
    const L = Number(longitudCauce);
    const A = Number(areaCuenca);
    const J = Number(pendienteMedia);

    const kirpich = (3.97 * Math.pow(L, 0.77) * Math.pow(J, -0.385)) / 60;
    const california = 0.066 * Math.pow(L / Math.pow(J, 0.5), 0.77);
    const giandotti = (4 * Math.sqrt(A) + 1.5 * L) / (25.3 * Math.sqrt(J * L));
    const temez = 0.3 * Math.pow(L / Math.pow(J, 0.25), 0.77);
    const tiempoConcentracion = Math.min(kirpich, california, giandotti, temez);

    setResultValues({
      kirpich: kirpich.toFixed(3),
      california: california.toFixed(3),
      giandotti: giandotti.toFixed(3),
      temez: temez.toFixed(3),
      tiempoConcentracion: tiempoConcentracion.toFixed(3),
    });
  };

  const generateHidrogramas = () => {
    const Tc = Number(resultValues.tiempoConcentracion);
    const Ac = Number(inputValues.areaCuenca);

    const tr = 0.6 * Tc;
    const d_e = 2 * Math.sqrt(Tc);
    const tp = d_e / 2 + tr;
    const tb = 2.67 * tp;
    const qp = (0.208 * Ac) / tp;

    setHidrogramaValues({
      tiempoRetraso: tr.toFixed(3),
      duracionExceso: d_e.toFixed(3),
      tiempoPico: tp.toFixed(3),
      tiempoBase: tb.toFixed(3),
      caudalPico: qp.toFixed(3),
    });

    const triangularData = {
      labels: [0, tp, tb],
      datasets: [
        {
          label: 'Hidrograma Triangular',
          data: [0, qp, 0],
          borderColor: 'rgba(75,192,192,1)',
          fill: false,
        },
      ],
    };

    const scsData = {
      labels: Array.from({ length: 28 }, (_, i) => (i * tp / 27).toFixed(3)),
      datasets: [
        {
          label: 'Hidrograma SCS',
          data: [
            0, 0.015, 0.075, 0.16, 0.28, 0.43, 0.6, 0.77, 0.89, 0.97,
            1.0, 0.98, 0.92, 0.84, 0.75, 0.65, 0.57, 0.43, 0.32, 0.24,
            0.18, 0.13, 0.098, 0.075, 0.036, 0.018, 0.009, 0.004
          ].map(val => (val * qp).toFixed(3)),
          borderColor: 'rgba(153,102,255,1)',
          fill: false,
        },
      ],
    };

    setChartData({
      triangular: triangularData,
      scs: scsData,
    });
  };

  const clearFields = () => {
    setInputValues({
      areaCuenca: '',
      longitudCauce: '',
      pendienteMedia: '',
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
      duracionExceso: '',
      tiempoPico: '',
      tiempoBase: '',
      caudalPico: '',
    });
    setChartData({
      triangular: null,
      scs: null,
    });
  };

  return (
    <div className="container mx-auto max-w-3xl p-4">
      {/* Contenedor Principal */}
      <div className="bg-white p-6 shadow-md rounded-lg border border-gray-300">
      <BackButton />

        {/* Encabezado */}
        <h1 className="text-2xl font-bold text-gray-800 text-center mb-6">
          Hidrograma Unitario de Máxima Crecida
        </h1>

        {/* Sección de Entrada de Datos y Resultados */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* Sección de Entrada de Datos */}
          <div className="bg-gray-50 p-6 rounded-lg shadow">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Entrada de Datos</h3>

            <div className="space-y-4">
              {[
                { label: "Área de la Cuenca (km²):", name: "areaCuenca", value: inputValues.areaCuenca },
                { label: "Longitud del Cauce (km):", name: "longitudCauce", value: inputValues.longitudCauce },
                { label: "Pendiente Media del Cauce (m/m):", name: "pendienteMedia", value: inputValues.pendienteMedia }
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
              onClick={calculate}
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
          </div>

          {/* Sección de Resultados */}
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


      {/* Contenedor Principal */}
      <div className="bg-white p-6 shadow-md rounded-lg border border-gray-300">

        {/* Sección de Parámetros */}
        <div className="bg-gray-50 p-6 rounded-lg shadow-md border border-gray-300">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Parámetros para la Construcción del Hidrograma
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              { label: "Tiempo de Retraso tr (h):", value: hidrogramaValues.tiempoRetraso },
              { label: "Duración en Exceso (h):", value: hidrogramaValues.duracionExceso },
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

          {/* Botón para Generar Hidrogramas */}
          <button
            onClick={generateHidrogramas}
            className="mt-6 w-full px-5 py-2 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-600 transition"
          >
            Generar Hidrogramas
          </button>
        </div>

        {/* Sección de Gráficos */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          {chartData.triangular && (
            <div className="bg-white p-6 rounded-lg shadow-md border border-gray-300">
              <h3 className="text-lg font-semibold text-gray-700 mb-2">Hidrograma Triangular</h3>
              <Line data={chartData.triangular} />
            </div>
          )}

          {chartData.scs && (
            <div className="bg-white p-6 rounded-lg shadow-md border border-gray-300">
              <h3 className="text-lg font-semibold text-gray-700 mb-2">Hidrograma SCS</h3>
              <Line data={chartData.scs} />
            </div>
          )}
        </div>

      </div>

    </div>
  );

};


export default HidrogramaUnitario;
