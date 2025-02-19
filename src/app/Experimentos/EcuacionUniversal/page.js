'use client';
import React, { useState } from 'react';

const EcuacionSuelo = () => {
    const [data, setData] = useState({
        anguloPendiente: 2,
        numeroTormentas: 1,
        longitudPendiente: 150,
        limo: 44,
        arena: 22.5,
        arcilla: 33.5,
        materiaOrganica: 0.3,
        factores: {
            conservacion: "Cultivo en contorno",
            permeabilidad: "Muy lenta (<0.12 cm/h)",
            estructura: "Muy fina granular",
        },
        tormentas: [{ intensidad: 5, energia: 15 }],
        factorC: {
            tipoAltura: "Sin dosel apreciable",
            cobertura: 25,
            tipoCobertura: "G",
            porcentajeCobertura: 0,
        },
        factorCValor: 0.36, // Valor inicial del factor C
    });

    const [results, setResults] = useState({
        r: 0,
        m: 0,
        k: 0,
        l: 0,
        s: 0,
        c: 0,
        pd: 0,
        perdidaSuelo: 0,
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setData({ ...data, [name]: parseFloat(value) });
    };

    const handleFactorChange = (e, factorGroup) => {
        const { name, value } = e.target;
        setData({
            ...data,
            [factorGroup]: {
                ...data[factorGroup],
                [name]: value,
            },
        });
    };

    const calcular = () => {
        const { anguloPendiente, numeroTormentas, longitudPendiente, limo, arena, arcilla, materiaOrganica, tormentas, factorCValor } = data;
        let totalEnergia = 0;

        // Calcular valores de tormentas
        tormentas.forEach((tormenta) => {
            const { intensidad, energia } = tormenta;
            let E_E_I = energia <= 76 ? 0.119 + 0.0873 * Math.log10(energia) : 0.283;
            totalEnergia += E_E_I * intensidad;
        });

        const r = totalEnergia / numeroTormentas;
        const m = (limo + arena) * (100 - arcilla);
        const k = (0.00021 * Math.pow(m, 1.14) * (12 - materiaOrganica) + (3.25 * 2) + (2.5 * 3)) / (100 * 7.594);

        const anguloRad = Math.atan(anguloPendiente / 100) * (180 / Math.PI);
        const s = longitudPendiente < 5
            ? 3 * Math.pow(Math.sin(anguloRad * Math.PI / 180), 0.8) + 0.56
            : anguloPendiente < 9
            ? 10.8 * Math.sin(anguloRad * Math.PI / 180) + 0.03
            : 16.8 * Math.sin(anguloRad * Math.PI / 180) - 0.5;

        const maux = 0.1342 * Math.log(anguloPendiente) + 0.192;
        const l = Math.pow(longitudPendiente / 22.13, maux);

        const c = factorCValor;
        const pd = 0.6; // Ejemplo fijo
        const perdidaSuelo = r * k * l * s * c * pd;

        setResults({
            r: r.toFixed(4),
            m: m.toFixed(4),
            k: k.toFixed(4),
            l: l.toFixed(4),
            s: s.toFixed(4),
            c: c.toFixed(4),
            pd: pd.toFixed(4),
            perdidaSuelo: perdidaSuelo.toFixed(4),
        });
    };

    const cargarEjemplo = () => {
        setData({
            anguloPendiente: 2,
            numeroTormentas: 1,
            longitudPendiente: 150,
            limo: 44,
            arena: 22.5,
            arcilla: 33.5,
            materiaOrganica: 0.3,
            factores: {
                conservacion: "Cultivo en contorno",
                permeabilidad: "Muy lenta (<0.12 cm/h)",
                estructura: "Muy fina granular",
            },
            tormentas: [{ intensidad: 5, energia: 15 }],
            factorC: {
                tipoAltura: "Sin dosel apreciable",
                cobertura: 25,
                tipoCobertura: "G",
                porcentajeCobertura: 0,
            },
            factorCValor: 0.36,
        });
        setResults({
            r: 0,
            m: 0,
            k: 0,
            l: 0,
            s: 0,
            c: 0,
            pd: 0,
            perdidaSuelo: 0,
        });
    };

    const limpiar = () => {
        setData({
            anguloPendiente: '',
            numeroTormentas: '',
            longitudPendiente: '',
            limo: '',
            arena: '',
            arcilla: '',
            materiaOrganica: '',
            factores: {
                conservacion: '',
                permeabilidad: '',
                estructura: '',
            },
            tormentas: [],
            factorC: {
                tipoAltura: '',
                cobertura: '',
                tipoCobertura: '',
                porcentajeCobertura: '',
            },
            factorCValor: '',
        });
        setResults({
            r: 0,
            m: 0,
            k: 0,
            l: 0,
            s: 0,
            c: 0,
            pd: 0,
            perdidaSuelo: 0,
        });
    };

    return (
        <div>
            <h1>Ecuación de Suelo</h1>
            <div>
                <label>Ángulo de Inclinación de la Pendiente (grados): </label>
                <input type="number" name="anguloPendiente" value={data.anguloPendiente} onChange={handleInputChange} />
                <label>Número de Tormentas Erosivas: </label>
                <input type="number" name="numeroTormentas" value={data.numeroTormentas} onChange={handleInputChange} />
                <label>Longitud de la Pendiente (λm): </label>
                <input type="number" name="longitudPendiente" value={data.longitudPendiente} onChange={handleInputChange} />
                <label>Limo (%): </label>
                <input type="number" name="limo" value={data.limo} onChange={handleInputChange} />
                <label>Arena (%): </label>
                <input type="number" name="arena" value={data.arena} onChange={handleInputChange} />
                <label>Arcilla (%): </label>
                <input type="number" name="arcilla" value={data.arcilla} onChange={handleInputChange} />
                <label>Datos de Materia Orgánica MO (%): </label>
                <input type="number" name="materiaOrganica" value={data.materiaOrganica} onChange={handleInputChange} />
                <h3>Selecciones</h3>
                <label>Factor de Prácticas de Conservación (P): </label>
                <select name="conservacion" value={data.factores.conservacion} onChange={(e) => handleFactorChange(e, 'factores')}>
                    <option value="Cultivo en contorno">Cultivo en contorno</option>
                    <option value="Siembra directa">Siembra directa</option>
                    <option value="Terraceo">Terraceo</option>
                </select>
                <label>Permeabilidad (P): </label>
                <select name="permeabilidad" value={data.factores.permeabilidad} onChange={(e) => handleFactorChange(e, 'factores')}>
                    <option value="Muy lenta (<0.12 cm/h)">Muy lenta (&lt;0.12 cm/h)</option>
                    <option value="Lenta (0.12-2.0 cm/h)">Lenta (0.12-2.0 cm/h)</option>
                    <option value="Moderada (2.0-6.0 cm/h)">Moderada (2.0-6.0 cm/h)</option>
                    <option value="Rápida (6.0-12.5 cm/h)">Rápida (6.0-12.5 cm/h)</option>
                    <option value="Muy rápida (12.5-25 cm/h)">Muy rápida (12.5-25 cm/h)</option>
                    <option value="Extremadamente rápida (>25 cm/h)">Extremadamente rápida (&gt;25 cm/h)</option>
                </select>
                <label>Estructura del Suelo (e): </label>
                <select name="estructura" value={data.factores.estructura} onChange={(e) => handleFactorChange(e, 'factores')}>
                    <option value="Muy fina granular">Muy fina granular</option>
                    <option value="Fina granular">Fina granular</option>
                    <option value="Media granular">Media granular</option>
                    <option value="Gruesa granular">Gruesa granular</option>
                </select>
                <h3>Factor C</h3>
                <label>Tipo y Altura: </label>
                <select name="tipoAltura" value={data.factorC.tipoAltura} onChange={(e) => handleFactorChange(e, 'factorC')}>
                    <option value="Sin dosel apreciable">Sin dosel apreciable</option>
                    <option value="Hierva alta, maleza, caída de gota de 20 pulg o menos">
                        Hierva alta, maleza, caída de gota de 20 pulg o menos
                    </option>
                    <option value="Maleza de caída de gota de 6.5 pies">Maleza de caída de gota de 6.5 pies</option>
                    <option value="Árboles, sin maleza baja apreciable, caída de gota de 13 pies">
                        Árboles, sin maleza baja apreciable, caída de gota de 13 pies
                    </option>
                </select>
                <label>Cobertura (%): </label>
                <select name="cobertura" value={data.factorC.cobertura} onChange={(e) => handleFactorChange(e, 'factorC')}>
                    <option value={25}>25</option>
                    <option value={50}>50</option>
                    <option value={75}>75</option>
                </select>
                <label>Tipo de Cobertura: </label>
                <select name="tipoCobertura" value={data.factorC.tipoCobertura} onChange={(e) => handleFactorChange(e, 'factorC')}>
                    <option value="G">G</option>
                    <option value="W">W</option>
                </select>
                <label>Porcentaje de Cobertura: </label>
                <select name="porcentajeCobertura" value={data.factorC.porcentajeCobertura} onChange={(e) => handleFactorChange(e, 'factorC')}>
                    <option value={0}>0</option>
                    <option value={20}>20</option>
                    <option value={40}>40</option>
                    <option value={60}>60</option>
                    <option value={80}>80</option>
                    <option value={100}>100</option>
                </select>
                <label>Valor del Factor C: </label>
                <input
                    type="number"
                    name="factorCValor"
                    value={data.factorCValor}
                    onChange={handleInputChange}
                    step="0.01"
                />
            </div>
            <div>
                <button onClick={calcular}>Calcular</button>
                <button onClick={cargarEjemplo}>Cargar Ejemplo</button>
                <button onClick={limpiar}>Limpiar</button>
            </div>
            <div>
                <h2>Resultados</h2>
                <p>R: {results.r}</p>
                <p>M: {results.m}</p>
                <p>K: {results.k}</p>
                <p>L: {results.l}</p>
                <p>S: {results.s}</p>
                <p>C: {results.c}</p>
                <p>PD: {results.pd}</p>
                <p>Pérdida de Suelo: {results.perdidaSuelo}</p>
            </div>
        </div>
    );
};

export default EcuacionSuelo;
