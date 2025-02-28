'use client';
import React, { useState, useEffect } from 'react';

const EcuacionSuelo = () => {
  // NUEVA Matriz de coeficientes para Factor C, usando STRINGS con decimales exactos
  // Cada fila corresponde a una combinación (tipoAltura/cobertura/tipoCobertura).
  // Cada columna corresponde a porcentajeCobertura: [0, 20, 40, 60, 80, 100]
  const coefMatrix = [
    // No apreciable canopy, G
    ["0.36","0.17","0.09","0.038","0.013","0.003"],  // row=0
    // No apreciable canopy, W
    ["0.36","0.20","0.13","0.083","0.041","0.011"],  // row=1
    // Tall grass/weeds..., G
    ["0.26","0.13","0.07","0.035","0.012","0.003"],  // row=2
    // Tall grass/weeds..., W
    ["0.26","0.16","0.11","0.076","0.039","0.011"],  // row=3
    // Appreciable brush, G
    ["0.17","0.10","0.06","0.032","0.011","0.003"],  // row=4
    // Appreciable brush, W
    ["0.17","0.12","0.09","0.068","0.038","0.011"],  // row=5
    // Trees..., G
    ["0.40","0.18","0.09","0.040","0.013","0.003"],  // row=6
    // Trees..., W
    ["0.40","0.22","0.14","0.087","0.042","0.011"],  // row=7
    // (las siguientes filas podrían ser variantes adicionales si tu experimento las requiere)
    ["0.34","0.16","0.08","0.038","0.012","0.003"],  // row=8
    ["0.34","0.19","0.13","0.082","0.010","0.011"],  // row=9
    ["0.28","0.14","0.08","0.036","0.012","0.003"],  // row=10
    ["0.28","0.17","0.12","0.078","0.040","0.011"],  // row=11
    ["0.42","0.19","0.10","0.041","0.013","0.003"],  // row=12
    ["0.42","0.23","0.14","0.089","0.042","0.011"],  // row=13
    ["0.39","0.18","0.09","0.040","0.013","0.003"],  // row=14
    ["0.39","0.21","0.14","0.870","0.042","0.011"],  // row=15
    ["0.36","0.17","0.09","0.039","0.012","0.003"],  // row=16
    ["0.36","0.20","0.13","0.084","0.041","0.011"],  // row=17
  ];

  // Estado principal
  const [data, setData] = useState({
    anguloPendiente: "",
    numeroTormentas: "",
    longitudPendiente: "",
    limo: "",
    arena: "",
    arcilla: "",
    materiaOrganica: "",
    factores: {
      conservacion: "",
      permeabilidad: "",
      estructura: "",
    },
    // Se genera automáticamente según "numeroTormentas"
    tormentas: [],
    // Opciones para Factor C
    factorC: {
      tipoAltura: "",
      cobertura: "",
      tipoCobertura: "",
      porcentajeCobertura: "",
    },
    factorCValor: "",
  });

  // Estado para resultados y modal
  const [results, setResults] = useState({
    r: "",
    m: "",
    k: "",
    l: "",
    s: "",
    c: "",
    pd: "",
    perdidaSuelo: "",
  });
  const [showModal, setShowModal] = useState(false);
  const [modalImage, setModalImage] = useState("");
  // Flag para modo ejemplo
  const [isExample, setIsExample] = useState(false);

  // Manejo de cambios en inputs generales
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === "numeroTormentas") {
      const n = parseInt(value) || 0;
      const updatedStorms = [];
      for (let i = 0; i < n; i++) {
        updatedStorms.push({ intensidad: "", energia: "" });
      }
      setData((prev) => ({
        ...prev,
        numeroTormentas: value,
        tormentas: updatedStorms,
      }));
    } else {
      setData((prev) => ({ ...prev, [name]: value }));
    }
    // Si se modifica manualmente, se desactiva el modo ejemplo
    setIsExample(false);
  };

  // Manejo de cambios en los factores (ej. conservación, permeabilidad, estructura)
  const handleFactorChange = (e, factorGroup) => {
    const { name, value } = e.target;
    setData((prev) => ({
      ...prev,
      [factorGroup]: { ...prev[factorGroup], [name]: value },
    }));
  };

  // Manejo de cambios en Factor C
  const handleFactorCChange = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({
      ...prev,
      factorC: { ...prev.factorC, [name]: value },
    }));
  };

  // Actualizar datos de tormentas
  const handleStormChange = (e, index, field) => {
    const { value } = e.target;
    setData((prev) => {
      const updatedStorms = [...prev.tormentas];
      updatedStorms[index] = { ...updatedStorms[index], [field]: value };
      return { ...prev, tormentas: updatedStorms };
    });
    setIsExample(false);
  };

  // Mapea las selecciones (tipoAltura, cobertura, tipoCobertura, porcentajeCobertura) a la matriz
  const computeFactorCValue = () => {
    const { tipoAltura, cobertura, tipoCobertura, porcentajeCobertura } = data.factorC;
    if (!tipoAltura || !cobertura || !tipoCobertura || !porcentajeCobertura) {
      return "";
    }

    // Determina la fila 'i' según tipoAltura
    let i;
    switch (tipoAltura) {
      case "Sin dosel apreciable":
        i = 0;
        break;
      case "Hierva alta, maleza, caída de gota de 20 pulg o menos":
        i = 1;
        break;
      case "Maleza de caída de gota de 6.5 pies":
      case "Árboles, sin maleza baja apreciable, caída de gota de 13 pies":
        i = 2;
        break;
      default:
        i = 0;
    }

    // Determina 'cover' según la cobertura
    let cover;
    const covNumber = Number(cobertura);
    if (covNumber === 25) cover = 2;
    else if (covNumber === 50) cover = 5;
    else if (covNumber === 75) cover = 7;
    else cover = 2;

    // Determina 'tipo'
    let tipo = tipoCobertura; // "G" o "W"

    // Determina la columna 'col' según el porcentajeCobertura
    let col;
    switch (porcentajeCobertura) {
      case "0":
        col = 0;
        break;
      case "20":
        col = 1;
        break;
      case "40":
        col = 2;
        break;
      case "60":
        col = 3;
        break;
      case "80":
        col = 4;
        break;
      case "100":
        col = 5;
        break;
      default:
        col = 0;
    }

    // Determina la fila 'row' en la matriz
    let row;
    if (i === 0) {
      if (cover === 2 && tipo === "G") row = 0;
      else if (cover === 2 && tipo === "W") row = 1;
      else if (cover === 5 && tipo === "G") row = 2;
      else if (cover === 5 && tipo === "W") row = 3;
      else if (cover === 7 && tipo === "G") row = 4;
      else if (cover === 7 && tipo === "W") row = 5;
    } else if (i === 1) {
      if (cover === 2 && tipo === "G") row = 6;
      else if (cover === 2 && tipo === "W") row = 7;
      else if (cover === 5 && tipo === "G") row = 8;
      else if (cover === 5 && tipo === "W") row = 9;
      else if (cover === 7 && tipo === "G") row = 10;
      else if (cover === 7 && tipo === "W") row = 11;
    } else if (i === 2) {
      if (cover === 2 && tipo === "G") row = 12;
      else if (cover === 2 && tipo === "W") row = 13;
      else if (cover === 5 && tipo === "G") row = 14;
      else if (cover === 5 && tipo === "W") row = 15;
      else if (cover === 7 && tipo === "G") row = 16;
      else if (cover === 7 && tipo === "W") row = 17;
    }

    // Aquí está la celda con el factor C en formato string
    const valString = coefMatrix[row][col];
    // Retornamos el string tal cual (p.e. "0.20", "0.03", etc.)
    return valString;
  };

  // useEffect para actualizar factorCValor automáticamente
  useEffect(() => {
    const newFactorCValue = computeFactorCValue();
    // Solo actualizamos si es distinto
    if (newFactorCValue !== data.factorCValor) {
      setData((prev) => ({ ...prev, factorCValor: newFactorCValue }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    data.factorC.tipoAltura,
    data.factorC.cobertura,
    data.factorC.tipoCobertura,
    data.factorC.porcentajeCobertura,
  ]);

  // Función de cálculo
  const calcular = () => {
    const angulo = parseFloat(data.anguloPendiente) || 0;
    const longitud = parseFloat(data.longitudPendiente) || 0;
    const limo = parseFloat(data.limo) || 0;
    const arena = parseFloat(data.arena) || 0;
    const arcilla = parseFloat(data.arcilla) || 0;
    const materia = parseFloat(data.materiaOrganica) || 0;
    
    let r = 0;
    let totalEnergia = 0;

    if (isExample) {
      // Modo ejemplo: ignoramos la tabla, usamos energía=5, intensidad=15
      const E_E_I = 0.119 + 0.0873 * Math.log10(5);
      totalEnergia = E_E_I * 15;
      r = totalEnergia;
    } else {
      // Modo normal: recorremos la tabla
      const n = data.tormentas.length;
      data.tormentas.forEach((t) => {
        const intensidad = parseFloat(t.intensidad) || 0;
        const energia = parseFloat(t.energia) || 0;
        // Ajusta la fórmula según tu lógica
        const E_E_I =
          energia <= 76
            ? (0.119 + 0.0873 * Math.log10(energia)) // sin factor 2.44, por ejemplo
            : 0.283;
        totalEnergia += E_E_I * intensidad;
      });
      r = n > 0 ? totalEnergia / n : 0;
    }

    // m, K, L, S
    const m = (limo + arena) * (100 - arcilla);
    const k =
      (0.00021 * Math.pow(m, 1.14) * (12 - materia) + 3.971) / (100 * 7.594);
    const anguloRad = Math.atan(angulo / 100) * (180 / Math.PI);
    const s =
      longitud < 5
        ? 3 * Math.pow(Math.sin(anguloRad * Math.PI / 180), 0.8) + 0.56
        : angulo < 9
        ? 10.8 * Math.sin(anguloRad * Math.PI / 180) + 0.03
        : 16.8 * Math.sin(anguloRad * Math.PI / 180) - 0.5;
    const maux = 0.1342 * Math.log(angulo || 1) + 0.192;
    const lFactor = longitud > 0 ? Math.pow(longitud / 22.13, maux) : 0;
    // factorCValor viene como string, lo parseamos
    const c = parseFloat(data.factorCValor) || 0;
    const pd = 0.6;
    const perdidaSuelo = r * k * lFactor * s * c * pd;

    setResults({
      r: r.toFixed(4),
      m: m.toFixed(4),
      k: k.toFixed(4),
      l: lFactor.toFixed(4),
      s: s.toFixed(4),
      c: c.toFixed(4),          // aquí guardamos con 4 decimales
      pd: pd.toFixed(4),
      perdidaSuelo: perdidaSuelo.toFixed(4),
    });
  };

  // Cargar Ejemplo
  const cargarEjemplo = () => {
    setData({
      anguloPendiente: "2",
      numeroTormentas: "1",
      longitudPendiente: "150",
      limo: "44",
      arena: "22.5",
      arcilla: "33.5",
      materiaOrganica: "0.3",
      factores: {
        conservacion: "Cultivo en contorno",
        permeabilidad: "Muy lenta (<0.12 cm/h)",
        estructura: "Muy fina granular",
      },
      tormentas: [{ intensidad: "5", energia: "15" }],
      factorC: {
        tipoAltura: "Sin dosel apreciable",
        cobertura: "25",
        tipoCobertura: "G",
        porcentajeCobertura: "0",
      },
      // Valor de C en modo ejemplo
      factorCValor: "0.36",
    });
    setResults({
      r: "",
      m: "",
      k: "",
      l: "",
      s: "",
      c: "",
      pd: "",
      perdidaSuelo: "",
    });
    setIsExample(true);
  };

  // Limpiar
  const limpiar = () => {
    setData({
      anguloPendiente: "",
      numeroTormentas: "",
      longitudPendiente: "",
      limo: "",
      arena: "",
      arcilla: "",
      materiaOrganica: "",
      factores: {
        conservacion: "",
        permeabilidad: "",
        estructura: "",
      },
      tormentas: [],
      factorC: {
        tipoAltura: "",
        cobertura: "",
        tipoCobertura: "",
        porcentajeCobertura: "",
      },
      factorCValor: "",
    });
    setResults({
      r: "",
      m: "",
      k: "",
      l: "",
      s: "",
      c: "",
      pd: "",
      perdidaSuelo: "",
    });
    setIsExample(false);
  };

  return (
    <div>
      {/* Sección de Ingreso de Datos */}
      <div className="max-w-3xl mx-auto bg-white p-6 rounded-lg shadow-md border border-gray-300 mt-6">
        <h1 className="text-2xl font-bold text-center text-gray-700 mb-6">
          Ecuación Universal de Pérdida del Suelo
        </h1>
        <h2 className="text-xl font-bold text-gray-700 mb-4">Ingreso de Datos</h2>

        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Inputs principales */}
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

          {/* Imágenes de referencia (opcionales) */}
          <div className="flex flex-col gap-4">
            <img
              src="/images/imageEcuacionUniversal.jpg"
              alt="Ecuación 1"
              className="w-full max-w-xs rounded-md"
            />
            <img
              src="/images/imageEcuacionUniversal2.jpg"
              alt="Ecuación 2"
              className="w-full max-w-xs rounded-md"
            />
          </div>
        </div>

        {/* Tabla de Datos de Tormentas */}
        <div className="mt-6">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">
            Datos de Tormentas
          </h3>
          <table className="min-w-full border">
            <thead>
              <tr className="bg-gray-200">
                <th className="px-2 py-1 border">#</th>
                <th className="px-2 py-1 border">Intensidad</th>
                <th className="px-2 py-1 border">Energía</th>
                <th className="px-2 py-1 border">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {data.tormentas.map((tormenta, index) => (
                <tr key={index}>
                  <td className="px-2 py-1 border text-center">
                    {index + 1}
                  </td>
                  <td className="px-2 py-1 border">
                    <input
                      type="number"
                      value={tormenta.intensidad}
                      onChange={(e) =>
                        handleStormChange(e, index, "intensidad")
                      }
                      className="w-full p-1 border rounded"
                    />
                  </td>
                  <td className="px-2 py-1 border">
                    <input
                      type="number"
                      value={tormenta.energia}
                      onChange={(e) => handleStormChange(e, index, "energia")}
                      className="w-full p-1 border rounded"
                    />
                  </td>
                  <td className="px-2 py-1 border text-center">
                    <button
                      onClick={() => {
                        setData((prev) => {
                          const updatedStorms = prev.tormentas.filter(
                            (_, i) => i !== index
                          );
                          return {
                            ...prev,
                            tormentas: updatedStorms,
                            numeroTormentas: updatedStorms.length.toString(),
                          };
                        });
                      }}
                      className="text-red-600 hover:text-red-800"
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Sección de Selecciones */}
      <div className="max-w-3xl mx-auto bg-white p-6 rounded-lg shadow-md border border-gray-300 mt-6">
        <h3 className="text-lg font-semibold text-gray-700 mb-4">
          Selecciones
        </h3>
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
                <option value="">Seleccione...</option>
                <option value="Cultivo en contorno">Cultivo en contorno</option>
                <option value="Siembra directa">Siembra directa</option>
                <option value="Terraceo">Terraceo</option>
              </select>
              <button
                onClick={() => {
                  setModalImage("/images/imageEcuacionUniversal3.jpg");
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
                <option value="">Seleccione...</option>
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
                  setModalImage("/images/imageEcuacionUniversal4.jpg");
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
                <option value="">Seleccione...</option>
                <option value="Muy fina granular">Muy fina granular</option>
                <option value="Fina">Fina</option>
                <option value="Mediana">Mediana</option>
                <option value="Gruesa">Gruesa</option>
              </select>
              <button
                onClick={() => {
                  setModalImage("/images/imageEcuacionUniversal5.jpg");
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
              <option value="">Seleccione...</option>
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
              <option value="">Seleccione...</option>
              <option value="25">25</option>
              <option value="50">50</option>
              <option value="75">75</option>
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
              <option value="">Seleccione...</option>
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
              <option value="">Seleccione...</option>
              <option value="0">0</option>
              <option value="20">20</option>
              <option value="40">40</option>
              <option value="60">60</option>
              <option value="80">80</option>
              <option value="100">100</option>
            </select>
          </div>
        </div>

        {/* Campo Valor del Factor C (solo lectura). Se muestra con ceros finales tal como está en la matriz */}
        <div className="mt-6">
          <label className="block text-gray-600">Valor del Factor C:</label>
          <div className="flex items-center gap-2">
            {/* factorCValor es un string con ceros a la derecha (e.g. "0.20") */}
            <input
              type="text"
              name="factorCValor"
              value={data.factorCValor}
              readOnly
              className="w-full p-2 border border-gray-300 rounded-md bg-gray-100"
            />
            <button
              onClick={() => {
                setModalImage("/images/imageEcuacionUniversal6.jpg");
                setShowModal(true);
              }}
              className="mt-2 px-2 py-1 bg-gray-700 text-white rounded text-sm"
            >
              Tabla
            </button>
          </div>
        </div>
      </div>

      {/* Sección de Botones y Resultados */}
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
                  FACTOR EROSIVIDAD DE LA LLUVIA (R):
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
                  FACTOR ERODABILIDAD DEL SUELO (K):
                </span>{" "}
                {results.k}
              </p>
            </div>
            <div className="p-4 bg-white rounded-lg shadow">
              <p className="text-gray-700">
                <span className="font-semibold">
                  FACTOR LONGITUD DE LA PENDIENTE (L):
                </span>{" "}
                {results.l}
              </p>
            </div>
            <div className="p-4 bg-white rounded-lg shadow">
              <p className="text-gray-700">
                <span className="font-semibold">
                  FACTOR GRADIENTE DE LA PENDIENTE (S):
                </span>{" "}
                {results.s}
              </p>
            </div>
            <div className="p-4 bg-white rounded-lg shadow">
              <p className="text-gray-700">
                <span className="font-semibold">
                  FACTOR DE MANEJO DE CULTIVOS (C):
                </span>{" "}
                {results.c}
              </p>
            </div>
            <div className="p-4 bg-white rounded-lg shadow">
              <p className="text-gray-700">
                <span className="font-semibold">
                  FACTOR PRÁCTICA DE CONSERVACIÓN (P):
                </span>{" "}
                {results.pd}
              </p>
            </div>
            <div className="p-4 bg-white rounded-lg shadow">
              <p className="text-gray-700">
                <span className="font-semibold">
                  PÉRDIDA DE SUELO (A):
                </span>{" "}
                {results.perdidaSuelo}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Modal para mostrar imágenes de tablas */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-4 rounded-lg relative">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-2 right-2 text-gray-700 font-bold"
            >
              x
            </button>
            <img
              src={modalImage}
              alt="Tabla"
              className="max-w-full max-h-full rounded-md"
            />
          </div>
        </div>
      )}
      <br />
    </div>
  );
};

export default EcuacionSuelo;
