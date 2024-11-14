'use client'
import React, { useState } from 'react';

import '../App.css';
const Penman = () => {
    const [temp, setTemp] = useState('');
    const [humedad, setHumedad] = useState('');
    const [nD, setND] = useState('');
    const [velViento, setVelViento] = useState('');
    const [energia, setEnergia] = useState('');
    const [albedo, setAlbedo] = useState('');
    const [resultado, setResultado] = useState({
        e: '',
        ea: '',
        Ta: '',
        D: '',
        Rc: '',
        RI: '',
        RB: '',
        H2: '',
        Ea2: '',
        Eo: '',
        EoMin: ''
    });

    // Función para cargar el ejemplo
    const cargarEjemplo = () => {
        setTemp(20);
        setHumedad(0.7);
        setND(0.4);
        setVelViento(5);
        setEnergia(550);
        setAlbedo(0.06);
    };

    // Función para limpiar los campos
    const limpiarCampos = () => {
        setTemp('');
        setHumedad('');
        setND('');
        setVelViento('');
        setEnergia('');
        setAlbedo('');
        setResultado({
            e: '',
            ea: '',
            Ta: '',
            D: '',
            Rc: '',
            RI: '',
            RB: '',
            H2: '',
            Ea2: '',
            Eo: '',
            EoMin: ''
        });
    };

    // Función para calcular los valores ajustados
    const calcular = () => {
        const e = calcularPresionVapor(temp);
        const ea = humedad * e;
        const Ta = parseFloat(temp) + 273; // Conversión a °K
        const D = 1; // ∆ (mmHg/°C)
        const Rc = energia * (0.2 + 0.48 * nD); // Cálculo de Rc
        const RI = Rc * (1 - albedo); // Cálculo de RI ajustado al albedo
        const o = 117.4 * Math.pow(10, -9); // Constante para RB
        const RB = o * Math.pow(Ta, 4) * (0.47 - 0.077 * Math.sqrt(ea)) * (0.2 + 0.8 * nD);
        const H2 = RI - RB; // Cálculo de H
        const Ea2 = 21 * (e - ea) * (0.5 + 0.54 * velViento); // Cálculo de Ea
        const Y = 0.49; // Coeficiente Y
        const Eo = (D * H2 + Y * Ea2) / (D + Y); // Evapotranspiración potencial E'o
        const EoMin = Eo / 60; // Conversión a mm/día

        setResultado({
            e: e.toFixed(2),
            ea: ea.toFixed(3),
            Ta: Ta.toFixed(0),
            D: D.toFixed(0),
            Rc: Rc.toFixed(1),
            RI: RI.toFixed(2),
            RB: RB.toFixed(2),
            H2: H2.toFixed(2),
            Ea2: Ea2.toFixed(1),
            Eo: Eo.toFixed(2),
            EoMin: EoMin.toFixed(1)
        });
    };

    // Función para calcular la presión de vapor (mmHg)
    const calcularPresionVapor = (temp) => {
        // Fórmula para la presión de vapor saturado e (mmHg)
        return 0.6108 * Math.exp((17.27 * temp) / (temp + 237.3)) * 7.5;
    };

    return (
        <div>


            <div>
                <label>Temperatura (⁰C): </label>
                <input type="number" value={temp} onChange={(e) => setTemp(e.target.value)} />
            </div>
            <div>
                <label>Humedad Relativa del Aire (h): </label>
                <input type="number" value={humedad} onChange={(e) => setHumedad(e.target.value)} />
            </div>
            <div>
                <label>Relación entre Insolación Actual e Insolación Máxima (n/D): </label>
                <input type="number" value={nD} onChange={(e) => setND(e.target.value)} />
            </div>
            <div>
                <label>Velocidad del Viento (m/s): </label>
                <input type="number" value={velViento} onChange={(e) => setVelViento(e.target.value)} />
            </div>
            <div>
                <label>Cantidad de Energía ((cal/cm²)/día): </label>
                <input type="number" value={energia} onChange={(e) => setEnergia(e.target.value)} />
            </div>
            <div>
                <label>Albedo de Superficie: </label>
                <input type="number" value={albedo} onChange={(e) => setAlbedo(e.target.value)} />
            </div>

            <div>
                <button onClick={cargarEjemplo}>Ejemplo</button>
                <button onClick={calcular}>Calcular</button>
                <button onClick={limpiarCampos}>Limpiar</button>
            </div>

            <h2>Resultados:</h2>
            <p>e (mmHg): {resultado.e}</p>
            <p>Ea (mmHg): {resultado.ea}</p>
            <p>Ta (°K): {resultado.Ta}</p>
            <p>∆ (mm de Hg/°C): {resultado.D}</p>
            <p>Rc ((cal/cm²)/día): {resultado.Rc}</p>
            <p>RI ((cal/cm²)/día): {resultado.RI}</p>
            <p>RB ((cal/cm²)/día): {resultado.RB}</p>
            <p>H ((cal/cm²)/día): {resultado.H2}</p>
            <p>Ea ((cal/cm²)/día): {resultado.Ea2}</p>
            <p>E'o ((cal/cm²)/día): {resultado.Eo}</p>
            <p>E'o (mm/día): {resultado.EoMin}</p>
        </div>
    );
};

export default Penman;
