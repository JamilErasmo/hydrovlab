import React, { useState } from "react";

const ExperimentoFournier = () => {
  const [p, setP] = useState("");
  const [pp, setPp] = useState("");
  const [h, setH] = useState("");
  const [alfa, setAlfa] = useState("");
  const [e, setE] = useState(null);
  const [eh, setEh] = useState(null);
  const [el, setEl] = useState(null);

  // Función para cargar valores de ejemplo
  const cargarEjemplo = () => {
    setP(90);
    setPp(50);
    setH(20);
    setAlfa(1000);
  };

  // Función para limpiar los campos
  const limpiarCampos = () => {
    setP("");
    setPp("");
    setH("");
    setAlfa("");
    setE(null);
    setEh(null);
    setEl(null);
  };

  // Función para calcular los resultados
  const calcular = () => {
    const P = parseFloat(p);
    const Pp = parseFloat(pp);
    const H = parseFloat(h);
    const Alfa = parseFloat(alfa) / 100;

    if (isNaN(P) || isNaN(Pp) || isNaN(H) || isNaN(Alfa) || P <= 0 || Pp <= 0 || H <= 0 || Alfa <= 0) {
      alert("Por favor, ingresa valores válidos en todos los campos.");
      return;
    }

    // Fórmulas del experimento
    const E = 0.0275 * Math.pow((Pp * Pp) / P, 2.65) * Math.pow(H * Alfa, 0.46);
    const EH = 52.4 * Math.pow(Pp, 2) / P - 513.21;
    const EL = 27.12 * Math.pow(Pp, 2) / P - 475.4;

    setE(E.toFixed(3));
    setEh(EH.toFixed(3));
    setEl(EL.toFixed(3));
  };

  return (
    <div>
      <h1>Experimento Fournier</h1>
      <div>
        <h3>Datos de Entrada</h3>
        <label>CAUDAL Q(m3/seg): </label>
        <input
          type="number"
          value={p}
          onChange={(e) => setP(e.target.value)}
          placeholder="Ingresa un valor"
        />
        <br />
        <label>FACTOR (a y n): </label>
        <input
          type="number"
          value={pp}
          onChange={(e) => setPp(e.target.value)}
          placeholder="Ingresa un valor"
        />
        <br />
        <label>FACTOR a: </label>
        <input
          type="number"
          value={h}
          onChange={(e) => setH(e.target.value)}
          placeholder="Ingresa un valor"
        />
        <br />
        <label>FACTOR n: </label>
        <input
          type="number"
          value={alfa}
          onChange={(e) => setAlfa(e.target.value)}
          placeholder="Ingresa un valor"
        />
      </div>

      <div style={{ marginTop: "20px" }}>
        <button onClick={cargarEjemplo}>Ejemplo</button>
        <button onClick={calcular} style={{ marginLeft: "10px" }}>
          Calcular
        </button>
        <button onClick={limpiarCampos} style={{ marginLeft: "10px" }}>
          Limpiar
        </button>
      </div>

      {e !== null && eh !== null && el !== null && (
        <div style={{ marginTop: "30px" }}>
          <h2>Resultados</h2>

          <div style={{ marginBottom: "20px" }}>
            <h3>Producción de Sedimentos</h3>
            <p>
              <em></em> <strong>E = 0.0275 * ((pp² / P)<sup>2.65</sup>) * ((H * alfa)<sup>0.46</sup>)</strong>
            </p>
            <p>
              <strong>E Tom/km²*año:</strong> {e}
            </p>
          </div>

          <div style={{ marginBottom: "20px" }}>
            <h3>Cuencas con Relieves Altos</h3>
            <p>
              <em></em> <strong>EH = 52.4 * (pp² / P) - 513.21</strong>
            </p>
            <p>
              <strong>EH Tom/km²*año:</strong> {eh}
            </p>
          </div>

          <div>
            <h3>Cuencas con Relieves Bajos</h3>
            <p>
              <em></em> <strong>EL = 27.12 * (pp² / P) - 475.4</strong>
            </p>
            <p>
              <strong>EL Tom/km²*año:</strong> {el}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExperimentoFournier;
