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

// Opciones para mostrar los nombres en los ejes
const chartOptions = {
  scales: {
    x: {
      title: {
        display: true,
        text: "t (h)"
      }
    },
    y: {
      title: {
        display: true,
        text: "Q (m³/s)"
      }
    }
  }
};

const EfectoPrecipitacion = () => {
  const [inputValues, setInputValues] = useState({
    areaCuenca: '',
    longitudCauce: '',
    pendienteMedia: '',
    duracionEfectiva: '',
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
  const [chartData, setChartData] = useState(null); // Hidrograma Triangular
  const [chartDataAdim, setChartDataAdim] = useState(null); // Hidrograma Adimensional
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
    // Cálculos según las fórmulas
    const kirpich = (3.97 * Math.pow(L, 0.77) * Math.pow(J, -0.385)) / 60;
    const california = 0.066 * Math.pow(L / Math.pow(J, 0.5), 0.77);
    const giandotti = (4 * Math.sqrt(A) + 1.5 * L) / (25.3 * Math.sqrt(J * L));
    const temez = 0.3 * Math.pow(L / Math.pow(J, 0.25), 0.77);

    const kirpichRounded = roundToThree(kirpich);
    const californiaRounded = roundToThree(california);
    const giandottiRounded = roundToThree(giandotti);
    const temezRounded = roundToThree(temez);
    // Tiempo de concentración definitivo según especificación (Kirpich)
    const tiempoConcentracion = kirpichRounded;

    setResultValues({
      kirpich: kirpichRounded,
      california: californiaRounded,
      giandotti: giandottiRounded,
      temez: temezRounded,
      tiempoConcentracion: roundToThree(tiempoConcentracion),
    });
  };

  const graficarHidrogramas = () => {
    const { areaCuenca, duracionEfectiva } = inputValues;
    const A = parseFloat(areaCuenca);
    const Tc = parseFloat(resultValues.tiempoConcentracion);
    const de = parseFloat(duracionEfectiva);

    if (isNaN(A) || isNaN(Tc) || isNaN(de)) {
      setError('Por favor, asegúrese de que todos los valores de entrada y el tiempo de concentración sean válidos.');
      return;
    }
    setError('');
    // Parámetros del hidrograma
    const tr = 0.6 * Tc;
    const tp = de / 2 + tr;
    const tb = 2.67 * tp;
    const qp = (0.208 * A) / tp;
    // Se usa Pe = 100 (valor fijo) para el cálculo de Qpico
    const Qpico = qp * 100;

    setHidrogramaValues({
      tiempoRetraso: roundToThree(tr),
      tiempoPico: roundToThree(tp),
      tiempoBase: roundToThree(tb),
      caudalPico: roundToThree(Qpico),
    });

    // Hidrograma Triangular (interpolación lineal entre 0, tp y tb)
    const numPointsTri = 101;
    const triangularLabels = Array.from({ length: numPointsTri }, (_, i) => roundToThree(i * tb / (numPointsTri - 1)));
    const triangularData = triangularLabels.map(t => {
      if (t <= tp) {
        return roundToThree((Qpico / tp) * t);
      } else {
        return roundToThree((Qpico / (tb - tp)) * (tb - t));
      }
    });

    const triangularChart = {
      labels: triangularLabels,
      datasets: [
        {
          label: 'Hidrograma Triangular',
          data: triangularData,
          borderColor: 'rgba(75,192,192,1)',
          fill: false,
        },
      ],
    };

    setChartData(triangularChart);

    // Hidrograma Adimensional usando los arrays predefinidos
    const t_tp = [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1.0,
                  1.1, 1.2, 1.3, 1.4, 1.5, 1.6, 1.8, 2.0,
                  2.2, 2.4, 2.6, 2.8, 3.0, 3.5, 4.0, 4.5, 5.0];
    const Q_Qp = [0, 0.015, 0.075, 0.16, 0.28, 0.43, 0.6, 0.77, 0.89, 0.97, 1.0,
                  0.98, 0.92, 0.84, 0.75, 0.65, 0.57, 0.43, 0.32, 0.24, 0.18,
                  0.13, 0.098, 0.075, 0.036, 0.018, 0.009, 0.004];

    const adimensionalLabels = t_tp.map(val => roundToThree(val * tp));
    const adimensionalData = Q_Qp.map(val => roundToThree(val * Qpico));

    const adimensionalChart = {
      labels: adimensionalLabels,
      datasets: [
        {
          label: 'Hidrograma Adimensional',
          data: adimensionalData,
          borderColor: 'rgba(255,99,132,1)',
          fill: false,
        },
      ],
    };

    setChartDataAdim(adimensionalChart);
  };

  const fillExampleValues = () => {
    // Valores de ejemplo corregidos
    setInputValues({
      areaCuenca: '20',
      longitudCauce: '7',
      pendienteMedia: '0.015',
      duracionEfectiva: '2.44',
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
    setChartDataAdim(null);
    setError('');
  };

  const clearFields = () => {
    setInputValues({
      areaCuenca: '',
      longitudCauce: '',
      pendienteMedia: '',
      duracionEfectiva: '',
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
    setChartDataAdim(null);
    setError('');
  };

  return (
    <div className="container mx-auto p-4">
      <BackButton />
      {/* Título del Experimento */}
      <div className="flex items-center gap-4 mb-6">
        <ArrowBackIosIcon 
          className="cursor-pointer text-gray-600 hover:text-gray-800" 
          onClick={() => window.history.back()} 
        />
        <h1 className="text-2xl font-bold text-gray-800">
          Efecto de la duración en la tormenta
        </h1>
      </div>

      {/* Sección de Entrada, Resultados e Imagen */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6 bg-white border border-gray-300 rounded-lg shadow-md max-w-5xl mx-auto">
        {/* Entrada de Datos */}
        <div className="bg-gray-50 p-6 rounded-lg shadow">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Entrada de Datos</h3>
          <div className="space-y-4">
            {[
              { label: "Área de la Cuenca (km²):", name: "areaCuenca", value: inputValues.areaCuenca },
              { label: "Longitud del Cauce (km):", name: "longitudCauce", value: inputValues.longitudCauce },
              { label: "Pendiente Media del Cauce (m/m):", name: "pendienteMedia", value: inputValues.pendienteMedia },
              { label: "Duración Efectiva (h):", name: "duracionEfectiva", value: inputValues.duracionEfectiva }
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
          <button
            onClick={calcular}
            className="mt-6 w-full px-5 py-2 bg-green-500 text-white font-semibold rounded-lg shadow-md hover:bg-green-600 transition"
          >
            Calcular
          </button>
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
          {error && <p className="text-red-500 text-left mt-4">{error}</p>}
        </div>

        {/* Resultados de los cálculos */}
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
                <label className="text-gray-700 font-medium text-left">{item.label}</label>
                <input
                  type="text"
                  value={item.value}
                  readOnly
                  className="w-full p-2 mt-1 border border-gray-300 rounded-lg bg-gray-100"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Imagen */}
        <div className="p-6 flex justify-center items-center bg-gray-50 rounded-lg shadow">
          <img src="/images/imagenguia.jpg" alt="Efecto de la precipitación" className="w-full" />
        </div>
      </div>

      {/* Sección de Parámetros y Gráficas (en una sola columna) */}
      <div className="grid grid-cols-1 gap-6 bg-white p-6 border border-gray-300 rounded-lg shadow-md max-w-5xl mx-auto mt-6">
        {/* Parámetros para el Hidrograma */}
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
                <label className="text-gray-700 font-medium text-left">{item.label}</label>
                <input
                  type="text"
                  value={item.value}
                  readOnly
                  className="w-full p-2 mt-1 border border-gray-300 rounded-lg bg-gray-100"
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

        {/* Gráficas de Hidrogramas */}
        <div className="bg-white p-6 rounded-lg shadow space-y-6">
          {chartData ? (
            <div>
              <h3 className="text-lg font-semibold text-gray-700 mb-4 text-left">Hidrograma Triangular</h3>
              <Line data={chartData} options={chartOptions} />
            </div>
          ) : (
            <p className="text-left text-gray-500">No hay datos para graficar el Hidrograma Triangular.</p>
          )}
          {chartDataAdim ? (
            <div>
              <h3 className="text-lg font-semibold text-gray-700 mb-4 text-left">Hidrograma Adimensional</h3>
              <Line data={chartDataAdim} options={chartOptions} />
            </div>
          ) : (
            <p className="text-left text-gray-500">No hay datos para graficar el Hidrograma Adimensional.</p>
          )}
        </div>
      </div>

      {/* Datos Finales y Tabla del Hidrograma del S.C.S */}
      {chartDataAdim && (
        <div className="bg-white p-6 mt-6 rounded-lg shadow-md border border-gray-300">
          <h3 className="text-xl font-semibold text-gray-800 mb-4 text-left">HIDROGRAMA DEL S.C.S</h3>
          <div className="text-left font-medium mb-4">
            EFECTO DE LA DURACIÓN EN LA TORMENTA
          </div>
          <div className="mb-4 text-left">
            <p>de(h)= {inputValues.duracionEfectiva}</p>
            <p>tp(h)= {hidrogramaValues.tiempoPico}</p>
            <p>tb(h)= {hidrogramaValues.tiempoBase}</p>
            <p>Qp(m³/s)= {hidrogramaValues.caudalPico}</p>
          </div>
          <table className="min-w-full text-left">
            <thead>
              <tr>
                <th className="px-4 py-2 border">t(h)</th>
                <th className="px-4 py-2 border">Q(m³/s)</th>
              </tr>
            </thead>
            <tbody>
              {chartDataAdim.labels.map((label, index) => (
                <tr key={index}>
                  <td className="px-4 py-2 border">{label}</td>
                  <td className="px-4 py-2 border">{chartDataAdim.datasets[0].data[index]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default EfectoPrecipitacion;
