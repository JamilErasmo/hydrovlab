'use client';
import React, { useState } from 'react';
import '../App.css';

const BalanceHidrico = () => {
    const [precipitacion, setPrecipitacion] = useState(Array(12).fill(''));
    const [evapotranspiracion, setEvapotranspiracion] = useState(Array(12).fill(''));
    const [mostrarResultados, setMostrarResultados] = useState(false);
    const [resultado, setResultado] = useState({
        pet: [],
        r: [],
        vr: [],
        etr: [],
        d: [],
        ex: []
    });

    const meses = [
        'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
        'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
    ];

    const cargarEjemplo = () => {
        const precipEjemplo = [77, 59, 88, 50, 60, 36, 8, 18, 32, 75, 78, 116];
        const evapoEjemplo = [26, 30, 40, 45, 60, 78, 91, 92, 71, 47, 29, 22];
        setPrecipitacion(precipEjemplo);
        setEvapotranspiracion(evapoEjemplo);
    };

    const limpiarCampos = () => {
        setPrecipitacion(Array(12).fill(''));
        setEvapotranspiracion(Array(12).fill(''));
        setResultado({
            pet: [],
            r: [],
            vr: [],
            etr: [],
            d: [],
            ex: []
        });
        setMostrarResultados(false);
    };

    const calcular = () => {
        const pet = procPET(precipitacion, evapotranspiracion);
        const r = procR(pet);
        const vr = procVR(r);
        const etr = procETR(precipitacion, evapotranspiracion, vr);
        const d = procD(evapotranspiracion, etr);
        const ex = procEx(pet, vr);

        setResultado({ pet, r, vr, etr, d, ex });
        setMostrarResultados(true);
    };

    const procPET = (p, et) => p.map((val, i) => parseFloat(val) - parseFloat(et[i]) || 0);
    const procR = (pet) => {
        let r = Array(12).fill(0);
        r[0] = 100;
        for (let i = 1; i < 12; i++) {
            r[i] = Math.max(0, Math.min(100, r[i - 1] + pet[i]));
        }
        return r;
    };
    const procVR = (r) => r.map((val, i) => (i === 0 ? 0 : r[i] - r[i - 1]));
    const procETR = (p, et, vr) => p.map((val, i) => (parseFloat(val) - parseFloat(et[i]) <= 0 ? parseFloat(val) + Math.abs(vr[i]) : parseFloat(et[i])));
    const procD = (et, etr) => et.map((val, i) => parseFloat(val) - parseFloat(etr[i]));
    const procEx = (pet, vr) => pet.map((val, i) => Math.max(0, val - vr[i]));

    return (
        <div className="app">
            <div className="content-wrapper">
                <div className="left-section">
                    <h3 className="section-title">Precipitación (mm)</h3>
                    {precipitacion.map((val, i) => (
                        <div key={i} className="input-row">
                            <label>{meses[i]}:</label>
                            <input
                                type="number"
                                value={val}
                                onChange={(e) => {
                                    const newValues = [...precipitacion];
                                    newValues[i] = e.target.value;
                                    setPrecipitacion(newValues);
                                }}
                                className="input-field"
                            />
                        </div>
                    ))}
                </div>
                <div className="center-section">
                    <h3 className="section-title">Evapotranspiración (mm)</h3>
                    {evapotranspiracion.map((val, i) => (
                        <div key={i} className="input-row">
                            <label>{meses[i]}:</label>
                            <input
                                type="number"
                                value={val}
                                onChange={(e) => {
                                    const newValues = [...evapotranspiracion];
                                    newValues[i] = e.target.value;
                                    setEvapotranspiracion(newValues);
                                }}
                                className="input-field"
                            />
                        </div>
                    ))}
                </div>
            </div>

            <div className="secondary-buttons">
                <button className="example-button" onClick={cargarEjemplo}>Ejemplo</button>
                <button className="calculate-button" onClick={calcular}>Calcular</button>
                <button className="clear-button" onClick={limpiarCampos}>Limpiar</button>
            </div>

            {mostrarResultados && (
                <div className="results-section">
                    <h2 className="section-title">Resultados</h2>
                    <table className="results-table">
                        <thead>
                            <tr>
                                <th>Resultado</th>
                                {meses.map((mes, i) => (
                                    <th key={i}>{mes}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>P</td>
                                {precipitacion.map((val, i) => <td key={i}>{val}</td>)}
                            </tr>
                            <tr>
                                <td>ET</td>
                                {evapotranspiracion.map((val, i) => <td key={i}>{val}</td>)}
                            </tr>
                            <tr>
                                <td>P-ET</td>
                                {resultado.pet.map((val, i) => <td key={i}>{val?.toFixed(2)}</td>)}
                            </tr>
                            <tr>
                                <td>R</td>
                                {resultado.r.map((val, i) => <td key={i}>{val?.toFixed(2)}</td>)}
                            </tr>
                            <tr>
                                <td>VR</td>
                                {resultado.vr.map((val, i) => <td key={i}>{val?.toFixed(2)}</td>)}
                            </tr>
                            <tr>
                                <td>ETR</td>
                                {resultado.etr.map((val, i) => <td key={i}>{val?.toFixed(2)}</td>)}
                            </tr>
                            <tr>
                                <td>D</td>
                                {resultado.d.map((val, i) => <td key={i}>{val?.toFixed(2)}</td>)}
                            </tr>
                            <tr>
                                <td>EX</td>
                                {resultado.ex.map((val, i) => <td key={i}>{val?.toFixed(2)}</td>)}
                            </tr>
                        </tbody>
                    </table>
                </div>

            )}
        </div>
    );
};

export default BalanceHidrico;
