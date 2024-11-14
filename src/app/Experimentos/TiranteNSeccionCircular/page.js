import React, { useState } from 'react';

const ExperimentoCircular = () => {
    const [data, setData] = useState({
        Q: 1,
        D: 1.5,
        N: 0.015,
        S: 0.0005,
        y: 0.5,
    });

    const [results, setResults] = useState({
        yResult: '',
        v: '',
        f2: '',
        En: ''
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setData({ ...data, [name]: parseFloat(value) });
    };

    const calcular = () => {
        let { Q, D, N, S, y } = data;
        let c, w, arcosw, x, a, p, f, f1, y1, v, t, f2, En;

        c = Q * N / Math.sqrt(S);
        y = 0.35 * D;
        do {
            w = 1 - (2 * y / D);
            arcosw = 1.570796 - Math.atan(w / Math.sqrt(1 - Math.pow(w, 2)));
            x = 2 * arcosw;
            a = (x - Math.sin(x)) * Math.pow(D, 2) / 8;
            p = x * D / 2;
            f = (Math.pow(a, 5 / 3) / Math.pow(p, 2 / 3)) - c;

            f1 = f;
            y += 0.0001;

            w = 1 - (2 * y / D);
            arcosw = 1.570796 - Math.atan(w / Math.sqrt(1 - Math.pow(w, 2)));
            x = 2 * arcosw;
            a = (x - Math.sin(x)) * Math.pow(D, 2) / 8;
            p = x * D / 2;
            f = (Math.pow(a, 5 / 3) / Math.pow(p, 2 / 3)) - c;

            y1 = y - (f * 0.0001 / (f - f1));
            if (y1 >= D) {
                alert("Aumente el diámetro");
                break;
            }

            y = y1;

            w = 1 - (2 * y / D);
            arcosw = 1.570796 - Math.atan(w / Math.sqrt(1 - Math.pow(w, 2)));
            x = 2 * arcosw;
            a = (x - Math.sin(x)) * Math.pow(D, 2) / 8;
            p = x * D / 2;
            f = (Math.pow(a, 5 / 3) / Math.pow(p, 2 / 3)) - c;

            f1 = f;
            y += 0.0001;

            w = 1 - (2 * y / D);
            arcosw = 1.570796 - Math.atan(w / Math.sqrt(1 - Math.pow(w, 2)));
            x = 2 * arcosw;
            a = (x - Math.sin(x)) * Math.pow(D, 2) / 8;
            p = x * D / 2;
            f = (Math.pow(a, 5 / 3) / Math.pow(p, 2 / 3)) - c;

            y1 = y - (f * 0.0001 / (f - f1));
        } while (Math.abs(y1 - y) >= 0.0001);

        v = Q / a;
        t = D * Math.sin(x / 2);
        f2 = v / Math.sqrt(9.81 * a / t);
        En = y + Math.pow(v, 2) / 19.62;

        setResults({
            yResult: y.toFixed(14),
            v: v.toFixed(14),
            f2: f2.toFixed(14),
            En: En.toFixed(14),
        });
    };

    const cargarEjemplo = () => {
        setData({
            Q: 1,
            D: 1.5,
            N: 0.015,
            S: 0.0005,
            y: 0.5,
        });
        setResults({
            yResult: '',
            v: '',
            f2: '',
            En: ''
        });
    };

    const limpiar = () => {
        setData({
            Q: '',
            D: '',
            N: '',
            S: '',
            y: '',
        });
        setResults({
            yResult: '',
            v: '',
            f2: '',
            En: ''
        });
    };

    return (
        <div>
            <h1>Análisis Tirante N Sección Circular</h1>
            <div>
                <label>CAUDAL Q (m³/s): </label>
                <input type="number" name="Q" value={data.Q} onChange={handleInputChange} />
                <label>DIAMETRO (m): </label>
                <input type="number" name="D" value={data.D} onChange={handleInputChange} />
                <label>COEF. RUGOSIDAD: </label>
                <input type="number" name="N" value={data.N} onChange={handleInputChange} />
                <label>PENDIENTE (m/m): </label>
                <input type="number" name="S" value={data.S} onChange={handleInputChange} />
                <label>TIRANTE INICIAL (m): </label>
                <input type="number" name="y" value={data.y} onChange={handleInputChange} />
            </div>
            <div>
                <button onClick={calcular}>Calcular</button>
                <button onClick={cargarEjemplo}>Cargar Ejemplo</button>
                <button onClick={limpiar}>Limpiar</button>
            </div>
            <div>
                <h2>Resultados</h2>
                <p>Tirante Normal y: {results.yResult}</p>
                <p>Velocidad v: {results.v}</p>
                <p>Número de Froude f2: {results.f2}</p>
                <p>Energía Específica En: {results.En}</p>
            </div>
        </div>
    );
};

export default ExperimentoCircular;
