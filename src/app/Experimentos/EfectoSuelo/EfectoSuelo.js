import React, { useState } from 'react';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import CalculateIcon from '@mui/icons-material/Calculate';
import DeleteIcon from '@mui/icons-material/Delete';
import logo from '../../assets/images/logo.png';
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
import '../../App.css';

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
      <NavBar />
      <div className="experiment-header">
        <ArrowBackIosIcon className="back-arrow" onClick={() => window.history.back()} />
        <h1 className="experiment-title">Efecto del Uso del Suelo en la Tormenta</h1>
      </div>

      <div className="content-wrapper">
        <div className="left-section">
          <h2 className="section-title">Entrada de Datos</h2>
          <div className="input-section">
            <label>Área de la Cuenca (km²):</label>
            <input type="text" name="areaCuenca" value={inputValues.areaCuenca} onChange={handleChange} />

            <label>Tipo de Vegetación:</label>
            <select name="tipoVegetacion" value={inputValues.tipoVegetacion} onChange={handleChange}>
              <option value="" disabled hidden>
                Seleccione una opción
              </option>
              <option value="1">Cultivos en Surcos</option>
              <option value="2">Cereales</option>
              <option value="3">Leguminosas</option>
              {/* Más opciones */}
            </select>

            <label>Pendiente:</label>
            <select name="pendiente" value={inputValues.pendiente} onChange={handleChange}>
              <option value="" disabled hidden>
                Seleccione una opción
              </option>
              <option value=">1%">Mayor a 1%</option>
              <option value="<1%">Menor a 1%</option>
            </select>

            <label>Tipo de Suelo:</label>
            <select name="tipoSuelo" value={inputValues.tipoSuelo} onChange={handleChange}>
              <option value="" disabled hidden>
                Seleccione una opción
              </option>
              <option value="A">A</option>
              <option value="B">B</option>
              <option value="C">C</option>
              <option value="D">D</option>
            </select>

            <label>Precipitación (mm):</label>
            <input type="text" name="precipitacion" value={inputValues.precipitacion} onChange={handleChange} />

            <button className="calculate-button" onClick={calcular}>Calcular</button>
            <div className="secondary-buttons">
              <button className="example-button" onClick={fillExampleValues}>
                <CalculateIcon className="button-icon" />
                <span className="button-text">Ejemplo</span>
              </button>
              <button className="clear-button" onClick={clearFields}>
                <DeleteIcon className="button-icon" />
                <span className="button-text">Limpiar</span>
              </button>
            </div>
          </div>
        </div>

        <div className="center-section">
          <h2 className="section-title">Resultados</h2>
          <div className="results-section">
            <h2>Resultados</h2>
            <label>CN1:</label>
            <input type="text" value={cnValues.CN1} readOnly />
            <label>CN2:</label>
            <input type="text" value={cnValues.CN2} readOnly />
            <label>CN3:</label>
            <input type="text" value={cnValues.CN3} readOnly />

            {/* Aquí mostramos el resultado general */}
            <label>Resultado:</label>
            <input type="text" value={result} readOnly />
          </div>
        </div>

        <div className="right-section">
          {/* Aquí puedes agregar una imagen guía si es necesario */}
        </div>
      </div>

      <div className="parameters-and-charts-wrapper">
        <div className="parameters-section">
          <h2 className="section-title">Parámetros para la Construcción del Hidrograma</h2>
          <div className="hidrograma-section">
            <label className="parameter-label">Tiempo de Retraso tr (h):</label>
            <input type="text" className="parameter-input" value={hidrogramaValues.tiempoRetraso} readOnly />

            <label className="parameter-label">Tiempo Pico tp (h):</label>
            <input type="text" className="parameter-input" value={hidrogramaValues.tiempoPico} readOnly />

            <label className="parameter-label">Tiempo Base tb (h):</label>
            <input type="text" className="parameter-input" value={hidrogramaValues.tiempoBase} readOnly />

            <label className="parameter-label">Caudal Pico Qp (m³/s):</label>
            <input type="text" className="parameter-input" value={hidrogramaValues.caudalPico} readOnly />
            <button className="generate-button" onClick={graficarHidrogramas}>Graficar Hidrogramas</button>
          </div>
        </div>

        <div className="chart-wrapper">
          {chartData.triangular && (
            <div className="chart-section">
              <h3 className="chart-title">Hidrograma Triangular</h3>
              <Line data={chartData.triangular} />
            </div>
          )}
          {chartData.scs && (
            <div className="chart-section">
              <h3 className="chart-title">Hidrograma SCS</h3>
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
