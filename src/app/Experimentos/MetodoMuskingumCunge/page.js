// src/MuskingumCunge.js
'use client';
import React, { useState, useRef } from 'react';
import BackButton from "@/components/BackButton";
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

const MuskingumCunge = () => {
  // Estado para los datos del formulario
  const [formData, setFormData] = useState({
    Qp: '',
    Qb: '',
    So: '',
    Ap: '',
    Tp: '',
    beta: '',
    longitudTramo: '',
    intervaloDt: '',
    iteraciones: '',
  });

  // Nuevo estado para mostrar mensaje de importación
  const [importStatus, setImportStatus] = useState('');

  // Estado para los resultados de los cálculos
  const [calcOutputs, setCalcOutputs] = useState({
    vel: '',
    cel: '',
    flujo: '',
    numCourant: '',
    numReynolds: '',
    coefX: '',
    coefK: '',
    coefC0: '',
    coefC1: '',
    coefC2: '',
    dxc: '',
    coefC0C1C2: '',
  });

  // Estado para los datos de la tabla (storeDatos)
  const [rows, setRows] = useState([]);

  // Estado para mensajes de error
  const [errorMessage, setErrorMessage] = useState('');

  // Estado para el modal de ingreso de datos
  const [showAddModal, setShowAddModal] = useState(false);
  const [newRowValue, setNewRowValue] = useState('');

  // Estado para mostrar/ocultar la gráfica
  const [showGraph, setShowGraph] = useState(false);

  // Referencia para el input de archivo
  const fileInputRef = useRef(null);

  // Manejo de cambios en el formulario
  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Función para cargar datos de ejemplo
  const loadSampleData = () => {
    setFormData({
      Qp: '1000',
      Qb: '0',
      So: '0.000868',
      Ap: '400',
      Tp: '100',
      beta: '1.6',
      longitudTramo: '14.4',
      intervaloDt: '1',
      iteraciones: '5',
    });
    const sampleQe = [
      118.0, 186.0, 258.0, 430.5, 441.0, 491.4, 682.5, 1274.2, 1442.1,
      1209.8, 993.6, 655.2, 527.8, 410.8, 338.0, 273.0, 126.0, 112.0,
      95.2, 82.6
    ];
    const sampleRows = sampleQe.map(val => ({
      Columna1: val, // Caudal de Entrada (Qe)
      Columna2: 0,   // Tiempo
      Columna3: 0,
      Columna4: 0,
      Columna5: 0,
      Columna6: 0,   // Caudal de Salida (Qs)
    }));
    setRows(sampleRows);
    setErrorMessage('');
  };

  // Función para agregar un nuevo dato a la tabla
  const ingresarDato = (val) => {
    const newRow = {
      Columna1: parseFloat(val),
      Columna2: 0,
      Columna3: 0,
      Columna4: 0,
      Columna5: 0,
      Columna6: 0,
    };
    setRows(prev => [...prev, newRow]);
  };

  // Función para realizar los cálculos
  const calcular = () => {
    const { Qp, Qb, So, Ap, Tp, beta, longitudTramo, intervaloDt, iteraciones } = formData;
    if (!Qp || !Qb || !So || !Ap || !Tp || !beta || !longitudTramo || !intervaloDt || !iteraciones) {
      setErrorMessage("Todos los campos de entrada son requeridos.");
      return;
    }
    setErrorMessage('');

    // Conversión y cálculo de parámetros básicos
    const B1 = parseFloat(Qp);
    const B2 = parseFloat(Qb);
    const B3 = parseFloat(So);
    const B4 = parseFloat(Ap);
    const B5 = parseFloat(Tp);
    const B6 = parseFloat(beta);
    const B7 = parseFloat(longitudTramo);
    const C7 = B7 * 1000;
    const B8 = parseFloat(intervaloDt);
    const C8 = B8 * 3600;

    // Cálculos según la fórmula original
    const B10 = B1 / B4;
    const B11 = B6 * B10;
    const B12 = B1 / B5;
    const B13 = B11 * (C8 / C7);
    const B14 = B12 / (B3 * B11 * C7);
    const B15 = 0.5 * (1 - B14);
    const B16 = B7 / B13;
    const B17 = (-1 + B13 + B14) / (1 + B13 + B14);
    const B18 = (1 + B13 - B14) / (1 + B13 + B14);
    const B19 = (1 - B13 + B14) / (1 + B13 + B14);
    const B20 = B12 / (B3 * B11);

    // Actualización de resultados de cálculo
    setCalcOutputs({
      vel: B10.toFixed(3),
      cel: B11.toFixed(3),
      flujo: B12.toFixed(3),
      numCourant: B13.toFixed(3),
      numReynolds: B14.toFixed(3),
      coefX: B15.toFixed(3),
      coefK: B16.toFixed(3),
      coefC0: B17.toFixed(3),
      coefC1: B18.toFixed(3),
      coefC2: B19.toFixed(3),
      dxc: B20.toFixed(3),
      coefC0C1C2: (B17 + B18 + B19).toFixed(3),
    });

    // Actualización de la tabla de datos
    let newRows = [...rows];
    const numFilas = newRows.length;
    const Dt = B8;
    let SUM = 0;
    const iter = parseInt(iteraciones, 10);
    if (numFilas === 0) {
      setErrorMessage("La tabla de datos está vacía.");
      return;
    }
    const ce = parseFloat(newRows[0].Columna1);
    const ceUltimo = parseFloat(newRows[numFilas - 1].Columna1);

    for (let i = 0; i < numFilas + iter; i++) {
      if (i < newRows.length) {
        newRows[i].Columna2 = SUM.toFixed(2);
      } else {
        newRows.push({
          Columna1: ceUltimo,
          Columna2: SUM.toFixed(2),
          Columna3: 0,
          Columna4: 0,
          Columna5: 0,
          Columna6: 0,
        });
      }
      SUM += Dt;
      if (i > 0) {
        const Qe1 = parseFloat(newRows[i - 1].Columna1);
        const Qe2 = parseFloat(newRows[i].Columna1);
        const Qs1 = (i > 1) ? parseFloat(newRows[i - 1].Columna6) : ce;
        const C0Qe2 = Qe2 * B17;
        const C1Qe1 = Qe1 * B18;
        const C2Qs1 = Qs1 * B19;
        const Qs = C0Qe2 + C1Qe1 + C2Qs1;
        newRows[i].Columna3 = C0Qe2.toFixed(2);
        newRows[i].Columna4 = C1Qe1.toFixed(2);
        newRows[i].Columna5 = C2Qs1.toFixed(2);
        newRows[i].Columna6 = Qs.toFixed(2);
      } else {
        newRows[i].Columna3 = "0";
        newRows[i].Columna4 = "0";
        newRows[i].Columna5 = "0";
        newRows[0].Columna6 = ce.toFixed(2);
      }
    }
    setRows(newRows);
  };

  // Reinicia el experimento
  const nuevoEjercicio = () => {
    setFormData({
      Qp: '',
      Qb: '',
      So: '',
      Ap: '',
      Tp: '',
      beta: '',
      longitudTramo: '',
      intervaloDt: '',
      iteraciones: '',
    });
    setCalcOutputs({
      vel: '',
      cel: '',
      flujo: '',
      numCourant: '',
      numReynolds: '',
      coefX: '',
      coefK: '',
      coefC0: '',
      coefC1: '',
      coefC2: '',
      dxc: '',
      coefC0C1C2: '',
    });
    setRows([]);
    setErrorMessage('');
    setShowGraph(false);
    setImportStatus('');
  };

  // Exportar datos a Excel
  const exportToExcel = () => {
    if (rows.length === 0) {
      setErrorMessage("No hay datos para exportar.");
      return;
    }
    const dataToExport = rows.map(row => ({
      "Caudal de Entrada (Qe) (m³/s)": row.Columna1,
      "Tiempo (horas)": row.Columna2,
      "C₀Qe₂": row.Columna3,
      "C₁Qe₁": row.Columna4,
      "C₂Qs₁": row.Columna5,
      "Caudal de Salida (Qs) (m³/s)": row.Columna6,
    }));
    const worksheet = XLSX.utils.json_to_sheet(dataToExport);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Datos");
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const dataBlob = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    saveAs(dataBlob, "muskingum_cunge.xlsx");
  };

  // Manejo del modal para ingresar un nuevo dato en la tabla
  const handleAddNewRow = () => {
    if (newRowValue === '' || isNaN(newRowValue)) {
      setErrorMessage("Debe ingresar un valor numérico para el caudal de entrada.");
      return;
    }
    ingresarDato(newRowValue);
    setNewRowValue('');
    setShowAddModal(false);
  };

  // Función para importar datos desde un archivo txt con el orden:
  // Qp, Qb, So, Ap, Tp, beta, longitudTramo, intervaloDt, iteraciones
  const handleFileImport = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const text = ev.target.result;
      const lines = text.split('\n').map(line => line.trim()).filter(line => line !== '');
      if (lines.length === 9) {
        const newFormData = {
          Qp: lines[0].replace(',', '.'),
          Qb: lines[1].replace(',', '.'),
          So: lines[2].replace(',', '.'),
          Ap: lines[3].replace(',', '.'),
          Tp: lines[4].replace(',', '.'),
          beta: lines[5].replace(',', '.'),
          longitudTramo: lines[6].replace(',', '.'),
          intervaloDt: lines[7].replace(',', '.'),
          iteraciones: lines[8].replace(',', '.'),
        };
        setFormData(newFormData);
        setImportStatus('Datos importados');
      } else {
        setErrorMessage("El archivo debe contener 9 líneas en el siguiente orden:\nQp, Qb, So, Ap, Tp, beta, longitudTramo, intervaloDt, iteraciones.");
        setImportStatus('');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div style={{ padding: '20px' }}>
      <BackButton />
      {/* Contenedor de Datos de Entrada */}
      <div className="max-w-2xl mx-auto bg-white p-6 rounded-lg shadow-md border border-gray-300 mt-6">
        {/* Título Principal */}
        <h1 className="text-2xl font-bold text-blue-700 text-center uppercase tracking-wide mb-4">
          Método de Muskingum – Cunge
        </h1>

        {/* Imagen entre el título y los datos de entrada */}
        <div className="flex justify-center mb-4">
          <img 
            src="\images\imageMuskingumCunge.png" 
            alt="Imagen del experimento" 
            className="w-1/2 object-contain" 
          />
        </div>

        {/* Botón para importar datos desde archivo TXT */}
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
          {/* Mensaje de confirmación */}
          {importStatus && (
            <span className="mt-2 text-green-600 text-sm">{importStatus}</span>
          )}
        </div>

        {/* Subtítulo */}
        <h2 className="text-lg font-semibold text-gray-800 border-b pb-2 mb-4">
          Datos de Entrada
        </h2>

        {/* Contenedor de Inputs */}
        <div className="space-y-4">
          {[
            { label: "Caudal Máximo (Qp) (m³/s):", name: "Qp" },
            { label: "Caudal Base (Qb) (m³/s):", name: "Qb" },
            { label: "Pendiente media (So) (m/m):", name: "So" },
            { label: "Área del cauce (Ap) (m²):", name: "Ap" },
            { label: "Ancho del cauce (Tp) (m):", name: "Tp" },
            { label: "Exponente de proporción (β):", name: "beta" },
            { label: "Longitud del tramo (C) (km):", name: "longitudTramo" },
            { label: "Intervalo de tiempo (Dt) (horas):", name: "intervaloDt" },
            { label: "Número de iteraciones extra:", name: "iteraciones", width: "w-20" }
          ].map((input, index) => (
            <div key={index} className="flex flex-col">
              <label className="text-gray-700 font-medium">{input.label}</label>
              <input
                type="number"
                step="any"
                name={input.name}
                value={formData[input.name]}
                onChange={handleFormChange}
                className={`w-full px-4 py-2 mt-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition ${input.width || ''}`}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Panel de Cálculos */}
      <div className="max-w-2xl mx-auto bg-white p-6 rounded-lg shadow-md border border-gray-300 mt-6">
        <h2 className="text-xl font-semibold text-blue-700 text-center mb-4">
          Cálculos
        </h2>
        <div className="grid grid-cols-2 gap-4 text-gray-700 text-sm">
          {[
            { label: "Velocidad (V, m/s):", value: calcOutputs.vel },
            { label: "Celeridad (c, m/s):", value: calcOutputs.cel },
            { label: "Flujo por unidad de ancho (qo, m²/s):", value: calcOutputs.flujo },
            { label: "Número de Courant (C):", value: calcOutputs.numCourant },
            { label: "Número de Reynolds (D):", value: calcOutputs.numReynolds },
            { label: "Coeficiente X:", value: calcOutputs.coefX },
            { label: "Coeficiente k:", value: calcOutputs.coefK },
            { label: "C0 (Coef. Descarga):", value: calcOutputs.coefC0 },
            { label: "C1 (Coef. Descarga):", value: calcOutputs.coefC1 },
            { label: "C2 (Coef. Descarga):", value: calcOutputs.coefC2 },
            { label: "(Dx)c:", value: calcOutputs.dxc },
            { label: "C0 + C1 + C2:", value: calcOutputs.coefC0C1C2 },
          ].map((item, index) => (
            <div key={index} className="flex justify-between border-b py-2">
              <span className="font-medium">{item.label}</span>
              <span>{item.value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Botones Generales */}
      <div className="flex justify-center gap-4 my-6">
        <button
          onClick={loadSampleData}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-md transition duration-300"
        >
          Ejemplo
        </button>
        <button
          onClick={calcular}
          className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg shadow-md transition duration-300"
        >
          Calcular
        </button>
        <button
          onClick={nuevoEjercicio}
          className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white font-semibold rounded-lg shadow-md transition duration-300"
        >
          Nuevo Ejercicio
        </button>
        <button
          onClick={exportToExcel}
          className="px-4 py-2 bg-yellow-600 hover:bg-yellow-700 text-white font-semibold rounded-lg shadow-md transition duration-300"
        >
          Exportar a Excel
        </button>
      </div>

      {/* Botón para Ingresar Dato */}
      <div className="mb-6 text-center">
        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-md transition duration-300"
        >
          Ingresar Dato
        </button>
      </div>

      {/* Modal de Ingreso de Datos */}
      {showAddModal && (
        <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 backdrop-blur-md">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h3 className="text-lg font-semibold mb-4 text-center">
              Ingresar Dato - Caudal Entrada (Qe)
            </h3>
            <input
              type="number"
              value={newRowValue}
              onChange={(e) => setNewRowValue(e.target.value)}
              className="border border-gray-300 rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <div className="flex justify-end gap-4 mt-4">
              <button
                onClick={() => { setShowAddModal(false); setNewRowValue(''); }}
                className="px-4 py-2 bg-gray-400 hover:bg-gray-500 text-white font-semibold rounded-lg transition duration-300"
              >
                Cancelar
              </button>
              <button
                onClick={handleAddNewRow}
                className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition duration-300"
              >
                Agregar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Contenedor de la Tabla con ancho máximo */}
      <div className="max-w-4xl mx-auto mb-6 overflow-x-auto">
        <h2 className="text-lg font-semibold text-blue-700 text-center mb-4">Datos</h2>
        <table className="w-full border border-gray-300 text-sm text-gray-700">
          <thead>
            <tr className="bg-blue-600 text-white">
              <th className="px-4 py-2">Caudal Entrada (Qe) (m³/s) (1)</th>
              <th className="px-4 py-2">Tiempo (horas) (2)</th>
              <th className="px-4 py-2">C₀Qe₂ (3)</th>
              <th className="px-4 py-2">C₁Qe₁ (4)</th>
              <th className="px-4 py-2">C₂Qs₁ (5)</th>
              <th className="px-4 py-2">Caudal Salida (Qs) (m³/s) (6)</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, idx) => (
              <tr key={idx} className="odd:bg-gray-100">
                <td className="border border-gray-300 px-4 py-2 text-center">{row.Columna1}</td>
                <td className="border border-gray-300 px-4 py-2 text-center">{row.Columna2}</td>
                <td className="border border-gray-300 px-4 py-2 text-center">{row.Columna3}</td>
                <td className="border border-gray-300 px-4 py-2 text-center">{row.Columna4}</td>
                <td className="border border-gray-300 px-4 py-2 text-center">{row.Columna5}</td>
                <td className="border border-gray-300 px-4 py-2 text-center">{row.Columna6}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Botón para Ver/Ocultar la Gráfica */}
      <div className="flex justify-center mb-6">
        <button
          onClick={() => setShowGraph(prev => !prev)}
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded-md transition-all"
        >
          {showGraph ? 'Ocultar Gráfica' : 'Ver Gráfica'}
        </button>
      </div>

      {/* Sección de Gráfica única que muestra ambos caudales */}
      {showGraph && rows.length > 0 && (
        <div className="max-w-2xl mx-auto mt-8">
          <h3 className="text-xl font-bold text-blue-700 text-center mb-6">
            Caudal de Entrada (Qe) y Salida (Qs)
          </h3>
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={rows} margin={{ top: 20, right: 30, left: 50, bottom: 30 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="Columna2" 
                label={{ value: 'Tiempo (horas)', position: 'insideBottom', offset: -5 }} 
              />
              <YAxis 
                label={{ value: 'Caudal (m³/s)', angle: -90, position: 'insideLeft' }} 
                domain={[0, 1500]} 
                tick={{ fontSize: 14 }} 
                width={60} 
              />
              <Tooltip />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="Columna6" 
                name="Qs (Salida)" 
                stroke="#8884d8" 
                dot={{ r: 4 }} 
                activeDot={{ r: 6 }} 
              />
              <Line 
                type="monotone" 
                dataKey="Columna1" 
                name="Qe (Entrada)" 
                stroke="#FF0000" 
                dot={{ r: 4 }} 
                activeDot={{ r: 6 }} 
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
};

export default MuskingumCunge;
