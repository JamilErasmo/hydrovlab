'use client';
import React, { useState } from 'react';
import BackButton from "@/components/BackButton"; // Ajusta la ruta según la ubicación
function createStroreData(col1, col2, col3, col4) {
  return {
    Columna1: col1,
    Columna2: col2,
    Columna3: col3,
    Columna4: col4
  };
}

const Mblaneyc = () => {
  // ==================================================
  // ESTADOS (Inputs equivalentes a txtlat, txtene, etc.)
  // ==================================================
  const [txtlat, setTxtlat] = useState("");
  const [txtene, setTxtene] = useState("");
  const [txtfeb, setTxtfeb] = useState("");
  const [txtmar, setTxtmar] = useState("");
  const [txtabr, setTxtabr] = useState("");
  const [txtmay, setTxtmay] = useState("");
  const [txtjun, setTxtjun] = useState("");
  const [txtjul, setTxtjul] = useState("");
  const [txtago, setTxtago] = useState("");
  const [txtsep, setTxtsep] = useState("");
  const [txtoct, setTxtoct] = useState("");
  const [txtnov, setTxtnov] = useState("");
  const [txtdic, setTxtdic] = useState("");
  const [txtcoe, setTxtcoe] = useState(""); // Coeficiente global
  const [txtcve, setTxtcve] = useState(""); // Ciclo vegetativo

  // Combos
  const [cbxcul, setCbxcul] = useState("");   // cultivo
  const [cbxmsi, setCbxmsi] = useState("");   // mes de siembra
  const [cbxlat, setCbxlat] = useState("");   // "Norte" o "Sur"

  // Radios ZONA
  const [radTipo1, setRadTipo1] = useState(true);  // Normal
  const [radTipo2, setRadTipo2] = useState(false); // Arida

  // Salidas
  const [storeDatos, setStoreDatos] = useState([]); // "gpDatosIniciales"
  const [NumberField1, setNumberField1] = useState(""); // Zona Normal
  const [NumberField2, setNumberField2] = useState(""); // Zona Arida

  // ==================================================
  // Función: cbxcul_SelectedIndexChanged
  // (Replicando la parte de JavaScript en el .aspx)
  // ==================================================
  const cbxcul_SelectedIndexChanged = (nuevoCultivo) => {
    let coe = "";
    let cve = "";

    // Reproduce EXACTAMENTE la lógica "if(mes=='Aguacate')..."
    if (nuevoCultivo === "Aguacate") {
      setTxtcve("12");
      coe = "Perenne";
      cve = "min 0.50 - max 0.55";
      setTxtcoe("");
    }
    else if (nuevoCultivo === "Ajonjoli") {
      setTxtcve("12");
      cve = "Perenne";
      coe = "0,80";
      setTxtcoe("0.8");
    }
    else if (nuevoCultivo === "Alfalfa Heladas") {
      setTxtcve("3");
      cve = "3 meses";
      coe = "min 0.80 - max 0.85";
      setTxtcoe("");
    }
    else if (nuevoCultivo === "Alfalfa Invierno") {
      setTxtcve("3");
      cve = "3 meses";
      coe = "0.60";
      setTxtcoe("0.6");
    }
    else if (nuevoCultivo === "Algodon") {
      cve = "6 a 7 meses";
      coe = "min 0.60 - max 0.65";
      setTxtcve("");
      setTxtcoe("");
    }
    else if (nuevoCultivo === "Arroz") {
      cve = "3 a 5 meses";
      coe = "min 1.00 - max 1.20";
      setTxtcve("");
      setTxtcoe("");
    }
    else if (nuevoCultivo === "Cacahuate") {
      setTxtcve("5");
      setTxtcoe("");
      cve = "5 meses";
      coe = "min 0.60 - max 0.65";
    }
    else if (nuevoCultivo === "Cacao") {
      setTxtcve("12");
      setTxtcoe("");
      cve = "Perenne";
      coe = "min 0.75 - max 0.80";
    }
    else if (nuevoCultivo === "Cafe") {
      setTxtcve("12");
      setTxtcoe("");
      cve = "Perenne";
      coe = "min 0.75 - max 0.80";
    }
    else if (nuevoCultivo === "Camote") {
      cve = "5 a 6 meses";
      coe = "0.60";
      setTxtcve("");
      setTxtcoe("0.6");
    }
    else if (nuevoCultivo === "Ca\u00F1a de azucar") {
      setTxtcve("12");
      setTxtcoe("");
      cve = "Perenne";
      coe = "min 0.75 - max 0.90";
    }
    else if (nuevoCultivo === "Cartamo") {
      cve = "5 a 8 meses";
      coe = "0.55 - 0.65";
      setTxtcve("");
      setTxtcoe("");
    }
    else if (nuevoCultivo === "Alpiste, Avena, Cebada, centeno, Trigo") {
      cve = "3 - 6 mese";
      coe = "min 0.75 - max 0.85";
      setTxtcve("");
      setTxtcoe("");
    }
    else if (nuevoCultivo === "Citricos") {
      cve = "7 - 8 meses";
      coe = "min 0.50 - max 0.65";
      setTxtcve("");
      setTxtcoe("");
    }
    else if (nuevoCultivo === "Chile") {
      cve = "3 a 4 meses";
      coe = "0.60";
      setTxtcve("");
      setTxtcoe("0.6");
    }
    else if (nuevoCultivo === "Esparrago") {
      cve = "6 a 7 meses";
      coe = "0.60";
      setTxtcve("12");
      setTxtcoe("0.6");
    }
    else if (nuevoCultivo === "Fresa") {
      setTxtcve("12");
      setTxtcoe("");
      cve = "Perenne";
      coe = "min 0.45 - max 0.60";
    }
    else if (nuevoCultivo === "Frijol") {
      cve = "3 a 4 meses";
      coe = "min 0.60 - max 0.70";
      setTxtcve("");
      setTxtcoe("");
    }
    else if (nuevoCultivo === "Frutales de hueso y pepita") {
      cve = "Entre heladas";
      coe = "min 0.60 - max 0.70";
      setTxtcve("");
      setTxtcoe("");
    }
    else if (nuevoCultivo === "Garbanzo") {
      cve = "4 a 5 meses";
      coe = "min 0.60 - max 0.70";
      setTxtcve("");
      setTxtcoe("");
    }
    else if (nuevoCultivo === "Girasol") {
      setTxtcve("4");
      setTxtcoe("");
      cve = "4 meses";
      coe = "min 0.50 - max 0.65";
    }
    else if (nuevoCultivo === "Gladiola") {
      cve = "3 a 4 meses";
      coe = "0,60";
      setTxtcve("");
      setTxtcoe("0.6");
    }
    else if (nuevoCultivo === "Haba") {
      cve = "4 a 5 meses";
      coe = "min 0.60 - max 0.70";
      setTxtcve("");
      setTxtcoe("");
    }
    else if (nuevoCultivo === "Hortalizas") {
      cve = "2 a 4 meses";
      coe = "0.60";
      setTxtcve("");
      setTxtcoe("0.6");
    }
    else if (nuevoCultivo === "Jitomate") {
      cve = "4 meses";
      coe = "0.70";
      setTxtcve("4");
      setTxtcoe("0.7");
    }
    else if (nuevoCultivo === "Lechuga y col") {
      setTxtcve("3");
      setTxtcoe("0.7");
      cve = "3 meses";
      coe = "0.70";
    }
    else if (nuevoCultivo === "Lenteja") {
      setTxtcve("4");
      setTxtcoe("");
      cve = "4 meses";
      coe = "min 0.60 - max 0.70";
    }
    else if (nuevoCultivo === "Ma\u00EDz 1") {
      setTxtcve("4");
      setTxtcoe("");
      cve = "4 meses";
      coe = "min 0.60 - max 0.70";
    }
    else if (nuevoCultivo === "Maiz 2") {
      cve = "4 a 7 meses";
      coe = "min 0.75 - max 0.85";
      setTxtcve("");
      setTxtcoe("");
    }
    else if (nuevoCultivo === "Mango") {
      setTxtcve("12");
      setTxtcoe("");
      cve = "Perenne";
      coe = "min 0.75 - max 0.80";
    }
    else if (nuevoCultivo === "Melon") {
      cve = "3 a 4 meses";
      coe = "0.60";
      setTxtcve("");
      setTxtcoe("0.6");
    }
    else if (nuevoCultivo === "Nogal") {
      cve = "Entre heladas";
      coe = "0,70";
      setTxtcve("");
      setTxtcoe("0.7");
    }
    else if (nuevoCultivo === "Papa") {
      setTxtcve("");
      setTxtcoe("");
      cve = "3 a 5 meses";
      coe = "min 0.65 - max 0.75";
    }
    else if (nuevoCultivo === "Palma datilera") {
      setTxtcve("12");
      setTxtcoe("");
      cve = "Perenne";
      coe = "min 0.65 - max 0.80";
    }
    else if (nuevoCultivo === "Palma cocotera") {
      setTxtcve("12");
      setTxtcoe("");
      cve = "Perenne";
      coe = "min 0.80 - max 0.90";
    }
    else if (nuevoCultivo === "Papaya") {
      setTxtcve("12");
      cve = "Perenne";
      coe = "min 0.60 - max 0.80";
      setTxtcoe("");
    }
    else if (nuevoCultivo === "Platano") {
      setTxtcve("12");
      setTxtcoe("");
      cve = "Perenne";
      coe = "min 0.80 - max 1.00";
    }
    else if (nuevoCultivo === "Pastos de gramirias") {
      cve = "Perenne";
      coe = "0.75";
      setTxtcve("12");
      setTxtcoe("0.75");
    }
    else if (nuevoCultivo === "Remolacha") {
      setTxtcve("6");
      setTxtcoe("");
      cve = "6 meses";
      coe = "min 0.65 - max 0.75";
    }
    else if (nuevoCultivo === "Sandia") {
      cve = "3 a 4 meses";
      coe = "0.60";
      setTxtcve("");
      setTxtcoe("0.6");
    }
    else if (nuevoCultivo === "Sorbo") {
      cve = "3 a 5 meses";
      coe = "0.60";
      setTxtcve("");
      // El JS original tenía un posible "bug" => setValue(0.7)
      setTxtcoe("0.7");
    }
    else if (nuevoCultivo === "Soya") {
      setTxtcve("");
      setTxtcoe("");
      cve = "3 a 5 meses";
      coe = "min 0.60 - max 0.70";
    }
    else if (nuevoCultivo === "Tabaco") {
      cve = "4 a 5 meses";
      coe = "min 0.70 - max 0.80";
      setTxtcve("");
      setTxtcoe("");
    }
    else if (nuevoCultivo === "Tomate") {
      setTxtcve("");
      setTxtcoe("");
      cve = "4 a 5 meses";
      coe = "min 0.70 - max 0.80";
    }
    else if (nuevoCultivo === "Trebol ladino") {
      setTxtcve("12");
      setTxtcoe("");
      cve = "Perenne";
      coe = "min 0.80 - max 0.85";
    }
    else if (nuevoCultivo === "Zanahoria") {
      cve = "2 a 4 meses";
      coe = "0.60";
      setTxtcve("");
      setTxtcoe("0.6");
    }

    console.log("CICLO VEGETATIVO:", coe, "COEFICIENTE:", cve);
  };

  // ==================================================
  // Funciones equivalentes a: procIndexMes, procInterpolarN, ...
  // ==================================================
  function procIndexMes(mes) {
    switch (mes) {
      case "Enero": return 0;
      case "Febrero": return 1;
      case "Marzo": return 2;
      case "Abril": return 3;
      case "Mayo": return 4;
      case "Junio": return 5;
      case "Julio": return 6;
      case "Agosto": return 7;
      case "Septiembre": return 8;
      case "Octubre": return 9;
      case "Noviembre": return 10;
      case "Diciembre": return 11;
      default: return 0;
    }
  }

  function procInterpolarN(lat) {
    // Porcentajes de sol para la latitud Norte
    // (Arreglo de 37 filas × 13 columnas => 37*13 = 481 valores)
    // El primer valor de cada fila es la latitud; luego 12 valores de horas/porcentajes.
    const lgrn = [
      0, 8.5, 7.66, 8.49, 8.21, 8.5, 8.22, 8.5, 8.45, 8.21, 8.5, 8.22, 8.5,
      5, 8.32, 7.57, 8.47, 8.29, 8.65, 8.41, 8.67, 8.66, 8.23, 8.42, 8.07, 8.3,
      10, 8.13, 7.47, 8.45, 8.37, 8.81, 8.6, 8.86, 8.71, 8.25, 8.34, 7.91, 8.1,
      15, 7.94, 7.36, 8.43, 8.44, 8.98, 8.8, 9.05, 8.83, 8.28, 8.2, 7.75, 7.88,
      16, 7.93, 7.35, 8.44, 8.46, 9.07, 8.83, 9.07, 8.85, 8.27, 8.24, 7.72, 7.83,
      17, 7.86, 7.32, 8.43, 8.48, 9.04, 8.87, 9.11, 8.87, 8.27, 8.22, 7.69, 7.8,
      18, 7.83, 7.3, 8.42, 8.5, 9.09, 8.92, 9.16, 8.9, 8.27, 8.21, 7.66, 7.74,
      19, 7.79, 7.28, 8.41, 8.51, 9.11, 8.97, 9.2, 8.92, 8.28, 8.19, 7.63, 7.71,
      20, 7.74, 7.25, 8.41, 8.52, 9.15, 9.0, 9.25, 8.96, 8.3, 8.18, 7.58, 7.66,
      21, 7.71, 7.24, 8.4, 8.54, 9.18, 9.05, 9.29, 8.98, 8.29, 8.15, 7.54, 7.62,
      22, 7.66, 7.21, 8.4, 8.56, 9.22, 9.09, 9.33, 9.0, 8.3, 8.13, 7.5, 7.55,
      23, 7.62, 7.19, 8.4, 8.57, 9.24, 9.12, 9.35, 9.02, 8.3, 8.11, 7.47, 7.5,
      24, 7.58, 7.17, 8.4, 8.6, 9.3, 9.2, 9.44, 9.05, 8.31, 8.09, 7.43, 7.46,
      25, 7.53, 7.14, 8.39, 8.61, 9.33, 9.23, 9.45, 9.09, 8.32, 8.09, 7.4, 7.42,
      26, 7.49, 7.12, 8.4, 8.64, 9.38, 9.3, 9.49, 9.1, 8.31, 8.06, 7.36, 7.31,
      27, 7.43, 7.09, 8.38, 8.65, 9.4, 9.32, 9.52, 9.13, 8.32, 8.03, 7.36, 7.31,
      28, 7.4, 7.0, 8.39, 8.68, 9.46, 9.38, 9.58, 9.16, 8.32, 8.02, 7.27, 7.27,
      29, 7.35, 7.04, 8.37, 8.7, 9.49, 9.43, 9.61, 9.19, 8.32, 8.0, 7.24, 7.2,
      30, 7.3, 7.03, 8.38, 8.72, 9.53, 9.49, 8.67, 9.22, 8.33, 7.99, 7.19, 7.15,
      31, 7.25, 7.0, 8.36, 8.73, 9.57, 9.54, 9.72, 9.24, 8.33, 7.95, 7.15, 7.09,
      32, 7.2, 6.97, 8.37, 8.76, 9.62, 9.59, 9.77, 9.27, 8.34, 7.95, 7.11, 7.05,
      33, 7.15, 6.94, 8.36, 8.78, 9.68, 9.65, 9.82, 9.31, 8.35, 7.94, 7.07, 6.98,
      34, 7.1, 6.91, 8.36, 8.8, 9.72, 9.7, 9.88, 9.33, 8.36, 7.9, 7.02, 6.92,
      35, 7.05, 6.88, 8.35, 8.83, 9.77, 9.76, 9.94, 9.37, 8.37, 7.88, 6.97, 6.85,
      36, 6.99, 6.85, 8.35, 8.85, 9.82, 9.82, 9.09, 9.4, 8.37, 7.85, 6.92, 6.79,
      38, 6.87, 6.79, 8.34, 8.9, 9.92, 9.95, 10.1, 9.47, 8.38, 7.8, 6.82, 6.66,
      40, 6.76, 6.72, 8.33, 8.95, 10.02, 10.08, 10.22, 9.57, 8.39, 7.75, 6.72, 7.52,
      42, 6.63, 6.65, 8.31, 9.0, 10.14, 10.22, 10.35, 9.62, 8.4, 7.69, 6.62, 6.37,
      44, 6.49, 6.58, 8.3, 9.06, 10.26, 10.38, 10.49, 9.7, 8.41, 7.63, 6.49, 6.21,
      46, 6.34, 6.5, 8.29, 9.12, 10.39, 10.54, 10.64, 9.79, 8.42, 7.57, 6.36, 6.04,
      48, 6.17, 6.41, 8.27, 9.18, 10.53, 10.71, 10.8, 9.89, 8.44, 7.51, 6.23, 5.86,
      50, 5.98, 6.3, 8.24, 9.24, 10.68, 10.91, 10.9, 10.0, 8.46, 7.45, 6.1, 5.65,
      52, 5.77, 6.19, 8.21, 9.29, 10.85, 11.13, 11.2, 10.12, 8.49, 7.39, 5.93, 5.43,
      54, 5.55, 6.08, 8.18, 9.36, 11.03, 11.38, 11.43, 10.26, 8.51, 7.3, 5.74, 5.18,
      56, 5.3, 5.95, 8.15, 9.45, 11.22, 11.67, 11.69, 10.4, 8.52, 7.21, 5.54, 4.89,
      58, 5.01, 5.81, 8.12, 9.55, 11.46, 12.0, 11.98, 10.55, 8.51, 7.1, 4.31, 4.56,
      60, 4.67, 5.65, 8.08, 9.65, 11.74, 12.39, 12.31, 10.7, 8.51, 6.98, 5.04, 4.22
    ];

    // Creamos una matriz tbl[37][13] a partir de ese array lineal
    const tbl = [];
    let idx = 0;
    for (let r = 0; r < 37; r++) {
      const row = [];
      for (let c = 0; c < 13; c++) {
        row.push(lgrn[idx]);
        idx++;
      }
      tbl.push(row);
    }

    // Arreglo resultado (12 valores => 1 para cada mes)
    const ka = new Array(12).fill(0);

    // Recorremos la tabla para localizar la "latitud mayor encontrada" (o exacta)
    for (let r = 0; r < 37; r++) {
      // Columna0 => latitud en la fila r
      const latEnTabla = tbl[r][0];

      if (latEnTabla > lat) {
        // lat mayor encontrada
        const lma = latEnTabla;                // latitud mayor
        const lme = (r === 0) ? 0 : tbl[r - 1][0]; // latitud menor (fila previa)
        const la1 = lme - lma;
        const la2 = lat - lma;

        // Interpolación horizontal en [1..12]
        for (let c = 1; c <= 12; c++) {
          const valorDiff = tbl[r - 1][c] - tbl[r][c];
          const valInterp = (la2 * valorDiff) / la1;
          ka[c - 1] = tbl[r][c] + valInterp;
        }
        return ka;
      }
      else if (latEnTabla === lat) {
        // lat exacta => tomamos directamente la fila
        for (let c = 0; c < 12; c++) {
          ka[c] = tbl[r][c + 1];
        }
        return ka;
      }
    }

    // Si no se encontró => retornamos ka lleno de ceros
    return ka;
  }

  function procInterpolarS(lat) {
    // Porcentajes de sol para la latitud Sur
    // (Arreglo de 15 filas × 13 columnas => 15*13 = 195 valores)
    // El primer valor de cada fila es la latitud; luego 12 valores de horas/porcentajes.
    const lgrs = [
      0, 8.5, 7.66, 8.49, 8.21, 8.5, 8.22, 8.5, 8.49, 8.21, 8.5, 8.22, 8.5,
      5, 8.68, 7.76, 8.51, 8.15, 8.34, 8.05, 8.33, 8.38, 8.19, 8.56, 8.37, 8.68,
      10, 8.86, 7.87, 8.53, 8.09, 8.18, 7.86, 8.14, 8.27, 8.17, 8.62, 8.53, 8.88,
      15, 9.05, 7.98, 8.55, 8.02, 8.02, 7.65, 7.95, 8.15, 8.15, 8.68, 8.7, 9.1,
      20, 9.24, 8.09, 8.57, 7.94, 7.85, 7.43, 7.76, 8.03, 8.13, 8.76, 8.87, 9.33,
      25, 9.46, 8.21, 8.6, 7.94, 7.66, 7.2, 7.54, 7.9, 8.11, 8.86, 9.04, 9.58,
      30, 9.7, 8.33, 8.62, 7.73, 7.45, 6.96, 7.31, 7.76, 8.07, 8.97, 9.24, 9.35,
      32, 9.81, 8.39, 8.63, 7.69, 7.36, 6.85, 7.21, 7.7, 8.96, 9.01, 9.33, 9.96,
      34, 9.92, 8.45, 8.64, 7.64, 7.27, 6.74, 7.1, 7.63, 8.05, 9.06, 9.42, 10.08,
      36, 10.03, 8.51, 8.65, 7.59, 7.18, 6.62, 6.99, 7.56, 8.04, 9.11, 9.51, 10.21,
      38, 10.15, 8.57, 8.66, 7.54, 7.08, 6.5, 6.87, 7.49, 8.03, 9.16, 9.61, 10.34,
      40, 10.27, 8.63, 8.67, 7.49, 6.97, 6.37, 6.76, 7.41, 8.02, 9.21, 9.71, 10.49,
      42, 10.4, 8.7, 8.68, 7.44, 6.85, 6.23, 6.64, 7.33, 8.01, 9.26, 9.82, 10.64,
      44, 10.54, 8.78, 8.69, 7.38, 6.73, 6.08, 6.51, 7.25, 7.99, 9.31, 9.94, 10.8,
      46, 10.69, 8.86, 8.7, 7.32, 6.61, 5.02, 6.37, 7.16, 7.96, 9.37, 10.07, 10.97
    ];

    // Creamos una matriz tbl[15][13]
    const tbl = [];
    let idx = 0;
    for (let r = 0; r < 15; r++) {
      const row = [];
      for (let c = 0; c < 13; c++) {
        row.push(lgrs[idx]);
        idx++;
      }
      tbl.push(row);
    }

    const ka = new Array(12).fill(0);

    for (let r = 0; r < 15; r++) {
      const latEnTabla = tbl[r][0];

      if (latEnTabla > lat) {
        // lat mayor encontrada
        const lma = latEnTabla;
        const lme = (r === 0) ? 0 : tbl[r - 1][0];
        const la1 = lme - lma;
        const la2 = lat - lma;

        for (let c = 1; c <= 12; c++) {
          const diffVal = tbl[r - 1][c] - tbl[r][c];
          const valInterp = (la2 * diffVal) / la1;
          ka[c - 1] = tbl[r][c] + valInterp;
        }
        return ka;
      }
      else if (latEnTabla === lat) {
        // latitud exacta
        for (let c = 0; c < 12; c++) {
          ka[c] = tbl[r][c + 1];
        }
        return ka;
      }
    }

    // Si no encuentra => array de ceros
    return ka;
  }

  function procfi(Pi, Ti) {
    const fi = [];
    for (let i = 0; i < 12; i++) {
      fi[i] = Pi[i] * ((Ti[i] + 17.8) / 21.8);
    }
    return fi;
  }

  function prockti(Ti) {
    const kti = [];
    for (let i = 0; i < 12; i++) {
      kti[i] = 0.03114 * Ti[i] + 0.2396;
    }
    return kti;
  }

  function procfikti(fi, kti) {
    const fikti = [];
    for (let i = 0; i < 12; i++) {
      fikti[i] = fi[i] * kti[i];
    }
    return fikti;
  }

  // ==================================================
  // FUNCIÓN PRINCIPAL => "CALCULAR"
  // Muestra SIEMPRE los 7 meses: abril..oct + (opcional) Nov y Dic
  // ==================================================
  const calcular = () => {
    // Construimos un array "tem(14)" => 0..13
    const tem = new Array(14).fill(0);

    tem[0] = parseFloat(txtlat || 0);
    tem[1] = parseFloat(txtene || 0);
    tem[2] = parseFloat(txtfeb || 0);
    tem[3] = parseFloat(txtmar || 0);
    tem[4] = parseFloat(txtabr || 0);
    tem[5] = parseFloat(txtmay || 0);
    tem[6] = parseFloat(txtjun || 0);
    tem[7] = parseFloat(txtjul || 0);
    tem[8] = parseFloat(txtago || 0);
    tem[9] = parseFloat(txtsep || 0);
    tem[10] = parseFloat(txtoct || 0);
    tem[11] = parseFloat(txtnov || 0);
    tem[12] = parseFloat(txtdic || 0);
    tem[13] = parseFloat(txtcoe || 0); // Coeficiente global

    const latitud = cbxlat;
    const esZonaNormal = radTipo1;

    // Temperaturas mensuales [0..11]
    const t2 = [];
    for (let i = 1; i <= 12; i++) {
      t2[i - 1] = tem[i];
    }

    // Interpolación
    let pi;
    if (latitud === "Norte") pi = procInterpolarN(tem[0]);
    else pi = procInterpolarS(tem[0]);

    const fi = procfi(pi, t2);
    const kti = prockti(t2);
    const fikti = procfikti(fi, kti);

    // s1 / s2 => sumas
    let s1 = 0;
    let s2 = 0;
    let newStore = [];

    // 1) Base de meses => [3..9] => Abril..Octubre
    let mesesArr = [3, 4, 5, 6, 7, 8, 9];

    // 2) CONDICIÓN para añadir Nov y Dic
    //    Por ejemplo, si txtcve==12 => se agregan 10 y 11
    if (parseInt(txtcve, 10) === 12) {
      mesesArr.push(10); // Nov
      mesesArr.push(11); // Dic
    }

    // 3) Generamos filas
    for (let i = 0; i < mesesArr.length; i++) {
      let c1 = mesesArr[i];
      let mesLabel = "";
      switch (c1) {
        case 3: mesLabel = "Abril"; break;
        case 4: mesLabel = "Mayo"; break;
        case 5: mesLabel = "Junio"; break;
        case 6: mesLabel = "Julio"; break;
        case 7: mesLabel = "Agosto"; break;
        case 8: mesLabel = "Septiembre"; break;
        case 9: mesLabel = "Octubre"; break;
        case 10: mesLabel = "Noviembre"; break;
        case 11: mesLabel = "Diciembre"; break;
        default: mesLabel = ""; break;
      }

      if (esZonaNormal) {
        // Normal => pi[c1], fi[c1]
        const fila = createStroreData(
          mesLabel,
          round2(t2[c1], 2),   // TEMPERATURA
          round2(pi[c1], 2),   // Pi
          round2(fi[c1], 2)    // Fi
        );
        s1 += fi[c1];
        newStore.push(fila);
      } else {
        // Arida => kti[c1], fikti[c1]
        let tempVal = round2(t2[c1], 2);
        // Ej. en el original: if c1==6 => .toFixed(4). 
        // Pero lo mantenemos simple:
        const fila = createStroreData(
          mesLabel,
          tempVal,             // TEMPERATURA
          round2(kti[c1], 2),  // Kti
          round2(fikti[c1], 2)  // Fikti
        );
        s2 += fikti[c1];
        newStore.push(fila);
      }
    }

    // 4) Fila TOTAL
    if (esZonaNormal) {
      newStore.push(createStroreData("TOTAL", 0, 0, round2(s1, 2)));
    } else {
      newStore.push(createStroreData("TOTAL", 0, 0, round2(s2, 2)));
    }

    // 5) Multiplicación final con Coef Global
    const fzn = s1 * tem[13];
    const fza = s2 * tem[13];
    setNumberField1(round2(fzn, 2).toString());
    setNumberField2(round2(fza, 2).toString());

    // 6) Actualizamos storeDatos
    setStoreDatos(newStore);
  };

  // Función redondeo
  function round2(value, digits) {
    if (isNaN(value)) return 0;
    const f = Math.pow(10, digits);
    return Math.round(value * f) / f;
  }

  // ==================================================
  // BOTÓN: NUEVO => limpiar
  // ==================================================
  const Nuevo = () => {
    setTxtlat(""); setTxtene(""); setTxtfeb(""); setTxtmar(""); setTxtabr("");
    setTxtmay(""); setTxtjun(""); setTxtjul(""); setTxtago(""); setTxtsep("");
    setTxtoct(""); setTxtnov(""); setTxtdic("");
    setTxtcoe(""); setTxtcve("");
    setCbxcul(""); setCbxmsi("");
    setCbxlat("");
    setRadTipo1(true);
    setRadTipo2(false);
    setNumberField1("");
    setNumberField2("");
    setStoreDatos([]);
  };

  // ==================================================
  // BOTÓN: EJEMPLO => igual que la parte <Click Handler="...">
  // ==================================================
  const ejemplo = () => {
    // Limpiar
    setStoreDatos([]);
    // Simular:
    setCbxmsi("Abril");
    setCbxlat("Norte");
    setCbxcul("Algodon");
    setTxtcoe("0.65");
    setTxtlat("25.5");
    setTxtcve("7");
    setTxtene("13");
    setTxtfeb("15");
    setTxtmar("18");
    setTxtabr("22");
    setTxtmay("25");
    setTxtjun("27");
    setTxtago("26");
    setTxtsep("24");
    setTxtoct("21");
    setTxtnov("16");
    setTxtdic("12");
    setTxtjul("26");

    setNumberField1("");
    setNumberField2("");
  };

  // ==================================================
  // BOTÓN: DESCARGAR RESULTADOS => Simulado
  // ==================================================
  const ToExcel = () => {
    console.log("Descargar resultados en Excel (simulado).");
  };

  // ==================================================
  // RENDER
  // ==================================================
  return (
    <div className="m-4">
            <BackButton />
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-800 uppercase">
          Método de Blaney Criddle Global
        </h1>
      </div>
      <div className="border border-gray-300 p-6 mb-6 bg-white shadow-md rounded-lg space-y-4">
        <h3 className="text-lg font-semibold text-gray-800">Ingreso de Datos</h3>

        <div className="flex flex-col">
          <label className="text-gray-700 font-medium">LATITUD:</label>
          <input
            type="number"
            value={txtlat}
            onChange={(e) => setTxtlat(e.target.value)}
            className="w-full p-2 mt-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
          />
        </div>

        {/* CULTIVO */}
        <div className="flex flex-col">
          <label className="text-gray-700 font-medium">CULTIVO:</label>
          <select
            value={cbxcul}
            onChange={(e) => {
              setCbxcul(e.target.value);
              cbxcul_SelectedIndexChanged(e.target.value);
            }}
            className="w-full p-2 mt-1 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
          >
            <option value="">Seleccione el cultivo</option>
            {[
              "Aguacate", "Ajonjoli", "Alfalfa Heladas", "Alfalfa Invierno", "Algodon", "Arroz",
              "Cacahuate", "Cacao", "Cafe", "Camote", "Caña de azucar", "Cartamo",
              "Alpiste, Avena, Cebada, centeno, Trigo", "Citricos", "Chile", "Esparrago",
              "Fresa", "Frijol", "Frutales de hueso y pepita", "Garbanzo", "Girasol", "Gladiola",
              "Haba", "Hortalizas", "Jitomate", "Lechuga y col", "Lenteja", "Maíz 1", "Maiz 2",
              "Mango", "Melon", "Nogal", "Papa", "Palma datilera", "Palma cocotera", "Papaya",
              "Platano", "Pastos de gramirias", "Remolacha", "Sandia", "Sorbo", "Soya",
              "Tabaco", "Tomate", "Trebol ladino", "Zanahoria"
            ].map((cultivo, index) => (
              <option key={index} value={cultivo}>{cultivo}</option>
            ))}
          </select>
        </div>
        {/* CICLO VEGETATIVO */}
        <div className="flex flex-col">
          <label className="text-gray-700 font-medium">CICLO VEGETATIVO:</label>
          <input
            type="number"
            value={txtcve}
            onChange={(e) => setTxtcve(e.target.value)}
            className="w-full p-2 mt-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
          />
        </div>

        {/* COEFICIENTE GLOBAL (Kg) */}
        <div className="flex flex-col">
          <label className="text-gray-700 font-medium">COEFICIENTE GLOBAL (Kg):</label>
          <input
            type="number"
            value={txtcoe}
            onChange={(e) => setTxtcoe(e.target.value)}
            className="w-full p-2 mt-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
          />
        </div>

        {/* MES DE SIEMBRA */}
        <div className="flex flex-col">
          <label className="text-gray-700 font-medium">MES DE SIEMBRA:</label>
          <select
            value={cbxmsi}
            onChange={(e) => setCbxmsi(e.target.value)}
            className="w-full p-2 mt-1 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
          >
            <option value="">Seleccione el mes de siembra</option>
            {[
              "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
              "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
            ].map((mes, index) => (
              <option key={index} value={mes}>{mes}</option>
            ))}
          </select>
        </div>

        {/* LATITUD (Norte/Sur) */}
        <div className="flex flex-col">
          <label className="text-gray-700 font-medium">LATITUD (Norte/Sur):</label>
          <select
            value={cbxlat}
            onChange={(e) => setCbxlat(e.target.value)}
            className="w-full p-2 mt-1 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
          >
            <option value="">Seleccione latitud</option>
            <option value="Norte">Norte</option>
            <option value="Sur">Sur</option>
          </select>
        </div>
      </div>
      {/* Sección de Temperatura */}
      <div className="border border-gray-300 p-6 mb-6 bg-white shadow-md rounded-lg">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Temperatura (°C)</h3>

        <div className="grid grid-cols-2 gap-4">
          {[
            { mes: "ENERO", value: txtene, setter: setTxtene },
            { mes: "FEBRERO", value: txtfeb, setter: setTxtfeb },
            { mes: "MARZO", value: txtmar, setter: setTxtmar },
            { mes: "ABRIL", value: txtabr, setter: setTxtabr },
            { mes: "MAYO", value: txtmay, setter: setTxtmay },
            { mes: "JUNIO", value: txtjun, setter: setTxtjun },
            { mes: "JULIO", value: txtjul, setter: setTxtjul },
            { mes: "AGOSTO", value: txtago, setter: setTxtago },
            { mes: "SEPTIEMBRE", value: txtsep, setter: setTxtsep },
            { mes: "OCTUBRE", value: txtoct, setter: setTxtoct },
            { mes: "NOVIEMBRE", value: txtnov, setter: setTxtnov },
            { mes: "DICIEMBRE", value: txtdic, setter: setTxtdic }
          ].map(({ mes, value, setter }, index) => (
            <div key={index} className="flex flex-col">
              <label className="text-gray-700 font-medium">{mes}:</label>
              <input
                type="number"
                value={value}
                onChange={(e) => setter(e.target.value)}
                className="w-full p-2 mt-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
              />
            </div>
          ))}
        </div>
      </div>
      {/* Sección de Zona */}
      <div className="border border-gray-300 p-6 mb-6 bg-white shadow-md rounded-lg">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Zona</h3>

        <div className="flex gap-6">
          <label className="flex items-center gap-2 text-gray-700 font-medium cursor-pointer">
            <input
              type="radio"
              checked={radTipo1}
              onChange={() => { setRadTipo1(true); setRadTipo2(false); }}
              className="w-5 h-5 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500"
            />
            Normal
          </label>

          <label className="flex items-center gap-2 text-gray-700 font-medium cursor-pointer">
            <input
              type="radio"
              checked={radTipo2}
              onChange={() => { setRadTipo1(false); setRadTipo2(true); }}
              className="w-5 h-5 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500"
            />
            Árida
          </label>
        </div>
      </div>


      {/* Botonera */}
      <div className="mb-4 flex flex-wrap gap-4">
        <button
          onClick={ejemplo}
          className="px-6 py-2 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-600 transition"
        >
          EJEMPLO
        </button>

        <button
          onClick={ToExcel}
          className="px-6 py-2 bg-green-500 text-white font-semibold rounded-lg shadow-md hover:bg-green-600 transition"
        >
          DESCARGAR RESULTADOS (simulado)
        </button>

        <button
          onClick={Nuevo}
          className="px-6 py-2 bg-yellow-500 text-white font-semibold rounded-lg shadow-md hover:bg-yellow-600 transition"
        >
          NUEVO
        </button>

        <button
          onClick={calcular}
          className="px-6 py-2 bg-red-500 text-white font-semibold rounded-lg shadow-md hover:bg-red-600 transition"
        >
          CALCULAR
        </button>
      </div>
      {/* Sección de Resultados */}
      <div className="border border-gray-300 p-6 bg-white shadow-md rounded-lg">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">RESULTADOS</h3>

        {/* Tabla de Resultados */}
        <div className="overflow-x-auto">
          <table className="w-full border border-gray-400 bg-white shadow-md rounded-lg text-gray-700">
            <thead>
              <tr className="bg-gray-200">
                <th className="p-3 border border-gray-400">MESES</th>
                <th className="p-3 border border-gray-400">TEMPERATURA</th>
                <th className="p-3 border border-gray-400">Pi / Kti</th>
                <th className="p-3 border border-gray-400">Fi / FiKti</th>
              </tr>
            </thead>
            <tbody>
              {storeDatos.map((fila, i) => (
                <tr key={i} className="border border-gray-300">
                  <td className="p-2 text-center">{fila.Columna1}</td>
                  <td className="p-2 text-center">{fila.Columna2}</td>
                  <td className="p-2 text-center">{fila.Columna3}</td>
                  <td className="p-2 text-center">{fila.Columna4}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Zona Normal o Árida */}
        <div className="mt-4">
          {radTipo1 && (
            <div className="flex items-center gap-3">
              <label className="text-gray-700 font-medium">Zona normal:</label>
              <input
                type="number"
                readOnly
                value={NumberField1}
                className="w-32 p-2 border border-gray-300 rounded-lg bg-gray-100 text-center"
              />
            </div>
          )}
          {radTipo2 && (
            <div className="flex items-center gap-3 mt-2">
              <label className="text-gray-700 font-medium">Zona árida:</label>
              <input
                type="number"
                readOnly
                value={NumberField2}
                className="w-32 p-2 border border-gray-300 rounded-lg bg-gray-100 text-center"
              />
            </div>
          )}
        </div>
      </div>

    </div>
  );
};

export default Mblaneyc;
