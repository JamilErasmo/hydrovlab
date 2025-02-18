'use client';
import React, { useState } from 'react';
import BackButton from "@/components/BackButton"; // Ajusta la ruta según la ubicación
const Experimento5 = () => {
  const [inputs, setInputs] = useState({
    transmisividad: '',
    almacenamiento: '',
    abatimiento: '',
    tiempo: '',
    distancia: '',
    Q: '',
  });

  const [result, setResult] = useState(null);
  const [activeCalculation, setActiveCalculation] = useState('Q');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setInputs({ ...inputs, [name]: value });
  };

  const computeW = (u) => {
    const gamma = 0.5772156649015328606;
    return -gamma - Math.log(u) + u - (u * u) / 4;
  };

  const calculateQ_Exp5 = () => {
    const { transmisividad, almacenamiento, abatimiento, tiempo, distancia } = inputs;
    if (transmisividad && almacenamiento && abatimiento && tiempo && distancia) {
      const T = parseFloat(transmisividad);
      const S = parseFloat(almacenamiento);
      const s = parseFloat(abatimiento);
      const t = parseFloat(tiempo);
      const r = parseFloat(distancia);
      const u = (r * r * S) / (4 * T * t);
      const W = computeW(u);
      const Q = (4 * Math.PI * T * s) / W;
      setResult({ Q: parseFloat(Q.toFixed(2)) });
    } else {
      alert("Por favor, complete todos los campos para calcular el caudal de extracción (Q).");
    }
  };

  const calculateZ_Exp5 = () => {
    const { Q, transmisividad, almacenamiento, tiempo, distancia } = inputs;
    if (Q && transmisividad && almacenamiento && tiempo && distancia) {
      const T = parseFloat(transmisividad);
      const S = parseFloat(almacenamiento);
      const Qval = parseFloat(Q);
      const t = parseFloat(tiempo);
      const r = parseFloat(distancia);
      const u = (r * r * S) / (4 * T * t);
      const W = computeW(u);
      const s = (Qval / (4 * Math.PI * T)) * W;
      setResult({ s: parseFloat(s.toFixed(2)) });
    } else {
      alert("Por favor, complete todos los campos para calcular el abatimiento (Z).");
    }
  };

  const clearFields = () => {
    setInputs({
      transmisividad: '',
      almacenamiento: '',
      abatimiento: '',
      tiempo: '',
      distancia: '',
      Q: '',
    });
    setResult(null);
  };

  const loadExample = () => {
    if (activeCalculation === 'Q') {
      setInputs({
        transmisividad: '752',
        almacenamiento: '0.015',
        abatimiento: '0.32',
        tiempo: '0.265',
        distancia: '115',
        Q: '',
      });
    } else if (activeCalculation === 'Z') {
      setInputs({
        transmisividad: '752',
        almacenamiento: '0.015',
        abatimiento: '',
        tiempo: '0.265',
        distancia: '115',
        Q: '2880',
      });
    }
  };

  return (
    <div className='py-10'>
            <BackButton />
      <div className="max-w-lg mx-auto p-6 bg-white shadow-lg rounded-lg">
        {/* Título */}
        <h2 className="text-center text-2xl font-bold text-blue-700 mb-6">
          Experimento 5: Método Theis
        </h2>

        {/* Botones de Selección */}
        <div className="flex justify-center gap-4 mb-6">
          <button
            onClick={() => setActiveCalculation('Q')}
            className={`px-4 py-2 rounded-md font-medium transition-all ${activeCalculation === 'Q' ? 'bg-blue-700 text-white' : 'bg-gray-400 text-white'
              }`}
          >
            Determinar Q
          </button>
          <button
            onClick={() => setActiveCalculation('Z')}
            className={`px-4 py-2 rounded-md font-medium transition-all ${activeCalculation === 'Z' ? 'bg-blue-700 text-white' : 'bg-gray-400 text-white'
              }`}
          >
            Determinar Z
          </button>
        </div>

        {/* Formulario */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {activeCalculation === 'Q' ? (
            <>
              <label className="text-gray-700 font-medium">Transmisibilidad (m²/día):</label>
              <input type="number" name="transmisividad" value={inputs.transmisividad} onChange={handleChange} className="input-style" />

              <label className="text-gray-700 font-medium">Almacenamiento (-):</label>
              <input type="number" name="almacenamiento" value={inputs.almacenamiento} onChange={handleChange} className="input-style" />

              <label className="text-gray-700 font-medium">Abatimiento (Z) (m):</label>
              <input type="number" name="abatimiento" value={inputs.abatimiento} onChange={handleChange} className="input-style" />

              <label className="text-gray-700 font-medium">Tiempo (días):</label>
              <input type="number" name="tiempo" value={inputs.tiempo} onChange={handleChange} className="input-style" />

              <label className="text-gray-700 font-medium">Distancia radial (m):</label>
              <input type="number" name="distancia" value={inputs.distancia} onChange={handleChange} className="input-style" />
            </>
          ) : (
            <>
              <label className="text-gray-700 font-medium">Caudal de extracción (m³/día):</label>
              <input type="number" name="Q" value={inputs.Q} onChange={handleChange} className="input-style" />

              <label className="text-gray-700 font-medium">Transmisibilidad (m²/día):</label>
              <input type="number" name="transmisividad" value={inputs.transmisividad} onChange={handleChange} className="input-style" />

              <label className="text-gray-700 font-medium">Almacenamiento (-):</label>
              <input type="number" name="almacenamiento" value={inputs.almacenamiento} onChange={handleChange} className="input-style" />

              <label className="text-gray-700 font-medium">Tiempo (días):</label>
              <input type="number" name="tiempo" value={inputs.tiempo} onChange={handleChange} className="input-style" />

              <label className="text-gray-700 font-medium">Distancia radial (m):</label>
              <input type="number" name="distancia" value={inputs.distancia} onChange={handleChange} className="input-style" />
            </>
          )}
        </div>

        {/* Botones de Acción */}
        <div className="flex justify-center gap-4 mb-6">
          <button onClick={activeCalculation === 'Q' ? calculateQ_Exp5 : calculateZ_Exp5}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md transition-all"
          >
            Calcular
          </button>

          <button onClick={clearFields}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md transition-all"
          >
            Limpiar
          </button>

          <button onClick={loadExample}
            className="bg-yellow-400 hover:bg-yellow-500 text-black px-4 py-2 rounded-md transition-all"
          >
            Ejemplo
          </button>
        </div>

        {/* Resultado */}
        {result && (
          <div className="bg-gray-100 border-l-4 border-blue-500 p-4 rounded-md text-center">
            <h3 className="font-bold text-blue-700">Resultado:</h3>
            {activeCalculation === 'Q' ? (
              <p className="text-lg"><strong>Caudal de extracción (Q):</strong> {result.Q} m³/día</p>
            ) : (
              <p className="text-lg"><strong>Abatimiento (Z):</strong> {result.s} m</p>
            )}
          </div>
        )}
      </div>
    </div>


  );
};

export default Experimento5;
