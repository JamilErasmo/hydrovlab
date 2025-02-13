'use client';
import React, { useState } from "react";

function App() {
  // Estados de entradas
  const [q, setQ] = useState("");
  const [n, setN] = useState("");
  const [s, setS] = useState("");
  const [y, setY] = useState("");
  const [x, setX] = useState("");
  // Opción de radio (X es parámetro focal: "Si" o "No")
  const [selectedOption, setSelectedOption] = useState("Si");
  // Estados de resultados (salidas)
  const [results, setResults] = useState({
    tiranteNormal: "",
    espejoA: "",
    focoParabola: "",
    energiaEspecifica: "",
    extra: "", // T en el caso "Si" o X en el caso "No"
    k: "" // En el caso "No", se asigna el valor de k; en el caso "Si" se repite T
  });

  // Función que ejecuta los cálculos del experimento
  const handleEjecutar = () => {
    // Convertir entradas a números
    const qVal = parseFloat(q);
    const nVal = parseFloat(n);
    const sVal = parseFloat(s);
    let yVal = parseFloat(y);
    const xVal = parseFloat(x);

    if (
      isNaN(qVal) ||
      isNaN(nVal) ||
      isNaN(sVal) ||
      isNaN(yVal) ||
      isNaN(xVal)
    ) {
      alert("Por favor, ingresa valores numéricos válidos en todos los campos.");
      return;
    }

    let C, a, T, p, f, f1, v, f2, En, y1, k;
    const g = 9.81;

    if (selectedOption === "Si") {
      // Primera rama: cuando X es parámetro fijo (rblXParamFock = "Si")
      C = qVal * nVal / Math.sqrt(sVal);

      do {
        a = (4 * Math.sqrt(2 * xVal) * Math.pow(yVal, 1.5)) / 3;
        T = Math.sqrt(8 * xVal * yVal);

        if (yVal / T <= 0.25) {
          p =
            Math.sqrt(8 * xVal) *
            (Math.sqrt(yVal) + Math.pow(yVal, 1.5) / (3 * xVal));
          f = Math.pow(a, 5 / 3) / Math.pow(p, 2 / 3) - C;
        } else {
          p =
            Math.sqrt(2 * xVal * yVal) *
            (Math.sqrt(1 + 2 * yVal / xVal) +
              Math.sqrt(xVal / (2 * yVal)) *
              Math.log(
                Math.sqrt(2 * yVal / xVal) + Math.sqrt(1 + 2 * yVal / xVal)
              ));
          f = Math.pow(a, 5 / 3) / Math.pow(p, 2 / 3) - C;
        }

        f1 = f;
        yVal = yVal + 0.0001;

        a = (4 * Math.sqrt(2 * xVal) * Math.pow(yVal, 1.5)) / 3;
        T = Math.sqrt(8 * xVal * yVal);

        if (yVal / T <= 0.25) {
          p =
            Math.sqrt(8 * xVal) *
            (Math.sqrt(yVal) + Math.pow(yVal, 1.5) / (3 * xVal));
          f = Math.pow(a, 5 / 3) / Math.pow(p, 2 / 3) - C;
        } else {
          p =
            Math.sqrt(2 * xVal * yVal) *
            (Math.sqrt(1 + 2 * yVal / xVal) +
              Math.sqrt(xVal / (2 * yVal)) *
              Math.log(
                Math.sqrt(2 * yVal / xVal) + Math.sqrt(1 + 2 * yVal / xVal)
              ));
          f = Math.pow(a, 5 / 3) / Math.pow(p, 2 / 3) - C;
        }

        y1 = yVal - (f * 0.0001) / (f - f1);
      } while (Math.abs(y1 - yVal) > 0.0001);

      v = qVal / a;
      f2 = v / Math.sqrt((g * 2 * yVal) / 3);
      En = yVal + (v * v) / 19.62;

      setResults({
        tiranteNormal: yVal.toFixed(4),
        espejoA: v.toFixed(4),
        focoParabola: f2.toFixed(4),
        energiaEspecifica: En.toFixed(4),
        extra: T.toFixed(4), // Se muestra T
        k: T.toFixed(4) // Se vuelve T para este caso
      });
    } else {
      // Segunda rama: cuando X es parámetro focal (rblXParamFock = "No")
      C = qVal * nVal / Math.sqrt(sVal);

      do {
        a = (2 * yVal * xVal) / 3;

        if (yVal / xVal <= 0.25) {
          p = xVal + (8 * yVal * yVal) / (3 * xVal);
          f = Math.pow(a, 5 / 3) / Math.pow(p, 2 / 3) - C;
        } else {
          p =
            (xVal / 2) * Math.sqrt(1 + (16 * yVal * yVal) / (xVal * xVal)) +
            (xVal / (4 * yVal)) *
            Math.log(
              4 * yVal / xVal +
              Math.sqrt(1 + (16 * yVal * yVal) / (xVal * xVal))
            );
          k = (xVal * xVal) / (8 * yVal);
          f = Math.pow(a, 5 / 3) / Math.pow(p, 2 / 3) - C;
        }

        f1 = f;
        yVal = yVal + 0.0001;

        a = (2 * yVal * xVal) / 3;

        if (yVal / xVal <= 0.25) {
          p = xVal + (8 * yVal * yVal) / (3 * xVal);
          k = (xVal * xVal) / (8 * yVal);
          f = Math.pow(a, 5 / 3) / Math.pow(p, 2 / 3) - C;
        } else {
          p =
            (xVal / 2) * Math.sqrt(1 + (16 * yVal * yVal) / (xVal * xVal)) +
            (xVal / (4 * yVal)) *
            Math.log(
              4 * yVal / xVal +
              Math.sqrt(1 + (16 * yVal * yVal) / (xVal * xVal))
            );
          k = (xVal * xVal) / (8 * yVal);
          f = Math.pow(a, 5 / 3) / Math.pow(p, 2 / 3) - C;
        }

        y1 = yVal - (f * 0.0001) / (f - f1);
      } while (Math.abs(y1 - yVal) > 0.0001);

      v = qVal / a;
      f2 = v / Math.sqrt((g * 2 * yVal) / 3);
      En = yVal + (v * v) / 19.62;

      setResults({
        tiranteNormal: yVal.toFixed(4),
        espejoA: v.toFixed(4),
        focoParabola: f2.toFixed(4),
        energiaEspecifica: En.toFixed(4),
        extra: xVal.toFixed(4), // Se muestra X
        k: k ? k.toFixed(4) : ""
      });
    }
  };

  // Función para cargar los valores de ejemplo según la opción seleccionada
  const handleEjemplo = () => {
    if (selectedOption === "Si") {
      setQ("1.8");
      setN("0.025");
      setS("0.001");
      setY("1");
      setX("0.5");
    } else {
      setQ("1.8");
      setN("0.025");
      setS("0.001");
      setY("1");
      setX("0");
    }
    setResults({
      tiranteNormal: "",
      espejoA: "",
      focoParabola: "",
      energiaEspecifica: "",
      extra: "",
      k: ""
    });
  };

  // Función para limpiar los campos de entrada y salida
  const handleLimpiar = () => {
    setQ("");
    setN("");
    setS("");
    setY("");
    setX("");
    setResults({
      tiranteNormal: "",
      espejoA: "",
      focoParabola: "",
      energiaEspecifica: "",
      extra: "",
      k: ""
    });
  };

  // Cuando se cambia la opción del radio (X parámetro focal)
  const handleOptionChange = (event) => {
    const valor = event.target.value;
    setSelectedOption(valor);
    if (valor === "Si") {
      setQ("1.8");
      setN("0.025");
      setS("0.001");
      setY("1");
      setX("0.5");
    } else {
      setQ("1.8");
      setN("0.025");
      setS("0.001");
      setY("1");
      setX("0");
    }
    setResults({
      tiranteNormal: "",
      espejoA: "",
      focoParabola: "",
      energiaEspecifica: "",
      extra: "",
      k: ""
    });
  };

  return (
    <div className="py-10 font-sans">
      <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-300 max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-center text-blue-700 mb-8">
          TIRANTENPARABÓLICA
        </h1>
        <form>
          {/* Panel de datos de entrada */}
          <fieldset className="mb-8">
            <legend className="text-xl font-semibold text-gray-800 mb-4 block">
              Datos de Entrada
            </legend>
            <div className="space-y-4">
              <div className="flex items-center">
                <label className="w-44 text-gray-700 font-medium">Caudal:</label>
                <input
                  type="text"
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  className="w-24 px-3 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 transition"
                  placeholder="Valor"
                />
              </div>
              <div className="flex items-center">
                <label className="w-44 text-gray-700 font-medium">
                  Coeficiente de Rigidez:
                </label>
                <input
                  type="text"
                  value={n}
                  onChange={(e) => setN(e.target.value)}
                  className="w-24 px-3 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 transition"
                  placeholder="Valor"
                />
              </div>
              <div className="flex items-center">
                <label className="w-44 text-gray-700 font-medium">Pendiente:</label>
                <input
                  type="text"
                  value={s}
                  onChange={(e) => setS(e.target.value)}
                  className="w-24 px-3 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 transition"
                  placeholder="Valor"
                />
              </div>
              <div className="flex items-center">
                <label className="w-44 text-gray-700 font-medium">Tirante Inicial:</label>
                <input
                  type="text"
                  value={y}
                  onChange={(e) => setY(e.target.value)}
                  className="w-24 px-3 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 transition"
                  placeholder="Valor"
                />
              </div>
              <div className="flex items-center">
                <label className="w-44 text-gray-700 font-medium">X:</label>
                <input
                  type="text"
                  value={x}
                  onChange={(e) => setX(e.target.value)}
                  className="w-24 px-3 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 transition"
                  placeholder="Valor"
                />
              </div>
              <div className="flex items-center">
                <label className="w-44 text-gray-700 font-medium">X Param FocK:</label>
                <div className="flex items-center">
                  <label className="mr-3">
                    <input
                      type="radio"
                      name="paramFock"
                      value="Si"
                      checked={selectedOption === "Si"}
                      onChange={handleOptionChange}
                      className="mr-1"
                    />
                    Si
                  </label>
                  <label>
                    <input
                      type="radio"
                      name="paramFock"
                      value="No"
                      checked={selectedOption === "No"}
                      onChange={handleOptionChange}
                      className="mr-1"
                    />
                    No
                  </label>
                </div>
              </div>
            </div>
          </fieldset>

          {/* Botones de acción */}
          <div className="flex justify-center gap-4 mb-8">
            <button
              type="button"
              onClick={handleEjecutar}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg shadow hover:bg-blue-600 transition"
            >
              Ejecutar
            </button>
            <button
              type="button"
              onClick={handleEjemplo}
              className="px-4 py-2 bg-green-500 text-white rounded-lg shadow hover:bg-green-600 transition"
            >
              Ejemplo
            </button>
            <button
              type="button"
              onClick={handleLimpiar}
              className="px-4 py-2 bg-red-500 text-white rounded-lg shadow hover:bg-red-600 transition"
            >
              Limpiar
            </button>
          </div>

          {/* Panel de resultados */}
          <fieldset>
            <legend className="text-xl font-semibold text-gray-800 mb-3 block">
              Resultados
            </legend>
            <div className="space-y-3">
              <div className="flex items-center">
                <label className="w-44 text-gray-700 font-medium">Tirante Normal:</label>
                <input
                  type="text"
                  readOnly
                  value={results.tiranteNormal}
                  className="w-24 px-3 py-1 border border-gray-300 rounded bg-gray-100"
                />
              </div>
              <div className="flex items-center">
                <label className="w-44 text-gray-700 font-medium">Espejo A:</label>
                <input
                  type="text"
                  readOnly
                  value={results.espejoA}
                  className="w-24 px-3 py-1 border border-gray-300 rounded bg-gray-100"
                />
              </div>
              <div className="flex items-center">
                <label className="w-44 text-gray-700 font-medium">Foco Parabola:</label>
                <input
                  type="text"
                  readOnly
                  value={results.focoParabola}
                  className="w-24 px-3 py-1 border border-gray-300 rounded bg-gray-100"
                />
              </div>
              <div className="flex items-center">
                <label className="w-44 text-gray-700 font-medium">Energía Específica:</label>
                <input
                  type="text"
                  readOnly
                  value={results.energiaEspecifica}
                  className="w-24 px-3 py-1 border border-gray-300 rounded bg-gray-100"
                />
              </div>
              <div className="flex items-center">
                <label className="w-44 text-gray-700 font-medium">
                  {selectedOption === "Si" ? "T:" : "X:"}
                </label>
                <input
                  type="text"
                  readOnly
                  value={results.extra}
                  className="w-24 px-3 py-1 border border-gray-300 rounded bg-gray-100"
                />
              </div>
              <div className="flex items-center">
                <label className="w-44 text-gray-700 font-medium">
                  {selectedOption === "Si" ? "T:" : "K:"}
                </label>
                <input
                  type="text"
                  readOnly
                  value={results.k}
                  className="w-24 px-3 py-1 border border-gray-300 rounded bg-gray-100"
                />
              </div>
            </div>
          </fieldset>
        </form>
      </div>
    </div>

  );
}

export default App;
