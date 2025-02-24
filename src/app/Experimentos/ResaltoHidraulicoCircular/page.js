'use client';
import React, { useState } from 'react';
import BackButton from "@/components/BackButton"; // Ajusta la ruta según la ubicación

const TiranteConjugadoCircular = () => {
  const [caudal, setCaudal] = useState('');
  const [diametro, setDiametro] = useState('');
  const [tiranteConjugado, setTiranteConjugado] = useState('');
  const [tiranteInicial, setTiranteInicial] = useState('');
  const [resultados, setResultados] = useState({
    energiaE: '',
    perdidaEnergiaE3: '',
    alturaResaltoY3: '',
    mensajeFlujo: ''
  });

  // Función para cargar el ejemplo con valores predeterminados
  const cargarEjemplo = () => {
    setCaudal(2);
    setDiametro(2);
    setTiranteConjugado(0.5);
    setTiranteInicial(0.9);
  };

  // Función para limpiar los campos
  const limpiarCampos = () => {
    setCaudal('');
    setDiametro('');
    setTiranteConjugado('');
    setTiranteInicial('');
    setResultados({
      energiaE: '',
      perdidaEnergiaE3: '',
      alturaResaltoY3: '',
      mensajeFlujo: ''
    });
  };

  // Función para calcular el área sumergida en una sección circular
  const calcularArea = (tirante, diametro) => {
    const radio = diametro / 2;
    if (tirante >= diametro) {
      return Math.PI * Math.pow(radio, 2); // Área total si el tirante cubre todo el diámetro
    }
    const angulo = 2 * Math.acos(1 - (tirante / radio)); // Ángulo en radianes
    const area = (Math.pow(radio, 2) / 2) * (angulo - Math.sin(angulo)); // Área sumergida
    return area;
  };

  // Función para calcular la energía
  const calcularEnergia = (Q, tirante, diametro) => {
    const g = 9.81; // Gravedad
    const area = calcularArea(tirante, diametro);
    const energia = tirante + (Math.pow(Q, 2) / (2 * g * Math.pow(area, 2)));
    return energia;
  };

  // Función para calcular el tirante conjugado iterativamente
  const calcular = () => {
    let Q = parseFloat(caudal);
    let D = parseFloat(diametro);
    let y1 = parseFloat(tiranteConjugado);
    let y2 = parseFloat(tiranteInicial);

    if (isNaN(Q) || isNaN(D) || isNaN(y1) || isNaN(y2)) {
      alert("Por favor, asegúrate de que todos los campos tengan valores numéricos válidos.");
      return;
    }

    try {
      // Constantes iniciales según el código base en VB
      const C = Math.pow(Q, 2) / (9.81 * Math.pow(y1, 5));
      const C1 = Math.pow(y1 / D, 4);

      // Función para calcular los parámetros en función del tirante y
      const calcParams = (yVal) => {
        const w = 1 - (2 * yVal / D);
        const arcocosw = 1.570796 - Math.atan(w / Math.sqrt(1 - w * w));
        const N = (1 / 4) * arcocosw - (1 / 2) * Math.sqrt((yVal / D) - Math.pow(yVal / D, 2)) * w;
        const A = N * Math.pow(D, 2);
        const K = 1 - (1 / 2) / (yVal / D) + (2 * Math.sqrt(yVal / D) * Math.pow(1 - yVal / D, 1.5)) / (3 * N);
        return { w, arcocosw, N, A, K };
      };

      // Cálculo de parámetros con el tirante conjugado y1
      const paramsY1 = calcParams(y1);
      const N1 = paramsY1.N;
      const K1 = paramsY1.K;
      const A1 = paramsY1.A;
      const C2 = K1 * Math.pow(N1, 2);
      const C3 = N1 / y1;

      // Iteración para ajustar el valor del tirante (y2)
      let y = y2;
      let diff = 1;
      const tolerance = 0.0001;
      let iteration = 0;
      let F = 0, FPlus = 0;

      while (diff > tolerance && iteration < 10000) {
        const params = calcParams(y);
        const N2 = params.N;
        const k2 = params.K;
        F = (k2 * N2 * y * C3 - C2) / (C1 * (1 - N1 / N2)) - C;

        // Incremento pequeño
        const delta = 0.0001;
        const yPlus = y + delta;
        const paramsPlus = calcParams(yPlus);
        const N2Plus = paramsPlus.N;
        const k2Plus = paramsPlus.K;
        FPlus = (k2Plus * N2Plus * yPlus * C3 - C2) / (C1 * (1 - N1 / N2Plus)) - C;

        // Fórmula de la secante para calcular el nuevo valor
        const YC = yPlus - delta * (FPlus) / (FPlus - F);
        diff = Math.abs(YC - y);
        y = YC;
        iteration++;

        if (y >= D) {
          alert("Incrementa el diámetro");
          break;
        }
      }

      const finalY2 = y; // Tirante ajustado

      // Cálculo de las energías E1 y E2
      const E1 = y1 + Math.pow(Q, 2) / (19.62 * Math.pow(A1, 2));
      const finalParams = calcParams(finalY2);
      const A2 = finalParams.A;
      const E2 = finalY2 + Math.pow(Q, 2) / (19.62 * Math.pow(A2, 2));
      const E3 = Math.abs(E1 - E2);
      const y3 = Math.abs(finalY2 - y1);

      // Determinar si el flujo es subcrítico o supercrítico
      const mensajeFlujo = finalY2 > y1 ? "El tirante es subcrítico" : "El tirante es supercrítico";

      setResultados({
        energiaE: E2.toFixed(14),
        perdidaEnergiaE3: E3.toFixed(16),
        alturaResaltoY3: y3.toFixed(14),
        mensajeFlujo,
      });
    } catch (error) {
      console.error("Error en el cálculo:", error);
      alert("Ha ocurrido un error en los cálculos. Verifica los datos de entrada o revisa los cálculos.");
    }
  };

  return (
    <div className="py-12">
      <BackButton />
      <div className="bg-white p-6 rounded-lg shadow-md border border-gray-300 max-w-2xl mx-auto mt-6">
        {/* Título del Experimento */}
        <h1 className="text-2xl font-bold text-blue-700 text-center mb-6">
          Análisis de Tirante Conjugado en Sección Circular
        </h1>

        {/* Sección de Datos de Entrada */}
        <div className="space-y-4">
          {/* Caudal Q */}
          <div className="flex flex-col">
            <label className="text-gray-700 font-medium">
              Caudal Q (m³/s):
            </label>
            <input
              type="number"
              value={caudal}
              onChange={(e) => setCaudal(e.target.value)}
              placeholder="Ingresa el caudal"
              className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
            />
          </div>

          {/* Diámetro D */}
          <div className="flex flex-col">
            <label className="text-gray-700 font-medium">
              Diámetro D (m):
            </label>
            <input
              type="number"
              value={diametro}
              onChange={(e) => setDiametro(e.target.value)}
              placeholder="Ingresa el diámetro"
              className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
            />
          </div>

          {/* Tirante Conjugado Y1 */}
          <div className="flex flex-col">
            <label className="text-gray-700 font-medium">
              Tirante Conjugado Y1 (m):
            </label>
            <input
              type="number"
              value={tiranteConjugado}
              onChange={(e) => setTiranteConjugado(e.target.value)}
              placeholder="Ingresa el tirante conjugado"
              className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
            />
          </div>

          {/* Valor Inicial del Tirante Y2 */}
          <div className="flex flex-col">
            <label className="text-gray-700 font-medium">
              Valor Inicial del Tirante Y2 (m):
            </label>
            <input
              type="number"
              value={tiranteInicial}
              onChange={(e) => setTiranteInicial(e.target.value)}
              placeholder="Ingresa el valor inicial"
              className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
            />
          </div>
        </div>

        {/* Botones Secundarios */}
        <div className="flex justify-center gap-4 mt-6">
          <button
            onClick={cargarEjemplo}
            className="px-4 py-2 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-600 transition"
          >
            Ejemplo
          </button>
          <button
            onClick={limpiarCampos}
            className="px-4 py-2 bg-red-500 text-white font-semibold rounded-lg shadow-md hover:bg-red-600 transition"
          >
            Limpiar
          </button>
        </div>

        {/* Botón de Calcular */}
        <div className="mt-4">
          <button
            onClick={calcular}
            className="w-full px-4 py-2 bg-green-500 text-white font-semibold rounded-lg shadow-md hover:bg-green-600 transition"
          >
            Calcular
          </button>
        </div>

        {/* Sección de Resultados */}
        {resultados.energiaE && (
          <div className="mt-6 p-6 bg-gray-50 rounded-lg shadow-md border border-gray-300">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Resultados</h2>
            <p className="text-lg font-medium text-gray-700">
              ENERGÍA E: <span className="font-bold text-blue-700">{resultados.energiaE}</span>
            </p>
            <p className="text-lg font-medium text-gray-700">
              PERDIDA DE ENERGÍA E3: <span className="font-bold text-blue-700">{resultados.perdidaEnergiaE3}</span>
            </p>
            <p className="text-lg font-medium text-gray-700">
              ALTURA DEL RESALTO HIDRÁULICO Y3: <span className="font-bold text-blue-700">{resultados.alturaResaltoY3} m</span>
            </p>
            <p className="text-lg font-medium text-gray-700">
              {resultados.mensajeFlujo}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TiranteConjugadoCircular;
