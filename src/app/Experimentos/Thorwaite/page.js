'use client';
import React, { useState } from 'react';
import '../App.css';

const Thorwaite = () => {
    const [latitud, setLatitud] = useState('');
    const [latitudSeleccion, setLatitudSeleccion] = useState('');
    const [temperaturas, setTemperaturas] = useState(Array(12).fill(''));
    const [ij, setIj] = useState([]);
    const [ka, setKa] = useState([]);
    const [uj, setUj] = useState([]);
    const [iTotal, setITotal] = useState(0);
    const [a, setA] = useState(0);

    // Función para cargar el ejemplo
    const cargarEjemplo = () => {
        setLatitud(25.5);
        setLatitudSeleccion("Norte");
        setTemperaturas([13, 15, 18, 22, 25, 27, 26, 26, 24, 21, 16, 12]);
    };

    // Función para limpiar los campos
    const limpiarCampos = () => {
        setLatitud('');
        setLatitudSeleccion('');
        setTemperaturas(Array(12).fill(''));
        setIj([]);
        setKa([]);
        setUj([]);
        setITotal(0);
        setA(0);
    };

    // Cálculo de Ij
    const calcularIj = (temps) => {
        let ij = temps.map(temp => Math.pow((temp / 5), 1.514));
        let sumaIj = ij.reduce((a, b) => a + b, 0);
        return { ij, sumaIj };
    };

    // Interpolación de Ka
    const interpolarKa = (lat, zona) => {
        const kaNorte = [1.17, 1.01, 1.05, 0.96, 0.94, 0.88, 0.92, 0.98, 1, 1.1, 1.11, 1.18];
        const kaSur = [1.2, 1.03, 1.06, 1, 0.95, 0.9, 0.92, 0.98, 1.02, 1.12, 1.14, 1.21];
        return zona === "Norte" ? kaNorte : kaSur;
    };

    // Cálculo de Uj
    const calcularUj = (ijTotal, temps, ka) => {
        let a = 0.000000675 * Math.pow(ijTotal, 3) - 0.0000771 * Math.pow(ijTotal, 2) + 0.0179 * ijTotal + 0.492;
        let uj = temps.map((temp, index) => (1.6 * ka[index] * Math.pow((10 * temp / ijTotal), a)).toFixed(2));
        return { uj, a };
    };

    // Función para manejar el cálculo
    const calcular = () => {
        const { ij, sumaIj } = calcularIj(temperaturas);
        const ka = interpolarKa(latitud, latitudSeleccion);
        const { uj, a } = calcularUj(sumaIj, temperaturas, ka);
        setIj(ij);
        setKa(ka);
        setUj(uj);
        setITotal(sumaIj.toFixed(2));
        setA(a.toFixed(2));
    };

    return (
        <div className="app">
            <h1 className="experiment-title">Método de Thorwaite</h1>

            <div className="input-section">
                <label>Latitud:</label>
                <input
                    type="number"
                    value={latitud}
                    onChange={(e) => setLatitud(e.target.value)}
                    className="input-field"
                    placeholder="Latitud"
                />

                <label>Zona:</label>
                <select
                    value={latitudSeleccion}
                    onChange={(e) => setLatitudSeleccion(e.target.value)}
                    className="input-field"
                >
                    <option value="">Seleccione la zona</option>
                    <option value="Norte">Norte</option>
                    <option value="Sur">Sur</option>
                </select>
            </div>

            <div className="input-section">
                {temperaturas.map((temp, index) => (
                    <div key={index}>
                        <label>Mes {index + 1}:</label>
                        <input
                            type="number"
                            value={temp}
                            onChange={(e) => {
                                const newTemps = [...temperaturas];
                                newTemps[index] = e.target.value;
                                setTemperaturas(newTemps);
                            }}
                            className="input-field"
                            placeholder={`Temperatura mes ${index + 1}`}
                        />
                    </div>
                ))}
            </div>

            <div className="secondary-buttons">
                <button onClick={cargarEjemplo} className="example-button">
                    <span className="button-text">Ejemplo</span>
                </button>
                <button onClick={limpiarCampos} className="clear-button">
                    <span className="button-text">Limpiar</span>
                </button>
                <button onClick={calcular} className="calculate-button">
                    <span className="button-text">Calcular</span>
                </button>
            </div>

            {ij.length > 0 && (
                <div className="results-section">
                    <h2 className="section-title">Resultados</h2>
                    <table className="results-table">
                        <thead>
                            <tr>
                                <th>Mes</th>
                                <th>Temperatura</th>
                                <th>Ij</th>
                                <th>Ka</th>
                                <th>Uj</th>
                            </tr>
                        </thead>
                        <tbody>
                            {temperaturas.map((temp, index) => (
                                <tr key={index}>
                                    <td>{`Mes ${index + 1}`}</td>
                                    <td>{temp}</td>
                                    <td>{ij[index].toFixed(2)}</td>
                                    <td>{ka[index]}</td>
                                    <td>{uj[index]}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <div className="summary">
                        <p><strong>I Total:</strong> {iTotal}</p>
                        <p><strong>a:</strong> {a}</p>
                    </div>
                </div>
            )}

        </div>
    );
};

export default Thorwaite;
