'use client';
import React, { useState } from "react";

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
    setPrec(["77","59","88","50","60","36","8","18","32","75","78","116"]);
    // Evapotranspiración (et)
    setEt(["26","30","40","45","60","78","91","92","71","47","29","22"]);
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
    <div style={{ maxWidth: "800px", margin: "0 auto", color: "#5377A9" }}>

      <h1 style={{ textAlign: "center" }}>Balance Hídrico</h1>

      {/* Panel de Entrada */}
      <div style={{ border: "1px solid #aaa", padding: 10, marginBottom: 20 }}>
        <div style={{ display: "flex", gap: 40, flexWrap: "wrap" }}>
          {/* Columna 1: Precipitación */}
          <div>
            <h3>PRECIPITACIÓN</h3>
            {[
              "ENERO",
              "FEBRERO",
              "MARZO",
              "ABRIL",
              "MAYO",
              "JUNIO",
              "JULIO",
              "AGOSTO",
              "SEPTIEMBRE",
              "OCTUBRE",
              "NOVIEMBRE",
              "DICIEMBRE"
            ].map((mes, i) => (
              <div key={`p_${i}`}>
                <label style={{ width: 80, display: "inline-block" }}>
                  {mes}:
                </label>
                <input
                  type="number"
                  step="1"    // Solo enteros
                  value={prec[i]}
                  onChange={(e) => handlePrecChange(i, e.target.value)}
                  style={{ width: "80px" }}
                />
              </div>
            ))}
          </div>
          {/* Columna 2: Evapotranspiración */}
          <div>
            <h3>EVAPOTRANSPIRACIÓN</h3>
            {[
              "ENERO",
              "FEBRERO",
              "MARZO",
              "ABRIL",
              "MAYO",
              "JUNIO",
              "JULIO",
              "AGOSTO",
              "SEPTIEMBRE",
              "OCTUBRE",
              "NOVIEMBRE",
              "DICIEMBRE"
            ].map((mes, i) => (
              <div key={`et_${i}`}>
                <label style={{ width: 80, display: "inline-block" }}>
                  {mes}:
                </label>
                <input
                  type="number"
                  step="1"
                  value={et[i]}
                  onChange={(e) => handleEtChange(i, e.target.value)}
                  style={{ width: "80px" }}
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Botonera */}
      <div style={{ textAlign: "center", marginBottom: 10 }}>
        <button onClick={DatosEjemplo}>EJEMPLO</button>
        <button onClick={Nuevo}>NUEVO</button>
        <button onClick={Calcular}>CALCULAR</button>
        <button onClick={descargarExcel}>DESCARGAR RESULTADOS</button>
      </div>

      {/* Resultados */}
      <h2 style={{ textAlign: "center" }}>RESULTADOS</h2>
      <div style={{ border: "px solid #aaa", padding: 1 }}>
        <table
          style={{
            borderCollapse: "collapse",
            width: "130%"
          }}
        >
          <thead>
            <tr style={{ backgroundColor: "#f4f4f4" }}>
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
            {/* Fila P */}
            <tr>
              <th>P</th>
              {prec.map((val, i) => (
                <td key={i} style={{ textAlign: "right" }}>
                  {val === "" ? "" : val} 
                  {/* Si está vacío, no muestra nada, caso contrario el valor (string) */}
                </td>
              ))}
            </tr>

            {/* Fila ET */}
            <tr>
              <th>ET</th>
              {et.map((val, i) => (
                <td key={i} style={{ textAlign: "right" }}>
                  {val === "" ? "" : val}
                </td>
              ))}
            </tr>

            {/* Fila P-ET */}
            <tr>
              <th>P-ET</th>
              {pet.map((val, i) => (
                <td key={i} style={{ textAlign: "right" }}>
                  {val === "" ? "" : val}
                </td>
              ))}
            </tr>

            {/* Fila R */}
            <tr>
              <th>R</th>
              {r.map((val, i) => (
                <td key={i} style={{ textAlign: "right" }}>
                  {val === "" ? "" : val}
                </td>
              ))}
            </tr>

            {/* Fila VR */}
            <tr>
              <th>VR</th>
              {vr.map((val, i) => (
                <td key={i} style={{ textAlign: "right" }}>
                  {val === "" ? "" : val}
                </td>
              ))}
            </tr>

            {/* Fila ETR */}
            <tr>
              <th>ETR</th>
              {etr.map((val, i) => (
                <td key={i} style={{ textAlign: "right" }}>
                  {val === "" ? "" : val}
                </td>
              ))}
            </tr>

            {/* Fila D */}
            <tr>
              <th>D</th>
              {d.map((val, i) => (
                <td key={i} style={{ textAlign: "right" }}>
                  {val === "" ? "" : val}
                </td>
              ))}
            </tr>

            {/* Fila EX */}
            <tr>
              <th>EX</th>
              {ex.map((val, i) => (
                <td key={i} style={{ textAlign: "right" }}>
                  {val === "" ? "" : val}
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default BalanceHidrico;
