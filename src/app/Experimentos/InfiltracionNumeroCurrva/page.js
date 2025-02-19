'use client';
import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';

const NumeroCurvaYTiempoConcentracion = () => {
    const [areaCuenca, setAreaCuenca] = useState('');
    const [longitudCauce, setLongitudCauce] = useState('');
    const [pendienteCauce, setPendienteCauce] = useState('');
    const [precipitacionTotal, setPrecipitacionTotal] = useState('');
    const [usoTierra, setUsoTierra] = useState('');
    const [tratamientoSuelo, setTratamientoSuelo] = useState('');
    const [pendienteTerreno, setPendienteTerreno] = useState('');
    const [tipoSuelo, setTipoSuelo] = useState('');
    const [selectedCheck, setSelectedCheck] = useState('CN2');
    const [CN1, setCN1] = useState(null);
    const [CN2, setCN2] = useState(null);
    const [CN3, setCN3] = useState(null);
    const [precipitacionEfectiva, setPrecipitacionEfectiva] = useState(null);
    const [retencionSuperficial, setRetencionSuperficial] = useState(null);
    const [tcKirpich, setTcKirpich] = useState(null);
    const [tcCalifornia, setTcCalifornia] = useState(null);
    const [tcGiandotti, setTcGiandotti] = useState(null);
    const [tcTemez, setTcTemez] = useState(null);
    const [tcDefinitivo, setTcDefinitivo] = useState(null);
    const [hidrogramaParams, setHidrogramaParams] = useState(null);
    const [graficaDatos, setGraficaDatos] = useState(null);

    const usoTierraOpciones = [
        'Sin cultivo',
        'Cereales',
        'Leguminosas',
        'Pastos altos',
        'Pastos bajos',
        'Bosques de coníferas',
        'Bosques de hojas anchas',
        'Matorrales densos',
        'Matorrales dispersos',
        'Zonas urbanas densas',
        'Zonas urbanas dispersas',
        'Zonas desérticas',
        'Zonas agrícolas con terrazas',
        'Zonas agrícolas sin terrazas',
    ];

    const calcularCN = () => {
        let CN2Calculado = 77;
        if (usoTierra === 'Sin cultivo') {
            CN2Calculado = 77;
        }
        const CN1Calculado = (4.2 * CN2Calculado) / (10 - 0.058 * CN2Calculado);
        const CN3Calculado = (23 * CN2Calculado) / (10 + 0.13 * CN2Calculado);

        setCN1(Math.round(CN1Calculado));
        setCN2(Math.round(CN2Calculado));
        setCN3(Math.round(CN3Calculado));
        return CN2Calculado;
    };

    const calcularRetencionSuperficial = (CN2) => {
        const S = (25400 / CN2) - 254;
        setRetencionSuperficial(S.toFixed(2));
        return S;
    };

    const calcularPrecipitacionEfectiva = (CN2, S) => {
        if (precipitacionTotal) {
            const Pe = Math.pow(precipitacionTotal - (0.2 * S), 2) / (precipitacionTotal + (0.8 * S));
            setPrecipitacionEfectiva(Pe.toFixed(0));
        }
    };

    const calcularTiempoConcentracion = () => {
        const ac = parseFloat(areaCuenca);
        const L = parseFloat(longitudCauce);
        const J = parseFloat(pendienteCauce);

        if (!isNaN(ac) && !isNaN(L) && !isNaN(J) && ac > 0 && L > 0 && J > 0) {
            const Tc_k = (3.97 * Math.pow(L, 0.77) * Math.pow(J, -0.385)) / 60;
            setTcKirpich(Tc_k.toFixed(3));

            const Tc_C = 0.066 * Math.pow(L / Math.sqrt(J), 0.77);
            setTcCalifornia(Tc_C.toFixed(3));

            const Tc_G = (4 * Math.sqrt(ac) + 1.5 * L) / (25.3 * Math.sqrt(J * L));
            setTcGiandotti(Tc_G.toFixed(3));

            const Tc_T = 0.3 * Math.pow(L / Math.pow(J, 0.25), 0.77);
            setTcTemez(Tc_T.toFixed(3));

            setTcDefinitivo(Tc_k.toFixed(3));
        }
    };
    
    const calcularHidrograma = () => {
        const tr = (0.6 * tcDefinitivo).toFixed(3);
        const de = (2 * Math.sqrt(tcDefinitivo)).toFixed(3);
        const tp = (parseFloat(de) / 2 + parseFloat(tr)).toFixed(3);
        const tb = (2.67 * parseFloat(tp)).toFixed(3);

        // Fórmula corregida para Qp
        const qp = (0.208 * areaCuenca) / tp;
        const Q_p = (qp * precipitacionEfectiva).toFixed(3);

        setHidrogramaParams({
            tr: parseFloat(tr),
            de: parseFloat(de),
            tp: parseFloat(tp),
            tb: parseFloat(tb),
            Qp: parseFloat(Q_p),
        });

        // Preparar los datos para la gráfica triangular
        const array_Tr_x = [0, parseFloat(tp), parseFloat(tb)];
        const array_Tr_y = [0, parseFloat(Q_p), 0];

        setGraficaDatos({
            labels: array_Tr_x,
            datasets: [
                {
                    label: 'Hidrograma Triangular',
                    data: array_Tr_y,
                    borderColor: 'rgba(75,192,192,1)',
                    backgroundColor: 'rgba(75,192,192,0.2)',
                    tension: 0.4,
                },
            ],
        });
    };

    const calcularHidrogramaUnitario = () => {
        const t_tp = [
            0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1.0,
            1.1, 1.2, 1.3, 1.4, 1.5, 1.6, 1.8, 2.0, 2.2, 2.4,
            2.6, 2.8, 3.0, 3.5, 4.0, 4.5, 5.0,
        ];
        const Q_Qp = [
            0, 0.015, 0.075, 0.16, 0.28, 0.43, 0.6, 0.77, 0.89, 0.97, 1.0,
            0.98, 0.92, 0.84, 0.75, 0.65, 0.57, 0.43, 0.32, 0.24, 0.18,
            0.13, 0.098, 0.075, 0.036, 0.018, 0.009, 0.004,
        ];

        const tp = parseFloat(hidrogramaParams.tp);
        const Qpico = parseFloat(hidrogramaParams.Qp);

        const array_x = t_tp.map((t) => (t * tp).toFixed(3));
        const array_y = Q_Qp.map((q) => (q * Qpico).toFixed(3));

        setGraficaDatos({
            labels: array_x,
            datasets: [
                {
                    label: 'Hidrograma Unitario SCS',
                    data: array_y,
                    borderColor: 'rgba(255,99,132,1)',
                    backgroundColor: 'rgba(255,99,132,0.2)',
                    tension: 0.4,
                },
            ],
        });
    };

    useEffect(() => {
        if (precipitacionTotal) {
            const CN2 = calcularCN();
            const S = calcularRetencionSuperficial(CN2);
            calcularPrecipitacionEfectiva(CN2, S);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [usoTierra, tratamientoSuelo, pendienteTerreno, tipoSuelo, precipitacionTotal]);

    const cargarEjemplo = () => {
        setAreaCuenca(25);
        setLongitudCauce(9);
        setPendienteCauce(0.011);
        setPrecipitacionTotal(200);
        setUsoTierra('Sin cultivo');
        setTratamientoSuelo('Surcos rectos');
        setPendienteTerreno('> 1');
        setTipoSuelo('Tipo A');
        setSelectedCheck('CN2');

        const CN2 = calcularCN();
        const S = calcularRetencionSuperficial(CN2);
        calcularPrecipitacionEfectiva(CN2, S);
        calcularTiempoConcentracion();
    };

    const limpiarCampos = () => {
        setAreaCuenca('');
        setLongitudCauce('');
        setPendienteCauce('');
        setPrecipitacionTotal('');
        setUsoTierra('');
        setTratamientoSuelo('');
        setPendienteTerreno('');
        setTipoSuelo('');
        setCN1(null);
        setCN2(null);
        setCN3(null);
        setSelectedCheck('');
        setPrecipitacionEfectiva(null);
        setRetencionSuperficial(null);
        setTcKirpich(null);
        setTcCalifornia(null);
        setTcGiandotti(null);
        setTcTemez(null);
        setTcDefinitivo(null);
        setHidrogramaParams(null);
    };

    return (
        <div>
            <h1>Cálculo del Número de Curva (CN) y Tiempo de Concentración</h1>
    
            {/* Sección de Datos de Entrada */}
            <div>
                <h3>Datos de Entrada</h3>
                <label>Área de la Cuenca Ac (km²): </label>
                <input
                    type="number"
                    value={areaCuenca}
                    onChange={(e) => setAreaCuenca(e.target.value)}
                />
                <br />
                <label>Longitud del Cauce Principal L (km): </label>
                <input
                    type="number"
                    value={longitudCauce}
                    onChange={(e) => setLongitudCauce(e.target.value)}
                />
                <br />
                <label>Pendiente Media del Cauce J (m/m): </label>
                <input
                    type="number"
                    value={pendienteCauce}
                    onChange={(e) => setPendienteCauce(e.target.value)}
                />
                <br />
                <label>Precipitación Total Pt (mm): </label>
                <input
                    type="number"
                    value={precipitacionTotal}
                    onChange={(e) => setPrecipitacionTotal(e.target.value)}
                />
                <br />
                <label>Uso de la Tierra y Cobertura: </label>
                <select value={usoTierra} onChange={(e) => setUsoTierra(e.target.value)}>
                    <option value="">Seleccionar</option>
                    {usoTierraOpciones.map((opcion, index) => (
                        <option key={index} value={opcion}>
                            {opcion}
                        </option>
                    ))}
                </select>
                <br />
                <label>Tratamiento del Suelo: </label>
                <select value={tratamientoSuelo} onChange={(e) => setTratamientoSuelo(e.target.value)}>
                    <option value="">Seleccionar</option>
                    <option value="Surcos rectos">Surcos rectos</option>
                    <option value="Contorneo">Contorneo</option>
                    <option value="Terrazas">Terrazas</option>
                    <option value="No definido">No definido</option>
                </select>
                <br />
                <label>Pendiente del Terreno (%): </label>
                <select value={pendienteTerreno} onChange={(e) => setPendienteTerreno(e.target.value)}>
                    <option value="">Seleccionar</option>
                    <option value="> 1">&gt; 1</option>
                    <option value="< 1">&lt; 1</option>
                    <option value="No definido">No definido</option>
                </select>
                <br />
                <label>Tipo de Suelo: </label>
                <select value={tipoSuelo} onChange={(e) => setTipoSuelo(e.target.value)}>
                    <option value="">Seleccionar</option>
                    <option value="Tipo A">Tipo A</option>
                    <option value="Tipo B">Tipo B</option>
                    <option value="Tipo C">Tipo C</option>
                    <option value="Tipo D">Tipo D</option>
                </select>
                <br />
            </div>
    
            {/* Resultados del Número de Curva (CN) */}
            <div>
                <h3>Resultados del Número de Curva (CN)</h3>
                <label>
                    CN1:
                    <input type="radio" name="cnSelect" checked={selectedCheck === 'CN1'} onChange={() => setSelectedCheck('CN1')} />
                </label>
                <input type="text" value={CN1 !== null ? CN1 : ''} readOnly />
                <br />
                <label>
                    CN2:
                    <input type="radio" name="cnSelect" checked={selectedCheck === 'CN2'} onChange={() => setSelectedCheck('CN2')} />
                </label>
                <input type="text" value={CN2 !== null ? CN2 : ''} readOnly />
                <br />
                <label>
                    CN3:
                    <input type="radio" name="cnSelect" checked={selectedCheck === 'CN3'} onChange={() => setSelectedCheck('CN3')} />
                </label>
                <input type="text" value={CN3 !== null ? CN3 : ''} readOnly />
                <br />
                <label>Precipitación Efectiva Pe (mm): </label>
                <input type="text" value={precipitacionEfectiva || ''} readOnly />
                <br />
                <label>Retención Superficial (mm): </label>
                <input type="text" value={retencionSuperficial || ''} readOnly />
            </div>

            {/* Botones principales bajo los datos de entrada */}
            <div style={{ marginTop: '20px' }}>
                <button onClick={cargarEjemplo}>Ejemplo</button>
                <button onClick={calcularTiempoConcentracion} style={{ marginLeft: '10px' }}>Calcular</button>
                <button onClick={limpiarCampos} style={{ marginLeft: '10px' }}>Limpiar</button>
            </div>
    
            {/* Resultados del Tiempo de Concentración */}
            <div>
                <h3>Resultados del Tiempo de Concentración</h3>
                {tcKirpich && <p><strong>Fórmula de Kirpich (h):</strong> {tcKirpich}</p>}
                {tcCalifornia && <p><strong>Fórmula California del U.S.B.R (h):</strong> {tcCalifornia}</p>}
                {tcGiandotti && <p><strong>Fórmula de Giandotti (h):</strong> {tcGiandotti}</p>}
                {tcTemez && <p><strong>Fórmula de Temez (h):</strong> {tcTemez}</p>}
                {tcDefinitivo && <p><strong>Tiempo de Concentración Definitivo Tc (h):</strong> {tcDefinitivo}</p>}
            </div>
    
            {/* Botón para Graficar Hidrogramas */}
            {tcDefinitivo && (
                <div style={{ marginTop: '20px' }}>
                    <button onClick={calcularHidrograma}>Graficar Hidrogramas</button>
                </div>
            )}
    
            {/* Resultados del Hidrograma */}
            {hidrogramaParams && (
                <div>
                    <h3>Parámetros para la Construcción del Hidrograma</h3>
                    <p><strong>Tiempo de Retraso tr (h):</strong> {hidrogramaParams.tr}</p>
                    <p><strong>Duración de Retraso de (h):</strong> {hidrogramaParams.de}</p>
                    <p><strong>Tiempo Pico tp (h):</strong> {hidrogramaParams.tp}</p>
                    <p><strong>Tiempo Base tb (h):</strong> {hidrogramaParams.tb}</p>
                    <p><strong>Caudal Pico Qp (m³/s):</strong> {hidrogramaParams.Qp}</p>

                    {/* Botones para graficar */}
                    <div style={{ marginTop: '20px' }}>
                        <button onClick={calcularHidrograma}>Graficar Hidrograma Triangular</button>
                        <button onClick={calcularHidrogramaUnitario} style={{ marginLeft: '10px' }}>
                            Graficar Hidrograma Unitario
                        </button>
                    </div>
                </div>
            )}

            {/* Gráfica */}
            {graficaDatos && (
                <div style={{ width: '600px'}}>
                    <h3>Gráfica del Hidrograma</h3>
                    <Line data={graficaDatos} />
                </div>
            )}
        </div>
    );
};

export default NumeroCurvaYTiempoConcentracion;