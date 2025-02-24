/* eslint-disable @next/next/no-img-element */
'use client';
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
  // Se guarda la información de las gráficas (triangular y SCS)
  const [chartData, setChartData] = useState(null);
  // Estado para el listado de resultados
  const [resultListing, setResultListing] = useState('');
  // Estado para mensajes de error
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setInputValues({
      ...inputValues,
      [e.target.name]: e.target.value,
    });
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
    const { areaCuenca, duracionEfectiva, precipitacionEfectiva } = inputValues;
    const A = parseFloat(areaCuenca);
    const Tc = parseFloat(resultValues.tiempoConcentracion);

    if (isNaN(A) || isNaN(Tc) || isNaN(parseFloat(duracionEfectiva)) || isNaN(parseFloat(precipitacionEfectiva))) {
      setError('Por favor, asegúrese de que todos los valores de entrada y el tiempo de concentración sean válidos.');
      return;
    }
    setError('');
    const tr = 0.6 * Tc;
    const tp = parseFloat(duracionEfectiva) / 2 + tr;
    const tb = 2.67 * tp;
    const qp = (0.208 * A) / tp;
    // Qpico se calcula utilizando la precipitación efectiva
    const Qpico = qp * parseFloat(precipitacionEfectiva);

    setHidrogramaValues({
      tiempoRetraso: roundToThree(tr),
      tiempoPico: roundToThree(tp),
      tiempoBase: roundToThree(tb),
      caudalPico: roundToThree(Qpico),
    });

    // Datos para el Hidrograma Triangular
    const triangularData = {
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

    // Datos para el Hidrograma SCS
    // Se utilizan los arreglos originales de factores adimensionales
    const t_tp = [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1.0, 1.1, 1.2, 1.3, 1.4, 1.5, 1.6, 1.8, 2.0, 2.2, 2.4, 2.6, 2.8, 3.0, 3.5, 4.0, 4.5, 5.0];
    const Q_Qp = [0, 0.015, 0.075, 0.16, 0.28, 0.43, 0.6, 0.77, 0.89, 0.97,
      1.0, 0.98, 0.92, 0.84, 0.75, 0.65, 0.57, 0.43, 0.32, 0.24,
      0.18, 0.13, 0.098, 0.075, 0.036, 0.018, 0.009, 0.004];
    const scsData = {
      labels: t_tp.map(val => roundToThree(val * tp)),
      datasets: [
        {
          label: 'Hidrograma SCS',
          data: Q_Qp.map(val => roundToThree(val * Qpico)),
          borderColor: 'rgba(153,102,255,1)',
          fill: false,
        },
      ],
    };

    setChartData({
      triangular: triangularData,
      scs: scsData,
    });

    // Generar el listado de resultados para el Hidrograma SCS
    let listing = "HIDROGRAMA SCS:\n\n";
    listing += "t (h)\t\tQ (m³/s/mm)\n";
    t_tp.forEach((factor, index) => {
      listing += `${roundToThree(factor * tp)}\t\t${roundToThree(Q_Qp[index] * Qpico)}\n`;
    });
    setResultListing(listing);
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
    setResultListing('');
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
    setResultListing('');
    setError('');
  };

  return (
    <div className="py-6 px-4">
      <BackButton />

      {/* Encabezado con botón de retroceso */}
      <div className="flex items-center gap-4 mb-6">
        <ArrowBackIosIcon
          className="cursor-pointer text-gray-600 hover:text-gray-800"
          onClick={() => window.history.back()}
        />
        <h1 className="text-2xl font-bold text-gray-800">
          Efecto de la precipitación efectiva en la tormenta
        </h1>
      </div>

      {/* Contenedor principal de Entrada, Resultados e Imagen */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6 bg-white border border-gray-300 rounded-lg shadow-md max-w-5xl mx-auto">
        {/* Entrada de Datos */}
        <div className="p-4 bg-gray-50 rounded-lg shadow">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">Entrada de Datos</h2>
          <div className="flex flex-col gap-4">
            <label className="text-gray-600">Área de la Cuenca (km²):</label>
            <input
              type="text"
              name="areaCuenca"
              value={inputValues.areaCuenca}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400"
            />
            <label className="text-gray-600">Longitud del Cauce (km):</label>
            <input
              type="text"
              name="longitudCauce"
              value={inputValues.longitudCauce}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400"
            />
            <label className="text-gray-600">Pendiente Media del Cauce (m/m):</label>
            <input
              type="text"
              name="pendienteMedia"
              value={inputValues.pendienteMedia}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400"
            />
            <label className="text-gray-600">Duración Efectiva (h):</label>
            <input
              type="text"
              name="duracionEfectiva"
              value={inputValues.duracionEfectiva}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400"
            />
            <label className="text-gray-600">Precipitación Efectiva (mm):</label>
            <input
              type="text"
              name="precipitacionEfectiva"
              value={inputValues.precipitacionEfectiva}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400"
            />
          </div>
          <button
            onClick={calcular}
            className="w-full mt-4 px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
          >
            Calcular
          </button>
          <div className="flex justify-between mt-4">
            <button
              onClick={fillExampleValues}
              className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
            >
              <CalculateIcon className="text-white" />
              <span>Ejemplo</span>
            </button>
            <button
              onClick={clearFields}
              className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
            >
              <DeleteIcon className="text-white" />
              <span>Limpiar</span>
            </button>
          </div>
          {error && <p className="text-red-500 text-center mt-4">{error}</p>}
        </div>

        {/* Resultados */}
        <div className="p-4 bg-gray-50 rounded-lg shadow">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">Resultados</h2>
          <div className="flex flex-col gap-3">
            <label className="text-gray-600">Fórmula de Kirpich (h):</label>
            <input type="text" value={resultValues.kirpich} readOnly className="w-full p-2 border border-gray-300 rounded-lg bg-gray-100" />
            <label className="text-gray-600">Fórmula Californiana del U.S.B.R (h):</label>
            <input type="text" value={resultValues.california} readOnly className="w-full p-2 border border-gray-300 rounded-lg bg-gray-100" />
            <label className="text-gray-600">Fórmula de Giandotti (h):</label>
            <input type="text" value={resultValues.giandotti} readOnly className="w-full p-2 border border-gray-300 rounded-lg bg-gray-100" />
            <label className="text-gray-600">Fórmula de Témez (h):</label>
            <input type="text" value={resultValues.temez} readOnly className="w-full p-2 border border-gray-300 rounded-lg bg-gray-100" />
            <label className="text-gray-600">Tiempo de Concentración Definitivo (h):</label>
            <input type="text" value={resultValues.tiempoConcentracion} readOnly className="w-full p-2 border border-gray-300 rounded-lg bg-gray-100" />
          </div>
        </div>

        {/* Imagen */}
        <div className="p-4 flex justify-center items-center bg-gray-50 rounded-lg shadow">
          <img src="/images/imagenguia.jpg" alt="Efecto de la precipitación" className="w-full" />
        </div>
      </div>

      {/* Sección de Parámetros y Gráficas */}
      <div className="grid grid-cols-1 gap-6 p-6 bg-white border border-gray-300 rounded-lg shadow-md max-w-5xl mx-auto">
        {/* Parámetros del Hidrograma */}
        <div className="p-4 bg-gray-50 rounded-lg shadow">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">Parámetros para la Construcción del Hidrograma</h2>
          <div className="flex flex-col gap-4">
            <label className="text-gray-600">Tiempo de Retraso tr (h):</label>
            <input
              type="text"
              value={hidrogramaValues.tiempoRetraso}
              readOnly
              className="w-full p-2 border border-gray-300 rounded-lg bg-gray-100"
            />
            <label className="text-gray-600">Tiempo Pico tp (h):</label>
            <input
              type="text"
              value={hidrogramaValues.tiempoPico}
              readOnly
              className="w-full p-2 border border-gray-300 rounded-lg bg-gray-100"
            />
            <label className="text-gray-600">Tiempo Base tb (h):</label>
            <input
              type="text"
              value={hidrogramaValues.tiempoBase}
              readOnly
              className="w-full p-2 border border-gray-300 rounded-lg bg-gray-100"
            />
            <label className="text-gray-600">Caudal Pico Qp (m³/s):</label>
            <input
              type="text"
              value={hidrogramaValues.caudalPico}
              readOnly
              className="w-full p-2 border border-gray-300 rounded-lg bg-gray-100"
            />
          </div>
          <button
            onClick={graficarHidrogramas}
            className="w-full mt-4 px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
          >
            Graficar Hidrogramas
          </button>
        </div>

        {/* Gráficas */}
        <div className="p-4">
          {chartData ? (
            <div className="grid grid-cols-1 gap-6">
              <div className="p-4 bg-white rounded-lg shadow">
                <h3 className="text-lg font-semibold text-gray-700 mb-4 text-center">Hidrograma Triangular</h3>
                <Line
                  data={chartData.triangular}
                  options={{
                    scales: {
                      x: { title: { display: true, text: 't (h)' } },
                      y: { title: { display: true, text: 'Q (m³/s)' } }
                    }
                  }}
                />
              </div>
              <div className="p-4 bg-white rounded-lg shadow">
                <h3 className="text-lg font-semibold text-gray-700 mb-4 text-center">Hidrograma SCS</h3>
                <Line
                  data={chartData.scs}
                  options={{
                    scales: {
                      x: { title: { display: true, text: 't (h)' } },
                      y: { title: { display: true, text: 'Q (m³/s/mm)' } }
                    }
                  }}
                />
              </div>
            </div>
          ) : (
            <p className="text-center text-gray-500">No hay datos para graficar.</p>
          )}
        </div>

        {/* Listado de Resultados */}
        {resultListing && (
          <div className="p-4 bg-gray-50 rounded-lg shadow border border-gray-300">
            <h3 className="text-lg font-semibold text-gray-700 mb-4 text-center">Listado de Resultados (Hidrograma SCS)</h3>
            <pre className="whitespace-pre-wrap text-gray-800">{resultListing}</pre>
          </div>
        )}
      </div>
    </div>
  );
};

export default EfectoPrecipitacion;
