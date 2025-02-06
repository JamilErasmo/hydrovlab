'use client';
import React, { useState } from 'react';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import CalculateIcon from '@mui/icons-material/Calculate';
import DeleteIcon from '@mui/icons-material/Delete';
import logo from '../../assets/images/logo.png';
import hidrogramaUnitarioImg from '../../assets/images/lluviaEscorrentia4.png';
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
    <div className="app">
      <NavBar />
      <div className="experiment-header">
        <ArrowBackIosIcon className="back-arrow" onClick={() => window.history.back()} />
        <h1 className="experiment-title">Hidrograma Unitario de Máxima Crecida</h1>
      </div>

      <div className="content-wrapper">
        <div className="left-section">
          <h2 className="section-title">Entrada de Datos</h2>
          <div className="input-section">
            <label>Área de la Cuenca (km²):</label>
            <input type="text" name="areaCuenca" value={inputValues.areaCuenca} onChange={handleChange} />

            <label>Longitud del Cauce (km):</label>
            <input type="text" name="longitudCauce" value={inputValues.longitudCauce} onChange={handleChange} />

            <label>Pendiente Media del Cauce (m/m):</label>
            <input type="text" name="pendienteMedia" value={inputValues.pendienteMedia} onChange={handleChange} />

            <button className="calculate-button" onClick={calculate}>Calcular</button>

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
        </div> {/* Cierre de left-section */}

        <div className="center-section">
          <h2 className="section-title">Resultados</h2>
          <div className="results-section">
            <label>Fórmula de Kirpich (h):</label>
            <input type="text" value={resultValues.kirpich} readOnly />
            <label>Fórmula Californiana del U.S.B.R (h):</label>
            <input type="text" value={resultValues.california} readOnly />
            <label>Fórmula de Giandotti (h):</label>
            <input type="text" value={resultValues.giandotti} readOnly />
            <label>Fórmula de Témez (h):</label>
            <input type="text" value={resultValues.temez} readOnly />
            <label>Tiempo de Concentración Definitivo (h):</label>
            <input type="text" value={resultValues.tiempoConcentracion} readOnly />
          </div>
        </div> {/* Cierre de center-section */}

        <div className="right-section">
          <img src={hidrogramaUnitarioImg} alt="Guía del Experimento" className="guide-image" />
        </div> {/* Cierre de right-section */}
      </div> {/* Cierre de content-wrapper */}

      <div className="parameters-and-charts-wrapper">
        <div className="parameters-section">
          <h2 className="section-title">Parámetros para la Construcción del Hidrograma</h2>
          <div className="hidrograma-section">
            <label>Tiempo de Retraso tr (h):</label>
            <input type="text" value={hidrogramaValues.tiempoRetraso} readOnly />
            <label>Duración en Exceso de (h):</label>
            <input type="text" value={hidrogramaValues.duracionExceso} readOnly />
            <label>Tiempo Pico tp (h):</label>
            <input type="text" value={hidrogramaValues.tiempoPico} readOnly />
            <label>Tiempo Base tb (h):</label>
            <input type="text" value={hidrogramaValues.tiempoBase} readOnly />
            <label>Caudal Pico Qp (m³/s):</label>
            <input type="text" value={hidrogramaValues.caudalPico} readOnly />
            <button className="generate-button" onClick={generateHidrogramas}>Generar Hidrogramas</button>
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
      </div> {/* Cierre de parameters-and-charts-wrapper */}
    </div>
  );

};

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

export default HidrogramaUnitario;
