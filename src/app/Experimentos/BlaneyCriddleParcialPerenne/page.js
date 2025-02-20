'use client';
import React, { useState } from "react";
import BackButton from "@/components/BackButton"; // Ajusta la ruta según la ubicación
const BlaneyCriddleParcialPerenne = () => {
  // Estados para los valores de latitud, cultivo, mes, temperatura, y resultados
  const [latitud, setLatitud] = useState("");
  const [hemisferio, setHemisferio] = useState("");
  const [cultivo, setCultivo] = useState("");
  const [mesSiembra, setMesSiembra] = useState("");
  const [temperatura, setTemperatura] = useState("");
  const [fi, setFi] = useState("");
  const [kci, setKci] = useState("");
  const [eti, setEti] = useState("");

  // Función para calcular Fi
  const calcularFi = (Pi, Ti) => {
    return Pi * ((Ti + 17.8) / 21.8); // Fórmula de Fi
  };

  // Función para calcular Kci
  const calcularKci = (mesSiembra, indiceCultivo) => {
    const kciTable = [
      [0.64, 0.2, 0.1, 0.65, 0.25, 0.2, 0.47, 0.63],
      [0.72, 0.25, 0.13, 0.75, 0.38, 0.25, 0.6, 0.67],
      [0.87, 0.38, 0.25, 0.9, 0.52, 0.3, 0.75, 0.7],
      [1.0, 0.63, 0.4, 1.0, 0.65, 0.5, 0.83, 0.71],
      [1.1, 0.87, 0.6, 1.1, 0.78, 0.62, 0.9, 0.73],
      [1.14, 1.0, 0.88, 1.15, 0.78, 0.78, 0.92, 0.74],
      [1.14, 1.0, 1.0, 1.13, 0.75, 0.79, 0.91, 0.74],
      [1.08, 0.87, 0.85, 1.1, 0.7, 0.75, 0.9, 0.73],
      [1.0, 0.5, 0.71, 1.0, 0.56, 0.6, 0.83, 0.7],
      [0.82, 0.38, 0.5, 0.92, 0.48, 0.5, 0.75, 0.68],
      [0.75, 0.2, 0.25, 0.8, 0.37, 0.35, 0.63, 0.65],
      [0.62, 0.13, 0.13, 0.68, 0.3, 0.2, 0.52, 0.61]
    ];
    return kciTable[mesSiembra - 1][indiceCultivo - 1];
  };

  // Función para calcular Eti
  const calcularEti = (kci, fi) => {
    return kci * fi; // Fórmula Eti = Kci * Fi
  };

  // Función para interpolar Norte
  const interpolarNorte = (latitud, mesSiembra) => {
    // Valores de insolación para el hemisferio norte (ficticios)
    const insolacionNorte = [
      [0, 8.5, 7.66, 8.49, 8.21, 8.5, 8.22, 8.5, 8.45, 8.21, 8.5, 8.22, 8.5],
      [5, 8.32, 7.57, 8.47, 8.29, 8.65, 8.41, 8.67, 8.66, 8.23, 8.42, 8.07, 8.3],
      [10, 8.13, 7.47, 8.45, 8.37, 8.81, 8.6, 8.86, 8.71, 8.25, 8.34, 7.91, 8.1]
    ];
    return insolacionNorte[0][mesSiembra];
  };

  // Función para interpolar Sur
  const interpolarSur = (latitud, mesSiembra) => {
    // Valores de insolación para el hemisferio sur (ficticios)
    // La primera columna representa la latitud (0, 5, 10)
    const insolacionSur = [
      [0, 8.5, 7.66, 8.49, 8.21, 8.5, 8.22, 8.5, 8.45, 8.21, 8.5, 8.22, 8.5],
      [5, 8.68, 7.76, 8.51, 8.15, 8.34, 8.05, 8.33, 8.38, 8.19, 8.56, 8.37, 8.68],
      [10, 8.86, 7.87, 8.53, 8.09, 8.18, 7.86, 8.14, 8.27, 8.17, 8.62, 8.53, 8.88]
    ];
  
    // Si la latitud es menor o igual al valor mínimo de la tabla, usamos la primera fila
    if (latitud <= insolacionSur[0][0]) {
      return insolacionSur[0][mesSiembra];
    }
    // Si la latitud es mayor o igual al valor máximo de la tabla, usamos la última fila
    if (latitud >= insolacionSur[insolacionSur.length - 1][0]) {
      return insolacionSur[insolacionSur.length - 1][mesSiembra];
    }
    // Buscar entre qué dos filas se encuentra la latitud y hacer interpolación lineal
    for (let i = 0; i < insolacionSur.length - 1; i++) {
      const lat1 = insolacionSur[i][0];
      const lat2 = insolacionSur[i + 1][0];
      if (latitud >= lat1 && latitud <= lat2) {
        const value1 = insolacionSur[i][mesSiembra];
        const value2 = insolacionSur[i + 1][mesSiembra];
        const fraccion = (latitud - lat1) / (lat2 - lat1);
        return value1 + fraccion * (value2 - value1);
      }
    }
  };  

  // Función que se ejecuta al presionar "Ejemplo"
  const handleEjemplo = () => {
    setLatitud(4.015);
    setHemisferio("Sur");
    setCultivo("5"); // Aguacate
    setMesSiembra("8"); // Agosto
    setTemperatura(15.5);
  };

  // Función que se ejecuta al presionar "Calcular"
  const handleCalcular = () => {
    const Pi = hemisferio === "Norte"
      ? interpolarNorte(latitud, mesSiembra)
      : interpolarSur(latitud, mesSiembra);

    const fiCalculado = calcularFi(Pi, temperatura);
    const kciCalculado = calcularKci(mesSiembra, cultivo);
    const etiCalculado = calcularEti(kciCalculado, fiCalculado);

    // Actualizamos los estados con los valores calculados
    setFi(fiCalculado.toFixed(4));
    setKci(kciCalculado.toFixed(4));
    setEti(etiCalculado.toFixed(4));
  };

  return (
    <div className=" py-14">
      <BackButton />
      <div className="w-96 mx-auto text-center border border-gray-300 p-6 bg-gray-100 shadow-md rounded-lg">
        <h2 className="text-xl font-semibold text-gray-800">Método de Criddle Parcial Perenne</h2>

        {/* Contenedor principal */}
        <div className="flex flex-col space-y-4 mb-6">

          {/* LATITUD */}
          <div className="flex flex-col">
            <label className="text-gray-700 font-semibold">Latitud:</label>
            <input
              type="text"
              value={latitud}
              onChange={(e) => setLatitud(e.target.value)}
              className="w-full p-2 mt-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
            />
          </div>

          {/* LATITUD (Norte/Sur) */}
          <select
            value={hemisferio}
            onChange={(e) => setHemisferio(e.target.value)}
            className="w-full p-2 mt-2 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
          >
            <option value="">Seleccione la latitud</option>
            <option value="Norte">Norte</option>
            <option value="Sur">Sur</option>
          </select>

          {/* CULTIVO */}
          <select
            value={cultivo}
            onChange={(e) => setCultivo(e.target.value)}
            className="w-full p-2 mt-1 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
          >
            <option value="">Seleccione el cultivo</option>
            {[
              "Huerta de plantas caducas con cubierta",
              "Huerta de plantas caducas sin cubierta",
              "Nogal", "Alfalfa", "Aguacate", "Vid", "Pastos", "Huerta de cítricos"
            ].map((cultivo, index) => (
              <option key={index} value={index + 1}>{cultivo}</option>
            ))}
          </select>

          {/* MES PARA ETP */}
          <select
            value={mesSiembra}
            onChange={(e) => setMesSiembra(e.target.value)}
            className="w-full p-2 mt-1 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
          >
            <option value="">Seleccione el mes de siembra</option>
            {[
              "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
              "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
            ].map((mes, index) => (
              <option key={index} value={index + 1}>{mes}</option>
            ))}
          </select>

          {/* TEMPERATURA DEL MES */}
          <div className="flex flex-col">
            <label className="text-gray-700 font-semibold">Temperatura del mes (°C):</label>
            <input
              type="text"
              value={temperatura}
              onChange={(e) => setTemperatura(e.target.value)}
              className="w-full p-2 mt-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
            />
          </div>

        </div>


        {/* Botonera */}
        <div className="flex justify-between mb-6">
          <button
            onClick={handleEjemplo}
            className="px-5 py-2 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-600 transition"
          >
            Ejemplo
          </button>

          <button
            onClick={handleCalcular}
            className="px-5 py-2 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-600 transition"
          >
            Calcular
          </button>

          <button
            onClick={() => window.location.reload()}
            className="px-5 py-2 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-600 transition"
          >
            Nuevo
          </button>
        </div>


        {/* Sección de Resultados */}
        <div className="text-left bg-white p-4 shadow-md rounded-lg border border-gray-300">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Resultados</h3>
          <p className="text-gray-700 font-medium">Kci: <span className="font-semibold">{kci}</span></p>
          <p className="text-gray-700 font-medium">Fi: <span className="font-semibold">{fi}</span></p>
          <p className="text-gray-700 font-medium">Eti: <span className="font-semibold">{eti}</span></p>
        </div>

      </div>
    </div>
  );
};

export default BlaneyCriddleParcialPerenne;
