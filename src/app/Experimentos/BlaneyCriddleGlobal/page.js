'use client'
import React, { useState } from 'react';

import '../App.css';

const BlaneyCriddleGlobal = () => {
  const [latitud, setLatitud] = useState('');
  const [latitudValor, setLatitudValor] = useState('');
  const [cultivo, setCultivo] = useState('');
  const [ciclo, setCiclo] = useState([]); // Inicializar como un array vacío
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

  // Lista de cultivos con ciclos y coeficientes globales
  const cultivos = [
    { nombre: 'Aguacate', ciclos: [12], coeficientes: ['0.50 - 0.55'] },
    { nombre: 'Ajonjoli', ciclos: [12], coeficientes: ['0.80'] },
    { nombre: 'Alfalfa Heladas', ciclos: [3], coeficientes: ['0.80 - 0.85'] },
    { nombre: 'Alfalfa Invierno', ciclos: [3], coeficientes: ['0.60'] },
    { nombre: 'Algodon', ciclos: [6, 7], coeficientes: ['0.60 - 0.65'] },
    { nombre: 'Arroz', ciclos: [3, 5], coeficientes: ['1.00 - 1.20'] },
    { nombre: 'Cacahuate', ciclos: [5], coeficientes: ['0.60 - 0.65'] },
    { nombre: 'Cacao', ciclos: [12], coeficientes: ['0.75 - 0.80'] },
    { nombre: 'Cafe', ciclos: [12], coeficientes: ['0.75 - 0.80'] },
    { nombre: 'Camote', ciclos: [5, 6], coeficientes: ['0.60'] },
    { nombre: 'Caña de azucar', ciclos: [12], coeficientes: ['0.75 - 0.90'] },
    { nombre: 'Cartamo', ciclos: [5, 8], coeficientes: ['0.55 - 0.65'] },
    { nombre: 'Cereales de grano pequeño', ciclos: [3, 6], coeficientes: ['0.75 - 0.85'] },
    { nombre: 'Citricos', ciclos: [7, 8], coeficientes: ['0.50 - 0.65'] },
    { nombre: 'Chile', ciclos: [3, 4], coeficientes: ['0.60'] },
    { nombre: 'Esparrago', ciclos: [6, 7], coeficientes: ['0.60'] },
    { nombre: 'Fresa', ciclos: [12], coeficientes: ['0.45 - 0.60'] },
    { nombre: 'Frijol', ciclos: [3, 4], coeficientes: ['0.60 - 0.70'] },
    { nombre: 'Frutales de hueso', ciclos: ['Entre heladas'], coeficientes: ['0.60 - 0.70'] },
    { nombre: 'Garbanzo', ciclos: [4, 5], coeficientes: ['0.60 - 0.70'] },
    { nombre: 'Girasol', ciclos: [4], coeficientes: ['0.50 - 0.65'] },
    { nombre: 'Gladiola', ciclos: [3, 4], coeficientes: ['0.60'] },
    { nombre: 'Haba', ciclos: [4, 5], coeficientes: ['0.60 - 0.70'] },
    { nombre: 'Hortalizas', ciclos: [2, 4], coeficientes: ['0.60'] },
    { nombre: 'Jitomate', ciclos: [4], coeficientes: ['0.70'] },
    { nombre: 'Lechuga y col', ciclos: [3], coeficientes: ['0.70'] },
    { nombre: 'Lenteja', ciclos: [4], coeficientes: ['0.60 - 0.70'] },
    { nombre: 'Maiz 1', ciclos: [4], coeficientes: ['0.60 - 0.70'] },
    { nombre: 'Maiz 2', ciclos: [4, 7], coeficientes: ['0.75 - 0.85'] },
    { nombre: 'Mango', ciclos: [12], coeficientes: ['0.75 - 0.80'] },
    { nombre: 'Melon', ciclos: [3, 4], coeficientes: ['0.60'] },
    { nombre: 'Nogal', ciclos: ['Entre heladas'], coeficientes: ['0.70'] },
    { nombre: 'Papa', ciclos: [3, 5], coeficientes: ['0.65 - 0.75'] },
    { nombre: 'Palma datilera', ciclos: [12], coeficientes: ['0.65 - 0.80'] },
    { nombre: 'Palma cocotera', ciclos: [12], coeficientes: ['0.80 - 0.90'] },
    { nombre: 'Papaya', ciclos: [12], coeficientes: ['0.60 - 0.80'] },
    { nombre: 'Platano', ciclos: [12], coeficientes: ['0.80 - 1.00'] },
    { nombre: 'Pastos de gramirias', ciclos: [12], coeficientes: ['0.75'] },
    { nombre: 'Remolacha', ciclos: [6], coeficientes: ['0.65 - 0.75'] },
    { nombre: 'Sandia', ciclos: [3, 4], coeficientes: ['0.60'] },
    { nombre: 'Sorbo', ciclos: [3, 5], coeficientes: ['0.60'] },
    { nombre: 'Soya', ciclos: [3, 5], coeficientes: ['0.60 - 0.70'] },
    { nombre: 'Tabaco', ciclos: [4, 5], coeficientes: ['0.70 - 0.80'] },
    { nombre: 'Tomate', ciclos: [4, 5], coeficientes: ['0.70 - 0.80'] },
    { nombre: 'Trebol ladino', ciclos: [12], coeficientes: ['0.80 - 0.85'] },
    { nombre: 'Zanahoria', ciclos: [2, 4], coeficientes: ['0.60'] },
  ];

  const handleTemperaturaChange = (event) => {
    const { name, value } = event.target;
    setTemperaturas((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  // Función para manejar el cambio de cultivo
  const handleCultivoChange = (event) => {
    const cultivoSeleccionado = event.target.value;
    const cultivoData = cultivos.find((c) => c.nombre === cultivoSeleccionado);
    if (cultivoData) {
      setCultivo(cultivoSeleccionado);
      setCiclo(cultivoData.ciclos);
      setCoeficiente(cultivoData.coeficientes);
      setCoeficienteSeleccionado(''); // Limpiar el valor del coeficiente seleccionado
    }
  };

  // Función para calcular Pi
  const calcularPi = (latitud, mes) => {
    const valoresPiNorte = {
      abril: 8.62,
      mayo: 9.36,
      junio: 9.26,
      julio: 9.47,
      agosto: 9.09,
      septiembre: 8.32,
      octubre: 8.07,
    };
    return valoresPiNorte[mes.toLowerCase()];
  };

  // Función para calcular Fi
  const calcularFi = (pi, temp) => {
    return pi * ((parseFloat(temp) + 17.8) / 21.8);
  };

  // Función para calcular los resultados
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

  // Función para llenar el formulario con datos de ejemplo
  const cargarEjemplo = () => {
    setLatitud('Norte');
    setLatitudValor('25.5');
    setCultivo('Algodon');
    setCiclo([6, 7]);
    setCoeficiente(['0.60 - 0.65']);
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

  // Función para limpiar todos los campos y la tabla
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
    <div>

      <div>
        <label>Latitud:</label>
        <select value={latitud} onChange={(e) => setLatitud(e.target.value)}>
          <option value="">Seleccione la latitud</option>
          <option value="Norte">Norte</option>
          <option value="Sur">Sur</option>
        </select>
      </div>

      <div>
        <label>Valor de Latitud:</label>
        <input
          type="number"
          value={latitudValor}
          onChange={(e) => setLatitudValor(e.target.value)}
          placeholder="Ingrese el valor de la latitud"
        />
      </div>

      <div>
        <label>Cultivo:</label>
        <select value={cultivo} onChange={handleCultivoChange}>
          <option value="">Seleccione un cultivo</option>
          {cultivos.map((cultivo, index) => (
            <option key={index} value={cultivo.nombre}>
              {cultivo.nombre}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label>Ciclo Vegetativo:</label>
        <select value={ciclo[0] || ''} onChange={(e) => setCiclo([e.target.value])}>
          <option value="">Seleccione el ciclo vegetativo</option>
          {Array.isArray(ciclo) &&
            ciclo.map((c, index) => (
              <option key={index} value={c}>
                {c}
              </option>
            ))}
        </select>
      </div>

      <div>
        <label>Coeficiente Global:</label>
        <select
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

      <div>
        <label>Mes de Siembra:</label>
        <select value={mesSiembra} onChange={(e) => setMesSiembra(e.target.value)}>
          <option value="">Seleccione el mes de siembra</option>
          <option value="Enero">Enero</option>
          <option value="Febrero">Febrero</option>
          <option value="Marzo">Marzo</option>
          <option value="Abril">Abril</option>
          <option value="Mayo">Mayo</option>
          <option value="Junio">Junio</option>
          <option value="Julio">Julio</option>
          <option value="Agosto">Agosto</option>
          <option value="Septiembre">Septiembre</option>
          <option value="Octubre">Octubre</option>
          <option value="Noviembre">Noviembre</option>
          <option value="Diciembre">Diciembre</option>
        </select>
      </div>

      <div>
        <label>Zona:</label>
        <div>
          <input
            type="radio"
            id="normal"
            name="zona"
            value="Normal"
            checked={zona === 'Normal'}
            onChange={(e) => setZona(e.target.value)}
          />
          <label htmlFor="normal">Normal</label>
          <input
            type="radio"
            id="arida"
            name="zona"
            value="Árida"
            checked={zona === 'Árida'}
            onChange={(e) => setZona(e.target.value)}
          />
          <label htmlFor="arida">Árida</label>
        </div>
      </div>

      <h3>Temperaturas (°C)</h3>
      {Object.keys(temperaturas).map((mes) => (
        <div key={mes}>
          <label>{mes.charAt(0).toUpperCase() + mes.slice(1)}:</label>
          <input
            type="number"
            name={mes}
            value={temperaturas[mes]}
            onChange={handleTemperaturaChange}
          />
        </div>
      ))}

      <button onClick={calcularResultados}>Calcular</button>
      <button onClick={cargarEjemplo}>Ejemplo</button>
      <button onClick={limpiarCampos}>Limpiar</button>

      {resultados.length > 0 && (
        <div>
          <h3>Resultados</h3>
          <table>
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
          <p>Zona normal: {zonaNormal}</p>
        </div>
      )}
    </div>
  );
};

export default BlaneyCriddleGlobal;
