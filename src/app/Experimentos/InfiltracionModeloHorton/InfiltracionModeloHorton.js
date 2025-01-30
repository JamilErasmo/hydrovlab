import React, { useState } from 'react';
import { Chart } from 'react-google-charts';

const ExperimentoInfiltracion = () => {
    const [fo, setFo] = useState('');
    const [fc, setFc] = useState('');
    const [k, setK] = useState('');
    const [numDatos, setNumDatos] = useState('');
    const [tiempos, setTiempos] = useState([]);
    const [infiltraciones, setInfiltraciones] = useState([]);
    const [volumen, setVolumen] = useState(null);
    const [graficaVisible, setGraficaVisible] = useState(false);
    const [nuevoTiempo, setNuevoTiempo] = useState('');

    const cargarEjemplo = () => {
        setFo(4.5);
        setFc(0.4);
        setK(0.35);
        setNumDatos(5);
        setTiempos([0.17, 0.5, 1, 2, 6]);
        setInfiltraciones([4.27, 3.84, 3.29, 2.44, 0.9]);
        setVolumen(null);
        setGraficaVisible(false);
    };

    const limpiarCampos = () => {
        setFo('');
        setFc('');
        setK('');
        setNumDatos('');
        setTiempos([]);
        setInfiltraciones([]);
        setVolumen(null);
        setGraficaVisible(false);
        setNuevoTiempo('');
    };

    const agregarTiempo = () => {
        if (!nuevoTiempo || !fo || !fc || !k || !numDatos) {
            alert('Por favor, ingresa todos los datos necesarios.');
            return;
        }

        if (tiempos.length >= numDatos) {
            alert('Ya se han ingresado el número de datos especificados.');
            return;
        }

        const t = parseFloat(nuevoTiempo);
        const f = parseFloat(fc) + (parseFloat(fo) - parseFloat(fc)) * Math.exp(-parseFloat(k) * t);
        setTiempos((prev) => [...prev, t]);
        setInfiltraciones((prev) => [...prev, parseFloat(f.toFixed(2))]);
        setNuevoTiempo('');
    };

    const calcularVolumen = () => {
        if (tiempos.length !== parseInt(numDatos) || infiltraciones.length !== parseInt(numDatos)) {
            alert('Por favor, asegúrate de que se hayan ingresado todos los datos necesarios.');
            return;
        }

        let area = 0;
        for (let i = 0; i < tiempos.length - 1; i++) {
            const base = tiempos[i + 1] - tiempos[i];
            const altura = (infiltraciones[i] + infiltraciones[i + 1]) / 2;
            area += base * altura;
        }

        setVolumen(area.toFixed(2));
        setGraficaVisible(true); // Mostrar la gráfica al calcular
    };

    const data = [
        ['Tiempo (h)', 'Infiltración (pulg/h)'],
        ...tiempos.map((t, i) => [t, infiltraciones[i]]),
    ];

    const options = {
        title: 'Volumen de Infiltración',
        hAxis: { title: 'Tiempo (h)' },
        vAxis: { title: 'Infiltración (pulg/h)' },
        legend: 'none',
    };

    return (
        <div>
            <h1>Experimento de Infiltración</h1>
            <div>
                <h3>Datos de Entrada</h3>
                <label>Infiltración Inicial (fo) (pulg/h): </label>
                <input
                    type="number"
                    value={fo}
                    onChange={(e) => setFo(e.target.value)}
                />
                <br />
                <label>Infiltración Final (fc) (pulg/h): </label>
                <input
                    type="number"
                    value={fc}
                    onChange={(e) => setFc(e.target.value)}
                />
                <br />
                <label>Parámetro del Suelo (k) (h⁻¹): </label>
                <input
                    type="number"
                    value={k}
                    onChange={(e) => setK(e.target.value)}
                />
                <br />
                <label>Número de Datos: </label>
                <input
                    type="number"
                    value={numDatos}
                    onChange={(e) => setNumDatos(e.target.value)}
                />
                <br />
                <label>Nuevo Tiempo (h): </label>
                <input
                    type="number"
                    value={nuevoTiempo}
                    onChange={(e) => setNuevoTiempo(e.target.value)}
                />
                <button onClick={agregarTiempo} style={{ marginLeft: '10px' }}>
                    Agregar Tiempo
                </button>
            </div>

            <div style={{ marginTop: '20px' }}>
                <button onClick={cargarEjemplo}>Ejemplo</button>
                <button onClick={calcularVolumen} style={{ marginLeft: '10px' }}>
                    Calcular
                </button>
                <button onClick={limpiarCampos} style={{ marginLeft: '10px' }}>
                    Limpiar
                </button>
            </div>

            <div>
                <h3>Resultados</h3>
                <p><strong>Volumen de Infiltración:</strong> {volumen ? `${volumen} pulg³` : 'Sin calcular'}</p>
                <h4>Tiempos Ingresados:</h4>
                <ul>
                    {tiempos.map((t, i) => (
                        <li key={i}>{t} h</li>
                    ))}
                </ul>
                <h4>Infiltraciones Calculadas:</h4>
                <ul>
                    {infiltraciones.map((f, i) => (
                        <li key={i}>{f} pulg/h</li>
                    ))}
                </ul>
            </div>

            {graficaVisible && (
                <div>
                    <h3>Gráfica del Volumen de Infiltración</h3>
                    <Chart
                        chartType="LineChart"
                        width="100%"
                        height="400px"
                        data={data}
                        options={options}
                    />
                </div>
            )}
        </div>
    );
};

export default ExperimentoInfiltracion;
