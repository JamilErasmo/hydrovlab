'use client';
import React, { useState } from 'react';
import '../App.css';

const Hargreaves = () => {
    const [lat, setLat] = useState('');
    const [hemisferio, setHemisferio] = useState('Norte');
    const [mes, setMes] = useState('Enero');
    const [temp, setTemp] = useState('');
    const [hrm, setHrm] = useState('');
    const [windSpeed, setWindSpeed] = useState('');
    const [elevacion, setElevacion] = useState('');
    const [etp, setEtp] = useState('');
    const [ecuacion, setEcuacion] = useState('modificada');

    const meses = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];

    const cargarEjemplo = () => {
        setLat(20);
        setHemisferio('Norte');
        setMes('Febrero');
        setTemp(23);
        setHrm(2);
        setWindSpeed(34);
        setElevacion(33);
        setEcuacion('modificada');
    };

    const limpiarCampos = () => {
        setLat('');
        setHemisferio('Norte');
        setMes('Enero');
        setTemp('');
        setHrm('');
        setWindSpeed('');
        setElevacion('');
        setEtp('');
        setEcuacion('basica');
    };

    const procCalculateB = () => {
        const etpValue = 17.35 * lat * temp * 0.01; // Fórmula básica ajustada (simulada)
        setEtp(etpValue.toFixed(3));
    };

    const procCalculateM = () => {
        const etpValue = 17.35 * lat * temp * (1 + windSpeed * 0.01) * (1 + elevacion * 0.0001); // Fórmula modificada ajustada (simulada)
        setEtp(etpValue.toFixed(3));
    };

    const calcularETP = () => {
        if (ecuacion === 'basica') {
            procCalculateB();
        } else {
            procCalculateM();
        }
    };

    return (
        <div className="app">
            <div className="content-wrapper">
                <div className="left-section">
                    <h2 className="section-title">Método de Hargreaves</h2>
                    <div className="input-section">
                        <div className="radio-group-container">
                            <span className="radio-group-title">Selecciona la ecuación:</span>
                            <div className="radio-option">
                                <input
                                    type="radio"
                                    id="basica"
                                    className="radio-input"
                                    checked={ecuacion === 'basica'}
                                    onChange={() => setEcuacion('basica')}
                                />
                                <label htmlFor="basica" className="radio-label">Básica</label>
                            </div>
                            <div className="radio-option">
                                <input
                                    type="radio"
                                    id="modificada"
                                    className="radio-input"
                                    checked={ecuacion === 'modificada'}
                                    onChange={() => setEcuacion('modificada')}
                                />
                                <label htmlFor="modificada" className="radio-label">Modificada</label>
                            </div>
                        </div>
                        <label>Latitud:</label>
                        <input className="input-field" type="number" value={lat} onChange={(e) => setLat(e.target.value)} />

                        <label>Hemisferio:</label>
                        <select className="input-field" value={hemisferio} onChange={(e) => setHemisferio(e.target.value)}>
                            <option value="Norte">Norte</option>
                            <option value="Sur">Sur</option>
                        </select>

                        <label>Mes:</label>
                        <select className="input-field" value={mes} onChange={(e) => setMes(e.target.value)}>
                            {meses.map((mes) => (
                                <option key={mes} value={mes}>
                                    {mes}
                                </option>
                            ))}
                        </select>

                        <label>Temperatura (⁰C):</label>
                        <input className="input-field" type="number" value={temp} onChange={(e) => setTemp(e.target.value)} />

                        <label>Humedad Relativa Mensual (Hrm):</label>
                        <input className="input-field" type="number" value={hrm} onChange={(e) => setHrm(e.target.value)} />

                        {ecuacion === 'modificada' && (
                            <>
                                <label>Velocidad del Viento:</label>
                                <input className="input-field" type="number" value={windSpeed} onChange={(e) => setWindSpeed(e.target.value)} />

                                <label>Elevación (m):</label>
                                <input className="input-field" type="number" value={elevacion} onChange={(e) => setElevacion(e.target.value)} />
                            </>
                        )}
                    </div>

                    <div className="secondary-buttons">
                        <button className="example-button" onClick={cargarEjemplo}>Ejemplo</button>
                        <button className="calculate-button" onClick={calcularETP}>Calcular</button>
                        <button className="clear-button" onClick={limpiarCampos}>Nuevo</button>
                    </div>
                </div>

                <div className="results-section">
                    <h2 className="section-subtitle">Resultados</h2>
                    <p className="result-text">Evapotranspiración Potencial (E.T.P): {etp || '0.000'}</p>
                </div>
            </div>
        </div>
    );
};

export default Hargreaves;
