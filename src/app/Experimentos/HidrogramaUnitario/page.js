'use client';
import React, { useState } from 'react';
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
  const [listing, setListing] = useState('');

  // Función para redondear a tres decimales
  const roundToThree = (num) => Math.round(num * 1000) / 1000;

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

    // Generación del Hidrograma Triangular con interpolación lineal (101 puntos)
    const numPointsTri = 101;
    const triangularLabels = Array.from({ length: numPointsTri }, (_, i) =>
      roundToThree((i * tb) / (numPointsTri - 1))
    );
    const triangularDataValues = triangularLabels.map((t) => {
      if (t <= tp) {
        return roundToThree((qp / tp) * t);
      } else {
        return roundToThree((qp / (tb - tp)) * (tb - t));
      }
    });
    const triangularData = {
      labels: triangularLabels.map((val) => val.toFixed(3)),
      datasets: [
        {
          label: 'Hidrograma Triangular',
          data: triangularDataValues,
          borderColor: 'rgba(75,192,192,1)',
          fill: false,
        },
      ],
    };

    // Datos para el gráfico SCS basados en la versión original
    const t_tp = [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1.0, 1.1, 1.2, 1.3, 1.4, 1.5, 1.6, 1.8, 2.0, 2.2, 2.4, 2.6, 2.8, 3.0, 3.5, 4.0, 4.5, 5.0];
    const Q_Qp = [0, 0.015, 0.075, 0.16, 0.28, 0.43, 0.6, 0.77, 0.89, 0.97,
                  1.0, 0.98, 0.92, 0.84, 0.75, 0.65, 0.57, 0.43, 0.32, 0.24,
                  0.18, 0.13, 0.098, 0.075, 0.036, 0.018, 0.009, 0.004];

    const scsLabels = t_tp.map((val) => (val * tp).toFixed(3));
    const scsDataValues = Q_Qp.map((val) => (val * qp).toFixed(3));

    const scsData = {
      labels: scsLabels,
      datasets: [
        {
          label: 'Hidrograma SCS',
          data: scsDataValues,
          borderColor: 'rgba(153,102,255,1)',
          fill: false,
        },
      ],
    };

    setChartData({
      triangular: triangularData,
      scs: scsData,
    });

    // Generar listado de resultados (pares t y Q del gráfico SCS)
    let listingText = "HIDROGRAMA UNITARIO DE MÁXIMA CRECIDA\n\n";
    listingText += "Hidrograma SCS:\n\n";
    listingText += "t(h)\t\tQ(m³/s/mm)\n";
    for (let i = 0; i < scsLabels.length; i++) {
      listingText += `${scsLabels[i]}\t\t${scsDataValues[i]}\n`;
    }
    setListing(listingText);
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
    setListing('');
  };

  return (
    <div className="container mx-auto max-w-5xl p-4">
      {/* Encabezado centrado sin la flecha */}
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">
          Hidrograma Unitario de Máxima Crecidad
        </h1>
      </div>

      {/* Sección de Entrada de Datos, Resultados e Imagen */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6 bg-white border border-gray-300 rounded-lg shadow-md mx-auto">
        {/* Entrada de Datos */}
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
          <button
            onClick={calculate}
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

        {/* Imagen */}
        <div className="p-6 flex justify-center items-center bg-gray-50 rounded-lg shadow">
          <img src="/images/imagenguia.jpg" alt="Efecto de la precipitación" className="w-full" />
        </div>
      </div>

      {/* Contenedor de Parámetros y Gráficos */}
      <div className="bg-white p-6 shadow-md rounded-lg border border-gray-300 mt-6 mx-auto">
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
          <button
            onClick={generateHidrogramas}
            className="mt-6 w-full px-5 py-2 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-600 transition"
          >
            Generar Hidrogramas
          </button>
        </div>

        {/* Sección de Gráficos (en una sola columna) */}
        <div className="mt-6 grid grid-cols-1 gap-6">
          {chartData.triangular && (
            <div className="bg-white p-6 rounded-lg shadow-md border border-gray-300">
              <h3 className="text-lg font-semibold text-gray-700 mb-2">Hidrograma Triangular</h3>
              <Line
                data={chartData.triangular}
                options={{
                  scales: {
                    x: { title: { display: true, text: 't (h)' } },
                    y: { title: { display: true, text: 'Q (m³/s)' } },
                  },
                }}
              />
            </div>
          )}
          {chartData.scs && (
            <div className="bg-white p-6 rounded-lg shadow-md border border-gray-300">
              <h3 className="text-lg font-semibold text-gray-700 mb-2">Hidrograma SCS</h3>
              <Line
                data={chartData.scs}
                options={{
                  scales: {
                    x: { title: { display: true, text: 't (h)' } },
                    y: { title: { display: true, text: 'Q (m³/s/mm)' } },
                  },
                }}
              />
            </div>
          )}
        </div>
      </div>

      {/* Sección del Listado de Resultados */}
      {listing && (
        <div className="mt-6 bg-gray-50 p-4 rounded-lg shadow border border-gray-300">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Listado de Resultados</h3>
          <pre className="whitespace-pre-wrap text-gray-800">{listing}</pre>
        </div>
      )}
    </div>
  );
};

export default HidrogramaUnitario;
