
'use client';
import React, { useState } from 'react';
import BackButton from "@/components/BackButton"; // Ajusta la ruta según la ubicación

export function penmanEjemplo() {
  return {
    t: 20,     // TEMPERATURA (°C)
    h: 0.7,    // HUMEDAD RELATIVA
    nd: 0.4,   // RELACION INSOLACION (n/D)
    u2: 5,     // VELOCIDAD DEL VIENTO (m/s)
    ra: 550,   // CANTIDAD DE ENERGIA (cal/cm2/día)
    r: 0.06    // ALBEDO DE LA SUPERFICIE
  };
}


export function penmanCalcular(t, h, nd, r, Ra, u2) {
  // Variables intermedias
  let e, ea, Ta, D, e1, e2, Rc, RI, RB, o, H2, Ea2, Eo, Y;

  // 1) e (mmHg), según tablas de interpolación (positivo o negativo)
  if (t >= 0) {
    e = procInterpolarP(t);
  } else {
    e = procInterpolarN(t);
  }

  // 2) ea = h * e
  ea = h * e;

  // 3) Ta = t + 273
  Ta = t + 273;

  // 4) D (derivada). Se usa e1 y e2 (t ± 0.05)
  if (t >= 0) {
    e1 = procInterpolarP(t + 0.05);
    e2 = procInterpolarP(t - 0.05);
  } else {
    e1 = procInterpolarN(t + 0.05);
    e2 = procInterpolarN(t - 0.05);
  }
  // D = (e1 - e2) / 0.1
  D = (e1 - e2) / 0.1;
  D = round2(D);

  // 5) Rc = Ra * (0.20 + 0.48 * nd)
  Rc = Ra * (0.20 + 0.48 * nd);
  Rc = round2(Rc);

  // 6) RI = Rc * (1 - r)
  RI = Rc * (1 - r);
  RI = round2(RI);

  // 7) RB = o * Ta^4 * (0.47 - 0.077 * sqrt(ea)) * (0.20 + 0.8 * nd)
  // donde o = 117.4 * 10^-9
  o = 117.4e-9; // 117.4 * 10^-9
  RB = o * Math.pow(Ta, 4) * (0.47 - 0.077 * Math.sqrt(ea)) * (0.20 + 0.8 * nd);
  RB = round2(RB);

  // 8) H2 = RI - RB
  H2 = RI - RB;
  H2 = round2(H2);

  // 9) Ea2 = 21 * (e - ea) * (0.5 + 0.54 * u2)
  Ea2 = 21 * (e - ea) * (0.5 + 0.54 * u2);
  Ea2 = round2(Ea2);

  // 10) E'o = ( D*H2 + Y*Ea2 ) / ( D + Y ), con Y=0.49
  Y = 0.49;
  Eo = (D * H2 + Y * Ea2) / (D + Y);
  Eo = round2(Eo);

  // 11) E'o en mm/día = Eo / 60
  let Eo2 = Eo / 60.0;
  Eo2 = round2(Eo2);

  return {
    e,      // e (mmHg)
    ea,     // Ea (mmHg)
    Ta,     // Ta (°K)
    D,      // ∆ (mm de Hg/°C)
    Rc,     // Rc ((cal/cm^2)/día)
    RI,     // RI ((cal/cm^2)/día)
    RB,     // RB ((cal/cm^2)/día)
    H2,     // H ((cal/cm^2)/día)
    Ea2,    // Ea ((cal/cm^2)/día)
    EoCal: Eo,  // E'o ((cal/cm^2)/día)
    EoMm: Eo2  // E'o (mm/día)
  };
}

/***********************************************************************
 * Funciones auxiliares
 ***********************************************************************/

/** Redondeo a 2 decimales (similar a Math.Round(value, 2) en VB) */
function round2(val) {
  return parseFloat(val.toFixed(2));
}

/**
 * Interpolación para temperaturas NEGATIVAS
 * Basado en la tabla y el procedimiento del .vb
 */
function procInterpolarN(t) {
  // La misma tabla lgrn() del VB
  const lgrn = [
    0, 0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1,
    0.0, 4.58, 4.55, 4.52, 4.49, 4.46, 4.43, 4.4, 4.36, 4.33, 4.29, 4.26,
    -1.0, 4.26, 4.23, 4.2, 4.17, 4.14, 4.11, 4.08, 4.05, 4.03, 4.0, 3.97,
    -2.0, 3.97, 3.94, 3.91, 3.88, 3.85, 3.82, 3.79, 3.76, 3.73, 3.7, 3.67,
    -3.0, 3.67, 3.64, 3.62, 3.59, 3.57, 3.54, 3.52, 3.49, 3.46, 3.44, 3.41,
    -4.0, 3.41, 3.39, 3.37, 3.34, 3.32, 3.29, 3.27, 3.24, 3.22, 3.18, 3.16,
    -5.0, 3.16, 3.14, 3.11, 3.09, 3.06, 3.04, 3.01, 2.99, 2.97, 2.95, 2.93,
    -6.0, 2.93, 2.91, 2.89, 2.86, 2.84, 2.82, 2.8, 2.77, 2.75, 2.73, 2.71,
    -7.0, 2.71, 2.69, 2.67, 2.65, 2.63, 2.61, 2.59, 2.57, 2.55, 2.53, 2.51,
    -8.0, 2.51, 2.49, 2.47, 2.45, 2.43, 2.41, 2.4, 2.38, 2.36, 2.34, 2.32,
    -9.0, 2.32, 2.3, 2.29, 2.27, 2.26, 2.24, 2.22, 2.21, 2.19, 2.17, 2.15,
    -10.0, 2.15, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0
  ];

  // Creamos una matriz 12x12
  let tbl = [];
  let index = 0;
  for (let i = 0; i < 12; i++) {
    tbl[i] = [];
    for (let j = 0; j < 12; j++) {
      tbl[i][j] = lgrn[index];
      index++;
    }
  }

  // Parte entera y decimal
  let entero = parseInt(t);
  let decimal = t - entero;
  decimal = parseFloat(decimal.toFixed(3));

  // Búsqueda en la tabla
  for (let fila = 1; fila < 12; fila++) {
    if (tbl[fila][0] === entero) {
      for (let col = 1; col < 12; col++) {
        // Coincidencia exacta
        if (tbl[0][col] === decimal) {
          return tbl[fila][col];
        }
        // Interpolación
        else if (tbl[0][col] > decimal) {
          let tma = tbl[fila][col];
          let tme = tbl[fila][col - 1];
          let dt1 = tme - tma; // (tme - tma)
          let dd1 = tbl[0][col] - tbl[0][col - 1];
          let dd2 = tbl[0][col] - decimal;
          let rst = (dd2 * dt1 / dd1) + tma;
          return round2(rst);
        }
      }
    }
  }
  return 0; // si no encuentra nada
}

/**
 * Interpolación para temperaturas POSITIVAS
 * Basado en la tabla y el procedimiento del .vb
 */
function procInterpolarP(t) {
  // Tabla lgrn() como en VB
  const lgrn = [
    0, 0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1,
    0, 4.58, 4.62, 4.65, 4.69, 4.71, 4.75, 4.78, 4.82, 4.86, 4.89, 4.92,
    1, 4.92, 4.96, 5, 5.03, 5.07, 5.11, 5.14, 5.18, 5.21, 5.25, 5.29,
    2, 5.29, 5.33, 5.37, 5.4, 5.44, 5.48, 5.53, 5.57, 5.6, 5.64, 5.68,
    3, 5.68, 5.72, 5.76, 5.8, 5.84, 5.89, 5.93, 5.97, 6.01, 6.06, 6.1,
    4, 6.1, 6.14, 6.18, 6.23, 6.27, 6.31, 6.36, 6.4, 6.45, 6.49, 6.54,
    5, 6.54, 6.58, 6.63, 6.68, 6.72, 6.77, 6.82, 6.86, 6.91, 6.96, 7.01,
    6, 7.01, 7.06, 7.11, 7.16, 7.2, 7.25, 7.31, 7.36, 7.41, 7.46, 7.51,
    7, 7.51, 7.56, 7.61, 7.67, 7.72, 7.77, 7.82, 7.88, 7.93, 7.98, 8.04,
    8, 8.04, 8.1, 8.15, 8.21, 8.26, 8.32, 8.37, 8.43, 8.48, 8.54, 8.61,
    9, 8.61, 8.67, 8.73, 8.78, 8.84, 8.9, 8.96, 9.02, 9.08, 9.14, 9.2,
    10, 9.2, 9.26, 9.33, 9.39, 9.46, 9.52, 9.58, 9.65, 9.71, 9.77, 9.84,
    11, 9.84, 9.9, 9.97, 10.03, 10.1, 10.17, 10.24, 10.31, 10.38, 10.45, 10.52,
    12, 10.52, 10.58, 10.66, 10.72, 10.79, 10.86, 10.93, 11, 11.08, 11.15, 11.23,
    13, 11.23, 11.3, 11.38, 11.45, 11.53, 11.6, 11.68, 11.76, 11.83, 11.91, 11.98,
    14, 11.98, 12.06, 12.14, 12.22, 12.3, 12.38, 12.46, 12.54, 12.62, 12.7, 12.78,
    15, 12.78, 12.86, 12.95, 13.03, 13.11, 13.2, 13.28, 13.37, 13.45, 13.54, 13.63,
    16, 13.63, 13.71, 13.8, 13.9, 13.99, 14.08, 14.17, 14.26, 14.35, 14.44, 14.53,
    17, 14.53, 14.62, 14.71, 14.8, 14.9, 14.99, 15.09, 15.17, 15.27, 15.38, 15.46,
    18, 15.46, 15.56, 15.66, 15.76, 15.86, 15.96, 16.06, 16.16, 16.26, 16.36, 16.46,
    19, 16.46, 16.57, 16.68, 16.79, 16.9, 17, 17.1, 17.21, 17.32, 17.43, 17.53,
    20, 17.53, 17.64, 17.75, 17.86, 17.97, 18.08, 18.2, 18.31, 18.43, 18.54, 18.65,
    21, 18.65, 18.77, 18.88, 19, 19.11, 19.23, 19.35, 19.46, 19.58, 19.7, 19.82,
    22, 19.82, 19.94, 20.06, 20.19, 20.31, 20.43, 20.58, 20.69, 20.8, 20.93, 21.05,
    23, 21.05, 21.19, 21.32, 21.45, 21.58, 21.71, 21.84, 21.97, 22.1, 22.23, 22.37,
    24, 22.37, 22.5, 22.63, 22.76, 22.91, 23.05, 23.19, 23.31, 23.45, 23.6, 23.75,
    25, 23.75, 23.9, 24.03, 24.2, 24.35, 24.49, 24.64, 24.79, 24.94, 25.08, 25.31,
    26, 25.31, 25.45, 25.6, 25.74, 25.89, 26.03, 26.18, 26.32, 26.46, 26.6, 26.74,
    27, 26.74, 26.9, 27.05, 27.21, 27.37, 27.53, 27.69, 27.85, 28, 28.16, 28.32,
    28, 28.32, 28.49, 28.66, 28.83, 29, 29.17, 29.34, 29.51, 29.68, 29.85, 30.03,
    29, 30.03, 30.2, 30.38, 30.56, 30.74, 30.92, 31.1, 31.28, 31.46, 31.64, 31.82,
    30, 31.82, 32, 32.19, 32.38, 32.57, 32.76, 32.95, 33.14, 33.33, 33.52, 0
  ];

  // Llenamos la matriz (32 filas x 12 columnas).
  let tbl = [];
  let index = 0;
  for (let i = 0; i < 32; i++) {
    tbl[i] = [];
    for (let j = 0; j < 12; j++) {
      tbl[i][j] = lgrn[index];
      index++;
    }
  }

  // Parte entera y decimal
  let entero = parseInt(t);
  let decimal = t - entero;
  decimal = parseFloat(decimal.toFixed(3));

  // Búsqueda en la tabla
  for (let fila = 1; fila < 32; fila++) {
    if (tbl[fila][0] === entero) {
      for (let col = 1; col < 12; col++) {
        // Coincidencia exacta
        if (tbl[0][col] === decimal) {
          return tbl[fila][col];
        }
        // Interpolación
        else if (tbl[0][col] > decimal) {
          let tma = tbl[fila][col];
          let tme = tbl[fila][col - 1];
          let dt1 = (tme - tma);
          let dd1 = tbl[0][col] - tbl[0][col - 1];
          let dd2 = tbl[0][col] - decimal;
          let rst = (dd2 * dt1 / dd1) + tma;
          return round2(rst);
        }
      }
    }
  }
  return 0;
}

export default function MPenman() {
  const [t, setT] = useState("");
  const [h, setH] = useState("");
  const [nd, setND] = useState("");
  const [r, setR] = useState("");
  const [Ra, setRa] = useState("");
  const [u2, setU2] = useState("");

  // Para resultados:
  const [resultados, setResultados] = useState(null);

  // Botón EJEMPLO
  const handleEjemplo = () => {
    const { t, h, nd, u2, ra, r } = penmanEjemplo();
    setT(t);
    setH(h);
    setND(nd);
    setU2(u2);
    setRa(ra);
    setR(r);
    setResultados(null); // Limpia resultados
  };

  // Botón CALCULAR
  const handleCalcular = () => {
    const res = penmanCalcular(
      parseFloat(t),
      parseFloat(h),
      parseFloat(nd),
      parseFloat(r),
      parseFloat(Ra),
      parseFloat(u2)
    );
    setResultados(res);
  };

  // Botón NUEVO
  const handleNuevo = () => {
    setT(""); setH(""); setND("");
    setR(""); setRa(""); setU2("");
    setResultados(null);
  };

  return (
    <div className="py-14" >
            <BackButton />
      <div className="bg-white p-6 rounded-lg shadow-md border border-gray-300 max-w-2xl mx-auto mt-6">
        {/* Título Principal */}
        <h2 className="text-2xl font-bold text-gray-800 text-center mb-6">
          Método Penman
        </h2>

        {/* Sección de Datos de Entrada */}
        <div className="space-y-4">
          <div className="flex flex-col">
            <label className="text-gray-700 font-medium">
              Temperatura (°C):
            </label>
            <input
              type="number"
              step="any"
              value={t}
              onChange={(e) => setT(e.target.value)}
              placeholder="Ingresa la temperatura"
              className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
            />
          </div>

          <div className="flex flex-col">
            <label className="text-gray-700 font-medium">
              Humedad Relativa (h):
            </label>
            <input
              type="number"
              step="any"
              value={h}
              onChange={(e) => setH(e.target.value)}
              placeholder="Ingresa la humedad"
              className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
            />
          </div>

          <div className="flex flex-col">
            <label className="text-gray-700 font-medium">
              n/D:
            </label>
            <input
              type="number"
              step="any"
              value={nd}
              onChange={(e) => setND(e.target.value)}
              placeholder="Ingresa n/D"
              className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
            />
          </div>

          <div className="flex flex-col">
            <label className="text-gray-700 font-medium">
              Vel. viento (m/s):
            </label>
            <input
              type="number"
              step="any"
              value={u2}
              onChange={(e) => setU2(e.target.value)}
              placeholder="Ingresa la velocidad del viento"
              className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
            />
          </div>

          <div className="flex flex-col">
            <label className="text-gray-700 font-medium">
              Energía Ra (cal/cm²/día):
            </label>
            <input
              type="number"
              step="any"
              value={Ra}
              onChange={(e) => setRa(e.target.value)}
              placeholder="Ingresa la energía Ra"
              className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
            />
          </div>

          <div className="flex flex-col">
            <label className="text-gray-700 font-medium">
              Albedo superficie (r):
            </label>
            <input
              type="number"
              step="any"
              value={r}
              onChange={(e) => setR(e.target.value)}
              placeholder="Ingresa el albedo"
              className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
            />
          </div>
        </div>

        {/* Botones de Acción */}
        <div className="flex justify-center gap-4 mt-6">
          <button
            onClick={handleEjemplo}
            className="px-6 py-2 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-600 transition"
          >
            EJEMPLO
          </button>
          <button
            onClick={handleCalcular}
            className="px-6 py-2 bg-green-500 text-white font-semibold rounded-lg shadow-md hover:bg-green-600 transition"
          >
            CALCULAR
          </button>
          <button
            onClick={handleNuevo}
            className="px-6 py-2 bg-red-500 text-white font-semibold rounded-lg shadow-md hover:bg-red-600 transition"
          >
            NUEVO
          </button>
        </div>

        {/* Sección de Resultados */}
        {resultados && (
          <div className="mt-6 bg-gray-50 p-6 rounded-lg shadow-md border border-gray-300">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Resultados:</h3>
            <p className="text-lg font-medium text-gray-700">
              e (mmHg): <span className="font-bold text-blue-700">{resultados.e}</span>
            </p>
            <p className="text-lg font-medium text-gray-700">
              ea (mmHg): <span className="font-bold text-blue-700">{resultados.ea}</span>
            </p>
            <p className="text-lg font-medium text-gray-700">
              Ta (K): <span className="font-bold text-blue-700">{resultados.Ta}</span>
            </p>
            <p className="text-lg font-medium text-gray-700">
              ∆ (mm de Hg/°C): <span className="font-bold text-blue-700">{resultados.D}</span>
            </p>
            <p className="text-lg font-medium text-gray-700">
              Rc (cal/cm²/día): <span className="font-bold text-blue-700">{resultados.Rc}</span>
            </p>
            <p className="text-lg font-medium text-gray-700">
              RI (cal/cm²/día): <span className="font-bold text-blue-700">{resultados.RI}</span>
            </p>
            <p className="text-lg font-medium text-gray-700">
              RB (cal/cm²/día): <span className="font-bold text-blue-700">{resultados.RB}</span>
            </p>
            <p className="text-lg font-medium text-gray-700">
              H (cal/cm²/día): <span className="font-bold text-blue-700">{resultados.H2}</span>
            </p>
            <p className="text-lg font-medium text-gray-700">
              Ea (cal/cm²/día): <span className="font-bold text-blue-700">{resultados.Ea2}</span>
            </p>
            <p className="text-lg font-medium text-gray-700">
              {"E'o (cal/cm²/día):"} <span className="font-bold text-blue-700">{resultados.EoCal}</span>
            </p>
            <p className="text-lg font-medium text-gray-700">
              {"E'o (mm/día):"} <span className="font-bold text-blue-700">{resultados.EoMm}</span>
            </p>
          </div>
        )}
      </div>
    </div>

  );
}
