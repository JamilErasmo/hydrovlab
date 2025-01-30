import React, { useState } from 'react';

const ExperimentoSaturacion = () => {
    const [conductividad, setConductividad] = useState('');
    const [seccion, setSeccion] = useState('');
    const [volumenAgua, setVolumenAgua] = useState('');
    const [tiempoAplicado, setTiempoAplicado] = useState('');
    const [tiempoSaturacion, setTiempoSaturacion] = useState('');
    const [infiltracionAcumulada, setInfiltracionAcumulada] = useState(null);
    const [adsorcion, setAdsorcion] = useState(null);
    const [infiltracion, setInfiltracion] = useState(null);

    const cargarEjemplo = () => {
        setConductividad(0.4);
        setSeccion(40);
        setVolumenAgua(100);
        setTiempoAplicado(0.5);
        setTiempoSaturacion(0.25);
        setInfiltracionAcumulada(null);
        setAdsorcion(null);
        setInfiltracion(null);
    };

    const limpiarCampos = () => {
        setConductividad('');
        setSeccion('');
        setVolumenAgua('');
        setTiempoAplicado('');
        setTiempoSaturacion('');
        setInfiltracionAcumulada(null);
        setAdsorcion(null);
        setInfiltracion(null);
    };

    const calcularResultados = () => {
        if (!conductividad || !seccion || !volumenAgua || !tiempoAplicado || !tiempoSaturacion) {
            alert('Por favor, asegúrate de ingresar todos los datos necesarios.');
            return;
        }

        const VolAg = parseFloat(volumenAgua);
        const AreaSecT = parseFloat(seccion);
        const TSat = parseFloat(tiempoSaturacion);
        const k = parseFloat(conductividad);
        const TApli = parseFloat(tiempoAplicado);

        const infilAcum = (VolAg / AreaSecT).toFixed(3);
        const ads = (infilAcum / Math.sqrt(TSat)).toFixed(3);
        const infil = (((ads * Math.sqrt(TApli)) + (k * TApli)).toFixed(3));

        setInfiltracionAcumulada(infilAcum);
        setAdsorcion(ads);
        setInfiltracion(infil);
    };

    return (
        <div>
            <h1>Experimento de Saturación</h1>
            <div>
                <h3>Datos de Entrada</h3>
                <label>Sección Transversal (cm²): </label>
                <input
                    type="number"
                    value={seccion}
                    onChange={(e) => setSeccion(e.target.value)}
                />
                <br />
                <label>Tiempo de Saturación (h): </label>
                <input
                    type="number"
                    value={tiempoSaturacion}
                    onChange={(e) => setTiempoSaturacion(e.target.value)}
                />
                <br />
                <label>Volumen de Agua (cm³): </label>
                <input
                    type="number"
                    value={volumenAgua}
                    onChange={(e) => setVolumenAgua(e.target.value)}
                />
                <br />
                <label>Conductividad Hidráulica (cm/h): </label>
                <input
                    type="number"
                    value={conductividad}
                    onChange={(e) => setConductividad(e.target.value)}
                />
                <br />
                <label>Tiempo Aplicado (h): </label>
                <input
                    type="number"
                    value={tiempoAplicado}
                    onChange={(e) => setTiempoAplicado(e.target.value)}
                />
            </div>

            <div style={{ marginTop: '20px' }}>
                <button onClick={cargarEjemplo}>Ejemplo</button>
                <button onClick={calcularResultados} style={{ marginLeft: '10px' }}>
                    Calcular
                </button>
                <button onClick={limpiarCampos} style={{ marginLeft: '10px' }}>
                    Limpiar
                </button>
            </div>

            <div style={{ marginTop: '20px' }}>
                <h3>Resultados</h3>
                <p><strong>Infiltración Acumulada:</strong> {infiltracionAcumulada ? `${infiltracionAcumulada} cm` : ''}</p>
                <p><strong>Adsorción:</strong> {adsorcion ? `${adsorcion} cm-h^(-0.5)` : ''}</p>
                <p><strong>Infiltración:</strong> {infiltracion ? `${infiltracion} cm` : ''}</p>
            </div>
        </div>
    );
};

export default ExperimentoSaturacion;
