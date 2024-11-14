'use client'
import React, { useState } from 'react';

import '../App.css';

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
    const insolacionSur = [
      [0, 8.5, 7.66, 8.49, 8.21, 8.5, 8.22, 8.5, 8.45, 8.21, 8.5, 8.22, 8.5],
      [5, 8.68, 7.76, 8.51, 8.15, 8.34, 8.05, 8.33, 8.38, 8.19, 8.56, 8.37, 8.68],
      [10, 8.86, 7.87, 8.53, 8.09, 8.18, 7.86, 8.14, 8.27, 8.17, 8.62, 8.53, 8.88]
    ];
    return insolacionSur[0][mesSiembra];
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
    <div style={{
      width: "400px",
      margin: "0 auto",
      textAlign: "center",
      border: "1px solid #cccccc",
      padding: "20px",
      backgroundColor: "#f7f7f7",
      borderRadius: "8px"
    }}>
      <h2>Método de Criddle Parcial Perenne</h2>

      <div style={{ display: "flex", flexDirection: "column", marginBottom: "20px" }}>
        <label style={{ margin: "10px 0 5px", fontWeight: "bold" }}>Latitud:</label>
        <input
          type="text"
          value={latitud}
          onChange={(e) => setLatitud(e.target.value)}
          style={{ padding: "8px", marginBottom: "10px", borderRadius: "5px", border: "1px solid #ccc" }}
        />
        <select
          onChange={(e) => setHemisferio(e.target.value)}
          style={{ padding: "8px", marginBottom: "10px", borderRadius: "5px", border: "1px solid #ccc" }}
        >
          <option value="">Seleccione la latitud</option>
          <option value="Norte">Norte</option>
          <option value="Sur">Sur</option>
        </select>

        <label style={{ margin: "10px 0 5px", fontWeight: "bold" }}>Cultivo:</label>
        <select
          onChange={(e) => setCultivo(e.target.value)}
          style={{ padding: "8px", marginBottom: "10px", borderRadius: "5px", border: "1px solid #ccc" }}
        >
          <option value="">Seleccione el cultivo</option>
          <option value="1">Huerta de plantas caducas con cubierta</option>
          <option value="2">Huerta de plantas caducas sin cubierta</option>
          <option value="3">Nogal</option>
          <option value="4">Alfalfa</option>
          <option value="5">Aguacate</option>
          <option value="6">Vid</option>
          <option value="7">Pastos</option>
          <option value="8">Huerta de cítricos</option>
        </select>

        <label style={{ margin: "10px 0 5px", fontWeight: "bold" }}>Mes para ETP:</label>
        <select
          onChange={(e) => setMesSiembra(e.target.value)}
          style={{ padding: "8px", marginBottom: "10px", borderRadius: "5px", border: "1px solid #ccc" }}
        >
          <option value="">Seleccione el mes de siembra</option>
          <option value="1">Enero</option>
          <option value="2">Febrero</option>
          <option value="3">Marzo</option>
          <option value="4">Abril</option>
          <option value="5">Mayo</option>
          <option value="6">Junio</option>
          <option value="7">Julio</option>
          <option value="8">Agosto</option>
          <option value="9">Septiembre</option>
          <option value="10">Octubre</option>
          <option value="11">Noviembre</option>
          <option value="12">Diciembre</option>
        </select>

        <label style={{ margin: "10px 0 5px", fontWeight: "bold" }}>Temperatura del mes (°C):</label>
        <input
          type="text"
          value={temperatura}
          onChange={(e) => setTemperatura(e.target.value)}
          style={{ padding: "8px", marginBottom: "10px", borderRadius: "5px", border: "1px solid #ccc" }}
        />
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "20px" }}>
        <button
          onClick={handleEjemplo}
          style={{
            padding: "10px 20px", backgroundColor: "#007bff", color: "white", border: "none", borderRadius: "5px", cursor: "pointer"
          }}
        >
          Ejemplo
        </button>
        <button
          onClick={handleCalcular}
          style={{
            padding: "10px 20px", backgroundColor: "#007bff", color: "white", border: "none", borderRadius: "5px", cursor: "pointer"
          }}
        >
          Calcular
        </button>
        <button
          onClick={() => window.location.reload()}
          style={{
            padding: "10px 20px", backgroundColor: "#007bff", color: "white", border: "none", borderRadius: "5px", cursor: "pointer"
          }}
        >
          Nuevo
        </button>
      </div>

      <div style={{ textAlign: "left" }}>
        <h3>Resultados</h3>
        <p>Kci: {kci}</p>
        <p>Fi: {fi}</p>
        <p>Eti: {eti}</p>
      </div>
    </div>
  );
};

export default BlaneyCriddleParcialPerenne;
