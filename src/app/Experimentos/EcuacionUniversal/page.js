'use client';
import React, { useState } from 'react';

const EcuacionSuelo = () => {
  const [data, setData] = useState({
    anguloPendiente: 2,
    numeroTormentas: 1,
    longitudPendiente: 150,
    limo: 44,
    arena: 22.5,
    arcilla: 33.5,
    materiaOrganica: 0.3,
    // Factores generales: se incluye ahora "estructura" (E)
    factores: {
      conservacion: "Cultivo en contorno",
      permeabilidad: "Muy lenta (<0.12 cm/h)",
      estructura: "Muy fina granular",
    },
    tormentas: [{ intensidad: 5, energia: 15 }],
    // Factor C con opciones ampliadas
    factorC: {
      tipoAltura: "Sin dosel apreciable",
      cobertura: 25,
      tipoCobertura: "G",
      porcentajeCobertura: "0",
    },
    factorCValor: 0.36,
  });

  const [results, setResults] = useState({
    r: 0,
    m: 0,
    k: 0,
    l: 0,
    s: 0,
    c: 0,
    pd: 0,
    perdidaSuelo: 0,
  });

  // Estado para controlar el modal emergente y la imagen que se mostrará
  const [showModal, setShowModal] = useState(false);
  const [modalImage, setModalImage] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setData({ ...data, [name]: value === '' ? '' : parseFloat(value) });
  };

  const handleFactorChange = (e, factorGroup) => {
    const { name, value } = e.target;
    setData({
      ...data,
      [factorGroup]: {
        ...data[factorGroup],
        [name]: value,
      },
    });
  };

  const handleFactorCChange = (e) => {
    const { name, value } = e.target;
    setData({
      ...data,
      factorC: {
        ...data.factorC,
        [name]: value,
      },
    });
  };

  const calcular = () => {
    const {
      anguloPendiente,
      numeroTormentas,
      longitudPendiente,
      limo,
      arena,
      arcilla,
      materiaOrganica,
      tormentas,
      factorCValor,
    } = data;
    let totalEnergia = 0;

    // Calcular valores de tormentas usando el factor de corrección 2.44
    tormentas.forEach((tormenta) => {
      const { intensidad, energia } = tormenta;
      let E_E_I =
        energia <= 76
          ? (0.119 + 0.0873 * Math.log10(energia)) * 2.44
          : 0.283 * 2.44;
      totalEnergia += E_E_I * intensidad;
    });

    const r = totalEnergia / numeroTormentas;
    const m = (limo + arena) * (100 - arcilla);
    const k = (0.00021 * Math.pow(m, 1.14) * (12 - materiaOrganica) + 3.971) / (100 * 7.594);

    const anguloRad = Math.atan(anguloPendiente / 100) * (180 / Math.PI);
    const s =
      longitudPendiente < 5
        ? 3 * Math.pow(Math.sin(anguloRad * Math.PI / 180), 0.8) + 0.56
        : anguloPendiente < 9
        ? 10.8 * Math.sin(anguloRad * Math.PI / 180) + 0.03
        : 16.8 * Math.sin(anguloRad * Math.PI / 180) - 0.5;

    const maux = 0.1342 * Math.log(anguloPendiente) + 0.192;
    const l = Math.pow(longitudPendiente / 22.13, maux);

    const c = parseFloat(data.factorCValor);
    const pd = 0.6;
    const perdidaSuelo = r * k * l * s * c * pd;

    setResults({
      r: r.toFixed(4),
      m: m.toFixed(4),
      k: k.toFixed(4),
      l: l.toFixed(4),
      s: s.toFixed(4),
      c: c.toFixed(4),
      pd: pd.toFixed(4),
      perdidaSuelo: perdidaSuelo.toFixed(4),
    });
  };

  const cargarEjemplo = () => {
    setData({
      anguloPendiente: 2,
      numeroTormentas: 1,
      longitudPendiente: 150,
      limo: 44,
      arena: 22.5,
      arcilla: 33.5,
      materiaOrganica: 0.3,
      factores: {
        conservacion: "Cultivo en contorno",
        permeabilidad: "Muy lenta (<0.12 cm/h)",
        estructura: "Muy fina granular",
      },
      tormentas: [{ intensidad: 5, energia: 15 }],
      factorC: {
        tipoAltura: "Sin dosel apreciable",
        cobertura: 25,
        tipoCobertura: "G",
        porcentajeCobertura: "0",
      },
      factorCValor: 0.36,
    });
    setResults({
      r: 0,
      m: 0,
      k: 0,
      l: 0,
      s: 0,
      c: 0,
      pd: 0,
      perdidaSuelo: 0,
    });
  };

  const limpiar = () => {
    setData({
      anguloPendiente: '',
      numeroTormentas: '',
      longitudPendiente: '',
      limo: '',
      arena: '',
      arcilla: '',
      materiaOrganica: '',
      factores: {
        conservacion: '',
        permeabilidad: '',
        estructura: '',
      },
      tormentas: [],
      factorC: {
        tipoAltura: '',
        cobertura: '',
        tipoCobertura: '',
        porcentajeCobertura: '',
      },
      factorCValor: '',
    });
    setResults({
      r: 0,
      m: 0,
      k: 0,
      l: 0,
      s: 0,
      c: 0,
      pd: 0,
      perdidaSuelo: 0,
    });
  };

  return (
    <div>
      {/* Sección de Ingreso de Datos */}
      <div className="max-w-3xl mx-auto bg-white p-6 rounded-lg shadow-md border border-gray-300 mt-6">
        <h1 className="text-2xl font-bold text-center text-gray-700 mb-6">
          Ecuación Universal de Pérdida del Suelo
        </h1>
        <h2 className="text-xl font-bold text-gray-700 mb-4">Ingreso de Datos</h2>

        {/* Contenedor Flex para inputs numéricos e imágenes */}
        <div className="flex flex-col md:flex-row gap-4">
          {/* Inputs numéricos */}
          <div className="flex-1">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="block text-gray-600">
                  Ángulo de Inclinación de la Pendiente (grados):
                </label>
                <input
                  type="number"
                  name="anguloPendiente"
                  value={data.anguloPendiente}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-md"
                />

                <label className="block text-gray-600">
                  Número de Tormentas Erosivas:
                </label>
                <input
                  type="number"
                  name="numeroTormentas"
                  value={data.numeroTormentas}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-md"
                />

                <label className="block text-gray-600">
                  Longitud de la Pendiente (λ m):
                </label>
                <input
                  type="number"
                  name="longitudPendiente"
                  value={data.longitudPendiente}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-gray-600">Limo (%):</label>
                <input
                  type="number"
                  name="limo"
                  value={data.limo}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-md"
                />

                <label className="block text-gray-600">Arena (%):</label>
                <input
                  type="number"
                  name="arena"
                  value={data.arena}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-md"
                />

                <label className="block text-gray-600">Arcilla (%):</label>
                <input
                  type="number"
                  name="arcilla"
                  value={data.arcilla}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-md"
                />

                <label className="block text-gray-600">
                  Materia Orgánica (MO %):
                </label>
                <input
                  type="number"
                  name="materiaOrganica"
                  value={data.materiaOrganica}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
              </div>
            </div>
          </div>

          {/* Imágenes sin descripción */}
          <div className="flex flex-col gap-4">
            <img
              src="/images/imageEcuacionUniversal.jpg"
              alt=""
              className="w-full max-w-xs rounded-md"
            />
            <img
              src="/images/imageEcuacionUniversal2.jpg"
              alt=""
              className="w-full max-w-xs rounded-md"
            />
          </div>
        </div>
      </div>

      {/* Sección de Selecciones */}
      <div className="max-w-3xl mx-auto bg-white p-6 rounded-lg shadow-md border border-gray-300 mt-6">
        <h3 className="text-lg font-semibold text-gray-700 mb-4">Selecciones</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Factor de Prácticas de Conservación (P) */}
          <div>
            <label className="block text-gray-600">
              Factor de Prácticas de Conservación (P):
            </label>
            <div className="flex items-center gap-2">
              <select
                name="conservacion"
                value={data.factores.conservacion}
                onChange={(e) => handleFactorChange(e, "factores")}
                className="w-full p-2 border border-gray-300 rounded-md"
              >
                <option value="Cultivo en contorno">Cultivo en contorno</option>
                <option value="Siembra directa">Siembra directa</option>
                <option value="Terraceo">Terraceo</option>
              </select>
              <button
                onClick={() => {
                  setModalImage('/images/imageEcuacionUniversal3.jpg');
                  setShowModal(true);
                }}
                className="mt-2 px-2 py-1 bg-gray-700 text-white rounded text-sm"
              >
                Tabla
              </button>
            </div>
          </div>

          {/* Permeabilidad (P) */}
          <div>
            <label className="block text-gray-600">Permeabilidad (P):</label>
            <div className="flex items-center gap-2">
              <select
                name="permeabilidad"
                value={data.factores.permeabilidad}
                onChange={(e) => handleFactorChange(e, "factores")}
                className="w-full p-2 border border-gray-300 rounded-md"
              >
                <option value="Muy lenta (<0.12 cm/h)">
                  Muy lenta (&lt;0.12 cm/h)
                </option>
                <option value="Lenta (0.12-2.0 cm/h)">
                  Lenta (0.12-2.0 cm/h)
                </option>
                <option value="Moderada (2.0-6.0 cm/h)">
                  Moderada (2.0-6.0 cm/h)
                </option>
                <option value="Rápida (6.0-12.5 cm/h)">
                  Rápida (6.0-12.5 cm/h)
                </option>
                <option value="Muy rápida (12.5-25 cm/h)">
                  Muy rápida (12.5-25 cm/h)
                </option>
                <option value="Extremadamente rápida (>25 cm/h)">
                  Extremadamente rápida (&gt;25 cm/h)
                </option>
              </select>
              <button
                onClick={() => {
                  setModalImage('/images/imageEcuacionUniversal4.jpg');
                  setShowModal(true);
                }}
                className="mt-2 px-2 py-1 bg-gray-700 text-white rounded text-sm"
              >
                Tabla
              </button>
            </div>
          </div>

          {/* Estructura del Suelo (E) */}
          <div>
            <label className="block text-gray-600">
              Estructura del Suelo (E):
            </label>
            <div className="flex items-center gap-2">
              <select
                name="estructura"
                value={data.factores.estructura}
                onChange={(e) => handleFactorChange(e, "factores")}
                className="w-full p-2 border border-gray-300 rounded-md"
              >
                <option value="Muy fina granular">Muy fina granular</option>
                <option value="Fina">Fina</option>
                <option value="Mediana">Mediana</option>
                <option value="Gruesa">Gruesa</option>
              </select>
              <button
                onClick={() => {
                  setModalImage('/images/imageEcuacionUniversal5.jpg');
                  setShowModal(true);
                }}
                className="mt-2 px-2 py-1 bg-gray-700 text-white rounded text-sm"
              >
                Tabla
              </button>
            </div>
          </div>
        </div>

        {/* Sección para Factor C */}
        <h3 className="text-lg font-semibold text-gray-700 mt-6">Factor C</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-600">Tipo y Altura:</label>
            <select
              name="tipoAltura"
              value={data.factorC.tipoAltura}
              onChange={handleFactorCChange}
              className="w-full p-2 border border-gray-300 rounded-md"
            >
              <option value="Sin dosel apreciable">Sin dosel apreciable</option>
              <option value="Hierva alta, maleza, caída de gota de 20 pulg o menos">
                Hierva alta, maleza, caída de gota de 20 pulg o menos
              </option>
              <option value="Maleza de caída de gota de 6.5 pies">
                Maleza de caída de gota de 6.5 pies
              </option>
              <option value="Árboles, sin maleza baja apreciable, caída de gota de 13 pies">
                Árboles, sin maleza baja apreciable, caída de gota de 13 pies
              </option>
            </select>
          </div>

          <div>
            <label className="block text-gray-600">Cobertura (%):</label>
            <select
              name="cobertura"
              value={data.factorC.cobertura}
              onChange={handleFactorCChange}
              className="w-full p-2 border border-gray-300 rounded-md"
            >
              <option value={25}>25</option>
              <option value={50}>50</option>
              <option value={75}>75</option>
            </select>
          </div>

          <div>
            <label className="block text-gray-600">Tipo de Cobertura:</label>
            <select
              name="tipoCobertura"
              value={data.factorC.tipoCobertura}
              onChange={handleFactorCChange}
              className="w-full p-2 border border-gray-300 rounded-md"
            >
              <option value="G">G</option>
              <option value="W">W</option>
            </select>
          </div>

          <div>
            <label className="block text-gray-600">
              Porcentaje de Cobertura (%):
            </label>
            <select
              name="porcentajeCobertura"
              value={data.factorC.porcentajeCobertura}
              onChange={handleFactorCChange}
              className="w-full p-2 border border-gray-300 rounded-md"
            >
              <option value="0">0</option>
              <option value="20">20</option>
              <option value="40">40</option>
              <option value="60">60</option>
              <option value="80">80</option>
              <option value="100">100</option>
            </select>
          </div>
        </div>

        {/* Campo Valor del Factor C con botón al costado */}
        <div className="mt-6">
          <label className="block text-gray-600">Valor del Factor C:</label>
          <div className="flex items-center gap-2">
            <input
              type="number"
              name="factorCValor"
              value={data.factorCValor}
              onChange={handleInputChange}
              step="0.01"
              className="w-full p-2 border border-gray-300 rounded-md"
            />
            <button
              onClick={() => {
                setModalImage('/images/imageEcuacionUniversal6.jpg');
                setShowModal(true);
              }}
              className="mt-2 px-2 py-1 bg-gray-700 text-white rounded text-sm"
            >
              Tabla
            </button>
          </div>
        </div>
      </div>

      {/* Sección de botones y resultados */}
      <div className="max-w-xl mx-auto bg-white p-6 rounded-lg shadow-md border border-gray-300 mt-6">
        <div className="flex justify-center gap-4 mb-6">
          <button
            onClick={calcular}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition duration-300"
          >
            Calcular
          </button>
          <button
            onClick={cargarEjemplo}
            className="px-4 py-2 bg-green-600 text-white rounded-lg shadow-md hover:bg-green-700 transition duration-300"
          >
            Cargar Ejemplo
          </button>
          <button
            onClick={limpiar}
            className="px-4 py-2 bg-red-600 text-white rounded-lg shadow-md hover:bg-red-700 transition duration-300"
          >
            Limpiar
          </button>
        </div>

        <div className="bg-gray-100 p-6 rounded-lg shadow-sm">
          <h2 className="text-xl font-bold text-gray-700 mb-4">Resultados</h2>
          <div className="grid grid-cols-1 gap-4">
            <div className="p-4 bg-white rounded-lg shadow">
              <p className="text-gray-700">
                <span className="font-semibold">
                  FACTOR EROSIVIDAD DE LA LLUVIA (R) (MJ.MM.HA-1.H-1.AÑO-1):
                </span>{" "}
                {results.r}
              </p>
            </div>
            <div className="p-4 bg-white rounded-lg shadow">
              <p className="text-gray-700">
                <span className="font-semibold">MATERIA ORGÁNICA:</span>{" "}
                {results.m}
              </p>
            </div>
            <div className="p-4 bg-white rounded-lg shadow">
              <p className="text-gray-700">
                <span className="font-semibold">
                  FACTOR ERODABILIDAD DEL SUELO (K) (T.HA.H.MJ-1.HA-1.MM-1):
                </span>{" "}
                {results.k}
              </p>
            </div>
            <div className="p-4 bg-white rounded-lg shadow">
              <p className="text-gray-700">
                <span className="font-semibold">
                  FACTOR LONGITUD DE LA PENDIENTE (L) (ADIMENSIONAL):
                </span>{" "}
                {results.l}
              </p>
            </div>
            <div className="p-4 bg-white rounded-lg shadow">
              <p className="text-gray-700">
                <span className="font-semibold">
                  FACTOR GRADIENTE DE LA PENDIENTE (S) (ADIMENSIONAL):
                </span>{" "}
                {results.s}
              </p>
            </div>
            <div className="p-4 bg-white rounded-lg shadow">
              <p className="text-gray-700">
                <span className="font-semibold">
                  FACTOR DE MANEJO DE CULTIVOS (C) (ADIMENSIONAL):
                </span>{" "}
                {results.c}
              </p>
            </div>
            <div className="p-4 bg-white rounded-lg shadow">
              <p className="text-gray-700">
                <span className="font-semibold">
                  FACTOR PRÁCTICA DE CONSERVACIÓN DE SUELOS (P) (ADIMENSIONAL):
                </span>{" "}
                {results.pd}
              </p>
            </div>
            <div className="p-4 bg-white rounded-lg shadow">
              <p className="text-gray-700">
                <span className="font-semibold">
                  PÉRDIDA DE SUELO POR UNIDAD DE SUPERFICIE (A:) (T.HA-1.AÑO-1):
                </span>{" "}
                {results.perdidaSuelo}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Modal emergente */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-4 rounded-lg relative">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-2 right-2 text-gray-700 font-bold"
            >
              X
            </button>
            <img
              src={modalImage}
              alt=""
              className="max-w-full max-h-full rounded-md"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default EcuacionSuelo;
