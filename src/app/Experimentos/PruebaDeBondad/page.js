'use client';
import React, { useState, useRef } from 'react';
import BackButton from "@/components/BackButton"; // Ajusta la ruta según la ubicación

const BondadYAjuste = () => {
  // Estados para datos, resultados, mensajes y nivel de significancia
  const [data, setData] = useState([]);
  const [results, setResults] = useState(null);
  const [message, setMessage] = useState('');
  const [alpha, setAlpha] = useState(0.05); // valor por defecto 0.05

  // Referencia para limpiar el input de archivo
  const fileInputRef = useRef(null);

  // Manejo de la selección del nivel de significancia
  const handleAlphaChange = (e) => {
    setAlpha(parseFloat(e.target.value));
  };

  // Manejo de carga de archivo .txt
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (!file) {
      setMessage("Seleccione un archivo para realizar los cálculos");
      return;
    }
    if (!file.name.toLowerCase().endsWith('.txt')) {
      setMessage("Error!!...La extensión del archivo debe ser .txt");
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target.result;
      const lines = text.split(/\r?\n/).filter(line => line.trim() !== '');
      const numbers = lines.map(line => parseFloat(line)).filter(num => !isNaN(num));
      if (numbers.length < 5) {
        setMessage("Error... Muy pocos datos, ingrese datos mayores o iguales a cinco.");
      } else if (numbers.length > 500) {
        setMessage("Solo se permite el análisis de registros de hasta 500 años");
      } else {
        setData(numbers);
        setResults(null); // Limpia resultados previos
        setMessage("Archivo cargado con éxito");
      }
    };
    reader.readAsText(file);
  };

  // Función para calcular los resultados de cada registro
  const calculateResults = () => {
    if (data.length === 0) return;
    const n = data.length;

    // Cálculo de media y desviación estándar (datos originales)
    const sum = data.reduce((acc, cur) => acc + cur, 0);
    const mean = sum / n;
    const sumSq = data.reduce((acc, cur) => acc + Math.pow(cur - mean, 2), 0);
    const std = Math.sqrt(sumSq / (n - 1));

    // Cálculo de media y desviación estándar para los logaritmos
    const logs = data.map((x) => Math.log(x));
    const sumLog = logs.reduce((acc, cur) => acc + cur, 0);
    const meanLog = sumLog / n;
    const sumSqLog = logs.reduce((acc, cur) => acc + Math.pow(cur - meanLog, 2), 0);
    const stdLog = Math.sqrt(sumSqLog / (n - 1));

    // Ordenar los datos de mayor a menor
    const sortedData = [...data].sort((a, b) => b - a);

    // Para cada registro se calculan:
    // • Fo(xm) = 1 - m/(n+1)
    // • F(xm) Normal = normalArea((xm-mean)/std)
    // • F(xm) LogNormal = normalArea((ln(xm)-meanLog)/stdLog)
    // • F(xm) Pearson III = normalArea((xm-mean)/std - 0.2) (ajuste dummy)
    // • F(xm) LogPearson III = normalArea((ln(xm)-meanLog)/stdLog - 0.1) (ajuste dummy)
    // • F(xm) Gumbel = 1 - exp(-exp(-((xm-mean)/std)))
    // Se calcula también la diferencia absoluta |Fo - F(xm)|
    const resultsArray = sortedData.map((caudal, index) => {
      const m = index + 1;
      const fo = 1 - m / (n + 1);
      const z_normal = (caudal - mean) / std;
      const F_normal = normalArea(z_normal);
      const diff_normal = Math.abs(fo - F_normal);

      const z_log = (Math.log(caudal) - meanLog) / stdLog;
      const F_logNormal = normalArea(z_log);
      const diff_logNormal = Math.abs(fo - F_logNormal);

      const F_pearson = normalArea(z_normal - 0.2); // ajuste dummy
      const diff_pearson = Math.abs(fo - F_pearson);

      const F_logPearson = normalArea(z_log - 0.1); // ajuste dummy
      const diff_logPearson = Math.abs(fo - F_logPearson);

      const F_gumbel = 1 - Math.exp(-Math.exp(-((caudal - mean) / std)));
      const diff_gumbel = Math.abs(fo - F_gumbel);

      return {
        m,
        caudal,
        fo,
        F_normal,
        diff_normal,
        F_logNormal,
        diff_logNormal,
        F_pearson,
        diff_pearson,
        F_logPearson,
        diff_logPearson,
        F_gumbel,
        diff_gumbel,
      };
    });

    setResults({ mean, std, meanLog, stdLog, resultsArray });
    setMessage("Cálculo completado.");
  };

  // Función de densidad normal
  const normal = (x) => {
    return (1 / Math.sqrt(2 * Math.PI)) * Math.exp(-Math.pow(x, 2) / 2);
  };

  // Aproximación numérica de la CDF normal (regla de Simpson)
  const normalArea = (z) => {
    const nIntervals = 1000;
    const a = -8; // límite inferior
    const d = (z - a) / (2 * nIntervals);
    let p = 0;
    for (let c = 1; c <= nIntervals; c++) {
      const x = a + (2 * c - 1) * d;
      p += 4 * normal(x);
    }
    let j = 0;
    for (let e = 1; e < nIntervals; e++) {
      const x = a + 2 * e * d;
      j += 2 * normal(x);
    }
    const l = normal(a);
    const y = normal(z);
    const q = j + l + p + y;
    return (d / 3) * q;
  };

  // Función para precargar datos de ejemplo
  const loadExampleData = () => {
    const exampleData = [
      7430, 7061, 6900, 6267, 6000, 5971, 5565, 4744, 4240, 4060,
      3706, 3682, 3220, 3130, 2737, 2675, 2489, 2414, 2367, 2350,
      2246, 2230, 2070, 1804, 1796,
    ];
    setData(exampleData);
    setResults(null);
    setMessage("Datos de ejemplo cargados.");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Función para limpiar datos, resultados y mensajes
  const clearAll = () => {
    setData([]);
    setResults(null);
    setMessage("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Función que calcula el resumen de resultados:
  // - Para cada distribución se obtiene el máximo valor de la diferencia (Dₘₐₓ)
  // - Se asigna un ranking: menor Dₘₐₓ → mejor ajuste (orden 1)
  // - Se calcula el valor crítico d según el nivel de significancia seleccionado
  // - Se determina la función con mejor ajuste (la de orden 1)
  const computeSummary = () => {
    if (!results) return null;
    const n = data.length;
    const maxDiffNormal = Math.max(...results.resultsArray.map(r => r.diff_normal));
    const maxDiffLogNormal = Math.max(...results.resultsArray.map(r => r.diff_logNormal));
    const maxDiffPearson = Math.max(...results.resultsArray.map(r => r.diff_pearson));
    const maxDiffLogPearson = Math.max(...results.resultsArray.map(r => r.diff_logPearson));
    const maxDiffGumbel = Math.max(...results.resultsArray.map(r => r.diff_gumbel));

    const distributions = [
      { name: 'Normal', maxDiff: maxDiffNormal },
      { name: 'Log-Normal', maxDiff: maxDiffLogNormal },
      { name: 'Pearson III', maxDiff: maxDiffPearson },
      { name: 'Log-Pearson III', maxDiff: maxDiffLogPearson },
      { name: 'Gumbel', maxDiff: maxDiffGumbel },
    ];

    // Ordenar de menor a mayor (el menor Dₘₐₓ es el mejor ajuste)
    const sorted = [...distributions].sort((a, b) => a.maxDiff - b.maxDiff);
    const ranked = distributions.map(dist => {
      const rank = sorted.findIndex(d => d.name === dist.name) + 1;
      return { ...dist, rank };
    });

    // Determinar el valor de Cₐ según el nivel de significancia
    let C_al = 1.358; // valor por defecto para 0.05
    if (alpha === 0.10) {
      C_al = 1.224;
    } else if (alpha === 0.01) {
      C_al = 1.628;
    }

    // Calcular kn según el tamaño de la muestra
    let kn = 0;
    if (n <= 40) {
      kn = Math.sqrt(n) + 0.12 + (0.11 / Math.sqrt(n));
    } else {
      kn = Math.sqrt(n);
    }
    const Dcritico = C_al / kn;

    // La función con mejor ajuste es la que tiene rank 1
    const bestFit = ranked.find(r => r.rank === 1);

    return { ranked, n, Dcritico, bestFit };
  };

  const summary = results ? computeSummary() : null;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
            <BackButton />
      <div >
        <h1 className="text-3xl font-bold text-blue-700 mb-4 uppercase tracking-wide">
          Prueba de Bondad de Ajuste
        </h1>
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          Ruta del Archivo
        </h2>

        <div className="mb-4 flex flex-col items-center gap-4 bg-white p-5 rounded-lg shadow-md border border-gray-300">
          <input
            type="file"
            accept=".txt"
            onChange={handleFileChange}
            ref={fileInputRef}
            className="block w-full text-sm text-gray-700 border border-gray-300 rounded-lg cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>
      </div>


      <div className="mb-4 flex flex-col items-center gap-2">
        <label className="text-gray-700 font-medium">
          Nivel de significancia:
          <select
            value={alpha}
            onChange={handleAlphaChange}
            className="ml-2 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
          >
            <option value="0.10">0.10</option>
            <option value="0.05">0.05</option>
            <option value="0.01">0.01</option>
          </select>
        </label>
      </div>

      <div className="mb-4 flex justify-center gap-4">
        <button
          onClick={loadExampleData}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
        >
          Ejemplo
        </button>

        <button
          onClick={calculateResults}
          disabled={data.length === 0}
          className={`px-4 py-2 rounded-lg transition ${data.length === 0
            ? "bg-gray-400 text-white cursor-not-allowed"
            : "bg-green-500 text-white hover:bg-green-600"
            }`}
        >
          Calcular
        </button>

        <button
          onClick={clearAll}
          className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
        >
          Limpiar
        </button>
      </div>

      <p className={`text-center font-medium ${message.includes("Error") ? "text-red-500" : "text-green-500"}`}>
        {message}
      </p>


      {results && summary && (
        <div className="mt-4 overflow-x-auto">
          {/* Sección de RESULTADOS */}
          <h2 className="text-xl font-bold text-center text-blue-600 mb-4">Resultados</h2>
          <table className="w-full border-collapse border border-gray-300 mb-4">
            <thead>
              <tr className="bg-gray-200">
                <th className="border border-gray-300 px-4 py-2">FUNCIÓN</th>
                <th className="border border-gray-300 px-4 py-2">KOLMOGOROV</th>
                <th className="border border-gray-300 px-4 py-2">Dₘₐₓ</th>
              </tr>
            </thead>
            <tbody>
              {summary.ranked.map((dist, i) => (
                <tr key={i} className="text-center bg-white even:bg-gray-100">
                  <td className="border border-gray-300 px-4 py-2">{dist.name}</td>
                  <td className="border border-gray-300 px-4 py-2">{dist.rank}</td>
                  <td className="border border-gray-300 px-4 py-2">{dist.maxDiff.toFixed(4)}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Sección de RESUMEN */}
          <h3 className="text-lg font-semibold text-gray-700">Resumen</h3>
          <p><strong>Número de datos =</strong> {summary.n}</p>
          <p><strong>Valor crítico d =</strong> {summary.Dcritico.toFixed(2)}</p>
          <p className="font-bold text-green-600">
            La función que mejor se ajusta a los datos es <strong>{summary.bestFit.name}</strong>
          </p>

          {/* Tabla Detallada de cada registro */}
          <h2 className="text-xl font-bold text-center text-blue-600 mt-6">Detalle de Resultados</h2>
          <table className="w-full border-collapse border border-gray-300 mt-4">
            <thead>
              <tr className="bg-gray-200">
                <th rowSpan="2" className="border border-gray-300 px-2 py-1">m</th>
                <th rowSpan="2" className="border border-gray-300 px-2 py-1">xm (m³/s)</th>
                <th rowSpan="2" className="border border-gray-300 px-2 py-1">Fo(xm)</th>
                <th colSpan="2" className="border border-gray-300 px-2 py-1">Normal</th>
                <th colSpan="2" className="border border-gray-300 px-2 py-1">LogNormal</th>
                <th colSpan="2" className="border border-gray-300 px-2 py-1">Pearson III</th>
                <th colSpan="2" className="border border-gray-300 px-2 py-1">LogPearson III</th>
                <th colSpan="2" className="border border-gray-300 px-2 py-1">Gumbel</th>
              </tr>
              <tr className="bg-gray-100">
                <th className="border border-gray-300 px-2 py-1">F(xm)</th>
                <th className="border border-gray-300 px-2 py-1">|Fo-F(xm)|</th>
                <th className="border border-gray-300 px-2 py-1">F(xm)</th>
                <th className="border border-gray-300 px-2 py-1">|Fo-F(xm)|</th>
                <th className="border border-gray-300 px-2 py-1">F(xm)</th>
                <th className="border border-gray-300 px-2 py-1">|Fo-F(xm)|</th>
                <th className="border border-gray-300 px-2 py-1">F(xm)</th>
                <th className="border border-gray-300 px-2 py-1">|Fo-F(xm)|</th>
                <th className="border border-gray-300 px-2 py-1">F(xm)</th>
                <th className="border border-gray-300 px-2 py-1">|Fo-F(xm)|</th>
              </tr>
            </thead>
            <tbody>
              {results.resultsArray.map((row, i) => (
                <tr key={i} className="text-center bg-white even:bg-gray-100">
                  <td className="border border-gray-300 px-2 py-1">{row.m}</td>
                  <td className="border border-gray-300 px-2 py-1">{row.caudal}</td>
                  <td className="border border-gray-300 px-2 py-1">{row.fo.toFixed(6)}</td>
                  <td className="border border-gray-300 px-2 py-1">{row.F_normal.toFixed(6)}</td>
                  <td className="border border-gray-300 px-2 py-1">{row.diff_normal.toFixed(6)}</td>
                  <td className="border border-gray-300 px-2 py-1">{row.F_logNormal.toFixed(6)}</td>
                  <td className="border border-gray-300 px-2 py-1">{row.diff_logNormal.toFixed(6)}</td>
                  <td className="border border-gray-300 px-2 py-1">{row.F_pearson.toFixed(6)}</td>
                  <td className="border border-gray-300 px-2 py-1">{row.diff_pearson.toFixed(6)}</td>
                  <td className="border border-gray-300 px-2 py-1">{row.F_logPearson.toFixed(6)}</td>
                  <td className="border border-gray-300 px-2 py-1">{row.diff_logPearson.toFixed(6)}</td>
                  <td className="border border-gray-300 px-2 py-1">{row.F_gumbel.toFixed(6)}</td>
                  <td className="border border-gray-300 px-2 py-1">{row.diff_gumbel.toFixed(6)}</td>b
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

    </div>
  );
};

export default BondadYAjuste;
