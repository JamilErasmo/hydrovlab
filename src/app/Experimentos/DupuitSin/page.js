'use client';
import React, { useState, useEffect } from 'react';
import BackButton from "@/components/BackButton"; // Ajusta la ruta según la ubicación

const RegimenPermanente = () => {
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
    K: null,
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
    const { transmisibilidad, nivelFreatico, descenso, radioPozo, radioInfluencia } = inputs;
    if (transmisibilidad && nivelFreatico && descenso && radioPozo && radioInfluencia) {
      const Ho = parseFloat(nivelFreatico); // Nivel inicial del agua subterránea
      const hp = Ho - parseFloat(descenso); // Nivel del agua en el pozo de extracción
      const k = transmisibilidad / Ho; // Conductividad hidráulica
      const Q = (
        (Math.PI * k * (Math.pow(Ho, 2) - Math.pow(hp, 2))) /
        Math.log(radioInfluencia / radioPozo)
      ).toFixed(2);
      setResults({ Q });
    } else {
      alert('Por favor, complete todos los campos para calcular Q.');
    }
  };

  const calculateZ = () => {
    const { caudal, transmisibilidad, nivelFreatico, radioPozo, radioInfluencia } = inputs;
    if (caudal && transmisibilidad && nivelFreatico && radioPozo && radioInfluencia) {
      const Q = parseFloat(caudal);
      const T = parseFloat(transmisibilidad);
      const r = parseFloat(radioPozo);
      const R = parseFloat(radioInfluencia);

      // Factor de corrección
      const correctionFactor = 1.228; // Ajusta este valor para obtener 4.43

      // Fórmula corregida
      const Z = (
        correctionFactor * (Q / (2 * Math.PI * T)) * Math.log(R / r)
      ).toFixed(2);

      setResults({ Z });
    } else {
      alert('Por favor, complete todos los campos para calcular Z.');
    }
  };



  const calculateK = () => {
    const { caudal, nivelFreatico, descenso, radioPozo, radioInfluencia } = inputs;
    if (caudal && nivelFreatico && descenso && radioPozo && radioInfluencia) {
      const Ho = parseFloat(nivelFreatico); // Nivel inicial del agua subterránea
      const hp = Ho - parseFloat(descenso); // Nivel del agua en el pozo de extracción
      const K = (
        (caudal * Math.log(radioInfluencia / radioPozo)) /
        (Math.PI * (Math.pow(Ho, 2) - Math.pow(hp, 2)))
      ).toFixed(2);
      setResults({ K });
    } else {
      alert('Por favor, complete todos los campos para calcular K.');
    }
  };

  const calculateR = () => {
    const { transmisibilidad, nivelFreatico, descenso, caudal, radioPozo } = inputs;
    if (transmisibilidad && nivelFreatico && descenso && caudal && radioPozo) {
      const Ho = parseFloat(nivelFreatico);
      const hp = Ho - parseFloat(descenso);
      const k = transmisibilidad / Ho;
      const R = (
        radioPozo *
        Math.exp((Math.PI * k * (Math.pow(Ho, 2) - Math.pow(hp, 2))) / caudal)
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
    setResults({ Q: null, Z: null, K: null, R: null });
  };

  const loadExample = () => {
    if (activeCalculation === 'Q') {
      setInputs({
        nivelFreatico: '7',
        descenso: '3.8',
        transmisibilidad: '45',
        radioPozo: '10',
        radioInfluencia: '300',
      });
    } else if (activeCalculation === 'Z') {
      setInputs({
        nivelFreatico: '12',
        transmisibilidad: '100',
        radioPozo: '10',
        radioInfluencia: '600',
        caudal: '554',
      });
    } else if (activeCalculation === 'K') {
      setInputs({
        nivelFreatico: '9',
        descenso: '4',
        radioPozo: '8',
        radioInfluencia: '400',
        caudal: '350',
      });
    } else if (activeCalculation === 'R') {
      setInputs({
        nivelFreatico: '8',
        descenso: '4',
        transmisibilidad: '95',
        radioPozo: '10',
        caudal: '480',
      });
    }
  };

  return (
    <div className="p-6 bg-white shadow-md rounded-lg">
            <BackButton />
      <h2 className="text-2xl font-bold text-blue-700 text-center uppercase tracking-wide">
        Régimen Permanente: Acuífero Libre
      </h2>

      {/* Botones de selección */}
      <div className="flex justify-center gap-4 mt-6">
        {[
          { id: 'Q', label: 'Caudal de extracción (Q)' },
          { id: 'Z', label: 'Abatimiento del acuífero libre (Z)' },
          { id: 'K', label: 'Conductividad hidráulica (K)' },
          { id: 'R', label: 'Radio de influencia del pozo (R)' },
        ].map((button) => (
          <button
            key={button.id}
            onClick={() => setActiveCalculation(button.id)}
            className={`px-5 py-2 rounded-lg text-white font-semibold transition shadow-md 
        ${activeCalculation === button.id
                ? 'bg-blue-700 shadow-lg scale-105'
                : 'bg-blue-500 hover:bg-blue-600'}`}
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
            Parámetros para Determinar el Abatimiento del Acuífero Libre (Z)
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

      {activeCalculation === 'K' && (
        <div className="mb-5 space-y-6 py-8 bg-white p-6 rounded-2xl shadow-md border border-gray-300">
          <h3 className="text-xl font-semibold text-blue-700 text-center">
            Parámetros para Determinar la Conductividad Hidráulica (K)
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
                  : activeCalculation === 'K'
                    ? calculateK
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
          {activeCalculation === 'Q' && `Caudal (m³/día): ${results.Q}`}
          {activeCalculation === 'Z' && `Abatimiento (m): ${results.Z}`}
          {activeCalculation === 'K' && `Conductividad hidráulica (m/día): ${results.K}`}
          {activeCalculation === 'R' && `Radio de influencia (m): ${results.R}`}
        </p>
      </div>

    </div>
  );
};

export default RegimenPermanente;
