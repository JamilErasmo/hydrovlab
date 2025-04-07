'use client'
import React, { useState } from 'react';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import CalculateIcon from '@mui/icons-material/Calculate';
import DeleteIcon from '@mui/icons-material/Delete';
// import logo from '../../assets/images/logo.png';
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
import './App.css';

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
    <div className="app">
      <div className="experiment-header">
        {/* <ArrowBackIosIcon className="back-arrow" onClick={() => window.history.back()} /> */}
        {/* <h1 className="experiment-title">Efecto de la Precipitación en la Tormenta</h1> */}
      </div>

      <div className="content-wrapper">
        <div className="left-section">
          <h2 className="section-title">Entrada de Datos</h2>X
          <div className="input-section">
            <label>Área de la Cuenca (km²):</label>
            <input type="text" name="areaCuenca" value={inputValues.areaCuenca} onChange={handleChange} />

            <label>Longitud del Cauce (km):</label>
            <input type="text" name="longitudCauce" value={inputValues.longitudCauce} onChange={handleChange} />

            <label>Pendiente Media del Cauce (m/m):</label>
            <input type="text" name="pendienteMedia" value={inputValues.pendienteMedia} onChange={handleChange} />

            <label>Duración Efectiva (h):</label>
            <input type="text" name="duracionEfectiva" value={inputValues.duracionEfectiva} onChange={handleChange} />

            <label>Precipitación Efectiva (mm):</label>
            <input type="text" name="precipitacionEfectiva" value={inputValues.precipitacionEfectiva} onChange={handleChange} />

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
          {chartData && (
            <div className="chart-section">
              <h3 className="chart-title">Hidrograma Triangular</h3>
              <Line data={chartData} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Barra de navegación

export default EfectoPrecipitacion;
