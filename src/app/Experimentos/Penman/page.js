'use client';
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

    const cargarEjemplo = () => {
        setTemp(20);
        setHumedad(0.7);
        setND(0.4);
        setVelViento(5);
        setEnergia(550);
        setAlbedo(0.06);
    };

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

    const calcular = () => {
        const e = calcularPresionVapor(temp);
        const ea = humedad * e;
        const Ta = parseFloat(temp) + 273;
        const D = 1;
        const Rc = energia * (0.2 + 0.48 * nD);
        const RI = Rc * (1 - albedo);
        const o = 117.4 * Math.pow(10, -9);
        const RB = o * Math.pow(Ta, 4) * (0.47 - 0.077 * Math.sqrt(ea)) * (0.2 + 0.8 * nD);
        const H2 = RI - RB;
        const Ea2 = 21 * (e - ea) * (0.5 + 0.54 * velViento);
        const Y = 0.49;
        const Eo = (D * H2 + Y * Ea2) / (D + Y);
        const EoMin = Eo / 60;

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

    const calcularPresionVapor = (temp) => {
        return 0.6108 * Math.exp((17.27 * temp) / (temp + 237.3)) * 7.5;
    };

    return (
        <div style={{ width: '80%', margin: '0 auto', padding: '20px', background: '#f9f9f9', borderRadius: '8px' }}>
            <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Cálculo Penman</h2>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px', justifyContent: 'space-between' }}>
                <div>
                    <label>Temperatura (⁰C):</label>
                    <input className="input-field" type="number" value={temp} onChange={(e) => setTemp(e.target.value)} />
                </div>
                <div>
                    <label>Humedad Relativa del Aire (h):</label>
                    <input className="input-field" type="number" value={humedad} onChange={(e) => setHumedad(e.target.value)} />
                </div>
                <div>
                    <label>Relación Insolación Actual/Máxima (n/D):</label>
                    <input className="input-field" type="number" value={nD} onChange={(e) => setND(e.target.value)} />
                </div>
                <div>
                    <label>Velocidad del Viento (m/s):</label>
                    <input className="input-field" type="number" value={velViento} onChange={(e) => setVelViento(e.target.value)} />
                </div>
                <div>
                    <label>Cantidad de Energía (cal/cm²/día):</label>
                    <input className="input-field" type="number" value={energia} onChange={(e) => setEnergia(e.target.value)} />
                </div>
                <div>
                    <label>Albedo de Superficie:</label>
                    <input className="input-field" type="number" value={albedo} onChange={(e) => setAlbedo(e.target.value)} />
                </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px' }}>
                <button className="example-button" onClick={cargarEjemplo}>
                    <span className="button-text">Ejemplo</span>
                </button>
                <button className="calculate-button" onClick={calcular}>
                    <span className="button-text">Calcular</span>
                </button>
                <button className="clear-button" onClick={limpiarCampos}>
                    <span className="button-text">Limpiar</span>
                </button>
            </div>

            {resultado.e && (
                <div style={{ marginTop: '30px', textAlign: 'left', background: '#fff', padding: '15px', borderRadius: '8px' }}>
                    <h3>Resultados</h3>
                    {Object.entries(resultado).map(([key, value]) => (
                        <p key={key}>
                            <strong>{key.toUpperCase()}: </strong>
                            {value}
                        </p>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Penman;
