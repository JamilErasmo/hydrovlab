'use client';
import React, { useState } from 'react';
import BackButton from "@/components/BackButton"; // Ajusta la ruta según la ubicación

const BlaneyCriddleParcial = () => {
  // Estados para los datos de entrada
  const [lat, setLat] = useState('');
  const [coe, setCoe] = useState('');
  const [tmp, setTmp] = useState('');
  const [latType, setLatType] = useState('Norte');
  const [crop, setCrop] = useState('Trigo');
  const [plantingMonth, setPlantingMonth] = useState('Enero');

  // Estados para los resultados
  const [kci, setKci] = useState(null);
  const [fi, setFi] = useState(null);
  const [eti, setEti] = useState(null);

  // Estado para el mensaje de error
  const [error, setError] = useState('');

  // Función que retorna el índice del mes (1-12) en español
  const procIndexMes = (mes) => {
    switch (mes) {
      case "Enero": return 1;
      case "Febrero": return 2;
      case "Marzo": return 3;
      case "Abril": return 4;
      case "Mayo": return 5;
      case "Junio": return 6;
      case "Julio": return 7;
      case "Agosto": return 8;
      case "Septiembre": return 9;
      case "Octubre": return 10;
      case "Noviembre": return 11;
      case "Diciembre": return 12;
      default: return 1;
    }
  };

  // Función procfi: fi = Pi * ((Ti + 17.8) / 21.8)
  const procfi = (Pi, Ti) => {
    return Pi * ((Ti + 17.8) / 21.8);
  };

  // Función procKCI – Calcula Kci de acuerdo al % de crecimiento (pcs) y el cultivo (cul)
  const procKCI = (pcs, cul) => {
    const lgrn = [
      0, 0.28, 0.0, 0.28, 0.2, 0.5, 0.57, 0.48, 0.3, 0.45, 0.3, 0.45,
      10, 0.38, 0.3, 0.39, 0.25, 0.6, 0.7, 0.6, 0.39, 0.5, 0.4, 0.45,
      20, 0.48, 0.98, 0.48, 0.35, 0.78, 0.84, 0.72, 0.58, 0.58, 0.55, 0.47,
      30, 0.85, 1.5, 0.82, 0.5, 0.92, 1.0, 0.9, 0.7, 0.67, 0.7, 0.6,
      40, 1.25, 1.48, 1.05, 0.8, 1.08, 1.08, 1.01, 0.78, 0.77, 0.92, 0.76,
      50, 1.5, 1.46, 1.1, 0.98, 1.12, 1.14, 1.08, 0.8, 0.8, 1.12, 0.9,
      60, 1.6, 1.44, 1.0, 1.02, 1.0, 1.1, 1.08, 0.81, 0.79, 1.27, 1.0,
      70, 1.55, 1.4, 0.92, 0.93, 1.05, 1.08, 1.02, 0.78, 0.76, 1.35, 1.0,
      80, 1.33, 1.25, 0.78, 0.85, 0.9, 0.98, 0.9, 0.7, 0.71, 1.37, 0.9,
      90, 0.98, 0.7, 0.67, 0.65, 0.72, 0.83, 0.77, 0.57, 0.68, 1.28, 0.8,
      100, 0.6, 0.0, 0.54, 0.5, 0.0, 0.7, 0.6, 0.4, 0.64, 1.22, 0.65
    ];
    // Construir una tabla de 11 filas x 12 columnas
    let tbl = [];
    let c3 = 0;
    for (let i = 0; i < 11; i++) {
      tbl[i] = [];
      for (let j = 0; j < 12; j++) {
        tbl[i][j] = lgrn[c3++];
      }
    }
    // Determinar el índice del cultivo
    let cropIndex;
    switch (cul) {
      case "Trigo": cropIndex = 1; break;
      case "Trigo de Invierno": cropIndex = 2; break;
      case "Sorgo de grano": cropIndex = 3; break;
      case "Algodon": cropIndex = 4; break;
      case "Frijol": cropIndex = 5; break;
      case "Lechuga": cropIndex = 6; break;
      case "Zanahoria": cropIndex = 7; break;
      case "Papa": cropIndex = 8; break;
      case "Calabaza": cropIndex = 9; break;
      case "Papa1":
      case "Papa 2": cropIndex = 10; break;
      case "Tomate": cropIndex = 11; break;
      default: cropIndex = 1; break;
    }
    let ka = 0;
    for (let i = 0; i < tbl.length; i++) {
      if (tbl[i][0] > pcs) {
        if (i === 0) break; // Evitar índice negativo
        let pma = tbl[i][0];
        let pme = tbl[i - 1][0];
        let la1 = pme - pma;
        let la2 = pcs - pma;
        let diff = tbl[i - 1][cropIndex] - tbl[i][cropIndex];
        let interpolated = la2 * diff / la1;
        ka = tbl[i][cropIndex] + interpolated;
        return parseFloat(ka.toFixed(4));
      } else if (tbl[i][0] === pcs) {
        ka = parseFloat(tbl[i][cropIndex].toFixed(4));
        return ka;
      }
    }
    return ka;
  };

  // Función procInterpolarN – Calcula la interpolación para latitud NORTE
  const procInterpolarN = (latitud, msi) => {
    const lgrn = [
      0, 8.5, 7.66, 8.49, 8.21, 8.5, 8.22, 8.5, 8.45, 8.21, 8.5, 8.22, 8.5,
      5, 8.32, 7.57, 8.47, 8.29, 8.65, 8.41, 8.67, 8.66, 8.23, 8.42, 8.07, 8.3,
      10, 8.13, 7.47, 8.45, 8.37, 8.81, 8.6, 8.86, 8.71, 8.25, 8.34, 7.91, 8.1,
      15, 7.94, 7.36, 8.43, 8.44, 8.98, 8.8, 9.05, 8.83, 8.28, 8.2, 7.75, 7.88,
      16, 7.93, 7.35, 8.44, 8.46, 9.07, 8.83, 9.07, 8.85, 8.27, 8.24, 7.72, 7.83,
      17, 7.86, 7.32, 8.43, 8.48, 9.04, 8.87, 9.11, 8.87, 8.27, 8.22, 7.69, 7.8,
      18, 7.83, 7.3, 8.42, 8.5, 9.09, 8.92, 9.16, 8.9, 8.27, 8.21, 7.66, 7.74,
      19, 7.79, 7.28, 8.41, 8.51, 9.11, 8.97, 9.2, 8.92, 8.28, 8.19, 7.63, 7.71,
      20, 7.74, 7.25, 8.41, 8.52, 9.15, 9.0, 9.25, 8.96, 8.3, 8.18, 7.58, 7.66,
      21, 7.71, 7.24, 8.4, 8.54, 9.18, 9.05, 9.29, 8.98, 8.29, 8.15, 7.54, 7.62,
      22, 7.66, 7.21, 8.4, 8.56, 9.22, 9.09, 9.33, 9.0, 8.3, 8.13, 7.5, 7.55,
      23, 7.62, 7.19, 8.4, 8.57, 9.24, 9.12, 9.35, 9.02, 8.3, 8.11, 7.47, 7.5,
      24, 7.58, 7.17, 8.4, 8.6, 9.3, 9.2, 9.44, 9.05, 8.31, 8.09, 7.43, 7.46,
      25, 7.53, 7.14, 8.39, 8.61, 9.33, 9.23, 9.45, 9.09, 8.32, 8.09, 7.4, 7.42,
      26, 7.49, 7.12, 8.4, 8.64, 9.38, 9.3, 9.49, 9.1, 8.31, 8.06, 7.36, 7.31,
      27, 7.43, 7.09, 8.38, 8.65, 9.4, 9.32, 9.52, 9.13, 8.32, 8.03, 7.36, 7.31,
      28, 7.4, 7.0, 8.39, 8.68, 9.46, 9.38, 9.58, 9.16, 8.32, 8.02, 7.27, 7.27,
      29, 7.35, 7.04, 8.37, 8.7, 9.49, 9.43, 9.61, 9.19, 8.32, 8.0, 7.24, 7.2,
      30, 7.3, 7.03, 8.38, 8.72, 9.53, 9.49, 7.19, 7.15,
    ];
    let tbl = [];
    let c3 = 0;
    for (let i = 0; i < 37; i++) {
      tbl[i] = [];
      for (let j = 0; j < 13; j++) {
        tbl[i][j] = lgrn[c3++];
      }
    }
    let ka = 0;
    for (let i = 0; i < tbl.length; i++) {
      if (tbl[i][0] > latitud) {
        if (i === 0) break;
        let lma = tbl[i][0];
        let lme = tbl[i - 1][0];
        let la1 = lme - lma;
        let la2 = latitud - lma;
        let diff = tbl[i - 1][msi] - tbl[i][msi];
        let interpolated = la2 * diff / la1;
        ka = tbl[i][msi] + interpolated;
        return parseFloat(ka.toFixed(4));
      } else if (tbl[i][0] === latitud) {
        ka = parseFloat(tbl[i][msi].toFixed(4));
        return ka;
      }
    }
    return ka;
  };

  // Función procInterpolarS – Calcula la interpolación para latitud SUR
  const procInterpolarS = (latitud, msi) => {
    const lgrs = [
      0, 8.5, 7.66, 8.49, 8.21, 8.5, 8.22, 8.5, 8.49, 8.21, 8.5, 8.22, 8.5,
      5, 8.68, 7.76, 8.51, 8.15, 8.18, 7.86, 8.14, 8.27, 8.17, 8.62, 8.53, 8.88,
      15, 9.05, 7.98, 8.55, 8.02, 8.02, 7.65, 7.95, 8.15, 8.15, 8.68, 8.7, 9.1,
      20, 9.24, 8.09, 8.57, 7.94, 7.85, 7.43, 7.76, 8.03, 8.13, 8.76, 8.87, 9.33,
      25, 9.46, 8.21, 8.6, 7.94, 7.66, 7.2, 7.54, 7.9, 8.11, 8.86, 9.04, 9.58,
      30, 9.7, 8.33, 8.62, 7.73, 7.45, 6.96, 7.31, 7.76, 8.07, 8.97, 9.24, 9.35,
      32, 9.81, 8.39, 8.63, 7.69, 7.36, 6.85, 7.21, 7.7, 8.96, 9.01, 9.33, 9.96,
      34, 9.92, 8.45, 8.64, 7.64, 7.27, 6.74, 7.1, 7.63, 8.05, 9.06, 9.42, 10.08,
      36, 10.03, 8.51, 8.65, 7.59, 7.18, 6.62, 6.99, 7.56, 8.04, 9.11, 9.51, 10.21,
      38, 10.15, 8.57, 8.66, 7.54, 7.08, 6.5, 6.87, 7.49, 8.03, 9.16, 9.61, 10.34,
      40, 10.27, 8.63, 8.67, 7.49, 6.97, 6.37, 6.76, 7.41, 8.02, 9.21, 9.71, 10.49,
      42, 10.4, 8.7, 8.68, 7.44, 6.85, 6.23, 6.64, 7.33, 8.01, 9.26, 9.82, 10.64,
      44, 10.54, 8.78, 8.69, 7.38, 6.73, 6.08, 6.51, 7.25, 7.99, 9.31, 9.94, 10.8,
      46, 10.69, 8.86, 8.7, 7.32, 6.61, 5.02, 6.37, 7.16, 7.96, 9.37, 10.07, 10.97
    ];
    let tbl = [];
    let c3 = 0;
    for (let i = 0; i < 15; i++) {
      tbl[i] = [];
      for (let j = 0; j < 13; j++) {
        tbl[i][j] = lgrs[c3++];
      }
    }
    let ka = 0;
    for (let i = 0; i < tbl.length; i++) {
      if (tbl[i][0] > latitud) {
        if (i === 0) break;
        let lma = tbl[i][0];
        let lme = tbl[i - 1][0];
        let la1 = lme - lma;
        let la2 = latitud - lma;
        let diff = tbl[i - 1][msi] - tbl[i][msi];
        let interpolated = la2 * diff / la1;
        ka = tbl[i][msi] + interpolated;
        return parseFloat(ka.toFixed(4));
      } else if (tbl[i][0] === latitud) {
        ka = parseFloat(tbl[i][msi].toFixed(4));
        return ka;
      }
    }
    return ka;
  };

  // Manejadores de eventos
  const handleEjemplo = () => {
    setLat(25.5);
    setCoe(50);
    setTmp(18);
    setLatType("Norte");
    setPlantingMonth("Abril");
    setCrop("Algodon");
    // Limpiar resultados y mensaje de error anteriores
    setKci(null);
    setFi(null);
    setEti(null);
    setError('');
  };

  const handleCalcular = () => {
    if (lat === '' || coe === '' || tmp === '') {
      setError("Por favor, complete todos los campos numéricos.");
      return;
    }
    // Limpiar error si todo está bien
    setError('');
    const latVal = Number(lat);
    const pcs = Number(coe);
    const temp = Number(tmp);
    const mesIndex = procIndexMes(plantingMonth);
    let Pi = 0;
    if (latType === "Norte") {
      Pi = procInterpolarN(latVal, mesIndex);
    } else {
      Pi = procInterpolarS(latVal, mesIndex);
    }
    const fiValue = procfi(Pi, temp);
    const kciValue = procKCI(pcs, crop);
    const etiValue = kciValue * fiValue;
    setFi(parseFloat(fiValue.toFixed(4)));
    setKci(parseFloat(kciValue.toFixed(4)));
    setEti(parseFloat(etiValue.toFixed(4)));
  };

  const handleNuevo = () => {
    setLat('');
    setCoe('');
    setTmp('');
    setLatType("");
    setCrop("");
    setPlantingMonth("");
    setKci(null);
    setFi(null);
    setEti(null);
    setError('');
  };

  return (
    <div className="py-8">
      <BackButton />

      <div className="py-14 max-w-3xl mx-auto text-[#5377A9] bg-white shadow-md rounded-lg">
        {/* Encabezado */}
        <div className="text-center">
          <h1 className="text-2xl font-bold uppercase mt-4">Método de Blaney Criddle Parcial</h1>
        </div>
        <br />

        {/* Contenedor principal */}
        <div className="border border-gray-300 p-6 mb-6 bg-white shadow-md rounded-lg space-y-4">
          <h3 className="text-lg font-semibold text-gray-800">Ingreso de Datos</h3>

          {/* LATITUD */}
          <div className="flex flex-col">
            <label className="text-gray-700 font-medium">LATITUD:</label>
            <input
              type="number"
              value={lat}
              onChange={(e) => setLat(e.target.value === "" ? "" : Number(e.target.value))}
              className="w-full p-2 mt-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
            />
          </div>

          {/* CULTIVO */}
          <div className="flex flex-col">
            <label className="text-gray-700 font-medium">CULTIVO:</label>
            <select
              value={crop}
              onChange={(e) => setCrop(e.target.value)}
              className="w-full p-2 mt-1 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
            >
              {[
                "Trigo", "Trigo de Invierno", "Sorgo de grano", "Algodon", "Frijol",
                "Lechuga", "Zanahoria", "Papa", "Calabaza", "Papa1", "Tomate"
              ].map((cultivo, index) => (
                <option key={index} value={cultivo}>{cultivo}</option>
              ))}
            </select>
          </div>

          {/* % CRECIMIENTO CULTIVO */}
          <div className="flex flex-col">
            <label className="text-gray-700 font-medium">% CRECIMIENTO CULTIVO:</label>
            <input
              type="number"
              value={coe}
              onChange={(e) => setCoe(e.target.value === "" ? "" : Number(e.target.value))}
              className="w-full p-2 mt-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
            />
          </div>

          {/* TEMPERATURA DEL MES */}
          <div className="flex flex-col">
            <label className="text-gray-700 font-medium">TEMPERATURA DEL MES (°C):</label>
            <input
              type="number"
              value={tmp}
              onChange={(e) => setTmp(e.target.value === "" ? "" : Number(e.target.value))}
              className="w-full p-2 mt-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
            />
          </div>

          {/* MES DE SIEMBRA */}
          <div className="flex flex-col">
            <label className="text-gray-700 font-medium">MES DE SIEMBRA:</label>
            <select
              value={plantingMonth}
              onChange={(e) => setPlantingMonth(e.target.value)}
              className="w-full p-2 mt-1 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
            >
              {[
                "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
                "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
              ].map((mes, index) => (
                <option key={index} value={mes}>{mes}</option>
              ))}
            </select>
          </div>

          {/* TIPO DE LATITUD */}
          <div className="flex flex-col">
            <label className="text-gray-700 font-medium">TIPO DE LATITUD:</label>
            <select
              value={latType}
              onChange={(e) => setLatType(e.target.value)}
              className="w-full p-2 mt-1 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
            >
              <option value="Norte">Norte</option>
              <option value="Sur">Sur</option>
            </select>
          </div>

          {/* Mensaje de error */}
          {error && <p className="text-red-500 text-center mt-2">{error}</p>}
        </div>

        {/* Botonera */}
        <div className="mt-4 flex flex-wrap gap-4">
          <button
            onClick={handleEjemplo}
            className="px-6 py-2 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-600 transition"
          >
            EJEMPLO
          </button>

          <button
            onClick={handleCalcular}
            className="px-6 py-2 bg-green-500 text-white font-semibold rounded-lg shadow-md hover:bg-green-600 transition"
          >
            CALCULAR
          </button>

          <button
            onClick={handleNuevo}
            className="px-6 py-2 bg-yellow-500 text-white font-semibold rounded-lg shadow-md hover:bg-yellow-600 transition"
          >
            NUEVO
          </button>
        </div>

        {/* Sección de Resultados */}
        <h2 className="text-xl font-semibold text-gray-800 mt-6">RESULTADOS</h2>
        <div className="border border-gray-300 p-4 w-40 mx-auto text-right bg-white shadow-md rounded-lg">
          <div className="flex justify-between items-center mb-2">
            <label className="text-gray-700 font-medium">Kci:</label>
            <input
              type="number"
              value={kci !== null ? kci : ''}
              readOnly
              className="w-16 p-1 border border-gray-300 rounded-lg bg-gray-100 text-center"
            />
          </div>
          <div className="flex justify-between items-center mb-2">
            <label className="text-gray-700 font-medium">Fi:</label>
            <input
              type="number"
              value={fi !== null ? fi : ''}
              readOnly
              className="w-16 p-1 border border-gray-300 rounded-lg bg-gray-100 text-center"
            />
          </div>
          <div className="flex justify-between items-center">
            <label className="text-gray-700 font-medium">Eti:</label>
            <input
              type="number"
              value={eti !== null ? eti : ''}
              readOnly
              className="w-16 p-1 border border-gray-300 rounded-lg bg-gray-100 text-center"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlaneyCriddleParcial;
