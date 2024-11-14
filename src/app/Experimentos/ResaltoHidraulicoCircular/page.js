import React, { useState } from 'react';

const TiranteConjugadoCircular = () => {
    const [caudal, setCaudal] = useState('');
    const [diametro, setDiametro] = useState('');
    const [tiranteConjugado, setTiranteConjugado] = useState('');
    const [tiranteInicial, setTiranteInicial] = useState('');
    const [resultados, setResultados] = useState({
        energiaE: '',
        perdidaEnergiaE3: '',
        alturaResaltoY3: '',
        mensajeFlujo: ''
    });

    // Función para cargar los valores de ejemplo
    const cargarEjemplo = () => {
        setCaudal(2);
        setDiametro(2);
        setTiranteConjugado(0.5);
        setTiranteInicial(0.9);
    };

    // Función para limpiar los campos
    const limpiarCampos = () => {
        setCaudal('');
        setDiametro('');
        setTiranteConjugado('');
        setTiranteInicial('');
        setResultados({
            energiaE: '',
            perdidaEnergiaE3: '',
            alturaResaltoY3: '',
            mensajeFlujo: ''
        });
    };

    // Función para calcular el área sumergida en una sección circular
    const calcularArea = (tirante, diametro) => {
        const radio = diametro / 2;
        if (tirante >= diametro) {
            return Math.PI * Math.pow(radio, 2); // Área total si el tirante cubre todo el diámetro
        }
        const angulo = 2 * Math.acos(1 - (tirante / radio)); // Ángulo en radianes
        const area = (Math.pow(radio, 2) / 2) * (angulo - Math.sin(angulo)); // Área sumergida
        return area;
    };

    // Función para calcular la energía
    const calcularEnergia = (caudal, tirante, diametro) => {
        const g = 9.81; // gravedad
        const area = calcularArea(tirante, diametro);
        const energia = tirante + (Math.pow(caudal, 2) / (2 * g * Math.pow(area, 2)));
        return energia;
    };

    // Función para calcular el tirante conjugado
    const calcular = () => {
        let Q = parseFloat(caudal);
        let D = parseFloat(diametro);
        let y1 = parseFloat(tiranteConjugado);
        let y2 = parseFloat(tiranteInicial);

        if (isNaN(Q) || isNaN(D) || isNaN(y1) || isNaN(y2)) {
            alert("Por favor, asegúrate de que todos los campos tengan valores numéricos válidos.");
            return;
        }

        try {
            // Energía inicial y final
            const E1 = calcularEnergia(Q, y1, D);
            const E2 = calcularEnergia(Q, y2, D);

            // Cálculos de pérdida de energía y altura del resalto
            const E3 = Math.abs(E1 - E2); // Pérdida de energía
            const y3 = Math.abs(y2 - y1); // Altura del resalto hidráulico

            // Determinar si el flujo es subcrítico o supercrítico
            let mensajeFlujo = '';
            if (y2 > y1) {
                mensajeFlujo = "El tirante es subcrítico";
            } else {
                mensajeFlujo = "El tirante es supercrítico";
            }

            // Mostrar resultados
            setResultados({
                energiaE: E2.toFixed(12),  // Energía final
                perdidaEnergiaE3: E3.toFixed(16),  // Pérdida de energía
                alturaResaltoY3: y3.toFixed(12),  // Altura del resalto
                mensajeFlujo  // Mensaje sobre el flujo
            });
        } catch (error) {
            console.error("Error en el cálculo:", error);
            alert("Ha ocurrido un error en los cálculos. Verifica los datos de entrada o revisa los cálculos.");
        }
    };

    return (
        <div>
            <h1>Análisis de Tirante Conjugado en Sección Circular</h1>

            <div>
                <h3>Datos de Entrada</h3>
                <label>Caudal Q (m³/s): </label>
                <input type="number" value={caudal} onChange={(e) => setCaudal(e.target.value)} /><br />

                <label>Diámetro D (m): </label>
                <input type="number" value={diametro} onChange={(e) => setDiametro(e.target.value)} /><br />

                <label>Tirante Conjugado Y1 (m): </label>
                <input type="number" value={tiranteConjugado} onChange={(e) => setTiranteConjugado(e.target.value)} /><br />

                <label>Valor Inicial del Tirante Y2 (m): </label>
                <input type="number" value={tiranteInicial} onChange={(e) => setTiranteInicial(e.target.value)} /><br />
            </div>

            <div style={{ marginTop: '20px' }}>
                <button onClick={cargarEjemplo}>Ejemplo</button>
                <button onClick={calcular} style={{ marginLeft: '10px' }}>Calcular</button>
                <button onClick={limpiarCampos} style={{ marginLeft: '10px' }}>Limpiar</button>
            </div>

            {resultados.energiaE && (
                <div style={{ marginTop: '30px' }}>
                    <h2>Resultados</h2>
                    <p>ENERGÍA E: {resultados.energiaE}</p>
                    <p>PERDIDA DE ENERGÍA E3: {resultados.perdidaEnergiaE3}</p>
                    <p>ALTURA DEL RESALTO HIDRÁULICO Y3: {resultados.alturaResaltoY3} m</p>
                    <p>{resultados.mensajeFlujo}</p> {/* Mostrar el mensaje de flujo */}
                </div>
            )}
        </div>
    );
};

export default TiranteConjugadoCircular;
