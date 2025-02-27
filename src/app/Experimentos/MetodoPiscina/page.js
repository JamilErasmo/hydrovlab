// src/PiscinaNivelada.js
'use client';
import React, { useState, useRef } from 'react';
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

const PiscinaNivelada = () => {
  // Datos de entrada (inician en blanco)
  const [formData, setFormData] = useState({
    area: '',
    tiempoM: '',
    tiempoS: '',
    iteraciones: ''
  });

  // Estado para mostrar mensaje de importación
  const [importStatus, setImportStatus] = useState('');

  // Tabla 1
  //  Columna1: Elevación
  //  Columna2: Caudal de Salida
  //  Columna3: Almacenamiento
  //  Columna4: (2S/Δt) + Q
  const [rows1, setRows1] = useState([]);

  // Tabla 2
  //  Columna1: Caudal de Entrada
  //  Columna2: Tiempo (min)
  //  Columna3: Ij + Ij+1
  //  Columna4: (2Sj/tΔ) - Qj
  //  Columna5: (2Sj+1/tΔ) - Qj+1
  //  Columna6: Caudal de Salida
  const [rows2, setRows2] = useState([]);

  // Mensaje de error
  const [errorMessage, setErrorMessage] = useState('');

  // Estados para mostrar/ocultar las gráficas
  const [showGraph1, setShowGraph1] = useState(false);
  const [showGraph2, setShowGraph2] = useState(false);

  // Estados para los modales de ingreso de datos en cada tabla
  const [showAddModal1, setShowAddModal1] = useState(false);
  const [newElevacion, setNewElevacion] = useState('');
  const [newCaudalSalida, setNewCaudalSalida] = useState('');

  const [showAddModal2, setShowAddModal2] = useState(false);
  const [newCaudalEntrada, setNewCaudalEntrada] = useState('');

  // Referencia para el input de archivo de importación
  const fileInputRef = useRef(null);

  // Manejo de cambios en el formulario principal
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Funciones para agregar datos a cada tabla
  const addData1 = (elev, caudal) => {
    const newRow = {
      Columna1: parseFloat(elev),  // Elevación
      Columna2: parseFloat(caudal),// Caudal de Salida
      Columna3: 0,
      Columna4: 0,
    };
    setRows1(prev => [...prev, newRow]);
  };

  const addData2 = (caudalEntrada) => {
    const newRow = {
      Columna1: parseFloat(caudalEntrada), // Caudal de Entrada
      Columna2: 0,  // Tiempo (min)
      Columna3: 0,
      Columna4: 0,
      Columna5: 0,
      Columna6: 0,  // Caudal de Salida
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

  // Función para cargar datos de ejemplo en formulario y tablas
  const loadSampleData = () => {
    setFormData({
      area: '43560',
      tiempoM: '10',
      tiempoS: '600',
      iteraciones: '6'
    });
    datosDePruebaE1();
    datosDePruebaE2();
    setErrorMessage('');
  };

  // Calcular Tabla 1: Almacenamiento y (2S/Δt) + Q
  const calcularDatosTabla1 = () => {
    if (!validateForm()) return;
    const area = parseFloat(formData.area);
    const tiempoSec = parseFloat(formData.tiempoS);

    // Para cada fila de la tabla 1, calculamos:
    // Almacenamiento = Elevación * Área
    // (2S/Δt) + Q = (2 * Almacenamiento / tiempoSec) + Caudal de Salida
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

  // Función auxiliar para la interpolación en Tabla 2
  const indiceRangoSeleccionado = (valor) => {
    for (let j = 0; j < rows1.length; j++) {
      if (valor <= parseFloat(rows1[j].Columna4)) {
        return j;
      }
    }
    return -1;
  };

  // Calcular Tabla 2
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
    const ceUltimo = newRows2[newRows2.length - 1].Columna1;
    for (let i = 0; i < numFilas + iteraciones; i++) {
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
      newRows2[i].Columna2 = sumTiempo;
      sumTiempo += tiempoM;
      if (i > 0) {
        newRows2[i].Columna3 = parseFloat((newRows2[i - 1].Columna1 + newRows2[i].Columna1).toFixed(1));
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
        const col2 = parseFloat(rows1[0].Columna2);
        const col3 = parseFloat(rows1[0].Columna3);
        const tiempoSec = parseFloat(formData.tiempoS);
        const col4_2 = (2 * col3 / tiempoSec) - col2;
        newRows2[i].Columna3 = 0;
        newRows2[i].Columna4 = parseFloat(col4_2.toFixed(2));
        newRows2[i].Columna5 = 0;
        newRows2[i].Columna6 = 0;
      }
    }
    setRows2(newRows2);
  };

  // Validación: Área y Tiempo (seg) son requeridos
  const validateForm = () => {
    if (!formData.area) {
      setErrorMessage('Área es un dato requerido');
      return false;
    }
    if (!formData.tiempoS) {
      setErrorMessage('Tiempo (∆t) (seg) es un dato requerido');
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
    setFormData({ area: '', tiempoM: '', tiempoS: '', iteraciones: '' });
    setErrorMessage('');
    setShowGraph1(false);
    setShowGraph2(false);
    setImportStatus('');
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

  // Función para importar datos a los campos de entrada
  // Se espera un archivo de texto con 4 líneas en el siguiente orden:
  // área, tiempoM, tiempoS, iteraciones
  const handleFileImport = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const text = ev.target.result;
      const lines = text.split('\n').map(line => line.trim()).filter(line => line !== '');
      if (lines.length === 4) {
        const newFormData = {
          area: lines[0].replace(',', '.'),
          tiempoM: lines[1].replace(',', '.'),
          tiempoS: lines[2].replace(',', '.'),
          iteraciones: lines[3].replace(',', '.'),
        };
        setFormData(newFormData);
        setImportStatus('Datos importados');
      } else {
        setErrorMessage("El archivo debe contener 4 líneas en el siguiente orden:\nÁrea, Tiempo (min), Tiempo (seg), Iteraciones.");
        setImportStatus('');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div style={{ padding: '20px' }}>
      <BackButton />

      {/* Título del experimento, imagen y botón de importación */}
      <div className="max-w-2xl mx-auto text-center mb-6">
        <h2 className="text-3xl font-bold text-blue-700 uppercase tracking-wide mb-4">
          Método de Piscina Nivelada
        </h2>
        <div className="flex justify-center mb-4">
          <img 
            src="\images\imagePicinaNivelada.png" 
            alt="Imagen del experimento" 
            className="w-1/2 object-contain"
          />
        </div>
        {/* Botón para importar datos a las casillas de entrada */}
        <div className="flex flex-col items-center mb-4">
          <button
            onClick={() => fileInputRef.current.click()}
            className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg shadow-md transition duration-300"
          >
            Importar Datos
          </button>
          <input 
            type="file" 
            accept=".txt" 
            ref={fileInputRef} 
            style={{ display: 'none' }} 
            onChange={handleFileImport}
          />
          {importStatus && (
            <span className="mt-2 text-green-600 text-sm">{importStatus}</span>
          )}
        </div>
      </div>

      {/* Formulario de entrada */}
      <div className="mb-6 p-6 bg-white shadow-md rounded-lg max-w-4xl mx-auto">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">Datos de Entrada</h2>

        {/* Área */}
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

        {/* Tiempo (min) */}
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

        {/* Tiempo (seg) */}
        <div className="mb-4">
          <label className="block text-gray-600 font-medium mb-1">
            Tiempo (∆t) (seg):
          </label>
          <input
            type="number"
            name="tiempoS"
            value={formData.tiempoS}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Ingrese el tiempo en segundos"
          />
        </div>
      </div>

      {/* Botones generales */}
      <div className="mb-6 flex flex-wrap gap-4 justify-center">
        <button
          onClick={loadSampleData}
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
      <div className="mb-6 max-w-4xl mx-auto">
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
        <div className="max-w-4xl mx-auto overflow-x-auto">
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

      {/* Gráfica para Tabla 1:
          Se ordenan los datos por Columna4 (x) y se grafican:
          Eje X: (2S/Δt)+Q
          Eje Y: Caudal de Salida (Columna2)
          Interpolación con "basis" para mayor curvatura. */}
      {showGraph1 && rows1.length > 0 && (() => {
        // Crear una copia de rows1 y ordenarla por Columna4
        const sortedRows1 = [...rows1].sort((a, b) => a.Columna4 - b.Columna4);

        return (
          <div className="mt-6 max-w-4xl mx-auto p-4 bg-white rounded-lg shadow-lg">
            <h3 className="text-xl font-semibold text-gray-700 text-center mb-4">
              Función almacenamiento caudal de salida para un embalse de detención
            </h3>
            <div className="w-full h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={sortedRows1}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="Columna4"
                    label={{
                      value: "(2S/Δt)+Q (m³/s)",
                      position: "insideBottom",
                      offset: -5,
                      className: "text-gray-600 text-sm"
                    }}
                  />
                  <YAxis
                    label={{
                      value: "Caudal de Salida (m³/s)",
                      angle: -90,
                      position: "insideLeft",
                      className: "text-gray-600 text-sm"
                    }}
                  />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="basis"
                    dataKey="Columna2"
                    name="Caudal de Salida"
                    stroke="#3b82f6"
                    strokeWidth={2}
                    activeDot={{ r: 8 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        );
      })()}

      {/* Modal para ingresar dato en Tabla 1 */}
      {showAddModal1 && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h3 className="text-lg font-semibold text-gray-700 mb-4 text-center">
              Ingresar Dato Tabla 1
            </h3>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-600">
                  Elevación:
                </label>
                <input
                  type="number"
                  value={newElevacion}
                  onChange={(e) => setNewElevacion(e.target.value)}
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600">
                  Caudal de Salida:
                </label>
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
      <br></br>
      <div className="mb-5 max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold text-blue-700 mb-4">Tabla 2</h2>
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
        <div className="max-w-4xl mx-auto overflow-x-auto">
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

      {/* Gráfica para Tabla 2: Se muestra en una sola gráfica
          el caudal de entrada (Columna1) y de salida (Columna6). */}
      {showGraph2 && rows2.length > 0 && (
        <div className="mt-5 max-w-4xl mx-auto p-5 bg-white shadow-lg rounded-lg">
          <h3 className="text-lg font-semibold text-gray-800 text-center mb-4">Tránsito de caudal a través de un embalse de detención</h3>
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
                    label={{ value: 'Caudal (m³/s)', angle: -90, position: 'insideLeft' }}
                    className="text-gray-700"
                  />
                  <Tooltip />
                  <Legend />
                  {/* Línea para Caudal de Salida */}
                  <Line
                    type="monotone"
                    dataKey="Columna6"
                    name="Caudal de Salida"
                    stroke="#82ca9d"
                    strokeWidth={2}
                    activeDot={{ r: 8 }}
                  />
                  {/* Línea para Caudal de Entrada */}
                  <Line
                    type="monotone"
                    dataKey="Columna1"
                    name="Caudal de Entrada"
                    stroke="#FF0000"
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
            <h3 className="text-xl font-semibold text-gray-800 text-center mb-4">
              Ingresar Dato Tabla 2
            </h3>
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
