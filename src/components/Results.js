import React from "react";
import { Line } from "react-chartjs-2";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from "chart.js";

// Registrar componentes de Chart.js
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

export default function Results({ results }) {
    if (!results) return (
        <div className="text-center text-gray-500 mt-6">
            No hay resultados disponibles. Por favor, realiza un cálculo.
        </div>
    );

    const { rmse, rSquared, nashSutcliffe, monthlyFlows } = results;

    // Datos para la gráfica "Calibración Año Medio"
    const months = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];
    const averageObserved = Array(12).fill(0);
    const averageSimulated = Array(12).fill(0);
    const monthCount = Array(12).fill(0);

    monthlyFlows.forEach((flow) => {
        const monthIndex = flow.month - 1;
        averageObserved[monthIndex] += flow.observed;
        averageSimulated[monthIndex] += flow.simulated;
        monthCount[monthIndex] += 1;
    });

    for (let i = 0; i < 12; i++) {
        if (monthCount[i] > 0) {
            averageObserved[i] /= monthCount[i];
            averageSimulated[i] /= monthCount[i];
        }
    }

    const chartData1 = {
        labels: months,
        datasets: [
            {
                label: "Caudal Observado",
                data: averageObserved,
                borderColor: "rgba(255, 99, 132, 1)", // Rojo
                backgroundColor: "rgba(255, 99, 132, 0.2)",
                borderWidth: 2,
            },
            {
                label: "Caudal Simulado",
                data: averageSimulated,
                borderColor: "rgba(54, 162, 235, 1)", // Azul
                backgroundColor: "rgba(54, 162, 235, 0.2)",
                borderWidth: 2,
            },
        ],
    };

    // Datos para la gráfica "Caudal Simulado y Observado"
    const chartData2 = {
        labels: monthlyFlows.map((flow, index) => `Mes ${index + 1}`),
        datasets: [
            {
                label: "Caudal Observado",
                data: monthlyFlows.map((flow) => flow.observed),
                borderColor: "rgba(255, 99, 132, 1)", // Rojo
                backgroundColor: "rgba(255, 99, 132, 0.2)",
                borderWidth: 1,
            },
            {
                label: "Caudal Simulado",
                data: monthlyFlows.map((flow) => flow.simulated),
                borderColor: "rgba(54, 162, 235, 1)", // Azul
                backgroundColor: "rgba(54, 162, 235, 0.2)",
                borderWidth: 1,
            },
        ],
    };

    const chartOptions1 = {
        responsive: true,
        plugins: {
            legend: { position: "top" },
            title: { display: true, text: "Calibración Año Medio" },
        },
        scales: {
            y: { beginAtZero: true, title: { display: true, text: "Caudal (m³/s)" } },
            x: { title: { display: true, text: "Meses" } },
        },
    };

    const chartOptions2 = {
        ...chartOptions1,
        plugins: {
            ...chartOptions1.plugins,
            title: { display: true, text: "Caudal Simulado y Observado" },
        },
    };

    return (
        <div className="bg-white shadow-md rounded-lg p-6 mt-6">
            <h2 className="text-2xl font-bold text-gray-700 mb-4">Resultados del Modelo Témez</h2>

            {/* Métricas principales */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="p-4 bg-blue-50 rounded-md shadow">
                    <p className="text-sm font-semibold text-gray-600">R² (Coeficiente de Correlación)</p>
                    <p className="text-xl font-bold text-blue-600">{rSquared ? rSquared.toFixed(3) : "N/A"}</p>
                </div>
                <div className="p-4 bg-green-50 rounded-md shadow">
                    <p className="text-sm font-semibold text-gray-600">EF (Eficiencia de Nash-Sutcliffe)</p>
                    <p className="text-xl font-bold text-green-600">{nashSutcliffe ? nashSutcliffe.toFixed(3) : "N/A"}</p>
                </div>
                <div className="p-4 bg-red-50 rounded-md shadow">
                    <p className="text-sm font-semibold text-gray-600">RMSE (Error Cuadrático Medio)</p>
                    <p className="text-xl font-bold text-red-600">{rmse ? rmse.toFixed(3) : "N/A"}</p>
                </div>
            </div>

            {/* Gráficas */}
            <div className="space-y-8">
                <div>
                    <Line data={chartData1} options={chartOptions1} />
                </div>
                <div>
                    <Line data={chartData2} options={chartOptions2} />
                </div>
            </div>

            {/* Tabla de caudales mensuales */}
            <h3 className="text-lg font-semibold text-gray-700 mb-4 mt-8">Caudales Mensuales</h3>
            <div className="overflow-x-auto">
                <table className="min-w-full bg-white border border-gray-200 rounded-lg">
                    <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                            <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">Año</th>
                            <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">Mes</th>
                            <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">Caudal Simulado (m³/s)</th>
                            <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">Caudal Observado (m³/s)</th>
                        </tr>
                    </thead>
                    <tbody>
                        {monthlyFlows.map((flow, index) => (
                            <tr
                                key={index}
                                className={index % 2 === 0 ? "bg-gray-50" : "bg-white"}
                            >
                                <td className="px-4 py-2 text-sm text-gray-700">{flow.year}</td>
                                <td className="px-4 py-2 text-sm text-gray-700">{flow.month}</td>
                                <td className="px-4 py-2 text-sm text-gray-700">{flow.simulated.toFixed(3)}</td>
                                <td className="px-4 py-2 text-sm text-gray-700">{flow.observed.toFixed(3)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
