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

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

export default function Charts({ monthlyFlows }) {
    // Calcular datos para la gráfica de calibración (promedio por mes)
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
                borderColor: "rgba(255, 99, 132, 1)",
                backgroundColor: "rgba(255, 99, 132, 0.2)",
                borderWidth: 2,
            },
            {
                label: "Caudal Simulado",
                data: averageSimulated,
                borderColor: "rgba(54, 162, 235, 1)",
                backgroundColor: "rgba(54, 162, 235, 0.2)",
                borderWidth: 2,
            },
        ],
    };

    // Gráfica 2: Todos los caudales observados y simulados
    const chartData2 = {
        labels: monthlyFlows.map((flow, index) => `Mes ${index + 1}`),
        datasets: [
            {
                label: "Caudal Observado",
                data: monthlyFlows.map((flow) => flow.observed),
                borderColor: "rgba(255, 99, 132, 1)",
                backgroundColor: "rgba(255, 99, 132, 0.2)",
                borderWidth: 1,
            },
            {
                label: "Caudal Simulado",
                data: monthlyFlows.map((flow) => flow.simulated),
                borderColor: "rgba(54, 162, 235, 1)",
                backgroundColor: "rgba(54, 162, 235, 0.2)",
                borderWidth: 1,
            },
        ],
    };

    const options = {
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

    const options2 = {
        ...options,
        plugins: {
            ...options.plugins,
            title: { display: true, text: "Caudal Simulado y Observado" },
        },
    };

    return (
        <div className="space-y-8">
            <div>
                <h3 className="text-lg font-semibold mb-4">Calibración Año Medio</h3>
                <Line data={chartData1} options={options} />
            </div>
            <div>
                <h3 className="text-lg font-semibold mb-4">Caudal Simulado y Observado</h3>
                <Line data={chartData2} options={options2} />
            </div>
        </div>
    );
}
