'use client';
import React, { useState } from 'react';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import CalculateIcon from '@mui/icons-material/Calculate';
import DeleteIcon from '@mui/icons-material/Delete';
import BackButton from "@/components/BackButton";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const EfectoSuelo = () => {
  // Estados para los valores de entrada
  const [inputValues, setInputValues] = useState({
    areaCuenca: '',
    longitudCauce: '',
    pendienteMedia: '',
    precipitacionTotal: '',
    usoTierra: '',
    tratamientoSuelo: '',
    pendienteTerreno: '',
    tipoSuelo: ''
  });
  // Estado para la selección de CN (opciones: "CN1", "CN2", "CN3")
  const [selectedCN, setSelectedCN] = useState("CN2");
  // Estados para los CN calculados
  const [cnValues, setCnValues] = useState({
    CN1: '',
    CN2: '',
    CN3: ''
  });
  // Estados para los cálculos hidrológicos generales
  const [calcValues, setCalcValues] = useState({
    Tc: '',
    pEfectiva: '',
    tr: '',
    d_e: '',
    tp: '',
    tb: '',
    Qpico: ''
  });
  // Estados para los Tc calculados con las fórmulas
  const [tcValues, setTcValues] = useState({
    Tc_k: '',
    Tc_C: '',
    Tc_G: '',
    Tc_T: '',
    Tc_def: ''
  });
  // Estado para los datos de las gráficas
  const [chartData, setChartData] = useState({
    triangular: null,
    scs: null,
  });
  // Estado para el listado final de resultados
  const [resultListing, setResultListing] = useState('');
  // Estado para mensajes de error
  const [error, setError] = useState('');
  // Estado para el modal de la tabla CN
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Función para redondear a tres decimales
  const roundToThree = (num) => Math.round(num * 1000) / 1000;

  // Manejo de cambios en los inputs
  const handleChange = (e) => {
    const { name, value } = e.target;
    setInputValues(prev => ({ ...prev, [name]: value }));
    setError('');
  };

  // Manejo de la selección de CN
  const handleCNSelection = (e) => {
    setSelectedCN(e.target.value);
  };

  // Fórmula para calcular la precipitación efectiva:
  // Pe = ((Pt/10 - 508/CN + 5.08)^2 / (Pt/10 + 2032/CN - 20.32)) * 10
  const calculatePEfectiva = (pt, CN) => {
    if (pt === 0) return 0;
    const ptDiv10 = pt / 10;
    return ((ptDiv10 - (508 / CN) + 5.08) ** 2 / (ptDiv10 + (2032 / CN) - 20.32)) * 10;
  };

  // Función para calcular el CN base
  const calculateCN2 = () => {
    const { usoTierra, pendienteTerreno, tipoSuelo } = inputValues;
    let CN_2 = 0;
    if (usoTierra === 'Sin cultivos') {
      CN_2 = 77;
    } else if (usoTierra === 'Cultivos en surcos') {
      if (pendienteTerreno === '>1%') {
        if (tipoSuelo === 'Tipo A') CN_2 = 72;
        if (tipoSuelo === 'Tipo B') CN_2 = 81;
        if (tipoSuelo === 'Tipo C') CN_2 = 88;
        if (tipoSuelo === 'Tipo D') CN_2 = 91;
      } else if (pendienteTerreno === '<1%') {
        if (tipoSuelo === 'Tipo A') CN_2 = 67;
        if (tipoSuelo === 'Tipo B') CN_2 = 78;
        if (tipoSuelo === 'Tipo C') CN_2 = 85;
        if (tipoSuelo === 'Tipo D') CN_2 = 89;
      } else {
        CN_2 = 77;
      }
    } else if (usoTierra === 'Cereales' || usoTierra === 'Leguminosas') {
      CN_2 = 77;
    } else {
      CN_2 = 77;
    }
    return CN_2;
  };

  // Función principal para realizar los cálculos
  const calcular = () => {
    const { areaCuenca, longitudCauce, pendienteMedia, precipitacionTotal } = inputValues;
    if (!areaCuenca || !longitudCauce || !pendienteMedia || !precipitacionTotal ||
        !inputValues.usoTierra || !inputValues.tratamientoSuelo ||
        !inputValues.pendienteTerreno || !inputValues.tipoSuelo) {
      setError("Por favor, complete todos los campos.");
      return;
    }
    const area = parseFloat(areaCuenca);
    const L = parseFloat(longitudCauce);
    const J = parseFloat(pendienteMedia);
    const pt = parseFloat(precipitacionTotal);
    if (isNaN(area) || isNaN(L) || isNaN(J) || isNaN(pt)) {
      setError("Por favor, ingrese valores numéricos válidos.");
      return;
    }
    // Calcular CN base y sus variantes
    const CN2 = calculateCN2();
    const CN1 = (4.2 * CN2) / (10 - 0.058 * CN2);
    const CN3 = (23 * CN2) / (10 + 0.13 * CN2);
    setCnValues({
      CN1: CN1.toFixed(0),
      CN2: CN2.toFixed(0),
      CN3: CN3.toFixed(0)
    });
    // Seleccionar el CN a usar según la opción seleccionada
    const selectedCNValue = selectedCN === "CN1" ? CN1 : selectedCN === "CN2" ? CN2 : CN3;
    const pEfectiva = roundToThree(calculatePEfectiva(pt, selectedCNValue));
    // Calcular Tc usando la fórmula de Kirpich (se usan L y J)
    const Tc_k = (3.97 * Math.pow(L, 0.77) * Math.pow(J, -0.385)) / 60;
    const Tc_C = 0.066 * Math.pow(L / Math.pow(J, 0.5), 0.77);
    const Tc_G = (4 * Math.sqrt(area) + 1.5 * L) / (25.3 * Math.sqrt(J * L));
    const Tc_T = 0.3 * Math.pow(L / Math.pow(J, 0.25), 0.77);
    // Se toma como definitivo el de Kirpich
    const Tc_def = Tc_k;
    setCalcValues(prev => ({
      ...prev,
      Tc: roundToThree(Tc_def),
      pEfectiva: pEfectiva
    }));
    setTcValues({
      Tc_k: roundToThree(Tc_k),
      Tc_C: roundToThree(Tc_C),
      Tc_G: roundToThree(Tc_G),
      Tc_T: roundToThree(Tc_T),
      Tc_def: roundToThree(Tc_def)
    });
  };

  // Función para graficar los hidrogramas y generar el listado final
  const graficarHidrogramas = () => {
    const { Tc, pEfectiva } = calcValues;
    const area = parseFloat(inputValues.areaCuenca);
    if (!Tc || !pEfectiva || isNaN(Tc) || isNaN(pEfectiva)) {
      setError("Error en el cálculo. Asegúrese de haber calculado previamente.");
      return;
    }
    // Cálculos hidrológicos:
    const tr = 0.6 * Tc;
    const d_e = 2 * Math.sqrt(Tc);
    const tp = d_e / 2 + tr;
    const tb = 2.67 * tp;
    const qp = (0.208 * area) / tp;
    const Qpico = qp * pEfectiva;
    setCalcValues(prev => ({
      ...prev,
      tr: roundToThree(tr),
      d_e: roundToThree(d_e),
      tp: roundToThree(tp),
      tb: roundToThree(tb),
      Qpico: roundToThree(Qpico)
    }));
  
    // Generar la gráfica del Hidrograma Triangular usando 101 puntos
    const numPointsTri = 101;
    const triangularLabels = Array.from({ length: numPointsTri }, (_, i) =>
      roundToThree((i * tb) / (numPointsTri - 1))
    );
    const triangularDataValues = triangularLabels.map(t => {
      if (t <= tp) {
        return roundToThree((Qpico / tp) * t);
      } else {
        return roundToThree((Qpico / (tb - tp)) * (tb - t));
      }
    });
    const triangularData = {
      labels: triangularLabels.map(val => val.toFixed(3)),
      datasets: [
        {
          label: 'Hidrograma Triangular',
          data: triangularDataValues,
          borderColor: 'rgba(75,192,192,1)',
          fill: false,
        },
      ],
    };
  
    // Para la curva SCS, definimos arrays fijos con 28 valores:
    const tCoeffs = [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1.0, 1.1, 1.2, 1.3, 1.4, 1.5, 1.6, 1.8, 2.0, 2.2, 2.4, 2.6, 2.8, 3.0, 3.5, 4.0, 4.5, 5.0];
    const qCoeffs = [0, 0.015, 0.075, 0.16, 0.28, 0.43, 0.6, 0.77, 0.89, 0.97,
                     1.0, 0.98, 0.92, 0.84, 0.75, 0.65, 0.57, 0.43, 0.32, 0.24,
                     0.18, 0.13, 0.098, 0.075, 0.036, 0.018, 0.009, 0.004];
  
    const scsData = {
      labels: tCoeffs.map(val => roundToThree(val * tp).toFixed(3)),
      datasets: [
        {
          label: 'Hidrograma SCS',
          data: qCoeffs.map(val => roundToThree(val * Qpico).toFixed(3)),
          borderColor: 'rgba(153,102,255,1)',
          fill: false,
        },
      ],
    };
  
    setChartData({
      triangular: triangularData,
      scs: scsData,
    });
  
    // Generar el listado final EXACTO
    const selectedCNValue = selectedCN === "CN1" ? cnValues.CN1 : selectedCN === "CN2" ? cnValues.CN2 : cnValues.CN3;
    let listing = "RESULTADOS DE LA SIMULACIÓN\n\n";
    listing += "EFECTO DEL USO DEL SUELO EN LA TORMENTA\n\n";
    listing += "HIDROGRAMA DEL S.C.S\n\n";
    listing += `CN =\t\t${selectedCNValue}\n\n`;
    listing += `Pe(mm)=\t\t${calcValues.pEfectiva}\n\n`;
    listing += `Qp(m³/s) =\t${calcValues.Qpico}\n\n`;
    listing += "t(h)\t\tQ(m³/s)\n";
    tCoeffs.forEach((coef, index) => {
      const tVal = roundToThree(coef * tp).toFixed(3);
      const qVal = roundToThree(coef * Qpico).toFixed(3);
      listing += `${tVal}\t\t${qVal}\n`;
    });
    setResultListing(listing);
  };
  
  // Función de ejemplo: asigna los valores solicitados
  const fillExampleValues = () => {
    setInputValues({
      areaCuenca: '25',
      longitudCauce: '9',
      pendienteMedia: '0.011',
      precipitacionTotal: '200',
      usoTierra: 'Sin cultivos',
      tratamientoSuelo: 'Surcos rectos',
      pendienteTerreno: 'No definido',
      tipoSuelo: 'Tipo A'
    });
    setSelectedCN("CN2");
    setCnValues({ CN1: '', CN2: '', CN3: '' });
    setCalcValues({ Tc: '', pEfectiva: '', tr: '', d_e: '', tp: '', tb: '', Qpico: '' });
    setTcValues({ Tc_k: '', Tc_C: '', Tc_G: '', Tc_T: '', Tc_def: '' });
    setChartData({ triangular: null, scs: null });
    setResultListing('');
    setError('');
  };
  
  const clearFields = () => {
    setInputValues({
      areaCuenca: '',
      longitudCauce: '',
      pendienteMedia: '',
      precipitacionTotal: '',
      usoTierra: '',
      tratamientoSuelo: '',
      pendienteTerreno: '',
      tipoSuelo: ''
    });
    setSelectedCN("CN2");
    setCnValues({ CN1: '', CN2: '', CN3: '' });
    setCalcValues({ Tc: '', pEfectiva: '', tr: '', d_e: '', tp: '', tb: '', Qpico: '' });
    setTcValues({ Tc_k: '', Tc_C: '', Tc_G: '', Tc_T: '', Tc_def: '' });
    setChartData({ triangular: null, scs: null });
    setResultListing('');
    setError('');
  };
  
  return (
    <div className="container mx-auto max-w-3xl p-4">
      <BackButton />
      <h1 className="text-2xl font-semibold text-gray-800 mb-4 text-center">
        Efecto del Uso del Suelo en la Tormenta
      </h1>
  
      {/* Sección de Entrada de Datos con imagen al lado */}
      <div className="bg-white p-6 shadow-md rounded-lg border border-gray-300">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Entrada de Datos</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Columna de Inputs */}
          <div className="grid grid-cols-1 gap-4">
            {/* ... Aquí van los inputs y selects ... */}
            <div className="flex flex-col">
              <label className="text-gray-700 font-medium">Área de la Cuenca (km²):</label>
              <input type="text" name="areaCuenca" value={inputValues.areaCuenca} onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-lg" />
            </div>
            <div className="flex flex-col">
              <label className="text-gray-700 font-medium">Longitud del Cauce (km):</label>
              <input type="text" name="longitudCauce" value={inputValues.longitudCauce} onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-lg" />
            </div>
            <div className="flex flex-col">
              <label className="text-gray-700 font-medium">Pendiente Media del Cauce (m/m):</label>
              <input type="text" name="pendienteMedia" value={inputValues.pendienteMedia} onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-lg" />
            </div>
            <div className="flex flex-col">
              <label className="text-gray-700 font-medium">Precipitación Total Pt (mm):</label>
              <input type="text" name="precipitacionTotal" value={inputValues.precipitacionTotal} onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-lg" />
            </div>
            <div className="flex flex-col">
              <label className="text-gray-700 font-medium">Uso de la Tierra y Cobertura:</label>
              <select name="usoTierra" value={inputValues.usoTierra} onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-lg bg-white">
                <option value="" disabled hidden>Seleccione una opción</option>
                <option value="Sin cultivos">Sin cultivos</option>
                <option value="Cultivos en surcos">Cultivos en surcos</option>
                <option value="Cereales">Cereales</option>
                <option value="Leguminosas">Leguminosas</option>
              </select>
            </div>
            <div className="flex flex-col">
              <label className="text-gray-700 font-medium">Tratamiento del Suelo:</label>
              <select name="tratamientoSuelo" value={inputValues.tratamientoSuelo} onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-lg bg-white">
                <option value="" disabled hidden>Seleccione una opción</option>
                <option value="Surcos rectos">Surcos rectos</option>
                <option value="Contorneo">Contorneo</option>
                <option value="Terrazas">Terrazas</option>
                <option value="No definido">No definido</option>
              </select>
            </div>
            <div className="flex flex-col">
              <label className="text-gray-700 font-medium">Pendiente del Terreno (%):</label>
              <select name="pendienteTerreno" value={inputValues.pendienteTerreno} onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-lg bg-white">
                <option value="" disabled hidden>Seleccione una opción</option>
                <option value="No definido">No definido</option>
                <option value=">1%">Mayor a 1%</option>
                <option value="<1%">Menor a 1%</option>
              </select>
            </div>
            <div className="flex flex-col">
              <label className="text-gray-700 font-medium">Tipo de Suelo:</label>
              <select name="tipoSuelo" value={inputValues.tipoSuelo} onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-lg bg-white">
                <option value="" disabled hidden>Seleccione una opción</option>
                <option value="Tipo A">Tipo A</option>
                <option value="Tipo B">Tipo B</option>
                <option value="Tipo C">Tipo C</option>
                <option value="Tipo D">Tipo D</option>
              </select>
            </div>
          </div>
          {/* Columna de Imagen y botón para ver la tabla CN */}
          <div className="flex flex-col items-center">
            <img src="/images/imagenguia.jpg" alt="Efecto de la precipitación" className="w-full" />
            <button 
              onClick={() => setIsModalOpen(true)}
              className="mt-2 px-2 py-1 bg-gray-700 text-white rounded text-sm"
            >
              Ver tabla CN
            </button>
          </div>
        </div>
  
        {/* Botonera y datos calculados */}
        <div className="mt-6">
          <div className="flex gap-2">
            <button
              onClick={calcular}
              className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-green-500 text-white rounded-lg"
            >
              Calcular
            </button>
            <button
              onClick={fillExampleValues}
              className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-blue-500 text-white rounded-lg"
            >
              <CalculateIcon className="mr-1" />Ejemplo
            </button>
            <button
              onClick={clearFields}
              className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-red-500 text-white rounded-lg"
            >
              <DeleteIcon className="mr-1" />Limpiar
            </button>
          </div>
          {error && <p className="text-red-500 mt-4">{error}</p>}
          {/* Datos de Entrada Calculados */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { label: "CN1 Suelos secos", value: cnValues.CN1 },
              { label: "CN2 Suelo intermedio", value: cnValues.CN2 },
              { label: "CN3 Suelo Húmedo", value: cnValues.CN3 },
              { label: "P. Efectiva (mm)", value: calcValues.pEfectiva },
              { label: "Tc (h)", value: calcValues.Tc }
            ].map((item, index) => (
              <div key={index} className="flex flex-col">
                <label className="text-gray-700 font-medium">{item.label}:</label>
                <input type="text" value={item.value} readOnly
                  className="w-full p-2 border border-gray-300 rounded-lg bg-gray-100 text-center" />
              </div>
            ))}
          </div>
          {/* Grupo de radio para seleccionar el CN a usar */}
          <div className="mt-4">
            <p className="text-gray-700 font-medium">Seleccione el CN para cálculos:</p>
            <div className="flex space-x-4">
              <label>
                <input type="radio" name="selectedCN" value="CN1"
                  checked={selectedCN === "CN1"}
                  onChange={handleCNSelection} className="mr-1" /> CN1 Suelos secos
              </label>
              <label>
                <input type="radio" name="selectedCN" value="CN2"
                  checked={selectedCN === "CN2"}
                  onChange={handleCNSelection} className="mr-1" /> CN2 Suelo intermedio
              </label>
              <label>
                <input type="radio" name="selectedCN" value="CN3"
                  checked={selectedCN === "CN3"}
                  onChange={handleCNSelection} className="mr-1" /> CN3 Suelo Húmedo
              </label>
            </div>
          </div>
        </div>
      </div>
  
      {/* Sección de Resultados Generales */}
      <div className="bg-white p-6 shadow-md rounded-lg border border-gray-300 mt-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Resultados</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { label: "FÓRMULA DE KIRPICH (h):", value: tcValues.Tc_k },
            { label: "FÓRMULA CALIFORNIANA DEL U.S.B.R (h):", value: tcValues.Tc_C },
            { label: "FÓRMULA DE GIANDOTTI (h):", value: tcValues.Tc_G },
            { label: "FÓRMULA DE TÉMEZ (h):", value: tcValues.Tc_T },
            { label: "Tc Definitivo (h):", value: tcValues.Tc_def }
          ].map((item, index) => (
            <div key={index} className="flex flex-col">
              <label className="text-gray-700 font-medium">{item.label}</label>
              <input type="text" value={item.value} readOnly
                className="w-full p-2 border border-gray-300 rounded-lg bg-gray-100 text-center" />
            </div>
          ))}
        </div>
      </div>
  
      {/* Sección de Parámetros y Gráficas */}
      <div className="grid grid-cols-1 gap-6 bg-white p-6 shadow-md rounded-lg border border-gray-300 mt-6">
        <div className="bg-gray-50 p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Parámetros para la Construcción del Hidrograma
          </h2>
          <div className="space-y-4">
            {[
              { label: "Tiempo de Retraso tr (h):", value: calcValues.tr },
              { label: "Duración en Exceso dₑ (h):", value: calcValues.d_e },
              { label: "Tiempo Pico tp (h):", value: calcValues.tp },
              { label: "Tiempo Base tb (h):", value: calcValues.tb },
              { label: "Caudal Pico Qp (m³/s):", value: calcValues.Qpico }
            ].map((item, index) => (
              <div key={index} className="flex flex-col">
                <label className="text-gray-700 font-medium">{item.label}</label>
                <input type="text" value={item.value} readOnly
                  className="w-full p-2 mt-1 border border-gray-300 rounded-lg bg-gray-100 text-center" />
              </div>
            ))}
          </div>
          <button onClick={graficarHidrogramas}
            className="mt-6 px-5 py-2 bg-blue-500 text-white rounded-lg w-full">
            Graficar Hidrogramas
          </button>
        </div>
        <div className="flex flex-col gap-6">
          {chartData.triangular && (
            <div className="bg-white p-4 shadow rounded-lg">
              <h3 className="text-lg font-semibold text-gray-700 mb-2 text-center">Hidrograma Triangular</h3>
              <Line data={chartData.triangular} options={{
                scales: {
                  x: { title: { display: true, text: 't (h)' } },
                  y: { title: { display: true, text: 'Q (m³/s)' } }
                }
              }} />
            </div>
          )}
          {chartData.scs && (
            <div className="bg-white p-4 shadow rounded-lg">
              <h3 className="text-lg font-semibold text-gray-700 mb-2 text-center">Hidrograma SCS</h3>
              <Line data={chartData.scs} options={{
                scales: {
                  x: { title: { display: true, text: 't (h)' } },
                  y: { title: { display: true, text: 'Q (m³/s)' } }
                }
              }} />
            </div>
          )}
        </div>
      </div>
  
      {/* Listado Final de Resultados */}
      <div className="bg-white p-6 shadow-md rounded-lg border border-gray-300 mt-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4 text-center">Datos del Hidrograma</h2>
        <pre className="whitespace-pre-wrap text-gray-800">
{resultListing}
        </pre>
      </div>
  
      {/* Modal para ver la tabla CN */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          {/* Fondo semitransparente */}
          <div 
            className="absolute inset-0 bg-black opacity-50" 
            onClick={() => setIsModalOpen(false)}
          ></div>
          <div className="bg-white p-4 rounded-lg relative z-10 max-w-md mx-auto">
            <button 
              onClick={() => setIsModalOpen(false)}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
            >
              Cerrar
            </button>
            <img src="/images/tablaCN.jpg" alt="Tabla CN" className="max-w-full max-h-full" />
          </div>
        </div>
      )}
    </div>
  );
};

export default EfectoSuelo;
