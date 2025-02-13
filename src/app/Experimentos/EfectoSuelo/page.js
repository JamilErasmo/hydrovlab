'use client';
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

const EfectoSuelo = () => {
  // Estados para los valores de entrada y resultados
  const [inputValues, setInputValues] = useState({
    areaCuenca: '',
    tipoVegetacion: '',
    pendiente: '',
    precipitacion: '',
    tipoSuelo: '',
  });
  const [cnValues, setCnValues] = useState({
    CN1: '',
    CN2: '',
    CN3: '',
  });
  const [hidrogramaValues, setHidrogramaValues] = useState({
    tiempoRetraso: '',
    tiempoPico: '',
    tiempoBase: '',
    caudalPico: '',
  });
  const [chartData, setChartData] = useState({
    triangular: null,
    scs: null,
  });

  // Maneja los cambios en las casillas de entrada
  const handleChange = (e) => {
    const { name, value } = e.target;
    setInputValues({
      ...inputValues,
      [name]: value,
    });
  };

  // Calcula los valores de CN2, CN1 y CN3
  const calculateCN2 = () => {
    let CN_2 = 0;
    const { tipoVegetacion, pendiente, tipoSuelo } = inputValues;

    if (tipoVegetacion === '1') {
      if (pendiente === '>1%') {
        if (tipoSuelo === 'A') CN_2 = 72;
        if (tipoSuelo === 'B') CN_2 = 81;
        if (tipoSuelo === 'C') CN_2 = 88;
        if (tipoSuelo === 'D') CN_2 = 91;
      } else if (pendiente === '<1%') {
        if (tipoSuelo === 'A') CN_2 = 67;
        if (tipoSuelo === 'B') CN_2 = 78;
        if (tipoSuelo === 'C') CN_2 = 85;
        if (tipoSuelo === 'D') CN_2 = 89;
      }
    }
    return CN_2;
  };

  // Agrega un estado separado para el resultado general
  // eslint-disable-next-line no-unused-vars
  const [result, setResult] = useState('');

  // En la función 'calcular', asigna el valor del resultado a ese nuevo estado
  const calcular = () => {
    const CN_2 = calculateCN2();
    const CN_1 = (4.2 * CN_2) / (10 - 0.058 * CN_2);
    const CN_3 = (23 * CN_2) / (10 + 0.13 * CN_2);

    setCnValues({
      CN1: CN_1.toFixed(0),
      CN2: CN_2.toFixed(0),
      CN3: CN_3.toFixed(0),
    });

    const areaCuenca = parseFloat(inputValues.areaCuenca);
    const precipitacion = parseFloat(inputValues.precipitacion);
    const resultado = areaCuenca * precipitacion * CN_2 / 100;

    // Guardamos el resultado en el estado 'result'
    setResult(resultado.toFixed(3));
  };
  // Llena los valores de ejemplo
  const fillExampleValues = () => {
    setInputValues({
      areaCuenca: '30',
      tipoVegetacion: '1',
      pendiente: '>1%',
      precipitacion: '150',
      tipoSuelo: 'B',
    });
    setCnValues({
      CN1: '',
      CN2: '',
      CN3: '',
    });
    setHidrogramaValues({
      tiempoRetraso: '',
      tiempoPico: '',
      tiempoBase: '',
      caudalPico: '',
    });
    setChartData({
      triangular: null,
      scs: null,
    });
  };

  // Limpia todos los campos
  const clearFields = () => {
    setInputValues({
      areaCuenca: '',
      tipoVegetacion: '',
      pendiente: '',
      precipitacion: '',
      tipoSuelo: '',
    });
    setCnValues({
      CN1: '',
      CN2: '',
      CN3: '',
    });
    setHidrogramaValues({
      tiempoRetraso: '',
      tiempoPico: '',
      tiempoBase: '',
      caudalPico: '',
    });
    setChartData({
      triangular: null,
      scs: null,
    });
  };

  // Genera las gráficas de los hidrogramas
  const graficarHidrogramas = () => {
    const Tc = parseFloat(cnValues.CN2);
    if (!Tc || isNaN(Tc)) {
      alert("Por favor, asegúrate de que los datos están completos.");
      return;
    }

    const tr = 0.6 * Tc;
    const tp = (2 * Math.sqrt(Tc)) / 2 + tr;
    const tb = 2.67 * tp;
    const qp = (0.208 * parseFloat(inputValues.areaCuenca)) / tp;
    const Qpico = qp * parseFloat(inputValues.precipitacion);

    // Actualiza solo el valor de caudalPico en hidrogramaValues
    setHidrogramaValues((prevValues) => ({
      ...prevValues,
      tiempoRetraso: tr.toFixed(3),
      tiempoPico: tp.toFixed(3),
      tiempoBase: tb.toFixed(3),
      caudalPico: Qpico.toFixed(3), // Solo aquí actualiza el caudal pico
    }));

    // Generación de datos para las gráficas
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

    // Actualiza los datos del gráfico
    setChartData({
      triangular: triangularData,
      scs: scsData,
    });
  };


  return (
    <div className="app">
      <ArrowBackIosIcon
        className="text-gray-600 cursor-pointer hover:text-gray-800 transition"
        onClick={() => window.history.back()}
      />
      <h1 className="text-2xl font-bold text-gray-800">
        Efecto del Uso del Suelo en la Tormenta
      </h1>
      {/* Contenedor principal */}
      <div className="bg-white p-6 shadow-md rounded-lg border border-gray-300">

        {/* Título */}
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Entrada de Datos</h2>

        {/* Contenedor de Inputs */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Área de la Cuenca */}
          <div className="flex flex-col">
            <label className="text-gray-700 font-medium">Área de la Cuenca (km²):</label>
            <input
              type="text"
              name="areaCuenca"
              value={inputValues.areaCuenca}
              onChange={handleChange}
              className="w-full p-2 mt-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
            />
          </div>

          {/* Tipo de Vegetación */}
          <div className="flex flex-col">
            <label className="text-gray-700 font-medium">Tipo de Vegetación:</label>
            <select
              name="tipoVegetacion"
              value={inputValues.tipoVegetacion}
              onChange={handleChange}
              className="w-full p-2 mt-1 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
            >
              <option value="" disabled hidden>Seleccione una opción</option>
              <option value="1">Cultivos en Surcos</option>
              <option value="2">Cereales</option>
              <option value="3">Leguminosas</option>
            </select>
          </div>

          {/* Pendiente */}
          <div className="flex flex-col">
            <label className="text-gray-700 font-medium">Pendiente:</label>
            <select
              name="pendiente"
              value={inputValues.pendiente}
              onChange={handleChange}
              className="w-full p-2 mt-1 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
            >
              <option value="" disabled hidden>Seleccione una opción</option>
              <option value=">1%">Mayor a 1%</option>
              <option value="<1%">Menor a 1%</option>
            </select>
          </div>

          {/* Tipo de Suelo */}
          <div className="flex flex-col">
            <label className="text-gray-700 font-medium">Tipo de Suelo:</label>
            <select
              name="tipoSuelo"
              value={inputValues.tipoSuelo}
              onChange={handleChange}
              className="w-full p-2 mt-1 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
            >
              <option value="" disabled hidden>Seleccione una opción</option>
              <option value="A">A</option>
              <option value="B">B</option>
              <option value="C">C</option>
              <option value="D">D</option>
            </select>
          </div>

          {/* Precipitación */}
          <div className="flex flex-col">
            <label className="text-gray-700 font-medium">Precipitación (mm):</label>
            <input
              type="text"
              name="precipitacion"
              value={inputValues.precipitacion}
              onChange={handleChange}
              className="w-full p-2 mt-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
            />
          </div>
        </div>

        {/* Botonera */}
        <div className="mt-6 flex justify-between">
          <button
            onClick={calcular}
            className="px-5 py-2 bg-green-500 text-white font-semibold rounded-lg shadow-md hover:bg-green-600 transition"
          >
            Calcular
          </button>

          <div className="flex space-x-4">
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
        <div className="bg-white p-6 shadow-md rounded-lg border border-gray-300 mt-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Resultados</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Valores CN1, CN2 y CN3 */}
            {[
              { label: "CN1", value: cnValues.CN1 },
              { label: "CN2", value: cnValues.CN2 },
              { label: "CN3", value: cnValues.CN3 },
              { label: "Resultado", value: result }
            ].map((item, index) => (
              <div key={index} className="flex flex-col">
                <label className="text-gray-700 font-medium">{item.label}:</label>
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


        <div className="right-section">
          {/* Aquí puedes agregar una imagen guía si es necesario */}
        </div>
      </div>

      {/* Contenedor Principal */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white p-6 shadow-md rounded-lg border border-gray-300">

        {/* Sección de Parámetros */}
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

          {/* Botón para Graficar */}
          <button
            onClick={graficarHidrogramas}
            className="mt-6 px-5 py-2 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-600 transition w-full"
          >
            Graficar Hidrogramas
          </button>
        </div>

        {/* Sección de Gráficos */}
        <div className="flex flex-col gap-6">
          {chartData.triangular && (
            <div className="bg-white p-4 shadow rounded-lg">
              <h3 className="text-lg font-semibold text-gray-700 mb-2">Hidrograma Triangular</h3>
              <Line data={chartData.triangular} />
            </div>
          )}

          {chartData.scs && (
            <div className="bg-white p-4 shadow rounded-lg">
              <h3 className="text-lg font-semibold text-gray-700 mb-2">Hidrograma SCS</h3>
              <Line data={chartData.scs} />
            </div>
          )}
        </div>

      </div>

    </div>
  );
};

// Barra de navegación
const NavBar = () => (
  <nav className="navbar">
    <img src={logo} alt="Logo" className="logo" />
    <div className="menu" id="menu">
      <a href="#bienvenida" className="menu-item">Bienvenida</a>
      <a href="#laboratorios" className="menu-item">Laboratorios</a>
      <a href="#blog" className="menu-item">Blog Técnicos</a>
      <a href="#equipo" className="menu-item">Equipo</a>
      <a href="#recursos" className="menu-item">Recursos Académicos</a>
      <a href="#investigacion" className="menu-item">Investigación</a>
      <a href="#usuario" className="menu-item">lmgranda4</a>
    </div>
  </nav>
);

export default EfectoSuelo;
