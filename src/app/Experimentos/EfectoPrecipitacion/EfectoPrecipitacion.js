import React, { useState } from 'react';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
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

  const handleChange = (e) => {
    setInputValues({
      ...inputValues,
      [e.target.name]: e.target.value,
    });
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
      alert('Por favor, ingrese valores numéricos válidos.');
      return;
    }

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
      alert('Por favor, asegúrese de que todos los valores de entrada y el tiempo de concentración sean válidos.');
      return;
    }

    const tr = 0.6 * Tc;
    const tp = inputValues.duracionEfectiva / 2 + tr;
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
  };

  return (
    <div className="py-6 px-4">

      {/* Encabezado con botón de retroceso */}
      <div className="flex items-center gap-4 mb-6">
        <ArrowBackIosIcon
          className="cursor-pointer text-gray-600 hover:text-gray-800"
          onClick={() => window.history.back()}
        />
        <h1 className="text-2xl font-bold text-gray-800">Efecto de la Precipitación en la Tormenta</h1>
      </div>

      {/* Contenedor principal con 3 columnas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6 bg-white border border-gray-300 rounded-lg shadow-md max-w-5xl mx-auto">

        {/* Sección de Entrada de Datos */}
        <div className="p-4 bg-gray-50 rounded-lg shadow">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">Entrada de Datos</h2>

          {/* Campos de Entrada */}
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

          {/* Botón de Calcular */}
          <button
            onClick={calcular}
            className="w-full mt-4 px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
          >
            Calcular
          </button>

          {/* Botones Secundarios */}
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
        </div>

        {/* Sección de Resultados */}
        <div className="p-4 bg-gray-50 rounded-lg shadow">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">Resultados</h2>

          {/* Resultados Calculados */}
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

        {/* Sección de Imagen o Espacio Adicional */}
        <div className="p-4 flex justify-center items-center bg-gray-50 rounded-lg shadow">
          <p className="text-gray-500 text-center">Aquí puedes agregar una imagen guía si es necesario.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 bg-white border border-gray-300 rounded-lg shadow-md max-w-5xl mx-auto">

        {/* 📌 Sección de Parámetros */}
        <div className="p-4 bg-gray-50 rounded-lg shadow">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">Parámetros para la Construcción del Hidrograma</h2>

          {/* Entradas de Parámetros */}
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

          {/* Botón de Graficar */}
          <button
            onClick={graficarHidrogramas}
            className="w-full mt-4 px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
          >
            Graficar Hidrogramas
          </button>
        </div>

        {/* 📌 Sección del Gráfico */}
        <div className="p-4 bg-white rounded-lg shadow">
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
