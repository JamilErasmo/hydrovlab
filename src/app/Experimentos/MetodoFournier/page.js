'use client';
import React, { useState } from "react";

const ExperimentoFournier = () => {
  const [p, setP] = useState("");
  const [pp, setPp] = useState("");
  const [h, setH] = useState("");
  const [alfa, setAlfa] = useState("");
  const [e, setE] = useState(null);
  const [eh, setEh] = useState(null);
  const [el, setEl] = useState(null);

  // Función para cargar valores de ejemplo
  const cargarEjemplo = () => {
    setP(90);
    setPp(50);
    setH(20);
    setAlfa(1000);
  };

  // Función para limpiar los campos
  const limpiarCampos = () => {
    setP("");
    setPp("");
    setH("");
    setAlfa("");
    setE(null);
    setEh(null);
    setEl(null);
  };

  // Función para calcular los resultados
  const calcular = () => {
    const P = parseFloat(p);
    const Pp = parseFloat(pp);
    const H = parseFloat(h);
    const Alfa = parseFloat(alfa) / 100;

    if (isNaN(P) || isNaN(Pp) || isNaN(H) || isNaN(Alfa) || P <= 0 || Pp <= 0 || H <= 0 || Alfa <= 0) {
      alert("Por favor, ingresa valores válidos en todos los campos.");
      return;
    }

    // Fórmulas del experimento
    const E = 0.0275 * Math.pow((Pp * Pp) / P, 2.65) * Math.pow(H * Alfa, 0.46);
    const EH = 52.4 * Math.pow(Pp, 2) / P - 513.21;
    const EL = 27.12 * Math.pow(Pp, 2) / P - 475.4;

    setE(E.toFixed(3));
    setEh(EH.toFixed(3));
    setEl(EL.toFixed(3));
  };

  return (
    <div className="py-10">

      <div className="bg-white p-6 rounded-lg shadow-md border border-gray-300 max-w-lg mx-auto mt-6">


        {/* Título Principal */}
        <h1 className="text-2xl font-bold text-blue-700 text-center uppercase tracking-wide border-b pb-2 mb-4">
          Experimento Fournier
        </h1>

        {/* Sección de Entrada de Datos */}
        <div className="space-y-4">

          {/* Campo: Caudal Q */}
          <div className="flex flex-col">
            <label className="text-gray-700 font-medium">Caudal Q (m³/seg):</label>
            <input
              type="number"
              value={p}
              onChange={(e) => setP(e.target.value)}
              placeholder="Ingresa un valor"
              className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
            />
          </div>

          {/* Campo: Factor (a y n) */}
          <div className="flex flex-col">
            <label className="text-gray-700 font-medium">Factor (a y n):</label>
            <input
              type="number"
              value={pp}
              onChange={(e) => setPp(e.target.value)}
              placeholder="Ingresa un valor"
              className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
            />
          </div>

          {/* Campo: Factor a */}
          <div className="flex flex-col">
            <label className="text-gray-700 font-medium">Factor a:</label>
            <input
              type="number"
              value={h}
              onChange={(e) => setH(e.target.value)}
              placeholder="Ingresa un valor"
              className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
            />
          </div>

          {/* Campo: Factor n */}
          <div className="flex flex-col">
            <label className="text-gray-700 font-medium">Factor n:</label>
            <input
              type="number"
              value={alfa}
              onChange={(e) => setAlfa(e.target.value)}
              placeholder="Ingresa un valor"
              className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
            />
          </div>

        </div>

        {/* Contenedor de Botones */}
        <div className="flex justify-center gap-4 mt-6">

          {/* Botón de Ejemplo */}
          <button
            onClick={cargarEjemplo}
            className="px-6 py-2 bg-gray-500 text-white font-semibold rounded-lg shadow-md hover:bg-gray-600 transition"
          >
            Ejemplo
          </button>

          {/* Botón de Calcular */}
          <button
            onClick={calcular}
            className="px-6 py-2 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-600 transition"
          >
            Calcular
          </button>

          {/* Botón de Limpiar */}
          <button
            onClick={limpiarCampos}
            className="px-6 py-2 bg-red-500 text-white font-semibold rounded-lg shadow-md hover:bg-red-600 transition"
          >
            Limpiar
          </button>

        </div>


        {/* Contenedor de Resultados */}
        {e !== null && eh !== null && el !== null && (
          <div className="bg-white p-6 rounded-lg shadow-md border border-gray-300 max-w-2xl mx-auto mt-6">

            {/* Título Principal */}
            <h2 className="text-2xl font-bold text-blue-700 text-center uppercase tracking-wide border-b pb-2 mb-4">
              Resultados
            </h2>

            {/* Sección: Producción de Sedimentos */}
            <div className="mb-6 p-4 bg-gray-100 rounded-lg shadow">
              <h3 className="text-xl font-semibold text-gray-800">Producción de Sedimentos</h3>
              <p className="text-gray-600 text-sm mt-1">
                <strong>E = 0.0275 * ((pp² / P)<sup>2.65</sup>) * ((H * alfa)<sup>0.46</sup>)</strong>
              </p>
              <p className="text-blue-800 text-lg font-bold mt-2">E Tom/km²*año: {e}</p>
            </div>

            {/* Sección: Cuencas con Relieves Altos */}
            <div className="mb-6 p-4 bg-gray-100 rounded-lg shadow">
              <h3 className="text-xl font-semibold text-gray-800">Cuencas con Relieves Altos</h3>
              <p className="text-gray-600 text-sm mt-1">
                <strong>EH = 52.4 * (pp² / P) - 513.21</strong>
              </p>
              <p className="text-green-800 text-lg font-bold mt-2">EH Tom/km²*año: {eh}</p>
            </div>

            {/* Sección: Cuencas con Relieves Bajos */}
            <div className="p-4 bg-gray-100 rounded-lg shadow">
              <h3 className="text-xl font-semibold text-gray-800">Cuencas con Relieves Bajos</h3>
              <p className="text-gray-600 text-sm mt-1">
                <strong>EL = 27.12 * (pp² / P) - 475.4</strong>
              </p>
              <p className="text-red-800 text-lg font-bold mt-2">EL Tom/km²*año: {el}</p>
            </div>

          </div>
        )}

      </div>
    </div>
  );
};

export default ExperimentoFournier;
