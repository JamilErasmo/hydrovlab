import React, { useState } from 'react';

const TiranteCriticoCircular = () => {
    const [caudal, setCaudal] = useState('');
    const [diametro, setDiametro] = useState('');
    const [tiranteInicial, setTiranteInicial] = useState('');
    const [tiranteCritico, setTiranteCritico] = useState(null);
    const [errorVisible, setErrorVisible] = useState(false);

    // Función para cargar el ejemplo con los valores dados
    const cargarEjemplo = () => {
        setCaudal(1.5);
        setDiametro(1.4);
        setTiranteInicial(0.4);
        setErrorVisible(false);
    };

    // Función para limpiar los campos
    const limpiarCampos = () => {
        setCaudal('');
        setDiametro('');
        setTiranteInicial('');
        setTiranteCritico(null);
        setErrorVisible(false);
    };

    // Función para calcular el tirante crítico
    const calcular = () => {
        let Q = parseFloat(caudal);
        let D = parseFloat(diametro);
        let y = parseFloat(tiranteInicial);

        const c = Q / Math.sqrt(9.81);
        let f, f1, w, arcosw, x, a, t, y1;

        do {
            w = 1 - (2 * y / D);
            arcosw = 1.570796 - Math.atan(w / Math.sqrt(1 - Math.pow(w, 2)));
            x = 2 * arcosw;
            a = (x - Math.sin(x)) * Math.pow(D, 2) / 8;
            t = D * Math.sin(x / 2);
            f = Math.pow(a, 1.5) / Math.sqrt(t) - c;

            f1 = f;
            y = y + 0.0001;

            w = 1 - (2 * y / D);
            arcosw = 1.570796 - Math.atan(w / Math.sqrt(1 - Math.pow(w, 2)));
            x = 2 * arcosw;
            a = (x - Math.sin(x)) * Math.pow(D, 2) / 8;
            t = D * Math.sin(x / 2);
            f = Math.pow(a, 1.5) / Math.sqrt(t) - c;

            y1 = y - ((f * 0.0001) / (f - f1));

            if (y1 >= D) {
                setErrorVisible(true);
                break;
            }

        } while (Math.abs(y1 - y) > 0.0001);

        setTiranteCritico(y.toFixed(15));
    };

    return (
        <div>
            <h1>Tirante Crítico en Sección Circular</h1>

            <div>
                <h3>Datos de Entrada</h3>
                <label>Caudal Q (m³/s): </label>
                <input type="number" value={caudal} onChange={(e) => setCaudal(e.target.value)} /><br />

                <label>Diámetro D (m): </label>
                <input type="number" value={diametro} onChange={(e) => setDiametro(e.target.value)} /><br />

                <label>Tirante Inicial Y (m): </label>
                <input type="number" value={tiranteInicial} onChange={(e) => setTiranteInicial(e.target.value)} /><br />
            </div>

            <div style={{ marginTop: '20px' }}>
                <button onClick={cargarEjemplo}>Ejemplo</button>
                <button onClick={calcular} style={{ marginLeft: '10px' }}>Calcular</button>
                <button onClick={limpiarCampos} style={{ marginLeft: '10px' }}>Limpiar</button>
            </div>

            {tiranteCritico && (
                <div style={{ marginTop: '30px' }}>
                    <h2>Resultados</h2>
                    <p><strong>Tirante Crítico:</strong> {tiranteCritico} m</p>
                </div>
            )}

            {errorVisible && (
                <div style={{ marginTop: '20px', color: 'red' }}>
                    <p><strong>Error:</strong> El valor de y1 supera el diámetro D.</p>
                </div>
            )}
        </div>
    );
};

export default TiranteCriticoCircular;
