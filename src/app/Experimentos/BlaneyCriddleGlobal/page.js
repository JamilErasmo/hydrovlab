'use client';
import React, { useState } from 'react';
import '../App.css';

const BlaneyCriddleGlobal = () => {
  const [latitud, setLatitud] = useState('');
  const [latitudValor, setLatitudValor] = useState('');
  const [cultivo, setCultivo] = useState('');
  const [ciclo, setCiclo] = useState([]);
  const [coeficiente, setCoeficiente] = useState([]);
  const [coeficienteSeleccionado, setCoeficienteSeleccionado] = useState('');
  const [mesSiembra, setMesSiembra] = useState('');
  const [zona, setZona] = useState('Normal');
  const [temperaturas, setTemperaturas] = useState({
    enero: '',
    febrero: '',
    marzo: '',
    abril: '',
    mayo: '',
    junio: '',
    julio: '',
    agosto: '',
    septiembre: '',
    octubre: '',
    noviembre: '',
    diciembre: '',
  });
  const [resultados, setResultados] = useState([]);
  const [totalFi, setTotalFi] = useState(0);
  const [zonaNormal, setZonaNormal] = useState(0);

  const cultivos = [
    { nombre: 'Aguacate', ciclos: [12], coeficientes: ['0.50 - 0.55'] },
    { nombre: 'Arroz', ciclos: [3, 5], coeficientes: ['1.00 - 1.20'] },
    { nombre: 'Caña de azucar', ciclos: [12], coeficientes: ['0.75 - 0.90'] },
    { nombre: 'Frijol', ciclos: [3, 4], coeficientes: ['0.60 - 0.70'] },
    { nombre: 'Maiz', ciclos: [4, 7], coeficientes: ['0.75 - 0.85'] },
  ];

  const handleTemperaturaChange = (event) => {
    const { name, value } = event.target;
    setTemperaturas((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleCultivoChange = (event) => {
    const cultivoSeleccionado = event.target.value;
    const cultivoData = cultivos.find((c) => c.nombre === cultivoSeleccionado);
    if (cultivoData) {
      setCultivo(cultivoSeleccionado);
      setCiclo(cultivoData.ciclos);
      setCoeficiente(cultivoData.coeficientes);
      setCoeficienteSeleccionado('');
    }
  };

  const calcularPi = (latitud, mes) => {
    const valoresPi = {
      abril: 8.62,
      mayo: 9.36,
      junio: 9.26,
      julio: 9.47,
      agosto: 9.09,
      septiembre: 8.32,
      octubre: 8.07,
    };
    return valoresPi[mes.toLowerCase()];
  };

  const calcularFi = (pi, temp) => {
    return pi * ((parseFloat(temp) + 17.8) / 21.8);
  };

  const calcularResultados = () => {
    const meses = ['abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre'];

    let totalFi = 0;

    const nuevosResultados = meses.map((mes) => {
      const pi = calcularPi(latitud, mes);
      const temp = temperaturas[mes];
      const fi = calcularFi(pi, temp);

      totalFi += fi;

      return {
        mes: mes.charAt(0).toUpperCase() + mes.slice(1),
        temperatura: temp,
        pi: pi.toFixed(2),
        fi: fi.toFixed(2),
      };
    });

    setTotalFi(totalFi.toFixed(2));
    setZonaNormal((totalFi * parseFloat(coeficienteSeleccionado)).toFixed(2));
    setResultados(nuevosResultados);
  };

  const cargarEjemplo = () => {
    setLatitud('Norte');
    setLatitudValor('25.5');
    setCultivo('Maiz');
    setCiclo([4, 7]);
    setCoeficiente(['0.75 - 0.85']);
    setMesSiembra('Abril');
    setTemperaturas({
      enero: '13',
      febrero: '15',
      marzo: '18',
      abril: '22',
      mayo: '25',
      junio: '27',
      julio: '26',
      agosto: '26',
      septiembre: '24',
      octubre: '21',
      noviembre: '16',
      diciembre: '12',
    });
    setZona('Normal');
  };

  const limpiarCampos = () => {
    setLatitud('');
    setLatitudValor('');
    setCultivo('');
    setCiclo([]);
    setCoeficiente([]);
    setCoeficienteSeleccionado('');
    setMesSiembra('');
    setTemperaturas({
      enero: '',
      febrero: '',
      marzo: '',
      abril: '',
      mayo: '',
      junio: '',
      julio: '',
      agosto: '',
      septiembre: '',
      octubre: '',
      noviembre: '',
      diciembre: '',
    });
    setZona('Normal');
    setResultados([]);
    setTotalFi(0);
    setZonaNormal(0);
  };

  return (
    <div className="app">
      <div className="content-wrapper">
        <div className="left-section">
          <h2 className="section-title">Configuración</h2>
          <div className="input-row">
            <label>Latitud:</label>
            <select
              className="input-field"
              value={latitud}
              onChange={(e) => setLatitud(e.target.value)}
            >
              <option value="">Seleccione la latitud</option>
              <option value="Norte">Norte</option>
              <option value="Sur">Sur</option>
            </select>
          </div>

          <div className="input-row">
            <label>Valor de Latitud:</label>
            <input
              className="input-field"
              type="number"
              value={latitudValor}
              onChange={(e) => setLatitudValor(e.target.value)}
              placeholder="Ingrese el valor de la latitud"
            />
          </div>

          <div className="input-row">
            <label>Cultivo:</label>
            <select
              className="input-field"
              value={cultivo}
              onChange={handleCultivoChange}
            >
              <option value="">Seleccione un cultivo</option>
              {cultivos.map((cultivo, index) => (
                <option key={index} value={cultivo.nombre}>
                  {cultivo.nombre}
                </option>
              ))}
            </select>
          </div>

          <div className="input-row">
            <label>Ciclo Vegetativo:</label>
            <select
              className="input-field"
              value={ciclo[0] || ''}
              onChange={(e) => setCiclo([e.target.value])}
            >
              <option value="">Seleccione el ciclo vegetativo</option>
              {Array.isArray(ciclo) &&
                ciclo.map((c, index) => (
                  <option key={index} value={c}>
                    {c}
                  </option>
                ))}
            </select>
          </div>

          <div className="input-row">
            <label>Coeficiente Global:</label>
            <select
              className="input-field"
              value={coeficienteSeleccionado}
              onChange={(e) => setCoeficienteSeleccionado(e.target.value)}
            >
              <option value="">Seleccione el coeficiente global</option>
              {Array.isArray(coeficiente) &&
                coeficiente.map((c, index) => (
                  <option key={index} value={c}>
                    {c}
                  </option>
                ))}
            </select>
          </div>
        </div>

        <div className="center-section">
          <h2 className="section-title">Temperaturas (°C)</h2>
          {Object.keys(temperaturas).map((mes) => (
            <div key={mes} className="input-row">
              <label>{mes.charAt(0).toUpperCase() + mes.slice(1)}:</label>
              <input
                className="input-field"
                type="number"
                name={mes}
                value={temperaturas[mes]}
                onChange={handleTemperaturaChange}
              />
            </div>
          ))}
        </div>
      </div>

      <div className="secondary-buttons">
        <button className="calculate-button" onClick={calcularResultados}>
          Calcular
        </button>
        <button className="example-button" onClick={cargarEjemplo}>
          Ejemplo
        </button>
        <button className="clear-button" onClick={limpiarCampos}>
          Limpiar
        </button>
      </div>

      {resultados.length > 0 && (
        <div className="results-section">
          <h2 className="section-title">Resultados</h2>
          <table className="results-table">
            <thead>
              <tr>
                <th>Mes</th>
                <th>Temperatura (°C)</th>
                <th>Pi</th>
                <th>Fi</th>
              </tr>
            </thead>
            <tbody>
              {resultados.map((resultado, index) => (
                <tr key={index}>
                  <td>{resultado.mes}</td>
                  <td>{resultado.temperatura}</td>
                  <td>{resultado.pi}</td>
                  <td>{resultado.fi}</td>
                </tr>
              ))}
              <tr>
                <td>TOTAL</td>
                <td>0</td>
                <td>0</td>
                <td>{totalFi}</td>
              </tr>
            </tbody>
          </table>
          <p className="results-summary">Zona normal: {zonaNormal}</p>
        </div>
      )}
    </div>
  );
};

export default BlaneyCriddleGlobal;
