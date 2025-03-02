'use client';
import React, { useState } from 'react';
import BackButton from "@/components/BackButton"; // Ajusta la ruta según corresponda

const CurvaRemansoBakhmeteffUnico = () => {
  const [caudal, setCaudal] = useState('');
  const [anchoSolera, setAnchoSolera] = useState('');
  const [talud, setTalud] = useState('');
  const [pendiente, setPendiente] = useState('');
  const [tiranteNormal, setTiranteNormal] = useState('');
  const [tiranteCritico, setTiranteCritico] = useState('');
  const [tiranteInicial, setTiranteInicial] = useState('');
  const [tiranteFinal, setTiranteFinal] = useState('');
  const [incrementoTirante, setIncrementoTirante] = useState('');
  const [resultado, setResultado] = useState(null);

  // Función de integración usando Simpson con 20 subintervalos
  const simpsonIntegration = (upper, N_val, n = 20) => {
    const H = upper / n;
    let sum1 = 0;
    for (let i = 1; i <= n - 1; i++) {
      const K = i * H;
      const denom = 1 - Math.pow(K, N_val);
      const FA = denom === 0 ? 0 : 1 / denom;
      sum1 += FA;
    }
    const area1 = sum1 * 2;
    const term0 = 1; // f(0)
    const termB = 1 / (1 - Math.pow(upper, N_val));
    const area2 = area1 + term0 + termB;
    let sum2 = 0;
    for (let i = 1; i <= n; i++) {
      const K = (i - 0.5) * H;
      const denom = 1 - Math.pow(K, N_val);
      const FB = denom === 0 ? 0 : 1 / denom;
      sum2 += FB;
    }
    const area3 = area2 + 4 * sum2;
    return (H / 6) * area3;
  };

  const cargarEjemplo = () => {
    setCaudal('0.9');
    setAnchoSolera('1');
    setTalud('1');
    setPendiente('0.0005');
    setTiranteNormal('0.676');
    setTiranteCritico('0.381');
    setTiranteInicial('0.381');
    setTiranteFinal('0.537');
    setIncrementoTirante('0.026');
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
    setResultado(null);
  };

  const calcular = () => {
    const Q = parseFloat(caudal);
    const B_input = parseFloat(anchoSolera);
    const Z = parseFloat(talud);
    const S = parseFloat(pendiente);
    const YN = parseFloat(tiranteNormal);
    const YC = parseFloat(tiranteCritico);
    const Y1 = parseFloat(tiranteInicial);
    const Y2 = parseFloat(tiranteFinal);
    const Y3 = parseFloat(incrementoTirante);

    if ([Q, B_input, Z, S, YN, YC, Y1, Y2, Y3].some(val => isNaN(val))) {
      alert('Por favor, ingrese todos los valores numéricos correctamente.');
      return;
    }

    // Cálculos intermedios (según el código VB original)
    const YM = Y1; // (Y1 + Y1)/2
    const BZ2 = B_input + 2 * Z * YM;
    const BZ = B_input + Z * YM;
    const ZR = Math.sqrt(1 + Z * Z);
    const N_val = (10 / 3) * (BZ2 / BZ) - (8 / 3) * (ZR * YM / (B_input + 2 * ZR * YM));
    const M_val = (3 * Math.pow(BZ2, 2) - 2 * Z * YM * BZ) / (BZ2 * BZ);
    const J_val = N_val / (N_val - M_val + 1);

    // Cálculo de DINIC usando Y1 (estado inicial)
    const U_initial = Y1 / YN;
    const fun_initial = simpsonIntegration(U_initial, N_val, 20);
    const X1_initial = (YN / S) * (U_initial - fun_initial);
    const V_initial = Math.pow(U_initial, N_val / J_val);
    const funV_initial = simpsonIntegration(V_initial, N_val, 20);
    const X2_initial = (YN / S) * (J_val / N_val) * Math.pow(YC / YN, M_val) * funV_initial;
    const DINIC = X1_initial + X2_initial;

    // Calcular para Y = 0.511 (valor objetivo)
    const Y_target = 0.511;
    const U = Y_target / YN;
    const funU = simpsonIntegration(U, N_val, 20);
    const X1 = (YN / S) * (U - funU);
    const V = Math.pow(U, N_val / J_val);
    const funV = simpsonIntegration(V, N_val, 20);
    const X2 = (YN / S) * (J_val / N_val) * Math.pow(YC / YN, M_val) * funV;
    const DELTAX = X1 + X2;
    const L = Math.abs(DELTAX - DINIC);

    setResultado({
      Y: Y_target.toFixed(3),
      U: U.toFixed(3),
      V: V.toFixed(3),
      funU: funU.toFixed(3),
      funV: funV.toFixed(3),
      DELTAX: DELTAX.toFixed(3),
      L: L.toFixed(3)
    });
  };

  return (
    <div className="py-6">
      <BackButton />

      {/* Contenedor de datos de entrada */}
      <div className="max-w-3xl mx-auto bg-white p-6 rounded-lg shadow-md border border-gray-300">
        {/* Título principal */}
        <h2 className="text-xl font-semibold text-gray-800 mb-4 text-center">
          Curva de Remanso – Bakhmeteff (Resultado Único)
        </h2>
        {/* Espacio para imagen y subtítulo "Datos de entrada" */}
        <div className="mb-4">
          <div className="flex justify-center mb-2">
            {/* Reemplaza la siguiente ruta con la imagen deseada */}
            <img src="\images\imageCurvaBakhmeteff.png" alt="Imagen descriptiva" className="max-h-48 object-contain" />
          </div>
          <h3 className="text-lg font-semibold text-left">Datos de entrada</h3>
        </div>
        {/* Inputs */}
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
            { label: "Incremento del Tirante Y3 (m):", value: incrementoTirante, setter: setIncrementoTirante },
          ].map(({ label, value, setter }, index) => (
            <div key={index} className="flex flex-col">
              <label className="text-gray-700 font-medium">{label}</label>
              <input
                type="number"
                value={value}
                onChange={(e) => setter(e.target.value)}
                className="w-full p-2 mt-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
          ))}
        </div>
        {/* Botones agrupados a la izquierda */}
        <div className="mt-6 flex justify-start space-x-2">
          <button onClick={cargarEjemplo} className="px-5 py-2 bg-blue-500 text-white rounded-lg">
            Ejemplo
          </button>
          <button onClick={calcular} className="px-5 py-2 bg-green-500 text-white rounded-lg">
            Calcular
          </button>
          <button onClick={limpiarCampos} className="px-5 py-2 bg-red-500 text-white rounded-lg">
            Limpiar
          </button>
        </div>
      </div>

      {/* Contenedor de resultados */}
      {resultado && (
        <div className="max-w-3xl mx-auto mt-6">
          {/* Encabezado de resultados fijo en la parte superior del contenedor */}
          <h2 className="sticky top-0 bg-white text-xl font-semibold text-gray-800 mb-2 py-2 border-b border-gray-300">
            Resultados
          </h2>
          <div className="bg-white p-6 rounded-lg shadow-md border border-gray-300 overflow-x-auto">
            <table className="w-full text-center border-collapse">
              <thead>
                <tr className="bg-gray-200">
                  <th className="px-4 py-2 border">Y (m)</th>
                  <th className="px-4 py-2 border">U (m/s)</th>
                  <th className="px-4 py-2 border">V (m/s)</th>
                  <th className="px-4 py-2 border">F (U, N)</th>
                  <th className="px-4 py-2 border">F (V, J)</th>
                  <th className="px-4 py-2 border">DELTAX (m)</th>
                  <th className="px-4 py-2 border">L (m)</th>
                </tr>
              </thead>
              <tbody>
                <tr className="hover:bg-gray-100">
                  <td className="px-4 py-2 border">{resultado.Y}</td>
                  <td className="px-4 py-2 border">{resultado.U}</td>
                  <td className="px-4 py-2 border">{resultado.V}</td>
                  <td className="px-4 py-2 border">{resultado.funU}</td>
                  <td className="px-4 py-2 border">{resultado.funV}</td>
                  <td className="px-4 py-2 border">{resultado.DELTAX}</td>
                  <td className="px-4 py-2 border">{resultado.L}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default CurvaRemansoBakhmeteffUnico;
