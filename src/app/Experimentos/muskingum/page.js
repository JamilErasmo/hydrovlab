'use client';
import React, { useState, useRef } from 'react';
import { Line } from 'react-chartjs-2';
import BackButton from "@/components/BackButton";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

// Registro de componentes de Chart.js
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const EstimacionesKYX = () => {
  // Estado para seleccionar el experimento activo
  const [activeExperiment, setActiveExperiment] = useState("kyx");

  /*** EXPERIMENTO "Estimaciones de K y X" ***/
  const [data, setData] = useState([]);
  const [inputValues, setInputValues] = useState({
    Tiempo: '',
    X1: '',
    X2: '',
    X3: '',
    X4: '',
  });
  const [modalValues, setModalValues] = useState({ Qe: '', Qs: '' });
  const [showModal, setShowModal] = useState(false);
  const [chartData, setChartData] = useState(null);
  const [resultadosK, setResultadosK] = useState({ K1: '', K2: '', K3: '', K4: '', X: '', K: '' });
  const [mejorSerie, setMejorSerie] = useState(null);
  const fileInputRef = useRef(null);

  const handleInputChange = (field, value) => {
    setInputValues({ ...inputValues, [field]: value });
  };

  const handleEjemplo = () => {
    const exampleData = [
      { Qe: 2.2, Qs: 2.0 },
      { Qe: 14.5, Qs: 7.0 },
      { Qe: 28.4, Qs: 11.7 },
      { Qe: 31.8, Qs: 16.5 },
      { Qe: 29.7, Qs: 24.0 },
      { Qe: 25.3, Qs: 29.1 },
      { Qe: 20.4, Qs: 28.4 },
      { Qe: 16.3, Qs: 23.8 },
      { Qe: 12.6, Qs: 19.4 },
      { Qe: 9.3, Qs: 15.3 },
      { Qe: 6.7, Qs: 11.2 },
      { Qe: 5.0, Qs: 8.2 },
      { Qe: 4.1, Qs: 6.4 },
      { Qe: 3.6, Qs: 5.2 },
      { Qe: 2.4, Qs: 4.6 },
    ];
    setData(
      exampleData.map((row, index) => ({
        ...row,
        Tiempo: index === 0 ? 0 : null,
        S: 0,
        X1: 0,
        X2: 0,
        X3: 0,
        X4: 0,
      }))
    );
    setInputValues({
      Tiempo: 0.5,
      X1: 0,
      X2: 0.1,
      X3: 0.2,
      X4: 0.3,
    });
    setResultadosK({ K1: '', K2: '', K3: '', K4: '', X: '', K: '' });
    setChartData(null);
    setMejorSerie(null);
  };

  const handleCalcular = () => {
    const xValues = [
      parseFloat(inputValues.X1) || 0,
      parseFloat(inputValues.X2) || 0.1,
      parseFloat(inputValues.X3) || 0.2,
      parseFloat(inputValues.X4) || 0.3,
    ];

    if (xValues.some((x) => x < 0 || x > 0.5)) {
      alert('Los valores de X deben cumplir con la condición 0 <= X <= 0.5.');
      return;
    }

    const deltaT = parseFloat(inputValues.Tiempo) || 0.5;
    let acumuladoTiempo = 0;
    let almacenamientoAnterior = 0;
    let maxAlmacenamiento = 0;
    let indexMax = 0;

    const resultados = data.map((row, index) => {
      if (index === 0) {
        return {
          ...row,
          Tiempo: acumuladoTiempo.toFixed(2),
          S: almacenamientoAnterior.toFixed(2),
          X1: 0,
          X2: 0,
          X3: 0,
          X4: 0,
        };
      }
      acumuladoTiempo += deltaT;
      const prevRow = data[index - 1];
      const S =
        almacenamientoAnterior +
        (deltaT / 2) *
          ((parseFloat(prevRow.Qe) || 0) +
            (parseFloat(row.Qe) || 0) -
            (parseFloat(prevRow.Qs) || 0) -
            (parseFloat(row.Qs) || 0));
      almacenamientoAnterior = S;
      if (S > maxAlmacenamiento) {
        maxAlmacenamiento = S;
        indexMax = index;
      }
      return {
        ...row,
        Tiempo: acumuladoTiempo.toFixed(2),
        S: S.toFixed(2),
        X1: (
          xValues[0] * (parseFloat(row.Qe) || 0) +
          (1 - xValues[0]) * (parseFloat(row.Qs) || 0)
        ).toFixed(2),
        X2: (
          xValues[1] * (parseFloat(row.Qe) || 0) +
          (1 - xValues[1]) * (parseFloat(row.Qs) || 0)
        ).toFixed(2),
        X3: (
          xValues[2] * (parseFloat(row.Qe) || 0) +
          (1 - xValues[2]) * (parseFloat(row.Qs) || 0)
        ).toFixed(2),
        X4: (
          xValues[3] * (parseFloat(row.Qe) || 0) +
          (1 - xValues[3]) * (parseFloat(row.Qs) || 0)
        ).toFixed(2),
      };
    });
    const kValues = {
      K1: (maxAlmacenamiento / resultados[indexMax].X1).toFixed(2),
      K2: (maxAlmacenamiento / resultados[indexMax].X2).toFixed(2),
      K3: (maxAlmacenamiento / resultados[indexMax].X3).toFixed(2),
      K4: (maxAlmacenamiento / resultados[indexMax].X4).toFixed(2),
    };
    setData(resultados);
    setResultadosK(kValues);
  };

  const handleLimpiar = () => {
    setData([]);
    setInputValues({
      Tiempo: '',
      X1: '',
      X2: '',
      X3: '',
      X4: '',
    });
    setResultadosK({ K1: '', K2: '', K3: '', K4: '', X: '', K: '' });
    setChartData(null);
    setMejorSerie(null);
  };

  const handleVerGraficas = () => {
    if (data.length === 0) {
      alert('No hay datos para graficar.');
      return;
    }
    const datasets = [1, 2, 3, 4].map((idx) => {
      return {
        label: `X${idx}`,
        data: data.map((row) => {
          const xValue = parseFloat(row[`X${idx}`]) || 0;
          const yValue = parseFloat(row.S) || 0;
          return { x: xValue, y: yValue };
        }),
        borderColor: `rgba(${75 * idx}, 192, 192, 0.8)`,
        backgroundColor: `rgba(${75 * idx}, 192, 192, 0.3)`,
        fill: false,
        tension: 0.1,
      };
    });
    let mejor = { label: '', rSquared: 0 };
    datasets.forEach((ds) => {
      const reg = computeRegression(ds.data);
      if (reg.rSquared > mejor.rSquared) {
        mejor = { label: ds.label, rSquared: reg.rSquared };
      }
    });
    setMejorSerie(mejor);
    setChartData({ datasets });
  };

  const computeRegression = (dataPoints) => {
    if (!dataPoints || dataPoints.length === 0) return { slope: 0, intercept: 0, rSquared: 0 };
    const n = dataPoints.length;
    let sumX = 0,
      sumY = 0;
    dataPoints.forEach((pt) => {
      sumX += pt.x;
      sumY += pt.y;
    });
    const meanX = sumX / n;
    const meanY = sumY / n;
    let numerator = 0,
      denominator = 0;
    dataPoints.forEach((pt) => {
      numerator += (pt.x - meanX) * (pt.y - meanY);
      denominator += Math.pow(pt.x - meanX, 2);
    });
    const slope = denominator === 0 ? 0 : numerator / denominator;
    const intercept = meanY - slope * meanX;
    let sumSqX = 0,
      sumSqY = 0;
    dataPoints.forEach((pt) => {
      sumSqX += Math.pow(pt.x - meanX, 2);
      sumSqY += Math.pow(pt.y - meanY, 2);
    });
    const rSquared = sumSqX * sumSqY === 0 ? 0 : Math.pow(numerator, 2) / (sumSqX * sumSqY);
    return { slope, intercept, rSquared };
  };

  const exportTableData = () => {
    if (data.length === 0) {
      alert("No hay datos para exportar.");
      return;
    }
    const dataToExport = data.map(row => ({
      "Qe (m³/s)": row.Qe,
      "Qs (m³/s)": row.Qs,
      "Tiempo (días)": row.Tiempo,
      "Almacenamiento (S)": row.S,
      "X1": row.X1,
      "X2": row.X2,
      "X3": row.X3,
      "X4": row.X4,
    }));
    const worksheet = XLSX.utils.json_to_sheet(dataToExport);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Datos");
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const dataBlob = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    saveAs(dataBlob, "datos_muskingum.xlsx");
  };

  const handleFileImport = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const text = ev.target.result;
      const lines = text.split('\n').map(line => line.trim()).filter(line => line !== '');
      if (lines.length === 5) {
        setInputValues({
          Tiempo: lines[0].replace(',', '.'),
          X1: lines[1].replace(',', '.'),
          X2: lines[2].replace(',', '.'),
          X3: lines[3].replace(',', '.'),
          X4: lines[4].replace(',', '.'),
        });
      } else {
        alert("El archivo debe contener 5 líneas en el siguiente orden: Tiempo, X1, X2, X3, X4.");
      }
    };
    reader.readAsText(file);
  };

  /*** EXPERIMENTO "Tránsito de avenida" ***/
  const [transitoData, setTransitoData] = useState([]);
  const [transitoInput, setTransitoInput] = useState({
    k: '',
    X: '',
    dt: '',
    iteraciones: '',
  });
  const [transitoCalcs, setTransitoCalcs] = useState({ C0: '', C1: '', C2: '', sum: '' });
  const [showModalTransito, setShowModalTransito] = useState(false);
  const [modalValuesTransito, setModalValuesTransito] = useState({ Qe: '' });
  const [chartDataTransito, setChartDataTransito] = useState(null);
  const transitoFileInputRef = useRef(null);

  const handleInputChangeTransito = (field, value) => {
    setTransitoInput({ ...transitoInput, [field]: value });
  };

  const handleEjemploTransito = () => {
    setTransitoInput({
      k: "2",
      X: "0.1",
      dt: "1",
      iteraciones: "5",
    });
    const sampleQe = [
      352, 587, 1353, 2725, 4408, 5987, 6704, 6951, 6839, 6207, 5346, 4560,
      3861, 3007, 2357.5, 1779, 1405, 1123, 952.5, 730, 605, 514, 422, 352
    ];
    const sampleRows = sampleQe.map(val => ({
      Qe: val,
      Tiempo: "",
      C0Qe2: "",
      C1Qe1: "",
      C2Qs1: "",
      Qs: "",
    }));
    setTransitoData(sampleRows);
  };

  const handleCalcularTransito = () => {
    if (!transitoInput.k || !transitoInput.X || !transitoInput.dt || !transitoInput.iteraciones) {
      alert("Todos los campos de entrada son requeridos.");
      return;
    }
    const k = parseFloat(transitoInput.k);
    const X = parseFloat(transitoInput.X);
    const dt = parseFloat(transitoInput.dt);
    const iteraciones = parseInt(transitoInput.iteraciones, 10);
    const denom = 2 * k * (1 - X) + dt;
    const C0 = (dt - 2 * k * X) / denom;
    const C1 = (dt + 2 * k * X) / denom;
    const C2 = (2 * k * (1 - X) - dt) / denom;
    // Actualizar estado de cálculos
    setTransitoCalcs({
      C0: C0.toFixed(4),
      C1: C1.toFixed(4),
      C2: C2.toFixed(4),
      sum: (C0 + C1 + C2).toFixed(2)
    });
    let newRows = [...transitoData];
    const numFilas = newRows.length;
    if (numFilas === 0) {
      alert("La tabla de datos está vacía.");
      return;
    }
    let tiempoAcumulado = 0;
    for (let i = 0; i < numFilas; i++) {
      if (i === 0) {
        tiempoAcumulado = 0;
        newRows[i].Tiempo = tiempoAcumulado.toFixed(2);
        newRows[i].C0Qe2 = "0";
        newRows[i].C1Qe1 = "0";
        newRows[i].C2Qs1 = "0";
        newRows[i].Qs = parseFloat(newRows[i].Qe).toFixed(2);
      } else {
        tiempoAcumulado += dt;
        newRows[i].Tiempo = tiempoAcumulado.toFixed(2);
        const Qe1 = parseFloat(newRows[i - 1].Qe);
        const Qe2 = parseFloat(newRows[i].Qe);
        const Qs1 = parseFloat(newRows[i - 1].Qs);
        const valC0 = C0 * Qe2;
        const valC1 = C1 * Qe1;
        const valC2 = C2 * Qs1;
        const QsCalc = valC0 + valC1 + valC2;
        newRows[i].C0Qe2 = valC0.toFixed(2);
        newRows[i].C1Qe1 = valC1.toFixed(2);
        newRows[i].C2Qs1 = valC2.toFixed(2);
        newRows[i].Qs = QsCalc.toFixed(2);
      }
    }
    // Agregar iteraciones extras
    const lastRow = newRows[newRows.length - 1];
    const lastQe = parseFloat(lastRow.Qe);
    for (let i = 0; i < iteraciones; i++) {
      tiempoAcumulado += dt;
      let newRow = {
        Qe: lastQe,
        Tiempo: tiempoAcumulado.toFixed(2),
        C0Qe2: "",
        C1Qe1: "",
        C2Qs1: "",
        Qs: "",
      };
      const Qe1 = parseFloat(newRows[newRows.length - 1].Qe);
      const Qe2 = lastQe;
      const Qs1 = parseFloat(newRows[newRows.length - 1].Qs);
      const valC0 = C0 * Qe2;
      const valC1 = C1 * Qe1;
      const valC2 = C2 * Qs1;
      const QsCalc = valC0 + valC1 + valC2;
      newRow.C0Qe2 = valC0.toFixed(2);
      newRow.C1Qe1 = valC1.toFixed(2);
      newRow.C2Qs1 = valC2.toFixed(2);
      newRow.Qs = QsCalc.toFixed(2);
      newRows.push(newRow);
    }
    setTransitoData(newRows);
  };

  const handleLimpiarTransito = () => {
    setTransitoData([]);
    setTransitoInput({
      k: '',
      X: '',
      dt: '',
      iteraciones: '',
    });
    setChartDataTransito(null);
    setTransitoCalcs({ C0: '', C1: '', C2: '', sum: '' });
  };

  const handleAgregarDatoTransito = () => {
    if (modalValuesTransito.Qe === '') {
      alert("Debe ingresar un valor numérico para el caudal de entrada.");
      return;
    }
    const newRow = {
      Qe: parseFloat(modalValuesTransito.Qe),
      Tiempo: "",
      C0Qe2: "",
      C1Qe1: "",
      C2Qs1: "",
      Qs: "",
    };
    setTransitoData(prev => [...prev, newRow]);
    setModalValuesTransito({ Qe: '' });
    setShowModalTransito(false);
  };

  const handleVerGraficasTransito = () => {
    if (transitoData.length === 0) {
      alert("No hay datos para graficar.");
      return;
    }
    const datasetQe = {
      label: "Qe (Entrada)",
      data: transitoData.map((row) => ({
        x: parseFloat(row.Tiempo) || 0,
        y: parseFloat(row.Qe) || 0,
      })),
      borderColor: "#FF0000",
      backgroundColor: "#FF0000",
      fill: false,
      tension: 0.1,
    };
    const datasetQs = {
      label: "Qs (Salida)",
      data: transitoData.map((row) => ({
        x: parseFloat(row.Tiempo) || 0,
        y: parseFloat(row.Qs) || 0,
      })),
      borderColor: "#8884d8",
      backgroundColor: "#8884d8",
      fill: false,
      tension: 0.1,
    };
    setChartDataTransito({ datasets: [datasetQe, datasetQs] });
  };

  const exportTableDataTransito = () => {
    if (transitoData.length === 0) {
      alert("No hay datos para exportar.");
      return;
    }
    const dataToExport = transitoData.map(row => ({
      "Qe (m³/s)": row.Qe,
      "Tiempo (días)": row.Tiempo,
      "C₀Qe₂": row.C0Qe2,
      "C₁Qe₁": row.C1Qe1,
      "C₂Qs₁": row.C2Qs1,
      "Qs (m³/s)": row.Qs,
    }));
    const worksheet = XLSX.utils.json_to_sheet(dataToExport);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Datos");
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const dataBlob = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    saveAs(dataBlob, "datos_transito.xlsx");
  };

  const handleFileImportTransito = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const text = ev.target.result;
      const lines = text.split('\n').map(line => line.trim()).filter(line => line !== '');
      if (lines.length === 4) {
        setTransitoInput({
          k: lines[0].replace(',', '.'),
          X: lines[1].replace(',', '.'),
          dt: lines[2].replace(',', '.'),
          iteraciones: lines[3].replace(',', '.'),
        });
      } else {
        alert("El archivo debe contener 4 líneas en el siguiente orden: k, X, Δt, Número de Iteracciones extras.");
      }
    };
    reader.readAsText(file);
  };

  const chartOptionsTransito = {
    responsive: true,
    plugins: {
      legend: { position: 'top' },
      title: { display: true, text: 'Caudal de Entrada y Salida vs Tiempo' },
    },
    scales: {
      x: {
        type: 'linear',
        position: 'bottom',
        title: { display: true, text: 'Tiempo (días)' },
      },
      y: { title: { display: true, text: 'Caudal (m³/s)' } },
    },
  };

  return (
    <div className='py-8'>
      <BackButton />
      <div className='py-12 w-full text-center'>
        {/* Título y espacio para imagen */}
        <h1 className="text-2xl font-bold mb-4">Método de Muskingum</h1>
        <div className="mb-4">
          <img src="/images/imagenMuskingum.png" alt="Método de Muskingum" className="mx-auto" />
        </div>
        {/* Botones para cambiar de experimento */}
        <div className="flex justify-center gap-4 mb-6">
          <button
            onClick={() => setActiveExperiment("kyx")}
            className={`px-4 py-2 rounded-lg shadow-md transition duration-300 ${activeExperiment === "kyx" ? "bg-blue-600 text-white" : "bg-gray-300 text-gray-800"}`}
          >
            Estimaciones de K y X
          </button>
          <button
            onClick={() => setActiveExperiment("transito")}
            className={`px-4 py-2 rounded-lg shadow-md transition duration-300 ${activeExperiment === "transito" ? "bg-blue-600 text-white" : "bg-gray-300 text-gray-800"}`}
          >
            Transito de avenida
          </button>
        </div>

        {/* Contenido según experimento seleccionado */}
        {activeExperiment === "kyx" && (
          <>
            <div className="flex justify-center">
              <div className="mb-4 flex flex-wrap gap-2 justify-center items-center py-6">
                <button onClick={handleEjemplo} className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition duration-300 ease-in-out">
                  Ejemplo
                </button>
                <button onClick={handleCalcular} className="px-4 py-2 bg-green-600 text-white rounded-lg shadow-md hover:bg-green-700 transition duration-300 ease-in-out">
                  Calcular
                </button>
                <button onClick={handleLimpiar} className="px-4 py-2 bg-red-600 text-white rounded-lg shadow-md hover:bg-red-700 transition duration-300 ease-in-out">
                  Limpiar
                </button>
                <button onClick={() => setShowModal(true)} className="px-4 py-2 bg-yellow-600 text-white rounded-lg shadow-md hover:bg-yellow-700 transition duration-300 ease-in-out">
                  Ingreso de Datos
                </button>
                <button onClick={handleVerGraficas} className="px-4 py-2 bg-indigo-600 text-white rounded-lg shadow-md hover:bg-indigo-700 transition duration-300 ease-in-out">
                  Ver Gráficas
                </button>
              </div>
            </div>
            <div className="flex justify-center gap-2 mt-4">
              <button onClick={exportTableData} className="px-4 py-2 bg-yellow-600 text-white rounded-lg shadow-md hover:bg-yellow-700 transition duration-300">
                Exportar Datos
              </button>
              <button onClick={() => fileInputRef.current.click()} className="px-4 py-2 bg-purple-600 text-white rounded-lg shadow-md hover:bg-purple-700 transition duration-300">
                Importar Datos de Entrada
              </button>
              <input type="file" accept=".txt" ref={fileInputRef} style={{ display: 'none' }} onChange={handleFileImport} />
            </div>
            <div className="overflow-x-auto">
              <table className="mx-auto text-center border-collapse border border-gray-300 shadow-lg w-full max-w-4xl">
                <thead>
                  <tr className="bg-gray-700 text-white">
                    <th className="p-2 border border-gray-400">Qe (m³/s)</th>
                    <th className="p-2 border border-gray-400">Qs (m³/s)</th>
                    <th className="p-2 border border-gray-400">
                      Tiempo (días)
                      <br />
                      <input
                        type="number"
                        value={inputValues.Tiempo}
                        onChange={(e) => handleInputChange('Tiempo', e.target.value)}
                        className="w-16 text-center text-black border border-gray-400 rounded-md p-1"
                      />
                    </th>
                    <th className="p-2 border border-gray-400">Almacenamiento (S) (m³/s)-d</th>
                    {[1, 2, 3, 4].map((num) => (
                      <th key={num} className="p-2 border border-gray-400">
                        X ({num})
                        <br />
                        <input
                          type="number"
                          value={inputValues[`X${num}`]}
                          onChange={(e) => handleInputChange(`X${num}`, e.target.value)}
                          className="w-16 text-center text-black border border-gray-400 rounded-md p-1"
                        />
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {data.map((row, index) => (
                    <tr key={index} className="odd:bg-gray-100 even:bg-white hover:bg-gray-200">
                      <td className="p-2 border border-gray-300">{row.Qe}</td>
                      <td className="p-2 border border-gray-300">{row.Qs}</td>
                      <td className="p-2 border border-gray-300">{row.Tiempo}</td>
                      <td className="p-2 border border-gray-300">{row.S}</td>
                      <td className="p-2 border border-gray-300">{row.X1}</td>
                      <td className="p-2 border border-gray-300">{row.X2}</td>
                      <td className="p-2 border border-gray-300">{row.X3}</td>
                      <td className="p-2 border border-gray-300">{row.X4}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {chartData && (
              <div className="max-w-2xl mx-auto bg-white p-6 rounded-lg shadow-md border border-gray-300 mt-6">
                <Line data={chartData} options={{
                  responsive: true,
                  plugins: { legend: { position: 'top' }, title: { display: true, text: 'Relación Flujo Ponderado vs Almacenamiento' } },
                  scales: {
                    x: { type: 'linear', position: 'bottom', title: { display: true, text: 'Flujo Ponderado (m³/s)' } },
                    y: { title: { display: true, text: 'Almacenamiento (m³/s)-d' } },
                  },
                }} />
              </div>
            )}
            {mejorSerie && (
              <div className="max-w-2xl mx-auto bg-gray-100 p-6 rounded-lg shadow-md border border-gray-300 mt-4">
                <p className="text-gray-700 text-lg text-center">
                  La serie <strong className="text-blue-600">{mejorSerie.label}</strong> es la que más se asemeja a una recta (R² = <span className="font-semibold">{mejorSerie.rSquared.toFixed(2)}</span>) y se recomienda usarla para estimar K.
                </p>
              </div>
            )}
            {Object.values(resultadosK).some((k) => k) && (
              <div className="max-w-xl mx-auto bg-gray-100 p-6 rounded-lg shadow-md border border-gray-300 mt-6 text-center">
                <h3 className="text-xl font-semibold text-gray-800">Valores de K</h3>
                <p className="text-gray-700 mt-2">K1 = {resultadosK.K1}</p>
                <p className="text-gray-700">K2 = {resultadosK.K2}</p>
                <p className="text-gray-700">K3 = {resultadosK.K3}</p>
                <p className="text-gray-700">K4 = {resultadosK.K4}</p>
                <p className="text-gray-600 mt-3 text-sm italic">
                  Recuerda: en las gráficas se debe escoger la X que más se asemeje a una recta para poder estimar el K.
                </p>
              </div>
            )}
            {showModal && (
              <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                <div className="bg-white p-6 rounded-lg shadow-lg w-96 relative">
                  <button className="absolute top-3 right-3 text-gray-700 hover:text-gray-900" onClick={() => setShowModal(false)}>
                    ✖
                  </button>
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Ingreso de Datos</h3>
                  <label className="block text-gray-700 font-medium">Qe:</label>
                  <input
                    type="number"
                    value={modalValues.Qe}
                    onChange={(e) => setModalValues({ ...modalValues, Qe: e.target.value })}
                    className="w-full text-black p-2 border border-gray-300 rounded-md mb-2"
                  />
                  <label className="block text-gray-700 font-medium">Qs:</label>
                  <input
                    type="number"
                    value={modalValues.Qs}
                    onChange={(e) => setModalValues({ ...modalValues, Qs: e.target.value })}
                    className="w-full text-black p-2 border border-gray-300 rounded-md mb-4"
                  />
                  <div className="flex justify-between">
                    <button
                      className="px-4 py-2 bg-blue-600 text-white rounded-md shadow-md hover:bg-blue-700 transition"
                      onClick={() => {
                        const newRow = {
                          Qe: parseFloat(modalValues.Qe),
                          Qs: parseFloat(modalValues.Qs),
                          Tiempo: "",
                          S: "",
                          X1: "",
                          X2: "",
                          X3: "",
                          X4: ""
                        };
                        setData(prev => [...prev, newRow]);
                        setModalValues({ Qe: '', Qs: '' });
                        setShowModal(false);
                      }}
                    >
                      Agregar
                    </button>
                    <button
                      className="px-4 py-2 bg-gray-500 text-white rounded-md shadow-md hover:bg-gray-600 transition"
                      onClick={() => setShowModal(false)}
                    >
                      Cancelar
                    </button>
                  </div>
                </div>
              </div>
            )}
          </>
        )}

        {activeExperiment === "transito" && (
          <>
            <div className="flex justify-center">
              <div className="mb-4 flex flex-wrap gap-2 justify-center items-center py-6">
                <button onClick={handleEjemploTransito} className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition duration-300 ease-in-out">
                  Ejemplo
                </button>
                <button onClick={handleCalcularTransito} className="px-4 py-2 bg-green-600 text-white rounded-lg shadow-md hover:bg-green-700 transition duration-300 ease-in-out">
                  Calcular
                </button>
                <button onClick={handleLimpiarTransito} className="px-4 py-2 bg-red-600 text-white rounded-lg shadow-md hover:bg-red-700 transition duration-300 ease-in-out">
                  Limpiar
                </button>
                <button onClick={() => setShowModalTransito(true)} className="px-4 py-2 bg-yellow-600 text-white rounded-lg shadow-md hover:bg-yellow-700 transition duration-300 ease-in-out">
                  Ingreso de Datos
                </button>
                <button onClick={handleVerGraficasTransito} className="px-4 py-2 bg-indigo-600 text-white rounded-lg shadow-md hover:bg-indigo-700 transition duration-300 ease-in-out">
                  Ver Gráficas
                </button>
              </div>
            </div>
            <div className="flex justify-center gap-2 mt-4">
              <button onClick={exportTableDataTransito} className="px-4 py-2 bg-yellow-600 text-white rounded-lg shadow-md hover:bg-yellow-700 transition duration-300">
                Exportar Datos
              </button>
              <button onClick={() => transitoFileInputRef.current.click()} className="px-4 py-2 bg-purple-600 text-white rounded-lg shadow-md hover:bg-purple-700 transition duration-300">
                Importar Datos de Entrada
              </button>
              <input type="file" accept=".txt" ref={transitoFileInputRef} style={{ display: 'none' }} onChange={handleFileImportTransito} />
            </div>
            {/* Sección de Datos de Entrada y Cálculos con ancho limitado */}
            <div className="max-w-4xl mx-auto">
              <div className="flex flex-col md:flex-row justify-center gap-4 mt-4">
                <div className="w-full md:w-1/2 bg-gray-100 p-4 rounded-lg shadow-md">
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">Datos de Entrada</h3>
                  <div className="flex flex-col gap-2">
                    <label className="text-gray-700 font-medium">Factor de almacenamiento (k) (días):</label>
                    <input
                      type="number"
                      value={transitoInput.k}
                      onChange={(e) => handleInputChangeTransito('k', e.target.value)}
                      className="border border-gray-400 rounded-md p-1 text-black"
                    />
                    <label className="text-gray-700 font-medium">Factor de ponderación (X):</label>
                    <input
                      type="number"
                      value={transitoInput.X}
                      onChange={(e) => handleInputChangeTransito('X', e.target.value)}
                      className="border border-gray-400 rounded-md p-1 text-black"
                    />
                    <label className="text-gray-700 font-medium">Intervalo de tiempo (Δt) (días):</label>
                    <input
                      type="number"
                      value={transitoInput.dt}
                      onChange={(e) => handleInputChangeTransito('dt', e.target.value)}
                      className="border border-gray-400 rounded-md p-1 text-black"
                    />
                    <label className="text-gray-700 font-medium">Número de Iteracciones extras:</label>
                    <input
                      type="number"
                      value={transitoInput.iteraciones}
                      onChange={(e) => handleInputChangeTransito('iteraciones', e.target.value)}
                      className="border border-gray-400 rounded-md p-1 text-black"
                    />
                  </div>
                </div>
                <div className="w-full md:w-1/2 bg-gray-100 p-4 rounded-lg shadow-md">
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">Cálculos</h3>
                  <p><strong>C0 (Coef. Descarga):</strong> {transitoCalcs.C0 || '0.0000'}</p>
                  <p><strong>C1 (Coef. Descarga):</strong> {transitoCalcs.C1 || '0.0000'}</p>
                  <p><strong>C2 (Coef. Descarga):</strong> {transitoCalcs.C2 || '0.0000'}</p>
                  <p><strong>C0 + C1 + C2 = 1:</strong> {transitoCalcs.sum || '0.00'}</p>
                </div>
              </div>
            </div>
            <div className="overflow-x-auto mt-4">
              <table className="mx-auto text-center border-collapse border border-gray-300 shadow-lg w-full max-w-4xl">
                <thead>
                  <tr className="bg-gray-700 text-white">
                    <th className="p-2 border border-gray-400">Qe (m³/s)</th>
                    <th className="p-2 border border-gray-400">Tiempo (días)</th>
                    <th className="p-2 border border-gray-400">C₀Qe₂</th>
                    <th className="p-2 border border-gray-400">C₁Qe₁</th>
                    <th className="p-2 border border-gray-400">C₂Qs₁</th>
                    <th className="p-2 border border-gray-400">Qs (m³/s)</th>
                  </tr>
                </thead>
                <tbody>
                  {transitoData.map((row, index) => (
                    <tr key={index} className="odd:bg-gray-100 even:bg-white hover:bg-gray-200">
                      <td className="p-2 border border-gray-300">{row.Qe}</td>
                      <td className="p-2 border border-gray-300">{row.Tiempo}</td>
                      <td className="p-2 border border-gray-300">{row.C0Qe2}</td>
                      <td className="p-2 border border-gray-300">{row.C1Qe1}</td>
                      <td className="p-2 border border-gray-300">{row.C2Qs1}</td>
                      <td className="p-2 border border-gray-300">{row.Qs}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {chartDataTransito && (
              <div className="max-w-2xl mx-auto bg-white p-6 rounded-lg shadow-md border border-gray-300 mt-6">
                <Line data={chartDataTransito} options={chartOptionsTransito} />
              </div>
            )}
            {showModalTransito && (
              <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                <div className="bg-white p-6 rounded-lg shadow-lg w-96 relative">
                  <button className="absolute top-3 right-3 text-gray-700 hover:text-gray-900" onClick={() => setShowModalTransito(false)}>
                    ✖
                  </button>
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Ingreso de Datos</h3>
                  <label className="block text-gray-700 font-medium">Qe:</label>
                  <input
                    type="number"
                    value={modalValuesTransito.Qe}
                    onChange={(e) => setModalValuesTransito({ Qe: e.target.value })}
                    className="w-full text-black p-2 border border-gray-300 rounded-md mb-4"
                  />
                  <div className="flex justify-between">
                    <button className="px-4 py-2 bg-blue-600 text-white rounded-md shadow-md hover:bg-blue-700 transition" onClick={handleAgregarDatoTransito}>
                      Agregar
                    </button>
                    <button className="px-4 py-2 bg-gray-500 text-white rounded-md shadow-md hover:bg-gray-600 transition" onClick={() => setShowModalTransito(false)}>
                      Cancelar
                    </button>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default EstimacionesKYX;
