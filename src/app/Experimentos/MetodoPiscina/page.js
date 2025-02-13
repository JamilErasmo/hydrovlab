// src/PiscinaNivelada.js
'use client';
import React, { useState } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

const PiscinaNivelada = () => {
  // Datos de entrada con valores por defecto para el experimento
  const [formData, setFormData] = useState({
    area: '43560',
    tiempoM: '10',
    // Iteraciones extra para la segunda tabla (por defecto 6)
    iteraciones: '6'
  });

  // Tabla 1 (storePiscinaNivelada1)
  // Columnas:
  //   Columna1: Elevación,
  //   Columna2: Caudal de Salida,
  //   Columna3: Almacenamiento,
  //   Columna4: (2S/Δt)+Q
  const [rows1, setRows1] = useState([]);

  // Tabla 2 (storePiscinaNivelada2)
  // Columnas:
  //   Columna1: Caudal de Entrada,
  //   Columna2: Tiempo (min),
  //   Columna3: Ij+Ij+1,
  //   Columna4: (2Sj/tΔ)-Qj,
  //   Columna5: (2Sj+1/tΔ)-Qj+1,
  //   Columna6: Caudal de Salida
  const [rows2, setRows2] = useState([]);

  // Mensaje de error
  const [errorMessage, setErrorMessage] = useState('');

  // Estados para mostrar/ocultar las gráficas
  const [showGraph1, setShowGraph1] = useState(false);
  const [showGraph2, setShowGraph2] = useState(false);

  // Estados para los modales de ingreso de datos en cada tabla
  // Tabla 1: Ingresar Elevación y Caudal de Salida
  const [showAddModal1, setShowAddModal1] = useState(false);
  const [newElevacion, setNewElevacion] = useState('');
  const [newCaudalSalida, setNewCaudalSalida] = useState('');
  // Tabla 2: Ingresar Caudal de Entrada
  const [showAddModal2, setShowAddModal2] = useState(false);
  const [newCaudalEntrada, setNewCaudalEntrada] = useState('');

  // Manejo de cambios en el formulario principal
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Funciones para agregar datos a cada tabla
  const addData1 = (elev, caudal) => {
    const newRow = {
      Columna1: parseFloat(elev),
      Columna2: parseFloat(caudal),
      Columna3: 0,
      Columna4: 0,
    };
    setRows1(prev => [...prev, newRow]);
  };

  const addData2 = (caudalEntrada) => {
    const newRow = {
      Columna1: parseFloat(caudalEntrada),
      Columna2: 0,
      Columna3: 0,
      Columna4: 0,
      Columna5: 0,
      Columna6: 0,
    };
    setRows2(prev => [...prev, newRow]);
  };

  // Datos de ejemplo para Tabla 1
  const datosDePruebaE1 = () => {
    setRows1([]);
    const testData = [
      [0, 0], [0.5, 3], [1, 8], [1.5, 17], [2, 30],
      [2.5, 43], [3, 60], [3.5, 78], [4, 97], [4.5, 117],
      [5, 137], [5.5, 156], [6, 173], [6.5, 190], [7, 205],
      [7.5, 218], [8, 231], [8.5, 242], [9, 253], [9.5, 264],
      [10, 275]
    ];
    testData.forEach(([elev, caudal]) => addData1(elev, caudal));
  };

  // Datos de ejemplo para Tabla 2
  const datosDePruebaE2 = () => {
    setRows2([]);
    const testData = [0, 60, 120, 180, 240, 300, 360, 320, 280, 240, 200, 160, 120, 80, 40, 0];
    testData.forEach(val => addData2(val));
  };

  // Calcular Tabla 1:
  // Almacenamiento = Elevación * área  
  // (2S/Δt)+Q = (2 * Almacenamiento / tiempo_sec) + Caudal de Salida
  const calcularDatosTabla1 = () => {
    if (!validateForm()) return;
    const area = parseFloat(formData.area);
    const tiempoM = parseFloat(formData.tiempoM);
    const tiempoSec = tiempoM * 60;
    const newRows1 = rows1.map(row => {
      const almacenamiento = row.Columna1 * area;
      const col4 = (2 * almacenamiento / tiempoSec) + row.Columna2;
      return {
        ...row,
        Columna3: parseFloat(almacenamiento.toFixed(2)),
        Columna4: parseFloat(col4.toFixed(2))
      };
    });
    setRows1(newRows1);
  };

  // Función auxiliar para la interpolación en Tabla 2:
  // Retorna el índice de la primera fila en Tabla 1 donde valor <= Columna4
  const indiceRangoSeleccionado = (valor) => {
    for (let j = 0; j < rows1.length; j++) {
      if (valor <= parseFloat(rows1[j].Columna4)) {
        return j;
      }
    }
    return -1;
  };

  // Calcular Tabla 2 (utilizando datos de Tabla 1 y Tabla 2)
  const calcularDatosTabla2 = () => {
    if (!validateForm()) return;
    if (rows1.length === 0) {
      setErrorMessage('Tabla 1 no tiene datos.');
      return;
    }
    const tiempoM = parseFloat(formData.tiempoM);
    let sumTiempo = 0;
    const iteraciones = parseInt(formData.iteraciones) || 0;
    let newRows2 = [...rows2];
    const numFilas = newRows2.length;
    if (numFilas === 0) {
      setErrorMessage('Tabla 2 no tiene datos.');
      return;
    }
    // Se obtiene el último valor de la primera columna de Tabla 2
    const ceUltimo = newRows2[newRows2.length - 1].Columna1;
    // Iteramos desde i = 0 hasta (numFilas + iteraciones - 1)
    for (let i = 0; i < numFilas + iteraciones; i++) {
      // Si la fila no existe, se agrega una nueva con ceUltimo
      if (i >= newRows2.length) {
        newRows2.push({
          Columna1: ceUltimo,
          Columna2: 0,
          Columna3: 0,
          Columna4: 0,
          Columna5: 0,
          Columna6: 0,
        });
      }
      // Se asigna el tiempo acumulado a Columna2
      newRows2[i].Columna2 = sumTiempo;
      sumTiempo += tiempoM;
      if (i > 0) {
        // Columna3 = (fila anterior Columna1 + fila actual Columna1)
        newRows2[i].Columna3 = parseFloat((newRows2[i - 1].Columna1 + newRows2[i].Columna1).toFixed(1));
        // Columna5 = (fila anterior Columna4 + fila actual Columna3)
        newRows2[i].Columna5 = parseFloat((newRows2[i - 1].Columna4 + newRows2[i].Columna3).toFixed(2));
        const x22 = newRows2[i].Columna5;
        const indice = indiceRangoSeleccionado(x22);
        if (indice === -1 || indice === 0) {
          setErrorMessage(`Interpolación no se puede realizar para x22 = ${x22}`);
          return;
        }
        const x1 = parseFloat(rows1[indice - 1].Columna4);
        const x2 = parseFloat(rows1[indice].Columna4);
        const y1 = parseFloat(rows1[indice - 1].Columna2);
        const y2 = parseFloat(rows1[indice].Columna2);
        const interpolado = y1 + ((y2 - y1) / (x2 - x1)) * (x22 - x1);
        newRows2[i].Columna6 = parseFloat(interpolado.toFixed(2));
        newRows2[i].Columna4 = parseFloat((x22 - 2 * newRows2[i].Columna6).toFixed(2));
      } else {
        // Para la primera fila (i === 0)
        const col2 = parseFloat(rows1[0].Columna2);
        const col3 = parseFloat(rows1[0].Columna3);
        const tiempoSec = tiempoM * 60;
        const col4_2 = (2 * col3 / tiempoSec) - col2;
        newRows2[i].Columna3 = 0;
        newRows2[i].Columna4 = parseFloat(col4_2.toFixed(2));
        newRows2[i].Columna5 = 0;
        newRows2[i].Columna6 = 0;
      }
    }
    setRows2(newRows2);
  };

  // Validación simple: se requiere que se ingresen Área y Tiempo (min)
  const validateForm = () => {
    if (!formData.area) {
      setErrorMessage('Área es un dato requerido');
      return false;
    }
    if (!formData.tiempoM) {
      setErrorMessage('Tiempo (min) es un dato requerido');
      return false;
    }
    setErrorMessage('');
    return true;
  };

  // Función genérica para exportar a Excel
  const exportToExcel = (data, fileName) => {
    if (data.length === 0) {
      setErrorMessage('No hay datos para exportar.');
      return;
    }
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Datos");
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const dataBlob = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    });
    saveAs(dataBlob, fileName);
  };

  const exportTabla1 = () => {
    const dataToExport = rows1.map(row => ({
      "Elevación (m)": row.Columna1,
      "Caudal de Salida (m³/s)": row.Columna2,
      "Almacenamiento (m³)": row.Columna3,
      "(2S/Δt)+Q (m³/s)": row.Columna4,
    }));
    exportToExcel(dataToExport, "tabla1.xlsx");
  };

  const exportTabla2 = () => {
    const dataToExport = rows2.map(row => ({
      "Caudal de Entrada (m³/s)": row.Columna1,
      "Tiempo (min)": row.Columna2,
      "Ij+Ij+1 (m³/s)": row.Columna3,
      "(2Sj/tΔ)-Qj (m³/s)": row.Columna4,
      "(2Sj+1/tΔ)-Qj+1 (m³/s)": row.Columna5,
      "Caudal de Salida (m³/s)": row.Columna6,
    }));
    exportToExcel(dataToExport, "tabla2.xlsx");
  };

  // Reinicia el ejercicio
  const nuevoEjercicio = () => {
    setRows1([]);
    setRows2([]);
    setFormData({ area: '', tiempoM: '', iteraciones: '' });
    setErrorMessage('');
    setShowGraph1(false);
    setShowGraph2(false);
  };

  // Modal Tabla 1: Ingresar dato
  const handleAddNewRow1 = () => {
    if (newElevacion === '' || newCaudalSalida === '' || isNaN(newElevacion) || isNaN(newCaudalSalida)) {
      setErrorMessage('Debe ingresar valores numéricos para Elevación y Caudal de Salida.');
      return;
    }
    addData1(newElevacion, newCaudalSalida);
    setNewElevacion('');
    setNewCaudalSalida('');
    setShowAddModal1(false);
  };

  // Modal Tabla 2: Ingresar dato
  const handleAddNewRow2 = () => {
    if (newCaudalEntrada === '' || isNaN(newCaudalEntrada)) {
      setErrorMessage('Debe ingresar un valor numérico para Caudal de Entrada.');
      return;
    }
    addData2(newCaudalEntrada);
    setNewCaudalEntrada('');
    setShowAddModal2(false);
  };

  return (
    <div style={{ padding: '20px' }}>
      {/* Formulario de entrada (Área y Tiempo) */}
      <div className="mb-6 p-6 bg-white shadow-md rounded-lg">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">Datos de Entrada</h2>

        {/* Área del espejo de agua */}
        <div className="mb-4">
          <label className="block text-gray-600 font-medium mb-1">
            Área del espejo de agua (m²):
          </label>
          <input
            type="number"
            name="area"
            value={formData.area}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Ingrese el área en m²"
          />
        </div>

        {/* Tiempo en minutos */}
        <div className="mb-4">
          <label className="block text-gray-600 font-medium mb-1">
            Tiempo (∆t) (min):
          </label>
          <input
            type="number"
            name="tiempoM"
            value={formData.tiempoM}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Ingrese el tiempo en minutos"
          />
        </div>
      </div>


      {/* Botones generales */}
      <div className="mb-6 flex flex-wrap gap-4 justify-center">
        <button
          onClick={() => { datosDePruebaE1(); datosDePruebaE2(); }}
          className="px-5 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition duration-300"
        >
          Ejemplo
        </button>

        <button
          onClick={calcularDatosTabla1}
          className="px-5 py-2 bg-green-600 text-white font-semibold rounded-lg shadow-md hover:bg-green-700 transition duration-300"
        >
          Calcular Tabla 1
        </button>

        <button
          onClick={calcularDatosTabla2}
          className="px-5 py-2 bg-yellow-600 text-white font-semibold rounded-lg shadow-md hover:bg-yellow-700 transition duration-300"
        >
          Calcular Tabla 2
        </button>

        <button
          onClick={nuevoEjercicio}
          className="px-5 py-2 bg-red-600 text-white font-semibold rounded-lg shadow-md hover:bg-red-700 transition duration-300"
        >
          Nuevo Ejercicio
        </button>
      </div>
      {/* Tabla 1 */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-blue-700 mb-4">Tabla 1</h2>

        <div className="flex flex-wrap gap-4 justify-center mb-4">
          <button
            onClick={() => setShowGraph1(prev => !prev)}
            className="px-5 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition duration-300"
          >
            {showGraph1 ? 'Ocultar Gráfica Tabla 1' : 'Ver Gráfica Tabla 1'}
          </button>

          <button
            onClick={exportTabla1}
            className="px-5 py-2 bg-green-600 text-white font-semibold rounded-lg shadow-md hover:bg-green-700 transition duration-300"
          >
            Exportar Tabla 1 a Excel
          </button>

          <button
            onClick={() => setShowAddModal1(true)}
            className="px-5 py-2 bg-yellow-600 text-white font-semibold rounded-lg shadow-md hover:bg-yellow-700 transition duration-300"
          >
            Ingresar Dato Tabla 1
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border border-gray-300">
            <thead className="bg-gray-200 text-gray-700">
              <tr>
                <th className="border px-4 py-2">Elevación (m)</th>
                <th className="border px-4 py-2">Caudal de Salida (m³/s)</th>
                <th className="border px-4 py-2">Almacenamiento (m³)</th>
                <th className="border px-4 py-2">(2S/Δt)+Q (m³/s)</th>
              </tr>
            </thead>
            <tbody>
              {rows1.map((row, index) => (
                <tr key={index} className="hover:bg-gray-100">
                  <td className="border px-4 py-2">{row.Columna1}</td>
                  <td className="border px-4 py-2">{row.Columna2}</td>
                  <td className="border px-4 py-2">{row.Columna3}</td>
                  <td className="border px-4 py-2">{row.Columna4}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Gráfica para Tabla 1 */}
      {showGraph1 && rows1.length > 0 && (
        <div className="mt-6 p-4 bg-white rounded-lg shadow-lg">
          <h3 className="text-xl font-semibold text-gray-700 text-center mb-4">Gráfica Tabla 1</h3>

          <div className="w-full h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={rows1}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="Columna1"
                  label={{
                    value: "Elevación (m)",
                    position: "insideBottom",
                    offset: -5,
                    className: "text-gray-600 text-sm"
                  }}
                />
                <YAxis
                  label={{
                    value: "(2S/Δt)+Q",
                    angle: -90,
                    position: "insideLeft",
                    className: "text-gray-600 text-sm"
                  }}
                />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="Columna4"
                  name="(2S/Δt)+Q"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  activeDot={{ r: 8 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Modal para ingresar dato en Tabla 1 */}
      {showAddModal1 && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h3 className="text-lg font-semibold text-gray-700 mb-4 text-center">
              Ingresar Dato Tabla 1
            </h3>

            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-600">Elevación:</label>
                <input
                  type="number"
                  value={newElevacion}
                  onChange={(e) => setNewElevacion(e.target.value)}
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600">Caudal de Salida:</label>
                <input
                  type="number"
                  value={newCaudalSalida}
                  onChange={(e) => setNewCaudalSalida(e.target.value)}
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="flex justify-end space-x-3 mt-4">
              <button
                onClick={() => {
                  setShowAddModal1(false);
                  setNewElevacion('');
                  setNewCaudalSalida('');
                }}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition"
              >
                Cancelar
              </button>
              <button
                onClick={handleAddNewRow1}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
              >
                Agregar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Tabla 2 */}
      <div className="mb-5">
        <h2 className="text-lg font-semibold text-gray-800 mb-3">Tabla 2</h2>

        {/* Input para Iteraciones Extras */}
        <div className="flex items-center mb-4">
          <label className="text-sm font-medium text-gray-700">Iteraciones extras:</label>
          <input
            type="number"
            name="iteraciones"
            value={formData.iteraciones}
            onChange={handleInputChange}
            className="w-16 ml-3 px-2 py-1 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Botones de Acción */}
        <div className="flex space-x-3 mb-4">
          <button
            onClick={() => setShowGraph2(prev => !prev)}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
          >
            {showGraph2 ? 'Ocultar Gráfica Tabla 2' : 'Ver Gráfica Tabla 2'}
          </button>
          <button
            onClick={exportTabla2}
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition"
          >
            Exportar Tabla 2 a Excel
          </button>
          <button
            onClick={() => setShowAddModal2(true)}
            className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition"
          >
            Ingresar Dato Tabla 2
          </button>
        </div>

        {/* Tabla de Datos */}
        <div className="overflow-x-auto">
          <table className="w-full border border-gray-300 rounded-md">
            <thead className="bg-gray-100">
              <tr className="text-left text-sm text-gray-700">
                <th className="p-2 border">Caudal de Entrada (m³/s)</th>
                <th className="p-2 border">Tiempo (min)</th>
                <th className="p-2 border">Ij+Ij+1 (m³/s)</th>
                <th className="p-2 border">(2Sj/tΔ)-Qj (m³/s)</th>
                <th className="p-2 border">(2Sj+1/tΔ)-Qj+1 (m³/s)</th>
                <th className="p-2 border">Caudal de Salida (m³/s)</th>
              </tr>
            </thead>
            <tbody>
              {rows2.map((row, index) => (
                <tr key={index} className="text-sm border-t">
                  <td className="p-2 border">{row.Columna1}</td>
                  <td className="p-2 border">{row.Columna2}</td>
                  <td className="p-2 border">{row.Columna3}</td>
                  <td className="p-2 border">{row.Columna4}</td>
                  <td className="p-2 border">{row.Columna5}</td>
                  <td className="p-2 border">{row.Columna6}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Gráfica para Tabla 2 */}
      {showGraph2 && rows2.length > 0 && (
        <div className="mt-5 p-5 bg-white shadow-lg rounded-lg">
          <h3 className="text-lg font-semibold text-gray-800 text-center mb-4">Gráfica Tabla 2</h3>
          <div className="flex justify-center">
            <div className="w-full max-w-4xl">
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={rows2}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="Columna2"
                    label={{ value: 'Tiempo (min)', position: 'insideBottom', offset: -5 }}
                    className="text-gray-700"
                  />
                  <YAxis
                    label={{ value: 'Caudal de Salida (m³/s)', angle: -90, position: 'insideLeft' }}
                    className="text-gray-700"
                  />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="Columna6"
                    name="Caudal de Salida"
                    stroke="#82ca9d"
                    strokeWidth={2}
                    activeDot={{ r: 8 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {/* Modal para ingresar dato en Tabla 2 */}
      {showAddModal2 && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-xl w-96">
            <h3 className="text-xl font-semibold text-gray-800 text-center mb-4">Ingresar Dato Tabla 2</h3>

            <div className="flex flex-col gap-4">
              <label className="text-gray-700 font-medium">
                Caudal de Entrada:
                <input
                  type="number"
                  value={newCaudalEntrada}
                  onChange={(e) => setNewCaudalEntrada(e.target.value)}
                  className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </label>
            </div>

            {/* Botones de acción */}
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => {
                  setShowAddModal2(false);
                  setNewCaudalEntrada('');
                }}
                className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition"
              >
                Cancelar
              </button>
              <button
                onClick={handleAddNewRow2}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                Agregar
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default PiscinaNivelada;
