'use client';
import React, { useState } from 'react';
import '../App.css';

const CurvaRemansoBakhmeteff = () => {
  const [caudal, setCaudal] = useState('');
  const [anchoSolera, setAnchoSolera] = useState('');
  const [talud, setTalud] = useState('');
  const [pendiente, setPendiente] = useState('');
  const [tiranteNormal, setTiranteNormal] = useState('');
  const [tiranteCritico, setTiranteCritico] = useState('');
  const [tiranteInicial, setTiranteInicial] = useState('');
  const [tiranteFinal, setTiranteFinal] = useState('');
  const [incrementoTirante, setIncrementoTirante] = useState('');
  const [resultados, setResultados] = useState([]);

  const cargarEjemplo = () => {
    setCaudal(0.9);
    setAnchoSolera(1);
    setTalud(1);
    setPendiente(0.0005);
    setTiranteNormal(0.676);
    setTiranteCritico(0.381);
    setTiranteInicial(0.381);
    setTiranteFinal(0.537);
    setIncrementoTirante(0.026);
  };

  const limpiarCampos = () => {
    setCaudal('');
    setAnchoSolera('');
    setTalud('');
    setPendiente('');
    setTiranteNormal('');
    setTiranteCritico('');
    setTiranteInicial('');
    setTiranteFinal('');
    setIncrementoTirante('');
    setResultados([]);
  };

  const calcular = () => {
    const Q = parseFloat(caudal);
    const B = parseFloat(anchoSolera);
    const Z = parseFloat(talud);
    const S = parseFloat(pendiente);
    const YN = parseFloat(tiranteNormal);
    const YC = parseFloat(tiranteCritico);
    const Y1 = parseFloat(tiranteInicial);
    const Y2 = parseFloat(tiranteFinal);
    const Y3 = parseFloat(incrementoTirante);

    if (isNaN(Q) || isNaN(B) || isNaN(Z) || isNaN(S) || isNaN(YN) || isNaN(YC) || isNaN(Y1) || isNaN(Y2) || isNaN(Y3)) {
      alert('Por favor, ingrese todos los valores numéricos correctamente.');
      return;
    }

    let resultadosCalculados = [];
    let XPrev = 0;

    for (let Y = Y1; Y <= Y2; Y += Y3) {
      const A = B * Y + Z * Y ** 2; // Área hidráulica
      const P = B + 2 * Y * Math.sqrt(1 + Z ** 2); // Perímetro mojado
      const R = A / P; // Radio hidráulico
      const V = Q / A; // Velocidad

      // Pérdida de energía específica
      const E = Y + (V ** 2) / (2 * 9.81);

      // Cálculo de distancia usando la ecuación de remanso simplificada
      const dE = ((S - (V ** 2) / (9.81 * R)) / (1 - (V ** 2) / (9.81 * Y)));
      const dX = dE * 100; // Escalado para representarlo en metros

      const X = XPrev + dX;
      XPrev = X;

      resultadosCalculados.push({
        Y: Y.toFixed(3),
        A: A.toFixed(3),
        P: P.toFixed(3),
        R: R.toFixed(3),
        V: V.toFixed(3),
        E: E.toFixed(3),
        X: X.toFixed(3),
      });
    }

    setResultados(resultadosCalculados);
  };

  return (
    <div className="app">


      {/* Contenedor principal */}
      <div className="flex flex-col bg-white p-6 shadow-md rounded-lg border border-gray-300">

        {/* Título */}
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Datos de Entrada</h2>

        {/* Contenedor de Inputs */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { label: "Caudal Q (m³/s):", value: caudal, setter: setCaudal },
            { label: "Ancho de Solera B (m):", value: anchoSolera, setter: setAnchoSolera },
            { label: "Talud:", value: talud, setter: setTalud },
            { label: "Pendiente (m/m):", value: pendiente, setter: setPendiente },
            { label: "Tirante Normal YN (m):", value: tiranteNormal, setter: setTiranteNormal },
            { label: "Tirante Crítico YC (m):", value: tiranteCritico, setter: setTiranteCritico },
            { label: "Tirante Inicial Y1 (m):", value: tiranteInicial, setter: setTiranteInicial },
            { label: "Tirante Final Y2 (m):", value: tiranteFinal, setter: setTiranteFinal },
            { label: "Incremento del Tirante Y3 (m):", value: incrementoTirante, setter: setIncrementoTirante }
          ].map(({ label, value, setter }, index) => (
            <div key={index} className="flex flex-col">
              <label className="text-gray-700 font-medium">{label}</label>
              <input
                type="number"
                value={value}
                onChange={(e) => setter(e.target.value)}
                className="w-full p-2 mt-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
              />
            </div>
          ))}
        </div>

        {/* Botonera */}
        <div className="mt-6 flex justify-between">
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

      </div>

      {resultados.length > 0 && (
        <div className="bg-white p-6 shadow-md rounded-lg border border-gray-300 mt-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Resultados</h2>

          <div className="overflow-x-auto">
            <table className="w-full border border-gray-400 bg-white shadow-md rounded-lg text-gray-700">
              <thead>
                <tr className="bg-gray-200">
                  <th className="p-3 border border-gray-400">Y</th>
                  <th className="p-3 border border-gray-400">A (m²)</th>
                  <th className="p-3 border border-gray-400">P (m)</th>
                  <th className="p-3 border border-gray-400">R (m)</th>
                  <th className="p-3 border border-gray-400">V (m/s)</th>
                  <th className="p-3 border border-gray-400">E (m)</th>
                  <th className="p-3 border border-gray-400">X (m)</th>
                </tr>
              </thead>
              <tbody>
                {resultados.map((resultado, index) => (
                  <tr key={index} className="border border-gray-300 hover:bg-gray-100 transition">
                    <td className="p-2 text-center">{resultado.Y}</td>
                    <td className="p-2 text-center">{resultado.A}</td>
                    <td className="p-2 text-center">{resultado.P}</td>
                    <td className="p-2 text-center">{resultado.R}</td>
                    <td className="p-2 text-center">{resultado.V}</td>
                    <td className="p-2 text-center">{resultado.E}</td>
                    <td className="p-2 text-center">{resultado.X}</td>
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

export default CurvaRemansoBakhmeteff;
