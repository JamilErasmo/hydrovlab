// src/OndaCinematica.js
'use client';
import React, { useState } from 'react';
import BackButton from "@/components/BackButton"; // Ajusta la ruta según la ubicación
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

const OndaCinematica = () => {
  // Estado para los datos del formulario
  const [formData, setFormData] = useState({
    base: '',
    L: '',
    So: '',
    n: '',
    deltaT: ''
  });

  // Estado para la tabla de datos (equivalente a storeDatos)
  const [rows, setRows] = useState([]);

  // Estado para mostrar mensajes de error
  const [errorMessage, setErrorMessage] = useState('');

  // Estado para mostrar/ocultar la gráfica
  const [showGraph, setShowGraph] = useState(false);

  // Estados para el modal de ingresar nuevo dato
  const [showAddModal, setShowAddModal] = useState(false);
  const [newRowValue, setNewRowValue] = useState('');

  // Manejo de cambios en los inputs del formulario
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Función que recibe un arreglo de filas y retorna la versión calculada de las mismas
  const calculateRows = (rowsToCalc) => {
    if (!validateForm()) return rowsToCalc;
    const DB = parseFloat(formData.base);
    const L = parseFloat(formData.L);
    const So = parseFloat(formData.So);
    const n = parseFloat(formData.n);
    const tiempo = parseFloat(formData.deltaT);
    let sumTiempo = 0;
    return rowsToCalc.map(row => {
      const A = sumTiempo;
      sumTiempo += tiempo;
      const B = parseFloat(row.Columna1);
      const G = Math.pow((B * n) / (DB * Math.sqrt(So)), 3 / 5);
      const C = ((Math.sqrt(So)) / n) * (5 / 3) * Math.pow(G, 2 / 3);
      const E = L / C;
      const F = E / 60;
      const D = A + F;
      return {
        ...row,
        Columna2: A,
        Columna3: parseFloat(G.toFixed(2)),
        Columna4: parseFloat(C.toFixed(2)),
        Columna5: parseFloat(E.toFixed(2)),
        Columna6: parseFloat(F.toFixed(2)),
        Columna7: parseFloat(D.toFixed(2)),
      };
    });
  };

  // Función para recalcular todos los datos de la tabla
  const calculate = () => {
    if (!validateForm()) return;
    setRows(prev => calculateRows(prev));
  };

  // Función para validar los datos del formulario
  const validateForm = () => {
    const { base, L, So, n, deltaT } = formData;
    if (!base) return setErrorMessage('Base es un dato requerido');
    if (!L) return setErrorMessage('Longitud es un dato requerido');
    if (!So) return setErrorMessage('Pendiente es un dato requerido');
    if (!n) return setErrorMessage('Coeficiente de rugosidad (n) es un dato requerido');
    if (!deltaT) return setErrorMessage('Delta t es un dato requerido');
    setErrorMessage('');
    return true;
  };

  // Función para agregar un dato (fila) a la tabla y recalcularla
  const addData = (value) => {
    const newRow = {
      Columna1: parseFloat(value),
      Columna2: 0,
      Columna3: 0,
      Columna4: 0,
      Columna5: 0,
      Columna6: 0,
      Columna7: 0,
    };
    setRows(prev => calculateRows([...prev, newRow]));
  };

  // Función para cargar datos de ejemplo
  const exampleData = () => {
    setRows([]);
    const values = [60, 60, 100, 140, 180, 220, 180, 140, 100, 60, 60, 60, 60];
    values.forEach((val) => {
      addData(val);
    });
    // Se setean también valores por defecto en el formulario
    setFormData({
      base: 60,
      L: 5000,
      So: 0.01,
      n: 0.035,
      deltaT: 12
    });
    setErrorMessage('');
    setShowGraph(false);
  };

  // Función para agregar un nuevo dato desde el modal
  const handleAddNewRow = () => {
    if (newRowValue === '' || isNaN(newRowValue)) {
      setErrorMessage('Debe ingresar un valor numérico para el caudal');
      return;
    }
    addData(newRowValue);
    setNewRowValue('');
    setShowAddModal(false);
  };

  // Función para exportar la tabla a Excel
  const exportToExcel = () => {
    if (rows.length === 0) {
      setErrorMessage('No hay datos para exportar.');
      return;
    }
    // Crear arreglo con encabezados descriptivos
    const dataToExport = rows.map(row => ({
      "Caudal de Entrada (m³/s)": row.Columna1,
      "Tiempo (min)": row.Columna2,
      "y Calado (m)": row.Columna3,
      "Celeridad (m/s)": row.Columna4,
      "Tiempo de Tránsito (seg)": row.Columna5,
      "Tiempo de Tránsito (min)": row.Columna6,
      "Tiempo de Salida (min)": row.Columna7,
    }));
    // Generar hoja de cálculo a partir del JSON
    const worksheet = XLSX.utils.json_to_sheet(dataToExport);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Datos");
    // Convertir libro a formato Excel (ArrayBuffer)
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    // Crear blob y descargar
    const dataBlob = new Blob([excelBuffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
    saveAs(dataBlob, "datos.xlsx");
  };

  return (
    <div style={{ padding: '20px' }}>
            <BackButton />
      <h1 className="text-3xl font-bold text-blue-700 text-center uppercase tracking-wide">
        Método Onda Cinemática
      </h1>


      <div className="max-w-lg mx-auto p-6 bg-gray-100 rounded-lg shadow-lg">
        <h2 className="text-center text-2xl font-bold text-blue-700 mb-4">Datos de Entrada</h2>

        {/* Formulario */}
        <div className="grid grid-cols-2 gap-4 items-center">
          <label className="font-semibold text-right">Base de solera (B) (m):</label>
          <input type="number" name="base" value={formData.base} onChange={handleInputChange} className="p-2 border border-gray-300 rounded-md text-center" />

          <label className="font-semibold text-right">Longitud de tramo (L) (m):</label>
          <input type="number" name="L" value={formData.L} onChange={handleInputChange} className="p-2 border border-gray-300 rounded-md text-center" />

          <label className="font-semibold text-right">Pendiente media del canal (So) (m/m):</label>
          <input type="number" step="any" name="So" value={formData.So} onChange={handleInputChange} className="p-2 border border-gray-300 rounded-md text-center" />

          <label className="font-semibold text-right">Coeficiente de rugosidad de manning (n):</label>
          <input type="number" step="any" name="n" value={formData.n} onChange={handleInputChange} className="p-2 border border-gray-300 rounded-md text-center" />

          <label className="font-semibold text-right">Tiempo (∆t) (min):</label>
          <input type="number" name="deltaT" value={formData.deltaT} onChange={handleInputChange} className="p-2 border border-gray-300 rounded-md text-center" />
        </div>

        {/* Botones */}
        <div className="flex justify-center gap-4 mt-6">
          <button onClick={exampleData} className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition">
            Ejemplo
          </button>
          <button onClick={calculate} className="px-4 py-2 bg-green-600 text-white font-semibold rounded-md hover:bg-green-700 transition">
            Calcular
          </button>
          <button onClick={() => { setRows([]); setShowGraph(false); }} className="px-4 py-2 bg-red-600 text-white font-semibold rounded-md hover:bg-red-700 transition">
            Nuevo
          </button>
        </div>
      </div>


      {/* Botones de acción */}
      <div className="flex flex-wrap justify-center gap-4 mt-6">
        <button
          onClick={exampleData}
          className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition">
          Ejemplo
        </button>

        <button
          onClick={calculate}
          className="px-4 py-2 bg-green-600 text-white font-semibold rounded-md hover:bg-green-700 transition">
          Calcular
        </button>

        <button
          onClick={() => { setRows([]); setShowGraph(false); }}
          className="px-4 py-2 bg-red-600 text-white font-semibold rounded-md hover:bg-red-700 transition">
          Nuevo Ejercicio
        </button>

        <button
          onClick={() => setShowGraph(prev => !prev)}
          className={`px-4 py-2 text-white font-semibold rounded-md transition ${showGraph ? "bg-gray-600 hover:bg-gray-700" : "bg-indigo-600 hover:bg-indigo-700"}`}>
          {showGraph ? 'Ocultar Gráfica' : 'Ver Gráfica'}
        </button>

        <button
          onClick={exportToExcel}
          className="px-4 py-2 bg-yellow-500 text-black font-semibold rounded-md hover:bg-yellow-600 transition">
          Exportar a Excel
        </button>
      </div>

      {/* Botón para ingresar un nuevo dato */}
      <div className="flex justify-center my-4">
        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition">
          Ingresar Dato
        </button>
      </div>

      {/* Tabla de datos */}
      <div className="overflow-x-auto">
        <h2 className="text-xl font-bold text-center text-blue-700 my-4">Datos</h2>
        <table className="min-w-full border border-gray-300 bg-white shadow-md rounded-lg">
          <thead className="bg-blue-600 text-white">
            <tr>
              <th className="px-4 py-2 border">Caudal de Entrada (m³/s)</th>
              <th className="px-4 py-2 border">Tiempo (min)</th>
              <th className="px-4 py-2 border">y Calado (m)</th>
              <th className="px-4 py-2 border">Celeridad (m/s)</th>
              <th className="px-4 py-2 border">Tiempo de Tránsito (seg)</th>
              <th className="px-4 py-2 border">Tiempo de Tránsito (min)</th>
              <th className="px-4 py-2 border">Tiempo de Salida (min)</th>
            </tr>
          </thead>
          <tbody className="text-center">
            {rows.map((row, index) => (
              <tr key={index} className="hover:bg-gray-100">
                <td className="px-4 py-2 border">{row.Columna1}</td>
                <td className="px-4 py-2 border">{row.Columna2}</td>
                <td className="px-4 py-2 border">{row.Columna3}</td>
                <td className="px-4 py-2 border">{row.Columna4}</td>
                <td className="px-4 py-2 border">{row.Columna5}</td>
                <td className="px-4 py-2 border">{row.Columna6}</td>
                <td className="px-4 py-2 border">{row.Columna7}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Gráfica */}
      {showGraph && rows.length > 0 && (
        <div className="mt-10 flex flex-col items-center">
          <h2 className="text-2xl font-bold text-blue-700 mb-4">Gráfica</h2>
          <div className="w-full max-w-4xl">
            <ResponsiveContainer width="100%" height={400}>
              <LineChart data={rows}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="Columna2"
                  label={{ value: "Tiempo (min)", position: "insideBottomRight", offset: -5 }}
                />
                <YAxis
                  label={{ value: "y Calado (m)", angle: -90, position: "insideLeft" }}
                />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="Columna3"
                  name="y Calado (m)"
                  stroke="#4A90E2"
                  strokeWidth={3}
                  dot={{ r: 5, fill: "#4A90E2" }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}


      {/* Modal para ingresar un nuevo dato */}
      {showAddModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h3 className="text-xl font-semibold text-gray-700 mb-4">Ingresar Dato</h3>

            <div className="mb-4">
              <label className="block text-gray-600 font-medium mb-1">Caudal Entrada:</label>
              <input
                type="number"
                value={newRowValue}
                onChange={(e) => setNewRowValue(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex justify-end space-x-3">
              <button
                onClick={() => { setShowAddModal(false); setNewRowValue(''); }}
                className="px-4 py-2 text-gray-600 bg-gray-200 rounded-lg hover:bg-gray-300"
              >
                Cancelar
              </button>

              <button
                onClick={handleAddNewRow}
                className="px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700"
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

export default OndaCinematica;
