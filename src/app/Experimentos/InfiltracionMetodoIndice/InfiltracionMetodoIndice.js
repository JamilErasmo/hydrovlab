import React, { useState } from 'react';

const HidrogramaExperimento = () => {
    const [areaCuenca, setAreaCuenca] = useState('');
    const [numDatos, setNumDatos] = useState('');
    const [intervalosTiempo, setIntervalosTiempo] = useState('');
    const [picoX, setPicoX] = useState('');
    const [picoY, setPicoY] = useState('');
    const [p1X, setP1X] = useState('');
    const [p1Y, setP1Y] = useState('');
    const [p2X, setP2X] = useState('');
    const [p2Y, setP2Y] = useState('');
    const [listX, setListX] = useState([]);
    const [listY, setListY] = useState([]);
    const [volumenEscurrimientoDirecto, setVolumenEscurrimientoDirecto] = useState(null);
    const [hpe, setHpe] = useState(null);
    const [indiceFi, setIndiceFi] = useState(null);
    const [checkTiempo, setCheckTiempo] = useState(false);
    const [altura, setAltura] = useState('');

    const cargarEjemplo = () => {
        setAreaCuenca(36);
        setNumDatos(6);
        setIntervalosTiempo(1);
        setPicoX(10);
        setPicoY(8);
        setP1X(6);
        setP1Y(1);
        setP2X(16);
        setP2Y(1);
        setListX([1, 2, 3, 4, 5, 6]);
        setListY([5.35, 3.07, 2.79, 4.45, 2.2, 0.6]);
        setVolumenEscurrimientoDirecto(null);
        setHpe(null);
        setIndiceFi(null);
        setCheckTiempo(true);
    };

    const limpiarCampos = () => {
        setAreaCuenca('');
        setNumDatos('');
        setIntervalosTiempo('');
        setPicoX('');
        setPicoY('');
        setP1X('');
        setP1Y('');
        setP2X('');
        setP2Y('');
        setListX([]);
        setListY([]);
        setVolumenEscurrimientoDirecto(null);
        setHpe(null);
        setIndiceFi(null);
        setCheckTiempo(false);
        setAltura('');
    };

    const generarIntervalosConCheckbox = () => {
        if (!intervalosTiempo || !numDatos) {
            alert('Por favor, completa los campos de intervalos de tiempo y número de datos.');
            setCheckTiempo(false);
            return;
        }

        const intervalos = Array.from({ length: parseInt(numDatos) }, (_, i) => (i + 1) * parseFloat(intervalosTiempo));
        setListX(intervalos);
        alert('Intervalos de tiempo generados. Ahora puedes agregar alturas.');
    };

    const agregarAltura = () => {
        if (!altura || listY.length >= listX.length) {
            alert('Ingresa una altura válida o verifica que no hayas excedido el número de datos.');
            return;
        }

        setListY([...listY, parseFloat(altura)]);
        setAltura('');
    };

    const calcularResultados = () => {
        if (!areaCuenca || !numDatos || !picoX || !picoY || !p1X || !p1Y || !p2X || !p2Y || listY.length !== listX.length) {
            alert('Asegúrate de ingresar todos los datos necesarios correctamente.');
            return;
        }

        const p1x = parseFloat(p1X);
        const picox = parseFloat(picoX);
        const p2x = parseFloat(p2X);
        const p1y = parseFloat(p1Y);
        const picoy = parseFloat(picoY);
        const p2y = parseFloat(p2Y);
        const Ac = parseFloat(areaCuenca);

        const a1 = (p1x * picoy) + (picox * p2y) + (p2x * p1y);
        const a2 = (p1y * picox) + (picoy * p2x) + (p2y * p1x);
        const volumen = Math.abs(a1 - a2) / 2 * 3600;
        const hpeCalc = (volumen / (Ac * 1000000)) * 1000;

        let fi = 0.1;
        let inVecY = [];
        let b3 = 0;
        const int = parseFloat(intervalosTiempo);

        do {
            // eslint-disable-next-line no-loop-func
            inVecY = listY.map((y) => Math.max((y - fi) * int, 0));
            b3 = inVecY.reduce((sum, value) => sum + value, 0);
            fi += 0.001;
        } while (Math.abs(b3 - hpeCalc) > 0.001);

        setVolumenEscurrimientoDirecto(volumen.toFixed(2));
        setHpe(hpeCalc.toFixed(2));
        setIndiceFi(fi.toFixed(3));
    };

    return (
        <div>
            <h1>Infiltración Método Indice de Infiltración Media</h1>

            <h3>Datos de Entrada</h3>
            <label>Área Cuenca (Km²): </label>
            <input type="number" value={areaCuenca} onChange={(e) => setAreaCuenca(e.target.value)} />
            <br />
            <label>Número de Datos del Hietograma: </label>
            <input type="number" value={numDatos} onChange={(e) => setNumDatos(e.target.value)} />
            <br />

            <h3>Coordenadas del Triángulo</h3>
            <label>Pico X: </label>
            <input type="number" value={picoX} onChange={(e) => setPicoX(e.target.value)} />
            <br />
            <label>Pico Y: </label>
            <input type="number" value={picoY} onChange={(e) => setPicoY(e.target.value)} />
            <br />
            <label>P1 X Ascendente: </label>
            <input type="number" value={p1X} onChange={(e) => setP1X(e.target.value)} />
            <br />
            <label>P1 Y Ascendente: </label>
            <input type="number" value={p1Y} onChange={(e) => setP1Y(e.target.value)} />
            <br />
            <label>P2 X Descendente: </label>
            <input type="number" value={p2X} onChange={(e) => setP2X(e.target.value)} />
            <br />
            <label>P2 Y Descendente: </label>
            <input type="number" value={p2Y} onChange={(e) => setP2Y(e.target.value)} />
            <br />

            <h3>Hietograma</h3>
            <label>Intervalos de Tiempo (Horas): </label>
            <input type="number" value={intervalosTiempo} onChange={(e) => setIntervalosTiempo(e.target.value)} />
            <br />
            <label>Generar Intervalos de Tiempo:</label>
            <input
                type="checkbox"
                checked={checkTiempo}
                onChange={(e) => {
                    setCheckTiempo(e.target.checked);
                    if (e.target.checked) generarIntervalosConCheckbox();
                }}
            />
            <br />
            <label>Altura HP Hietograma (mm): </label>
            <input
                type="number"
                value={altura}
                onChange={(e) => setAltura(e.target.value)}
            />
            <button onClick={agregarAltura}>Agregar</button>
            <ul>
                {listX.map((x, i) => (
                    <li key={i}>
                        Tiempo: {x} horas - Altura: {listY[i] || 'Pendiente'} mm
                    </li>
                ))}
            </ul>

            <button onClick={cargarEjemplo}>Cargar Ejemplo</button>
            <button onClick={calcularResultados}>Calcular</button>
            <button onClick={limpiarCampos}>Limpiar</button>

            <h3>Resultados</h3>
            <p>Volumen de Escurrimiento Directo: {volumenEscurrimientoDirecto || 'Sin calcular'}</p>
            <p>HPE: {hpe || 'Sin calcular'} mm</p>
            <p>Índice Fi: {indiceFi || 'Sin calcular'} mm</p>
        </div>
    );
};

export default HidrogramaExperimento;
