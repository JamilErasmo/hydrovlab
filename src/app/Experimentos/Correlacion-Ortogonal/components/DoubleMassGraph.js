'use client';
import { Chart } from 'chart.js/auto';
import React, { useContext, useEffect, useRef } from 'react';
import { AppContext } from '../page';

const DoubleMassGraph = ({ selectedStations }) => {
  const { data } = useContext(AppContext);
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  useEffect(() => {
    if (chartRef.current) {
      const ctx = chartRef.current.getContext('2d');

      // Destroy the previous chart if it exists
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }

      const allStations = Object.keys(data);
      const datasets = [
        {
          label: 'no seleccionada',
          data: [],
          backgroundColor: 'blue',
          borderColor: 'blue',
          pointStyle: 'circle',
          pointRadius: 5,
          pointHoverRadius: 7
        },
        {
          label: 'seleccionada',
          data: [],
          backgroundColor: 'red',
          borderColor: 'red',
          pointStyle: 'circle',
          pointRadius: 5,
          pointHoverRadius: 7
        }
      ];

      // Populate datasets based on selection status
      allStations.forEach(station => {
        const stationData = data[station];
        const datasetIndex = selectedStations.includes(station) ? 1 : 0;
        datasets[datasetIndex].data.push({
          x: parseFloat(stationData.coordinates[0]),
          y: parseFloat(stationData.coordinates[1]),
          station: station // Adding station name for labeling
        });
      });

      // Create the new chart instance
      const newChart = new Chart(ctx, {
        type: 'scatter',
        data: {
          datasets: datasets
        },
        options: {
          animation: false,
          scales: {
            x: {
              type: 'linear',
              position: 'bottom',
              title: {
                display: true,
                text: 'Longitud'
              }
            },
            y: {
              title: {
                display: true,
                text: 'Latitud'
              }
            }
          },
          plugins: {
            legend: {
              display: true,
              position: 'top'
            },
            tooltip: {
              callbacks: {
                label: function (context) {
                  let label = context.dataset.label || '';
                  if (label) {
                    label += ': ';
                  }
                  if (context.parsed.x !== null) {
                    label += context.raw.station;
                  }
                  return label;
                }
              }
            },
            title: {
              display: true,
              text: 'Gráfica de Estaciones'
            }
          }
        }
      });

      // Store the new chart instance in the ref
      chartInstance.current = newChart;
    }

    // Cleanup function to destroy the chart when the component unmounts or when dependencies change
    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [data, selectedStations]);

  return (
    <div className="bg-white p-6 rounded-lg shadow-md border border-gray-300">
      <h4 className="text-lg font-semibold text-gray-800 mb-4">Gráfica de Estaciones</h4>
      <div className="w-full overflow-hidden">
        <canvas ref={chartRef} className="w-full h-auto"></canvas>
      </div>
    </div>

  );
};

export default DoubleMassGraph;