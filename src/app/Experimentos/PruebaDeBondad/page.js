'use client';
import React, { useState, useRef } from 'react';
import BackButton from "@/components/BackButton"; // Ajusta la ruta según tu proyecto

export default function BondadYAjuste() {
  // Estados y referencia
  const [data, setData] = useState([]);
  const [results, setResults] = useState(null);
  const [message, setMessage] = useState("");
  const [alpha, setAlpha] = useState(0.05);
  const fileInputRef = useRef(null);

  // Carga de archivo
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) {
      setMessage("Seleccione un archivo para realizar los cálculos");
      return;
    }
    if (!file.name.toLowerCase().endsWith(".txt")) {
      setMessage("Error!!...La extensión del archivo debe ser .txt");
      return;
    }
    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target.result;
      const lines = text.split(/\r?\n/).map(l => l.trim()).filter(l => l !== "");
      const numbers = lines.map(line => parseFloat(line)).filter(num => !isNaN(num));
      if (numbers.length < 5) {
        setMessage("Error... Muy pocos datos, ingrese datos mayores o iguales a cinco.");
        return;
      } else if (numbers.length > 500) {
        setMessage("Solo se permite el análisis de registros de hasta 500 datos");
        return;
      }
      setData(numbers);
      setResults(null);
      setMessage("Archivo cargado con éxito");
    };
    reader.readAsText(file);
  };

  // Carga de datos de ejemplo (25 datos)
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

  // Limpiar
  const clearAll = () => {
    setData([]);
    setResults(null);
    setMessage("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Función de densidad normal estándar
  function normalPDF(x) {
    return (1 / Math.sqrt(2 * Math.PI)) * Math.exp(-x * x / 2);
  }

  // Aproximación de la CDF normal con regla de Simpson (de -8 hasta z)
  function normalCDF(z) {
    const nIntervals = 1000;
    const a = -8;
    if (z < a) return 0;
    if (z > 8) return 1;
    const d = (z - a) / (2 * nIntervals);
    let p = 0;
    for (let i = 1; i <= nIntervals; i++) {
      const x = a + (2 * i - 1) * d;
      p += 4 * normalPDF(x);
    }
    let j = 0;
    for (let i = 1; i < nIntervals; i++) {
      const x = a + 2 * i * d;
      j += 2 * normalPDF(x);
    }
    const l = normalPDF(a);
    const y = normalPDF(z);
    const q = p + j + l + y;
    return (d / 3) * q;
  }

  // Función pochisq: CDF de la chi-cuadrado
  function pochisq(x, df) {
    if (x <= 0 || df < 1) return 1.0;
    const a = 0.5 * x;
    const even = df % 2 === 0;
    let y = 0;
    if (df > 1) {
      y = Math.exp(-a);
    }
    let s = 0;
    if (even) {
      s = y;
    } else {
      s = 2 * poz(-Math.sqrt(x));
    }
    let c = 0;
    let e = 0;
    let z = 0;
    let m = 0;
    if (df > 2) {
      let df2 = 0.5 * df - 1;
      z = even ? 1 : 0.5;
      if (a > 20) {
        e = even ? 0 : 0.5723649429247;
        c = Math.log(a);
        for (m = z; m <= df2; m++) {
          e = e + Math.log(m);
          s += Math.exp(m * c - a - e);
        }
        return s;
      } else {
        e = even ? 1 : 0.5641895835477563 / Math.sqrt(a);
        c = 0;
        for (m = z; m <= df2; m++) {
          e = e * (a / m);
          c += e;
        }
        s = c * y + s;
      }
    }
    return s;
  }

  // Función poz: probabilidad acumulada de la Normal estándar
  function poz(z) {
    const Z_MAX = 6;
    if (z === 0) return 0.5;
    const y = 0.5 * Math.abs(z);
    let x = 0;
    if (y >= Z_MAX * 0.5) {
      x = 1;
    } else if (y < 1) {
      const w = y * y;
      x =
        ((((((((0.000124818987 * w - 0.001075204047) * w + 0.005198775019) * w -
          0.019198292004) *
          w +
          0.059054035642) *
          w -
          0.151968751364) *
          w +
          0.319152932694) *
          w -
          0.5319230073) *
          w +
          0.797884560593) *
        y *
        2;
    } else {
      let w = y - 2;
      x =
        (((((((((((((-0.000045255659 * w + 0.00015252929) * w -
          0.000019538132) *
          w -
          0.000676904986) *
          w +
          0.001390604284) *
          w -
          0.00079462082) *
          w -
          0.002034254874) *
          w +
          0.006549791214) *
          w -
          0.010557625006) *
          w +
          0.011630447319) *
          w -
          0.009279453341) *
          w +
          0.005353579108) *
          w -
          0.002141268741) *
          w +
          0.000535310849) *
        w +
        0.999936657524;
    }
    return z > 0 ? (x + 1) * 0.5 : (1 - x) * 0.5;
  }

  // Newton-Raphson para Log-Pearson III: resuelve la ecuación en calZ
  function calZ(kt, k) {
    let x1 = 1;
    for (let j = 0; j < 100; j++) {
      const fx =
        x1 +
        (x1 * x1 - 1) * k +
        (1 / 3) * (x1 ** 3 - 6 * x1) * k ** 2 -
        (x1 * x1 - 1) * k ** 3 +
        x1 * k ** 4 +
        (1 / 3) * k ** 5 -
        kt;
      const fpx =
        1 +
        2 * x1 * k +
        k ** 2 * x1 ** 2 -
        2 * k ** 2 -
        2 * x1 * k ** 3 +
        k ** 4;
      const x2 = x1 - fx / fpx;
      if (Math.abs(x2 - x1) < 1e-7) {
        return x2;
      }
      x1 = x2;
    }
    return x1;
  }

  // --- Funciones de distribución ---
  // Normal
  function F_Normal(x, mean, std) {
    const z = (x - mean) / std;
    return normalCDF(z);
  }

  // Log-Normal (usa ln)
  function F_LogNormal(x, meanLn, stdLn) {
    const z = (Math.log(x) - meanLn) / stdLn;
    return normalCDF(z);
  }

  // Pearson III (tal como en el VB original)
  function F_PearsonIII(x, array, mean, std) {
    const n = array.length;
    let sumLam = 0;
    for (let i = 0; i < n; i++) {
      const lam = Math.abs(((array[i] - mean) ** 3) / (n + 1)) / (std ** 3);
      sumLam += lam;
    }
    const b1 = (2 / sumLam) ** 2;
    const alphaP = std / Math.sqrt(b1);
    const delta = mean - alphaP * b1;
    const y = (x - delta) / alphaP;
    const x2 = 2 * y;
    const v = 2 * b1;
    const pro = pochisq(x2, v);
    return 1 - pro;
  }

  // Log-Pearson III (tal como en el VB original)
  function F_LogPearsonIII(x, meanLog10, stdLog10, cs) {
    const y = Math.log10(x);
    const kt = (y - meanLog10) / stdLog10;
    const k = cs / 6;
    const z = calZ(kt, k);
    return normalCDF(z);
  }

  // Gumbel
  function F_Gumbel(x, array, mean, std) {
    const n = array.length;
    const yi = [];
    for (let j = 1; j <= n; j++) {
      const ratio = (n + 1) / j;
      const val = -Math.log(Math.log(ratio));
      yi.push(val);
    }
    const meanY = yi.reduce((acc, v) => acc + v, 0) / n;
    const stdY = Math.sqrt(yi.reduce((acc, v) => acc + (v - meanY) ** 2, 0) / n);
    const sn = stdY, yn = meanY;
    const alfa = sn / std;
    const u = mean - (yn / alfa);
    return Math.exp(-Math.exp(-alfa * (x - u)));
  }

  // Cálculos estadísticos: medias y desviaciones
  function computeStats(array) {
    const n = array.length;
    const mean = array.reduce((acc, val) => acc + val, 0) / n;
    const std = Math.sqrt(array.reduce((acc, val) => acc + (val - mean) ** 2, 0) / (n - 1));
    const lnArray = array.map(val => Math.log(val));
    const meanLn = lnArray.reduce((acc, val) => acc + val, 0) / n;
    const stdLn = Math.sqrt(lnArray.reduce((acc, val) => acc + (val - meanLn) ** 2, 0) / (n - 1));
    const log10Array = array.map(val => Math.log10(val));
    const meanLog10 = log10Array.reduce((acc, val) => acc + val, 0) / n;
    const stdLog10 = Math.sqrt(log10Array.reduce((acc, val) => acc + (val - meanLog10) ** 2, 0) / (n - 1));
    let sumAsim = 0;
    for (let i = 0; i < n; i++) {
      const z = (log10Array[i] - meanLog10) / stdLog10;
      sumAsim += z ** 3;
    }
    const cs = (n / ((n - 1) * (n - 2))) * sumAsim;
    return { mean, std, meanLn, stdLn, meanLog10, stdLog10, cs };
  }

  // Función principal de cálculo
  const calculateResults = () => {
    if (data.length === 0) return;
    // Ordenar de mayor a menor
    const sortedData = [...data].sort((a, b) => b - a);
    const n = sortedData.length;
    const { mean, std, meanLn, stdLn, meanLog10, stdLog10, cs } = computeStats(sortedData);

    const resultsArray = sortedData.map((val, i) => {
      const m = i + 1;
      // Fo(xm) = 1 - m/(n+1)
      const Fo = 1 - m / (n + 1);

      const Fn = F_Normal(val, mean, std);
      const diffN = Math.abs(Fo - Fn);

      const Fln = F_LogNormal(val, meanLn, stdLn);
      const diffLN = Math.abs(Fo - Fln);

      const Fp3 = F_PearsonIII(val, sortedData, mean, std);
      const diffP3 = Math.abs(Fo - Fp3);

      const Flp3 = F_LogPearsonIII(val, meanLog10, stdLog10, cs);
      const diffLP3 = Math.abs(Fo - Flp3);

      const Fg = F_Gumbel(val, sortedData, mean, std);
      const diffG = Math.abs(Fo - Fg);

      return {
        m,
        caudal: val,
        Fo,
        F_normal: Fn,
        diff_normal: diffN,
        F_logNormal: Fln,
        diff_logNormal: diffLN,
        F_pearson: Fp3,
        diff_pearson: diffP3,
        F_logPearson: Flp3,
        diff_logPearson: diffLP3,
        F_gumbel: Fg,
        diff_gumbel: diffG,
      };
    });

    setResults({ resultsArray });
    setMessage("Cálculo completado.");
  };

  // Cálculo del valor crítico d
  function computeDcritico() {
    const n = data.length;
    let C_al = 1.358; // default para 0.05
    if (alpha === 0.1) C_al = 1.224;
    else if (alpha === 0.01) C_al = 1.628;
    let kn = n <= 40 ? Math.sqrt(n) + 0.12 + 0.11 / Math.sqrt(n) : Math.sqrt(n);
    return C_al / kn;
  }

  // Resumen y Ranking (se asigna rank 5 a la mayor Dₘₐₓ y rank 1 a la menor)
  function getSummary() {
    if (!results) return null;
    const arr = results.resultsArray;
    const maxDiffNormal = Math.max(...arr.map(r => r.diff_normal));
    const maxDiffLogNormal = Math.max(...arr.map(r => r.diff_logNormal));
    const maxDiffPearson = Math.max(...arr.map(r => r.diff_pearson));
    const maxDiffLogPearson = Math.max(...arr.map(r => r.diff_logPearson));
    const maxDiffGumbel = Math.max(...arr.map(r => r.diff_gumbel));

    const distributions = [
      { name: "Normal", maxDiff: maxDiffNormal },
      { name: "Log-Normal", maxDiff: maxDiffLogNormal },
      { name: "Pearson III", maxDiff: maxDiffPearson },
      { name: "Log-Pearson III", maxDiff: maxDiffLogPearson },
      { name: "Gumbel", maxDiff: maxDiffGumbel },
    ];

    const sorted = [...distributions].sort((a, b) => b.maxDiff - a.maxDiff);
    const ranked = distributions.map(dist => {
      const idx = sorted.findIndex(d => d.name === dist.name);
      return { ...dist, rank: 5 - idx };
    });
    return ranked;
  }

  const summary = results ? getSummary() : null;
  const dCritico = results ? computeDcritico() : null;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
      <BackButton />

      <h1 className="text-3xl font-bold text-blue-700 mb-4 uppercase tracking-wide">
        Prueba de Bondad de Ajuste
      </h1>

      {/* Carga de Archivo */}
      <div className="mb-4 flex flex-col items-center gap-4 bg-white p-5 rounded-lg shadow-md border border-gray-300">
        <input
          type="file"
          accept=".txt"
          onChange={handleFileChange}
          ref={fileInputRef}
          className="block w-full text-sm text-gray-700 border border-gray-300 rounded-lg cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
      </div>

      {/* Nivel de Significancia */}
      <div className="mb-4 flex flex-col items-center gap-2">
        <label className="text-gray-700 font-medium">
          Nivel de significancia:
          <select
            value={alpha}
            onChange={(e) => setAlpha(parseFloat(e.target.value))}
            className="ml-2 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
          >
            <option value="0.10">0.10</option>
            <option value="0.05">0.05</option>
            <option value="0.01">0.01</option>
          </select>
        </label>
      </div>

      {/* Botones */}
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
          className={`px-4 py-2 rounded-lg transition ${data.length === 0 ? "bg-gray-400 text-white cursor-not-allowed" : "bg-green-500 text-white hover:bg-green-600"}`}
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

      {/* Mensaje */}
      <p className={`text-center font-medium ${message.includes("Error") ? "text-red-500" : "text-green-500"}`}>
        {message}
      </p>

      {/* Resultados */}
      {results && summary && (
        <div className="mt-4 mx-auto max-w-3xl">
          <h1 className="text-2xl font-bold text-center text-blue-600 mb-2">
            RESULTADOS DE LA SIMULACIÓN
          </h1>
          <h2 className="text-xl font-bold text-center text-blue-600 mb-2">
            PRUEBA DE BONDAD DE AJUSTE
          </h2>
          <h3 className="text-lg font-bold text-center text-blue-600 mb-4">
            KOLMOGOROV-SMIRNOV
          </h3>
          <div className="text-center mb-4">
            <p>
              <strong>Número de datos =</strong> {data.length}
            </p>
            <p>
              <strong>Valor crítico d =</strong> {dCritico ? dCritico.toFixed(4) : ""}
            </p>
          </div>

          {/* Tabla Resumen */}
          <table className="min-w-[400px] table-auto border-collapse border border-gray-300 mb-4 mx-auto">
            <thead>
              <tr className="bg-gray-200">
                <th className="border border-gray-300 px-4 py-2">FUNCIÓN</th>
                <th className="border border-gray-300 px-4 py-2">KOLMOGOROV</th>
                <th className="border border-gray-300 px-4 py-2">D_Máx</th>
              </tr>
            </thead>
            <tbody>
              {summary.map((dist, i) => (
                <tr key={i} className="text-center bg-white even:bg-gray-100">
                  <td className="border border-gray-300 px-4 py-2">{dist.name}</td>
                  <td className="border border-gray-300 px-4 py-2">{dist.rank}</td>
                  <td className="border border-gray-300 px-4 py-2">{dist.maxDiff.toFixed(4)}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Tabla Detallada */}
          <table className="min-w-[600px] table-auto border-collapse border border-gray-300 mx-auto">
            <thead>
              <tr className="bg-gray-200">
                <th rowSpan="2" className="border border-gray-300 px-2 py-1">m</th>
                <th rowSpan="2" className="border border-gray-300 px-2 py-1">xm (m³/s)</th>
                <th rowSpan="2" className="border border-gray-300 px-2 py-1">Fo(xm)</th>
                <th colSpan="2" className="border border-gray-300 px-2 py-1">Normal</th>
                <th colSpan="2" className="border border-gray-300 px-2 py-1">LogNormal</th>
                <th colSpan="2" className="border border-gray-300 px-2 py-1">Pearson III</th>
                <th colSpan="2" className="border border-gray-300 px-2 py-1">Log-Pearson III</th>
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
                  <td className="border border-gray-300 px-2 py-1">{row.Fo.toFixed(6)}</td>
                  <td className="border border-gray-300 px-2 py-1">{row.F_normal.toFixed(6)}</td>
                  <td className="border border-gray-300 px-2 py-1">{row.diff_normal.toFixed(6)}</td>
                  <td className="border border-gray-300 px-2 py-1">{row.F_logNormal.toFixed(6)}</td>
                  <td className="border border-gray-300 px-2 py-1">{row.diff_logNormal.toFixed(6)}</td>
                  <td className="border border-gray-300 px-2 py-1">{row.F_pearson.toFixed(6)}</td>
                  <td className="border border-gray-300 px-2 py-1">{row.diff_pearson.toFixed(6)}</td>
                  <td className="border border-gray-300 px-2 py-1">{row.F_logPearson.toFixed(6)}</td>
                  <td className="border border-gray-300 px-2 py-1">{row.diff_logPearson.toFixed(6)}</td>
                  <td className="border border-gray-300 px-2 py-1">{row.F_gumbel.toFixed(6)}</td>
                  <td className="border border-gray-300 px-2 py-1">{row.diff_gumbel.toFixed(6)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
