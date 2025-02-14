'use client';
import Chart from 'chart.js/auto';
import 'chartjs-adapter-date-fns';
import React, { useContext, useEffect, useRef, useCallback } from 'react';
import { AppContext } from '../page';

function TimeSeriesGraph({ station }) {
  const { data } = useContext(AppContext);
  const chartRef = useRef(null);
  const chartInstanceRef = useRef(null); // Almacenar la instancia del gráfico sin causar renders innecesarios

  // Función para destruir el gráfico anterior antes de crear uno nuevo
  const destroyChart = useCallback(() => {
    if (chartInstanceRef.current) {
      chartInstanceRef.current.destroy();
      chartInstanceRef.current = null;
    }
  }, []);

  useEffect(() => {
    if (!station || !data[station]) {
      destroyChart();
      return;
    }

    const stationData = data[station];
    const years = Object.keys(stationData.data);

    const allData = years.reduce((acc, year) => {
      const yearData = stationData.data[year];
      yearData.monthly.forEach((value, monthIndex) => {
        if (value !== -100.0) {
          acc.push({
            x: `${year}-${(monthIndex + 1).toString().padStart(2, '0')}-01`, // Formato YYYY-MM-DD
            y: value
          });
        }
      });
      return acc;
    }, []);

    destroyChart(); // Destruir gráfico existente antes de crear uno nuevo

    const ctx = chartRef.current.getContext('2d');
    chartInstanceRef.current = new Chart(ctx, {
      type: 'line',
      data: {
        datasets: [{
          label: 'Precipitación Mensual',
          data: allData,
          fill: false,
          borderColor: 'rgb(75, 192, 192)',
          tension: 0.1
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          x: {
            type: 'time',
            time: {
              unit: 'month',
              displayFormats: {
                month: 'yyyy-MM'
              },
              tooltipFormat: 'yyyy-MM-dd'
            },
            title: {
              display: true,
              text: 'Fecha'
            }
          },
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: 'Precipitación (mm)'
            }
          }
        },
        plugins: {
          title: {
            display: true,
            text: `Serie Temporal Mensual - Estación: ${station}`
          }
        }
      }
    });

  }, [station, data, destroyChart]);

  return <canvas ref={chartRef} className="w-full h-80"></canvas>;
}

export default TimeSeriesGraph;
