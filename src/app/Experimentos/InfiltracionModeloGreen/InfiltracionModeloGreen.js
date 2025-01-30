import React, { useState } from 'react';

const ExperimentoInfiltracion = () => {
    const [porosidadEfectiva, setPorosidadEfectiva] = useState('');
    const [porosidad, setPorosidad] = useState('');
    const [cabezaSuccion, setCabezaSuccion] = useState('');
    const [conductividadHidraulica, setConductividadHidraulica] = useState('');
    const [tiempo, setTiempo] = useState('');
    const [saturacionEfectiva, setSaturacionEfectiva] = useState('');
    const [cambioContenidoHumedad, setCambioContenidoHumedad] = useState('');
    const [contenidoResidualHumedad, setContenidoResidualHumedad] = useState('');
    const [fInicial, setFInicial] = useState('');
    const [infiltracionAcumulada, setInfiltracionAcumulada] = useState('');
    const [tasaInfiltracion, setTasaInfiltracion] = useState('');
    const [intensidadLluvia, setIntensidadLluvia] = useState('');
    const [tiempoEncharcamiento, setTiempoEncharcamiento] = useState('');
    const [profundidadAguaInfiltrada, setProfundidadAguaInfiltrada] = useState('');
    const [calcularFInicial, setCalcularFInicial] = useState(false);

    const cargarEjemplo = () => {
        setPorosidadEfectiva(0.486);
        setPorosidad(0.501);
        setCabezaSuccion(16.68);
        setConductividadHidraulica(0.65);
        setTiempo(1);
        setSaturacionEfectiva(0.3);
        if (calcularFInicial) {
            setFInicial((1 * 0.65).toFixed(2));
        } else {
            setFInicial('');
        }
    };

    const limpiarCampos = () => {
        setPorosidadEfectiva('');
        setPorosidad('');
        setCabezaSuccion('');
        setConductividadHidraulica('');
        setTiempo('');
        setSaturacionEfectiva('');
        setCambioContenidoHumedad('');
        setContenidoResidualHumedad('');
        setFInicial('');
        setInfiltracionAcumulada('');
        setTasaInfiltracion('');
        setIntensidadLluvia('');
        setTiempoEncharcamiento('');
        setProfundidadAguaInfiltrada('');
        setCalcularFInicial(false);
    };

    const calcularPrimeraParte = () => {
        if (porosidad === '' || porosidadEfectiva === '' || saturacionEfectiva === '') {
            alert('Por favor, ingresa todos los datos necesarios para calcular.');
            return;
        }

        const n = parseFloat(porosidad);
        const ne = parseFloat(porosidadEfectiva);
        const se = parseFloat(saturacionEfectiva);

        const tetaR = (n - ne).toFixed(5);
        const deltaTeta = ((1 - se) * ne).toFixed(5);

        setContenidoResidualHumedad(tetaR);
        setCambioContenidoHumedad(deltaTeta);

        if (calcularFInicial && tiempo && conductividadHidraulica) {
            const F = (parseFloat(tiempo) * parseFloat(conductividadHidraulica)).toFixed(2);
            setFInicial(F);
        }
    };

    const handleCheckChange = () => {
        setCalcularFInicial((prev) => !prev);
        if (!calcularFInicial && tiempo && conductividadHidraulica) {
            const F = (parseFloat(tiempo) * parseFloat(conductividadHidraulica)).toFixed(2);
            setFInicial(F);
        }
    };

    const calcularSegundaParte = () => {
        if (
            fInicial === '' ||
            cabezaSuccion === '' ||
            conductividadHidraulica === '' ||
            cambioContenidoHumedad === ''
        ) {
            alert('Por favor, completa los datos necesarios para calcular la infiltración acumulada.');
            return;
        }

        let x1 = parseFloat(fInicial);
        let x = 0;
        const k = parseFloat(conductividadHidraulica);
        const CabSu = parseFloat(cabezaSuccion);
        const CConH = parseFloat(cambioContenidoHumedad);

        do {
            x1 = x;
            x = (k * tiempo + CabSu * CConH * Math.log(1 + x1 / (CabSu * CConH))).toFixed(5);
        } while (Math.abs(x1 - x) > 0.001);

        setInfiltracionAcumulada(x);

        const tasaInf = (k * ((CabSu * CConH) / x + 1)).toFixed(5);
        setTasaInfiltracion(tasaInf);
    };

    const calcularTerceraParte = () => {
        if (intensidadLluvia === '' || conductividadHidraulica === '' || cambioContenidoHumedad === '') {
            alert('Por favor, completa los datos necesarios para calcular el tiempo de encharcamiento.');
            return;
        }

        const IP = parseFloat(intensidadLluvia);
        const k = parseFloat(conductividadHidraulica);
        const CabSu = parseFloat(cabezaSuccion);
        const CConH = parseFloat(cambioContenidoHumedad);

        const TE = ((k * CabSu * CConH) / (IP * (IP - k))).toFixed(5);
        const PA = (IP * TE).toFixed(5);

        setTiempoEncharcamiento(TE);
        setProfundidadAguaInfiltrada(PA);
    };

    return (
        <div>
            <h1>Experimento de Infiltración</h1>
            <div>
                <h3>Datos de Entrada</h3>
                <label>Porosidad Efectiva: </label>
                <input
                    type="number"
                    value={porosidadEfectiva}
                    onChange={(e) => setPorosidadEfectiva(e.target.value)}
                />
                <br />
                <label>Porosidad: </label>
                <input
                    type="number"
                    value={porosidad}
                    onChange={(e) => setPorosidad(e.target.value)}
                />
                <br />
                <label>Cabeza de Succión en el Frente Mojado (cm): </label>
                <input
                    type="number"
                    value={cabezaSuccion}
                    onChange={(e) => setCabezaSuccion(e.target.value)}
                />
                <br />
                <label>Conductividad Hidráulica (K) (cm/h): </label>
                <input
                    type="number"
                    value={conductividadHidraulica}
                    onChange={(e) => setConductividadHidraulica(e.target.value)}
                />
                <br />
                <label>Tiempo (horas): </label>
                <input
                    type="number"
                    value={tiempo}
                    onChange={(e) => setTiempo(e.target.value)}
                />
                <br />
                <label>Saturación Efectiva Se: </label>
                <input
                    type="number"
                    value={saturacionEfectiva}
                    onChange={(e) => setSaturacionEfectiva(e.target.value)}
                />
                <br />
            </div>
            <div style={{ marginTop: '20px' }}>
                <button onClick={cargarEjemplo}>Ejemplo</button>
                <button onClick={calcularPrimeraParte} style={{ marginLeft: '10px' }}>
                    Calcular
                </button>
                <button onClick={limpiarCampos} style={{ marginLeft: '10px' }}>
                    Limpiar
                </button>
            </div>
            <div>
                <h3>Resultados</h3>
                <p>Contenido Residual de Humedad del Suelo: {contenidoResidualHumedad} Tanto x1</p>
                <p>Cambio en el Contenido de Humedad: {cambioContenidoHumedad} Tanto x1</p>
                <label>
                    <input
                        type="checkbox"
                        checked={calcularFInicial}
                        onChange={handleCheckChange}
                    />
                    F(t) = kt Calculado
                </label>
                <p>
                    F(t) Valor Inicial (Opcional):{' '}
                    <input
                        type="number"
                        value={fInicial}
                        onChange={(e) => setFInicial(e.target.value)}
                        placeholder="Opcional"
                    />{' '}
                    cm
                </p>
            </div>
            <div>
                <h3>INFILTRACIÓN ACUMULADA</h3>
                <button onClick={calcularSegundaParte}>Calcular F</button>
                <p>Infiltración Acumulada F: {infiltracionAcumulada} cm</p>
                <p>Tasa de Infiltración: {tasaInfiltracion} cm/h</p>
            </div>
            <div>
                <h3>TIEMPO DE ENCHARCAMIENTO</h3>
                <label>Intensidad de Lluvia (cm/h): </label>
                <input
                    type="number"
                    value={intensidadLluvia}
                    onChange={(e) => setIntensidadLluvia(e.target.value)}
                    placeholder="Ingrese un valor"
                />
                <br />
                <button onClick={calcularTerceraParte} style={{ marginTop: '10px' }}>
                    Calcular Tiempo de encharcamiento
                </button>
                <p>Tiempo de Encharcamiento: {tiempoEncharcamiento} horas</p>
                <p>Profundidad de Agua Infiltrada: {profundidadAguaInfiltrada} cm</p>
            </div>
        </div>
    );
};

export default ExperimentoInfiltracion;
