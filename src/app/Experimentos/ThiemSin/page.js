'use client';

import React, { useState, useEffect } from 'react';
import BackButton from "@/components/BackButton"; // Ajusta la ruta según la ubicación

const ThiemCalculations = () => {
  const [inputs, setInputs] = useState({
    nivelFreatico: '',
    descenso: '',
    transmisibilidad: '',
    radioPozo: '',
    radioInfluencia: '',
    caudal: '',
  });
  const [results, setResults] = useState({
    Q: null,
    Z: null,
    T: null,
    R: null,
  });
  const [activeCalculation, setActiveCalculation] = useState('Q');

  useEffect(() => {
    setActiveCalculation('Q');
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setInputs({ ...inputs, [name]: value });
  };

  const calculateQ = () => {
    const { nivelFreatico, descenso, transmisibilidad, radioPozo, radioInfluencia } = inputs;
    if (nivelFreatico && descenso && transmisibilidad && radioPozo && radioInfluencia) {
      const Q = (
        (2 * Math.PI * transmisibilidad * descenso) /
        Math.log(radioInfluencia / radioPozo)
      ).toFixed(2);
      setResults({ Q });
    } else {
      alert('Por favor, complete todos los campos para calcular Q.');
    }
  };

  const calculateZ = () => {
    const { caudal, transmisibilidad, radioPozo, radioInfluencia } = inputs;
    if (caudal && transmisibilidad && radioPozo && radioInfluencia) {
      const Z = (
        (caudal * Math.log(radioInfluencia / radioPozo)) /
        (2 * Math.PI * transmisibilidad)
      ).toFixed(2);
      setResults({ Z });
    } else {
      alert('Por favor, complete todos los campos para calcular Z.');
    }
  };

  const calculateT = () => {
    const { caudal, descenso, radioPozo, radioInfluencia } = inputs;
    if (caudal && descenso && radioPozo && radioInfluencia) {
      const T = (
        (caudal * Math.log(radioInfluencia / radioPozo)) /
        (2 * Math.PI * descenso)
      ).toFixed(2);
      setResults({ T });
    } else {
      alert('Por favor, complete todos los campos para calcular T.');
    }
  };

  const calculateR = () => {
    const { caudal, transmisibilidad, descenso, radioPozo } = inputs;
    if (caudal && transmisibilidad && descenso && radioPozo) {
      const R = (
        radioPozo * Math.exp((2 * Math.PI * transmisibilidad * descenso) / caudal)
      ).toFixed(2);
      setResults({ R });
    } else {
      alert('Por favor, complete todos los campos para calcular R.');
    }
  };

  const clearFields = () => {
    setInputs({
      nivelFreatico: '',
      descenso: '',
      transmisibilidad: '',
      radioPozo: '',
      radioInfluencia: '',
      caudal: '',
    });
    setResults({ Q: null, Z: null, T: null, R: null });
  };

  const loadExample = () => {
    if (activeCalculation === 'Q') {
      setInputs({
        nivelFreatico: '12',
        descenso: '4.5',
        transmisibilidad: '100',
        radioPozo: '10',
        radioInfluencia: '600',
      });
    } else if (activeCalculation === 'Z') {
      setInputs({
        nivelFreatico: '10',
        transmisibilidad: '80',
        radioPozo: '5',
        radioInfluencia: '200',
        caudal: '385',
      });
    } else if (activeCalculation === 'T') {
      setInputs({
        nivelFreatico: '8',
        descenso: '2.5',
        radioPozo: '10',
        radioInfluencia: '400',
        caudal: '510',
      });
    } else if (activeCalculation === 'R') {
      setInputs({
        nivelFreatico: '12',
        descenso: '6',
        transmisibilidad: '70',
        radioPozo: '10',
        caudal: '650',
      });
    }
  };

  return (
    <div style={{ padding: '20px' }}>
            <BackButton />
      <h2 className="text-2xl font-bold text-blue-700 text-center uppercase tracking-wide">
        Régimen Permanente: Acuífero Confinado
      </h2>

      <div className="flex justify-center gap-4 mt-6">
        {[
          { id: 'Q', label: 'Caudal de extracción (Q)' },
          { id: 'Z', label: 'Abatimiento en el pozo (Z)' },
          { id: 'T', label: 'Coeficiente de transmisibilidad (T)' },
          { id: 'R', label: 'Radio de influencia del pozo (R)' },
        ].map((button) => (
          <button
            key={button.id}
            onClick={() => setActiveCalculation(button.id)}
            className={`px-4 py-2 rounded-lg text-white font-medium transition ${activeCalculation === button.id
              ? 'bg-blue-700 shadow-md'
              : 'bg-blue-500 hover:bg-blue-600'
              }`}
          >
            {button.label}
          </button>
        ))}
      </div>

      {activeCalculation === 'Q' && (
        <div className="mb-5 space-y-6 py-8 bg-white p-6 rounded-2xl shadow-md border border-gray-300">
          <h3 className="text-xl font-semibold text-blue-700 text-center">
            Parámetros para Determinar el Caudal de Extracción (Q)
          </h3>

          {[
            { name: 'nivelFreatico', label: 'Nivel freático original (m):' },
            { name: 'descenso', label: 'Descenso del nivel freático (m):' },
            { name: 'transmisibilidad', label: 'Coeficiente de transmisibilidad (m²/día):' },
            { name: 'radioPozo', label: 'Radio del pozo de extracción (m):' },
            { name: 'radioInfluencia', label: 'Radio de influencia del pozo de extracción (m):' },
          ].map((field) => (
            <div key={field.name} className="flex flex-col">
              <label className="text-gray-700 font-medium">{field.label}</label>
              <input
                type="number"
                name={field.name}
                value={inputs[field.name]}
                onChange={handleChange}
                className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
              />
            </div>
          ))}
        </div>
      )}

      {activeCalculation === 'Z' && (
        <div className="mb-5 space-y-6 py-8 bg-white p-6 rounded-2xl shadow-md border border-gray-300">
          <h3 className="text-xl font-semibold text-blue-700 text-center">
            Parámetros para Determinar el Abatimiento en el Pozo (Z)
          </h3>

          {[
            { name: 'nivelFreatico', label: 'Nivel freático original (m):' },
            { name: 'transmisibilidad', label: 'Coeficiente de transmisibilidad (m²/día):' },
            { name: 'radioPozo', label: 'Radio del pozo de extracción (m):' },
            { name: 'radioInfluencia', label: 'Radio de influencia del pozo de extracción (m):' },
            { name: 'caudal', label: 'Caudal (m³/día):' },
          ].map((field) => (
            <div key={field.name} className="flex flex-col">
              <label className="text-gray-700 font-medium">{field.label}</label>
              <input
                type="number"
                name={field.name}
                value={inputs[field.name]}
                onChange={handleChange}
                className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
              />
            </div>
          ))}
        </div>
      )}


      {activeCalculation === 'T' && (
        <div className="mb-5 space-y-6 py-8 bg-white p-6 rounded-2xl shadow-md border border-gray-300">
          <h3 className="text-xl font-semibold text-blue-700 text-center">
            Parámetros para Determinar el Coeficiente de Transmisibilidad (T)
          </h3>

          {[
            { name: 'nivelFreatico', label: 'Nivel freático original (m):' },
            { name: 'descenso', label: 'Descenso del nivel freático (m):' },
            { name: 'radioPozo', label: 'Radio del pozo de extracción (m):' },
            { name: 'radioInfluencia', label: 'Radio de influencia del pozo de extracción (m):' },
            { name: 'caudal', label: 'Caudal (m³/día):' },
          ].map((field) => (
            <div key={field.name} className="flex flex-col">
              <label className="text-gray-700 font-medium">{field.label}</label>
              <input
                type="number"
                name={field.name}
                value={inputs[field.name]}
                onChange={handleChange}
                className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
              />
            </div>
          ))}
        </div>
      )}
      {activeCalculation === 'R' && (
        <div className="mb-5 space-y-6 py-8 bg-white p-6 rounded-2xl shadow-md border border-gray-300">
          <h3 className="text-xl font-semibold text-blue-700 text-center">
            Parámetros para Determinar el Radio de Influencia del Pozo (R)
          </h3>

          {[
            { name: 'nivelFreatico', label: 'Nivel freático original (m):' },
            { name: 'descenso', label: 'Descenso del nivel freático (m):' },
            { name: 'transmisibilidad', label: 'Coeficiente de transmisibilidad (m²/día):' },
            { name: 'radioPozo', label: 'Radio del pozo de extracción (m):' },
            { name: 'caudal', label: 'Caudal (m³/día):' },
          ].map((field) => (
            <div key={field.name} className="flex flex-col">
              <label className="text-gray-700 font-medium">{field.label}</label>
              <input
                type="number"
                name={field.name}
                value={inputs[field.name]}
                onChange={handleChange}
                className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
              />
            </div>
          ))}
        </div>
      )}


      <div className="mt-6 text-center">
        {/* Contenedor de botones */}
        <div className="mb-6 flex justify-center gap-4">
          <button
            onClick={
              activeCalculation === 'Q'
                ? calculateQ
                : activeCalculation === 'Z'
                  ? calculateZ
                  : activeCalculation === 'T'
                    ? calculateT
                    : calculateR
            }
            disabled={!activeCalculation}
            className={`px-6 py-2 rounded-lg font-semibold text-white transition ${activeCalculation
                ? 'bg-blue-600 hover:bg-blue-700 shadow-md'
                : 'bg-gray-400 cursor-not-allowed'
              }`}
          >
            Calcular
          </button>
          <button
            onClick={clearFields}
            className="px-6 py-2 bg-gray-500 hover:bg-gray-600 rounded-lg font-semibold text-white transition shadow-md"
          >
            Limpiar
          </button>
          <button
            onClick={loadExample}
            className="px-6 py-2 bg-green-600 hover:bg-green-700 rounded-lg font-semibold text-white transition shadow-md"
          >
            Ejemplo
          </button>
        </div>

        {/* Resultados */}
        <h3 className="text-xl font-semibold text-blue-700">Resultados:</h3>
        <p className="text-lg font-medium text-gray-800 mt-2">
          {activeCalculation === 'Q' && `Caudal (Q): ${results.Q}`}
          {activeCalculation === 'Z' && `Abatimiento (m): ${results.Z}`}
          {activeCalculation === 'T' && `Coef. de Transmisibilidad (T): ${results.T}`}
          {activeCalculation === 'R' && `Radio de influencia (m): ${results.R}`}
        </p>
      </div>

    </div>
  );
};

export default ThiemCalculations;
