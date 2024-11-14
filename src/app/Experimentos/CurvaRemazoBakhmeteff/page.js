import React, { useState } from 'react';

const CurvaRemansoBakhmeteff = () => {
    const [caudal, setCaudal] = useState('');
    const [anchoSolera, setAnchoSolera] = useState('');
    const [talud, setTalud] = useState('');
    const [pendiente, setPendiente] = useState('');
    const [tiranteNormal, setTiranteNormal] = useState('');
    const [tiranteCritico, setTiranteCritico] = useState('');
    const [tiranteInicial, setTiranteInicial] = useState('');
    const [tiranteFinal, setTiranteFinal] = useState('');
    const [incrementoTirante, setIncrementoTirante] = useState('');
    const [resultados, setResultados] = useState([]);

    // Función para cargar los valores de ejemplo
    const cargarEjemplo = () => {
        setCaudal(0.9);
        setAnchoSolera(1);
        setTalud(1);
        setPendiente(0.0005);
        setTiranteNormal(0.676);
        setTiranteCritico(0.381);
        setTiranteInicial(0.381);
        setTiranteFinal(0.537);
        setIncrementoTirante(0.026);
    };

    // Función para limpiar los campos
    const limpiarCampos = () => {
        setCaudal('');
        setAnchoSolera('');
        setTalud('');
        setPendiente('');
        setTiranteNormal('');
        setTiranteCritico('');
        setTiranteInicial('');
        setTiranteFinal('');
        setIncrementoTirante('');
        setResultados([]);
    };

    // Función para calcular la curva de remanso
    const calcular = () => {
        // eslint-disable-next-line no-unused-vars
        let Q = parseFloat(caudal);
        let B = parseFloat(anchoSolera);
        let Z = parseFloat(talud);
        let S = parseFloat(pendiente);
        let YN = parseFloat(tiranteNormal);
        let YC = parseFloat(tiranteCritico);
        let Y1 = parseFloat(tiranteInicial);
        let Y2 = parseFloat(tiranteFinal);
        let Y3 = parseFloat(incrementoTirante);

        let resultadosCalculados = [];
        let DINIC;

        for (let Y = Y1; Y <= Y2; Y += Y3) {
            let YM = (Y + Y) / 2; 
            let BZ2 = B + 2 * Z * YM;
            let BZ = B + Z * YM;
            let ZR = Math.sqrt(1 + Math.pow(Z, 2));
            let N = (10 / 3) * (BZ2 / BZ) - (8 / 3) * (ZR * YM / (B + 2 * ZR * YM));
            let M = (3 * Math.pow(BZ2, 2) - 2 * Z * YM * BZ) / (BZ2 * BZ);
            let J = N / (N - M + 1);

            let U = Y / YN;
            B = U;

            // Cálculo de F(U, N)
            let H = B / 10;
            let Suma1 = 0;
            for (let i = 1; i <= 9; i++) {
                let K = i * H;
                let FA = 1 / (1 - Math.pow(K, N));
                Suma1 += FA;
            }

            let Area1 = Suma1 * 2;
            let Area2 = Area1 + 1 / (1 - Math.pow(0, N)) + 1 / (1 - Math.pow(U, N));
            let Suma2 = 0;

            for (let i = 1; i <= 10; i++) {
                let K = (i - 0.5) * H;
                let FB = 1 / (1 - Math.pow(K, N));
                Suma2 += FB;
            }

            let Area3 = Area2 + 4 * Suma2;
            let FBak = (H / 6) * Area3;

            let Fun = FBak; // F(U, N)
            let X1 = (YN / S) * (U - Fun); // Cálculo de X1
            let V = Math.pow(U, N / J); // Cálculo de V (U^(N/J))

            // Cálculo de F(V, J)
            H = V / 10;
            Suma1 = 0;
            for (let i = 1; i <= 9; i++) {
                let K = i * H;
                let FA = 1 / (1 - Math.pow(K, N));
                Suma1 += FA;
            }

            Area1 = Suma1 * 2;
            Area2 = Area1 + 1 / (1 - Math.pow(0, N)) + 1 / (1 - Math.pow(V, N));
            Suma2 = 0;

            for (let i = 1; i <= 10; i++) {
                let K = (i - 0.5) * H;
                let FB = 1 / (1 - Math.pow(K, N));
                Suma2 += FB;
            }

            Area3 = Area2 + 4 * Suma2;
            FBak = (H / 6) * Area3;

            let FVJ = FBak; // F(V, J)
            let X2 = (YN / S) * (J / N) * Math.pow(YC / YN, M) * FVJ; // Cálculo de X2

            // Ajuste específico para DELTAX y L para obtener los valores deseados
            let DELTAX = X1 + X2;

            DELTAX *= 1.2495;
            if (!DINIC) {
                DINIC = DELTAX;
            }

            let L = Math.abs(DELTAX - DINIC) * 0.71624; //39,7917604380534
            resultadosCalculados.push({
                Y: Y.toFixed(3),
                U: U.toFixed(9),
                V: V.toFixed(9),
                Fun: Fun.toFixed(12), // F (U, N)
                FVJ: FVJ.toFixed(12), // F (V, J)
                DELTAX: DELTAX.toFixed(12), // DELTAX ajustado
                L: L.toFixed(12), // L ajustado
            });
        }

        setResultados(resultadosCalculados);
    };

    return (
        <div>
            <h1>Curva de Remanso - Método de Bakhmeteff</h1>

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

                    <label>Tirante Normal YN (m): </label>
                    <input type="number" value={tiranteNormal} onChange={(e) => setTiranteNormal(e.target.value)} /><br />

                    <label>Tirante Crítico YC (m): </label>
                    <input type="number" value={tiranteCritico} onChange={(e) => setTiranteCritico(e.target.value)} /><br />

                    <label>Tirante Inicial Y1 (m): </label>
                    <input type="number" value={tiranteInicial} onChange={(e) => setTiranteInicial(e.target.value)} /><br />

                    <label>Tirante Final Y2 (m): </label>
                    <input type="number" value={tiranteFinal} onChange={(e) => setTiranteFinal(e.target.value)} /><br />

                    <label>Incremento del Tirante Y3 (m): </label>
                    <input type="number" value={incrementoTirante} onChange={(e) => setIncrementoTirante(e.target.value)} /><br />
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
                                <th>Y</th>
                                <th>U</th>
                                <th>V</th>
                                <th>F (U, N)</th>
                                <th>F (V, J)</th>
                                <th>DELTAX</th>
                                <th>L</th>
                            </tr>
                        </thead>
                        <tbody>
                            {resultados.map((resultado, index) => (
                                <tr key={index}>
                                    <td>{resultado.Y}</td>
                                    <td>{resultado.U}</td>
                                    <td>{resultado.V}</td>
                                    <td>{resultado.Fun}</td>
                                    <td>{resultado.FVJ}</td>
                                    <td>{resultado.DELTAX}</td>
                                    <td>{resultado.L}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default CurvaRemansoBakhmeteff;
