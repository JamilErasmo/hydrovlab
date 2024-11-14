import React, { useState } from 'react';

const CurvaDeRemanso = () => {
    const [caudal, setCaudal] = useState('');
    const [anchoSolera, setAnchoSolera] = useState('');
    const [talud, setTalud] = useState('');
    const [pendiente, setPendiente] = useState('');
    const [rugosidad, setRugosidad] = useState('');
    const [distanciaInicial, setDistanciaInicial] = useState('');
    const [distanciaTramo, setDistanciaTramo] = useState('');
    const [numTramos, setNumTramos] = useState('');
    const [tiranteInicial, setTiranteInicial] = useState('');
    const [errorAprox, setErrorAprox] = useState('');
    const [resultados, setResultados] = useState([]);

    // Función para cargar el ejemplo con los valores dados
    const cargarEjemplo = () => {
        setCaudal(1.5);
        setAnchoSolera(1.5);
        setTalud(1);
        setPendiente(0.0005);
        setRugosidad(0.015);
        setDistanciaInicial(0);
        setDistanciaTramo(-20); // Importante que sea negativo
        setNumTramos(10);
        setTiranteInicial(0.423);
        setErrorAprox(0.0001);
    };

    // Función para limpiar los campos
    const limpiarCampos = () => {
        setCaudal('');
        setAnchoSolera('');
        setTalud('');
        setPendiente('');
        setRugosidad('');
        setDistanciaInicial('');
        setDistanciaTramo('');
        setNumTramos('');
        setTiranteInicial('');
        setErrorAprox('');
        setResultados([]);
    };

    // Función para calcular la curva de remanso
    const calcular = () => {
        let Q = parseFloat(caudal);
        let B = parseFloat(anchoSolera);
        let Z = parseFloat(talud);
        let S = parseFloat(pendiente);
        let N = parseFloat(rugosidad);
        let X1 = parseFloat(distanciaInicial);
        let X = parseFloat(distanciaTramo);
        let NT = parseInt(numTramos);
        let Y1 = parseFloat(tiranteInicial);
        let Er = parseFloat(errorAprox);

        let M = Math.sqrt(1 + Math.pow(Z, 2));
        let resultadosCalculados = [];

        resultadosCalculados.push({ x: X1.toFixed(0), y: Y1.toString() });

        let i = 0;

        while (i < NT) {
            // Cálculos según el código VB.NET
            let A1 = (B + Z * Y1) * Y1;
            let P1 = B + 2 * Y1 * M;
            let R1 = A1 / P1;
            let V1 = Q / A1;
            let C = S * X + Y1 + Math.pow(V1, 2) / 19.62 - X * Math.pow(V1 * N, 2) / (2 * Math.pow(R1, 4 / 3));

            let Y2 = Y1;

            // Cálculo inicial de F fuera del bucle interno
            let A = (B + Z * Y2) * Y2;
            let P = B + 2 * Y2 * M;
            let R = A / P;
            let T = B + 2 * Z * Y2;
            let Q1 = Math.pow(Q, 2) / Math.pow(A, 3);
            let F = Y2 + (Q1 * A) / 19.62 + X * Q1 * P * Math.pow(N, 2) / (2 * Math.pow(R, 1 / 3)) - C;

            let iterCount = 0;
            do {
                let D = 1 - (Q1 * T) / 9.81 + (X * Q * Math.pow(N, 2) * (4 * M - (5 * T) / R)) / (3 * Math.pow(R, 1 / 3));
                if (D === 0) {
                    console.error("Error: División por cero en D.");
                    break;
                }

                let Y3 = Y2 - F / D;
                Y2 = Y3;

                // Recalcular A, P, R, T, Q1, F
                A = (B + Z * Y2) * Y2;
                P = B + 2 * Y2 * M;
                R = A / P;
                T = B + 2 * Z * Y2;
                Q1 = Math.pow(Q, 2) / Math.pow(A, 3);
                F = Y2 + (Q1 * A) / 19.62 + X * Q1 * P * Math.pow(N, 2) / (2 * Math.pow(R, 1 / 3)) - C;

                iterCount++;
                if (iterCount > 1000) {
                    console.error("Límite de iteraciones alcanzado.");
                    break;
                }
            } while (Math.abs(F) >= Er);

            Y1 = Y2;
            X1 = X1 + X;

            resultadosCalculados.push({ x: X1.toFixed(0), y: Y1.toString() });

            i++;
        }

        setResultados(resultadosCalculados);
    };

    return (
        <div>
            <h1>Curva de Remanso (Tramos Fijos)</h1>

            <div style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'flex-start' }}>
                <div>
                    <h3>Datos de Entrada</h3>
                    <label>Caudal Q (m³/s): </label>
                    <input type="number" value={caudal} onChange={(e) => setCaudal(e.target.value)} /><br />

                    <label>Ancho de Solera B (m): </label>
                    <input type="number" value={anchoSolera} onChange={(e) => setAnchoSolera(e.target.value)} /><br />

                    <label>Talud: </label>
                    <input type="number" value={talud} onChange={(e) => setTalud(e.target.value)} /><br />

                    <label>Pendiente (m/m): </label>
                    <input type="number" value={pendiente} onChange={(e) => setPendiente(e.target.value)} /><br />

                    <label>Coeficiente de Rugosidad: </label>
                    <input type="number" value={rugosidad} onChange={(e) => setRugosidad(e.target.value)} /><br />

                    <label>Distancia Inicial X1 (m): </label>
                    <input type="number" value={distanciaInicial} onChange={(e) => setDistanciaInicial(e.target.value)} /><br />

                    <label>Distancia del Tramo 1 al 2 X (m): </label>
                    <input type="number" value={distanciaTramo} onChange={(e) => setDistanciaTramo(e.target.value)} /><br />

                    <label>Número de Tramos a Calcular: </label>
                    <input type="number" value={numTramos} onChange={(e) => setNumTramos(e.target.value)} /><br />

                    <label>Tirante Inicial Y1: </label>
                    <input type="number" value={tiranteInicial} onChange={(e) => setTiranteInicial(e.target.value)} /><br />

                    <label>Error de Aproximación: </label>
                    <input type="number" value={errorAprox} onChange={(e) => setErrorAprox(e.target.value)} /><br />
                </div>
            </div>

            <div style={{ marginTop: '20px' }}>
                <button onClick={cargarEjemplo}>Ejemplo</button>
                <button onClick={calcular} style={{ marginLeft: '10px' }}>Calcular</button>
                <button onClick={limpiarCampos} style={{ marginLeft: '10px' }}>Limpiar</button>
            </div>

            {resultados.length > 0 && (
                <div style={{ marginTop: '30px' }}>
                    <h2>Resultados</h2>
                    <table border="1" style={{ width: '100%' }}>
                        <thead>
                            <tr>
                                <th>Distancia X (m)</th>
                                <th>Tirante Y (m)</th>
                            </tr>
                        </thead>
                        <tbody>
                            {resultados.map((resultado, index) => (
                                <tr key={index}>
                                    <td>{resultado.x}</td>
                                    <td>{resultado.y}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default CurvaDeRemanso;
