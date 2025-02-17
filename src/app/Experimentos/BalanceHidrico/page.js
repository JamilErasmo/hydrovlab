'use client';
import React, { useState } from "react";
import BackButton from "@/components/BackButton"; // Ajusta la ruta según la ubicación

function BalanceHidrico() {
  // -- 1. Estados de INPUTS (Precipitación y Evapotranspiración) como strings vacíos:
  //    Así podemos limpiar todo dejándolo en blanco.
  const [prec, setPrec] = useState(Array(12).fill(""));
  const [et, setEt] = useState(Array(12).fill(""));

  // -- 2. Estados de RESULTADOS. Al inicio, vacíos (strings), para que la tabla salga en blanco.
  const [pet, setPet] = useState(Array(12).fill(""));
  const [r, setR] = useState(Array(12).fill(""));
  const [vr, setVr] = useState(Array(12).fill(""));
  const [etr, setEtr] = useState(Array(12).fill(""));
  const [d, setD] = useState(Array(12).fill(""));
  const [ex, setEx] = useState(Array(12).fill(""));

  // -- 3. Handlers para inputs. Se guarda directamente el string que escribe el usuario.
  //    Luego, en el cálculo, convertimos a entero (parseInt).
  const handlePrecChange = (index, value) => {
    const newPrec = [...prec];
    newPrec[index] = value; // guardamos el string tal cual
    setPrec(newPrec);
  };

  const handleEtChange = (index, value) => {
    const newEt = [...et];
    newEt[index] = value;
    setEt(newEt);
  };

  // -- 4. Funciones de cálculo (idénticas, pero usando enteros).
  //    Ojo: al convertir de string a number, ignoramos decimales con parseInt.

  // pet[i] = p[i] - e[i]
  function procPET(p, e) {
    return p.map((valP, i) => valP - e[i]);
  }

  // r[0] = 100
  // r[i] = min(max(r[i-1] + pet[i],0),100)
  function procR(petArray) {
    const rArray = [];
    rArray[0] = 100;
    for (let i = 1; i < 12; i++) {
      const val = rArray[i - 1] + petArray[i];
      if (val > 100) {
        rArray[i] = 100;
      } else if (val < 0) {
        rArray[i] = 0;
      } else {
        rArray[i] = val;
      }
    }
    return rArray;
  }

  // vr[i] = r[i] - r[i-1], vr[0] = 0
  function procVR(rArray) {
    const vrArray = [];
    vrArray[0] = 0;
    for (let i = 1; i < 12; i++) {
      vrArray[i] = rArray[i] - rArray[i - 1];
    }
    return vrArray;
  }

  // ETR[i] = ( (p[i] - e[i]) <= 0 ) ? p[i] + abs(vr[i]) : e[i]
  function procETR(p, e, vrArray) {
    return p.map((valP, i) => {
      if (valP - e[i] <= 0) {
        return valP + Math.abs(vrArray[i]);
      } else {
        return e[i];
      }
    });
  }

  // D[i] = e[i] - etr[i]
  function procD(e, etrArray) {
    return e.map((valE, i) => valE - etrArray[i]);
  }

  // EX[i] = (pet[i] >= 0) ? pet[i] - vr[i] : 0
  function procEx(petArray, vrArray) {
    return petArray.map((valPet, i) => {
      if (valPet >= 0) {
        return valPet - vrArray[i];
      }
      return 0;
    });
  }

  // -- 5. DatosEjemplo: Carga de valores de ejemplo (enteros):
  function DatosEjemplo() {
    // Precipitación (p)
    setPrec(["77", "59", "88", "50", "60", "36", "8", "18", "32", "75", "78", "116"]);
    // Evapotranspiración (et)
    setEt(["26", "30", "40", "45", "60", "78", "91", "92", "71", "47", "29", "22"]);
  }

  // -- 6. CALCULAR: Toma los strings de prec y et, convierte a entero (parseInt),
  //    luego ejecuta las fórmulas y setea los resultados también como strings enteros.
  function Calcular() {
    // Convertir strings a enteros (o 0 si vacío o inválido):
    const pInt = prec.map((str) => parseInt(str, 10) || 0);
    const eInt = et.map((str) => parseInt(str, 10) || 0);

    // Cálculos
    const petRes = procPET(pInt, eInt);
    const rRes = procR(petRes);
    const vrRes = procVR(rRes);
    const etrRes = procETR(pInt, eInt, vrRes);
    const dRes = procD(eInt, etrRes);
    const exRes = procEx(petRes, vrRes);

    // Guardamos resultados como strings (p. ej. "45") para evitar decimales.
    setPet(petRes.map((v) => v.toString()));
    setR(rRes.map((v) => v.toString()));
    setVr(vrRes.map((v) => v.toString()));
    setEtr(etrRes.map((v) => v.toString()));
    setD(dRes.map((v) => v.toString()));
    setEx(exRes.map((v) => v.toString()));
  }

  // -- 7. NUEVO: Limpiar todos los campos (deja inputs y tabla en blanco, no en 0).
  function Nuevo() {
    setPrec(Array(12).fill(""));
    setEt(Array(12).fill(""));
    setPet(Array(12).fill(""));
    setR(Array(12).fill(""));
    setVr(Array(12).fill(""));
    setEtr(Array(12).fill(""));
    setD(Array(12).fill(""));
    setEx(Array(12).fill(""));
  }

  // -- 8. Descargar Excel (mantenemos la misma lógica), sin decimales.
  function descargarExcel() {
    // Forzamos CALCULAR para asegurar resultados actualizados.
    Calcular();

    // Generar tabla HTML con los arrays de strings.
    const generarFila = (titulo, arr) => {
      let tds = "";
      for (let i = 0; i < 12; i++) {
        tds += `<td>${arr[i]}</td>`;
      }
      return `<tr><th>${titulo}</th>${tds}</tr>`;
    };

    const tablaHTML = `
      <table border="1">
        <thead>
          <tr>
            <th></th>
            <th>ENERO</th>
            <th>FEBRERO</th>
            <th>MARZO</th>
            <th>ABRIL</th>
            <th>MAYO</th>
            <th>JUNIO</th>
            <th>JULIO</th>
            <th>AGOSTO</th>
            <th>SEPTIEMBRE</th>
            <th>OCTUBRE</th>
            <th>NOVIEMBRE</th>
            <th>DICIEMBRE</th>
          </tr>
        </thead>
        <tbody>
          ${generarFila("P", prec)}
          ${generarFila("ET", et)}
          ${generarFila("P-ET", pet)}
          ${generarFila("R", r)}
          ${generarFila("VR", vr)}
          ${generarFila("ETR", etr)}
          ${generarFila("D", d)}
          ${generarFila("EX", ex)}
        </tbody>
      </table>
    `;

    const blob = new Blob([tablaHTML], { type: "application/vnd.ms-excel" });
    const url = URL.createObjectURL(blob);

    const enlace = document.createElement("a");
    enlace.href = url;
    enlace.download = "Resultados.xls";
    document.body.appendChild(enlace);
    enlace.click();
    document.body.removeChild(enlace);
    URL.revokeObjectURL(url);
  }

  // -- 9. Render JSX (inputs + botones + tabla):
  return (

    <div className="max-w-4xl mx-auto text-[#5377A9] p-8">
      <BackButton />

      {/* Título */}
      <h1 className="text-center text-3xl font-bold text-gray-800 mb-8">Balance Hídrico</h1>

      {/* Panel de Entrada */}
      <div className="border border-gray-200 p-8 mb-10 bg-white shadow-lg rounded-xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">

          {/* Columna 1: Precipitación */}
          <div>
            <h3 className="text-xl font-semibold text-gray-700 mb-4">🌧 PRECIPITACIÓN</h3>
            {[
              "ENERO", "FEBRERO", "MARZO", "ABRIL", "MAYO", "JUNIO",
              "JULIO", "AGOSTO", "SEPTIEMBRE", "OCTUBRE", "NOVIEMBRE", "DICIEMBRE"
            ].map((mes, i) => (
              <div key={`p_${i}`} className="flex items-center gap-4 mb-3">
                <label className="w-32 font-medium text-gray-600">{mes}:</label>
                <input
                  type="number"
                  step="1"
                  value={prec[i]}
                  onChange={(e) => handlePrecChange(i, e.target.value)}
                  className="w-24 p-2 border border-gray-300 rounded-md text-center focus:ring-2 focus:ring-[#5377A9] focus:border-[#5377A9] transition duration-200 shadow-sm"
                />
              </div>
            ))}
          </div>

          {/* Columna 2: Evapotranspiración */}
          <div>
            <h3 className="text-xl font-semibold text-gray-700 mb-4">🌡 EVAPOTRANSPIRACIÓN</h3>
            {[
              "ENERO", "FEBRERO", "MARZO", "ABRIL", "MAYO", "JUNIO",
              "JULIO", "AGOSTO", "SEPTIEMBRE", "OCTUBRE", "NOVIEMBRE", "DICIEMBRE"
            ].map((mes, i) => (
              <div key={`et_${i}`} className="flex items-center gap-4 mb-3">
                <label className="w-32 font-medium text-gray-600">{mes}:</label>
                <input
                  type="number"
                  step="1"
                  value={et[i]}
                  onChange={(e) => handleEtChange(i, e.target.value)}
                  className="w-24 p-2 border border-gray-300 rounded-md text-center focus:ring-2 focus:ring-[#5377A9] focus:border-[#5377A9] transition duration-200 shadow-sm"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
      {/* Botonera */}
      <div className="flex justify-center gap-4 mb-8">
        <button
          onClick={DatosEjemplo}
          className="px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold rounded-xl shadow-md hover:scale-105 transform transition duration-200"
        >
          EJEMPLO
        </button>
        <button
          onClick={Nuevo}
          className="px-6 py-3 bg-gradient-to-r from-gray-500 to-gray-600 text-white font-semibold rounded-xl shadow-md hover:scale-105 transform transition duration-200"
        >
          NUEVO
        </button>
        <button
          onClick={Calcular}
          className="px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white font-semibold rounded-xl shadow-md hover:scale-105 transform transition duration-200"
        >
          CALCULAR
        </button>
        <button
          onClick={descargarExcel}
          className="px-6 py-3 bg-gradient-to-r from-indigo-500 to-indigo-600 text-white font-semibold rounded-xl shadow-md hover:scale-105 transform transition duration-200"
        >
          DESCARGAR RESULTADOS
        </button>
      </div>

      {/* Resultados */}
      <h2 className="text-center text-2xl font-bold text-gray-800 border-b-4 border-[#5377A9] pb-3 mb-6">
        📊 RESULTADOS
      </h2>

      <div className="overflow-x-auto bg-white shadow-lg rounded-xl p-6">
        <table className="w-full border-collapse border border-gray-300 rounded-lg">
          <thead>
            <tr className="bg-gradient-to-r from-gray-200 to-gray-300 text-gray-900">
              <th className="p-3"></th>
              {[
                "ENERO", "FEBRERO", "MARZO", "ABRIL", "MAYO", "JUNIO",
                "JULIO", "AGOSTO", "SEPTIEMBRE", "OCTUBRE", "NOVIEMBRE", "DICIEMBRE"
              ].map((mes, i) => (
                <th key={i} className="p-3 text-center font-semibold">{mes}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {[
              { label: "🌧 P", data: prec },
              { label: "🌡 ET", data: et },
              { label: "📉 P-ET", data: pet },
              { label: "💧 R", data: r },
              { label: "📊 VR", data: vr },
              { label: "🌱 ETR", data: etr },
              { label: "🔥 D", data: d },
              { label: "⚡ EX", data: ex }
            ].map(({ label, data }, index) => (
              <tr key={index} className="border-b border-gray-300 odd:bg-gray-50 hover:bg-gray-100 transition">
                <th className="p-3 text-left font-semibold text-gray-800">{label}</th>
                {data.map((val, i) => (
                  <td key={i} className="p-3 text-right text-gray-700">
                    {val === "" ? "--" : val}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div >
  );
}

export default BalanceHidrico;
