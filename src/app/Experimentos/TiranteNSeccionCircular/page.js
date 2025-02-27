'use client';
import React, { useState } from 'react';
import BackButton from "@/components/BackButton"; // Ajusta la ruta según la ubicación

const ExperimentoCircular = () => {
  const [data, setData] = useState({
    Q: '',
    D: '',
    N: '',
    S: '',
    y: '', // Este valor no se usará directamente, se calcula internamente
  });

  const [results, setResults] = useState({
    yResult: '',
    v: '',
    f2: '',
    En: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setData({ ...data, [name]: parseFloat(value) });
  };

  const calcular = () => {
    // Extraemos las variables de entrada
    const { Q, D, N, S } = data;
    // c es constante en el problema
    const c = Q * N / Math.sqrt(S);
    const delta = 0.0001;
    const tol = 0.0000001; // tolerancia para convergencia
    let iteration = 0, maxIter = 10000;

    // Función que dado un y calcula f(y) = (a^(5/3))/(p^(2/3)) - c
    const fFunction = (yVal) => {
      const w = 1 - (2 * yVal / D);
      const arcosw = 1.570796 - Math.atan(w / Math.sqrt(1 - Math.pow(w, 2)));
      const x = 2 * arcosw;
      const a = (x - Math.sin(x)) * Math.pow(D, 2) / 8;
      const p = x * D / 2;
      return Math.pow(a, 5 / 3) / Math.pow(p, 2 / 3) - c;
    };

    // Inicializamos y con 35% del diámetro, como en el código original
    let y_old = 0.35 * D;
    let y_new = y_old;

    // Iteramos usando el método de Newton–Raphson
    do {
      const f_y = fFunction(y_old);
      const f_y_delta = fFunction(y_old + delta);
      const derivative = (f_y_delta - f_y) / delta;
      if (derivative === 0) break; // evitar división por cero
      y_new = y_old - f_y / derivative;
      if (y_new >= D) {
        alert("Aumente el diámetro");
        return;
      }
      if (Math.abs(y_new - y_old) < tol) break;
      y_old = y_new;
      iteration++;
      if (iteration > maxIter) break;
    } while (true);

    // Con y convergido, recalculamos los valores finales:
    const y_final = y_new;
    const w = 1 - (2 * y_final / D);
    const arcosw = 1.570796 - Math.atan(w / Math.sqrt(1 - Math.pow(w, 2)));
    const x = 2 * arcosw;
    const a = (x - Math.sin(x)) * Math.pow(D, 2) / 8;
    const p = x * D / 2;
    const v = Q / a;
    const t = D * Math.sin(x / 2);
    const f2 = v / Math.sqrt(9.81 * a / t);
    const En = y_final + Math.pow(v, 2) / 19.62;

    setResults({
      yResult: y_final.toFixed(15),
      v: v.toFixed(15),
      f2: f2.toFixed(15),
      En: En.toFixed(15)
    });
  };

  const cargarEjemplo = () => {
    setData({
      Q: 1,
      D: 1.5,
      N: 0.015,
      S: 0.0005,
      y: 0.5,
    });
    setResults({
      yResult: '',
      v: '',
      f2: '',
      En: ''
    });
  };

  const limpiar = () => {
    setData({
      Q: '',
      D: '',
      N: '',
      S: '',
      y: '',
    });
    setResults({
      yResult: '',
      v: '',
      f2: '',
      En: ''
    });
  };

  return (
    <div className="py-10">
      <BackButton />
      <div className="bg-white p-6 rounded-lg shadow-md border border-gray-300 max-w-2xl mx-auto mt-6">
        <h1 className="text-2xl font-bold text-blue-700 text-center mb-6">
          Tirante Normal de Sección Circular
        </h1>
        <div className="flex justify-center mb-2">
          {/* Reemplaza la siguiente ruta con la imagen deseada */}
          <img src="\images\imageSTrapezoidal.png" alt="Imagen descriptiva" className="max-h-48 object-contain" />
        </div>
        <div className="mb-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Datos de Entrada</h3>

          <label className="block text-gray-700 font-medium">CAUDAL Q (m³/s):</label>
          <input
            type="number"
            name="Q"
            value={data.Q}
            onChange={handleInputChange}
            className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 transition"
          />

          <label className="block text-gray-700 font-medium mt-4">DIÁMETRO (m):</label>
          <input
            type="number"
            name="D"
            value={data.D}
            onChange={handleInputChange}
            className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 transition"
          />

          <label className="block text-gray-700 font-medium mt-4">COEF. RUGOSIDAD:</label>
          <input
            type="number"
            name="N"
            value={data.N}
            onChange={handleInputChange}
            className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 transition"
          />

          <label className="block text-gray-700 font-medium mt-4">PENDIENTE (m/m):</label>
          <input
            type="number"
            name="S"
            value={data.S}
            onChange={handleInputChange}
            className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 transition"
          />

          <label className="block text-gray-700 font-medium mt-4">TIRANTE INICIAL (m):</label>
          <input
            type="number"
            name="y"
            value={data.y}
            onChange={handleInputChange}
            className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 transition"
          />
        </div>

        <div className="flex justify-center gap-4 mb-6">
          <button
            onClick={calcular}
            className="px-4 py-2 bg-green-500 text-white font-semibold rounded-lg shadow-md hover:bg-green-600 transition"
          >
            Calcular
          </button>
          <button
            onClick={cargarEjemplo}
            className="px-4 py-2 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-600 transition"
          >
            Cargar Ejemplo
          </button>
          <button
            onClick={limpiar}
            className="px-4 py-2 bg-red-500 text-white font-semibold rounded-lg shadow-md hover:bg-red-600 transition"
          >
            Limpiar
          </button>
        </div>

        {results.yResult && (
          <div className="p-6 bg-gray-50 rounded-lg shadow-md border border-gray-300">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Resultados</h2>
            <p className="text-lg text-gray-700">
              <strong>Tirante Normal (y):</strong> {results.yResult}
            </p>
            <p className="text-lg text-gray-700">
              <strong>Velocidad (v):</strong> {results.v}
            </p>
            <p className="text-lg text-gray-700">
              <strong>Número de Froude (f2):</strong> {results.f2}
            </p>
            <p className="text-lg text-gray-700">
              <strong>Energía Específica (En):</strong> {results.En}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ExperimentoCircular;
