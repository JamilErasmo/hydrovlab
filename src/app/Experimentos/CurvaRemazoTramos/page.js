'use client';
import React, { useState } from 'react';
import BackButton from "@/components/BackButton"; // Ajusta la ruta según la ubicación

const CurvaDeRemanso = () => {
  const [caudal, setCaudal] = useState('');
  const [anchoSolera, setAnchoSolera] = useState('');
  const [talud, setTalud] = useState('');
  const [pendiente, setPendiente] = useState('');
  const [rugosidad, setRugosidad] = useState('');
  const [distanciaInicial, setDistanciaInicial] = useState('');
  const [distanciaTramo, setDistanciaTramo] = useState('');
  const [numTramos, setNumTramos] = useState('');
  const [tiranteInicial, setTiranteInicial] = useState('');
  const [errorAprox, setErrorAprox] = useState('');
  const [resultados, setResultados] = useState([]);
  const [error, setError] = useState('');

  const cargarEjemplo = () => {
    setCaudal(1.5);
    setAnchoSolera(1.5);
    setTalud(1);
    setPendiente(0.0005);
    setRugosidad(0.015);
    setDistanciaInicial(0);
    setDistanciaTramo(-20);
    setNumTramos(10);
    setTiranteInicial(0.423);
    setErrorAprox(0.0001);
    setError('');
  };

  const limpiarCampos = () => {
    setCaudal('');
    setAnchoSolera('');
    setTalud('');
    setPendiente('');
    setRugosidad('');
    setDistanciaInicial('');
    setDistanciaTramo('');
    setNumTramos('');
    setTiranteInicial('');
    setErrorAprox('');
    setResultados([]);
    setError('');
  };

  const calcular = () => {
    const Q = parseFloat(caudal);
    const B = parseFloat(anchoSolera);
    const Z = parseFloat(talud);
    const S = parseFloat(pendiente);
    const N = parseFloat(rugosidad);
    const X1 = parseFloat(distanciaInicial);
    const X = parseFloat(distanciaTramo);
    const NT = parseInt(numTramos);
    const Y1 = parseFloat(tiranteInicial);
    const Er = parseFloat(errorAprox);

    if (
      isNaN(Q) ||
      isNaN(B) ||
      isNaN(Z) ||
      isNaN(S) ||
      isNaN(N) ||
      isNaN(X1) ||
      isNaN(X) ||
      isNaN(NT) ||
      isNaN(Y1) ||
      isNaN(Er)
    ) {
      setError('Por favor, asegúrese de llenar todos los campos correctamente.');
      return;
    }
    setError('');

    const M = Math.sqrt(1 + Z ** 2);
    const resultadosCalculados = [];
    resultadosCalculados.push({ x: X1.toFixed(0), y: Y1.toFixed(3) });

    let i = 0;
    let currentX = X1;
    let currentY = Y1;

    while (i < NT) {
      const A1 = (B + Z * currentY) * currentY;
      const P1 = B + 2 * currentY * M;
      const R1 = A1 / P1;
      const V1 = Q / A1;

      const C = S * X + currentY + V1 ** 2 / 19.62 - X * (V1 * N) ** 2 / (2 * R1 ** (4 / 3));

      let Y2 = currentY;
      let F;
      let iterCount = 0;

      do {
        const A = (B + Z * Y2) * Y2;
        const P = B + 2 * Y2 * M;
        const R = A / P;
        const T = B + 2 * Z * Y2;
        const Q1 = Q ** 2 / A ** 3;

        F = Y2 + Q1 * A / 19.62 + X * Q1 * P * N ** 2 / (2 * R ** (1 / 3)) - C;

        const D = 1 - Q1 * T / 9.81 + X * Q * N ** 2 * (4 * M - (5 * T) / R) / (3 * R ** (1 / 3));

        if (D === 0) {
          console.error('Error: División por cero en el cálculo de D.');
          break;
        }

        Y2 -= F / D;
        iterCount++;

        if (iterCount > 1000) {
          console.error('Límite de iteraciones alcanzado.');
          break;
        }
      } while (Math.abs(F) >= Er);

      currentY = Y2;
      currentX += X;

      resultadosCalculados.push({ x: currentX.toFixed(0), y: currentY.toFixed(3) });
      i++;
    }

    setResultados(resultadosCalculados);
  };

  return (
    <div className="py-6">
      <BackButton />
      <div className="max-w-3xl mx-auto bg-white p-6 rounded-lg shadow-md border border-gray-300 mt-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4 text-center">Curva de Remanso (Tramos Fijos)</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { label: "Caudal Q (m³/s):", value: caudal, setter: setCaudal },
            { label: "Ancho de Solera B (m):", value: anchoSolera, setter: setAnchoSolera },
            { label: "Talud:", value: talud, setter: setTalud },
            { label: "Pendiente (m/m):", value: pendiente, setter: setPendiente },
            { label: "Coeficiente de Rugosidad:", value: rugosidad, setter: setRugosidad },
            { label: "Distancia Inicial X1 (m):", value: distanciaInicial, setter: setDistanciaInicial },
            { label: "Distancia del Tramo X (m):", value: distanciaTramo, setter: setDistanciaTramo },
            { label: "Número de Tramos:", value: numTramos, setter: setNumTramos },
            { label: "Tirante Inicial Y1 (m):", value: tiranteInicial, setter: setTiranteInicial },
            { label: "Error de Aproximación:", value: errorAprox, setter: setErrorAprox }
          ].map(({ label, value, setter }, index) => (
            <div key={index} className="flex flex-col">
              <label className="text-gray-700 font-medium">{label}</label>
              <input
                type="number"
                value={value}
                onChange={(e) => {
                  setter(e.target.value);
                  setError('');
                }}
                className="w-full p-2 mt-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
              />
            </div>
          ))}
        </div>
        <div className="mt-6 flex justify-center space-x-4">
          <button
            onClick={cargarEjemplo}
            className="px-5 py-2 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-600 transition"
          >
            Ejemplo
          </button>
          <button
            onClick={calcular}
            className="px-5 py-2 bg-green-500 text-white font-semibold rounded-lg shadow-md hover:bg-green-600 transition"
          >
            Calcular
          </button>
          <button
            onClick={limpiarCampos}
            className="px-5 py-2 bg-red-500 text-white font-semibold rounded-lg shadow-md hover:bg-red-600 transition"
          >
            Limpiar
          </button>
        </div>
        {/* Mostrar mensaje de error si existe */}
        {error && <p className="text-red-500 text-center mt-4">{error}</p>}
      </div>

      {resultados.length > 0 && (
        <div className="bg-white p-6 shadow-md rounded-lg border border-gray-300 mt-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Resultados</h2>
          <div className="overflow-x-auto">
            <table className="w-full border border-gray-400 bg-white shadow-md rounded-lg text-gray-700">
              <thead>
                <tr className="bg-gray-200">
                  <th className="p-3 border border-gray-400">Distancia X (m)</th>
                  <th className="p-3 border border-gray-400">Tirante Y (m)</th>
                </tr>
              </thead>
              <tbody>
                {resultados.map((resultado, index) => (
                  <tr key={index} className="border border-gray-300 hover:bg-gray-100 transition">
                    <td className="p-2 text-center">{resultado.x}</td>
                    <td className="p-2 text-center">{resultado.y}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default CurvaDeRemanso;
