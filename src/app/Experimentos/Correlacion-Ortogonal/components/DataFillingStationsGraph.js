'use client';

import { Chart } from 'chart.js/auto';
import React, { useContext, useEffect, useRef } from 'react';
import { AppContext } from '../page';

const DataFillingStationsGraph = ({ stationAnalysis, stationBase }) => {
  const { data } = useContext(AppContext);
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  useEffect(() => {
    if (chartRef.current && stationAnalysis && stationBase) {
      const ctx = chartRef.current.getContext('2d');

      // Destroy the previous chart if it exists
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }

      // Calculate cumulative sums for both stations
      const years = Object.keys(data[stationAnalysis]?.data || {});
      const cumulativeDataAnalysis = [];
      const cumulativeDataBase = [];
      let sumAnalysis = 0, sumBase = 0;
      let maxAnalysis = 0, maxBase = 0;

      years.forEach(year => {
        const yearDataAnalysis = data[stationAnalysis].data[year];
        const yearDataBase = data[stationBase].data[year];

        if (yearDataAnalysis && yearDataBase) {
          // Assuming total is the key used for annual totals, adjust if different
          const totalAnalysis = yearDataAnalysis.total !== -100.0 ? yearDataAnalysis.total : 0;
          const totalBase = yearDataBase.total !== -100.0 ? yearDataBase.total : 0;

          sumAnalysis += totalAnalysis;
          sumBase += totalBase;

          // Store the maximum values for scaling
          maxAnalysis = Math.max(maxAnalysis, sumAnalysis);
          maxBase = Math.max(maxBase, sumBase);

          // Store cumulative sums in separate arrays for x and y
          cumulativeDataAnalysis.push(sumAnalysis);
          cumulativeDataBase.push(sumBase);
        }
      });

      // Prepare data for the chart
      const chartData = cumulativeDataBase.map((baseValue, index) => ({
        x: (baseValue / maxBase) * 100,
        y: (cumulativeDataAnalysis[index] / maxAnalysis) * 100,
        year: years[index]
      }));

      // Create the new chart instance
      const newChart = new Chart(ctx, {
        type: 'scatter',
        data: {
          datasets: [{
            label: 'Dobles Acumulaciones',
            data: chartData,
            backgroundColor: 'red',
            borderColor: 'red',
            pointStyle: 'circle',
            pointRadius: 5,
            pointHoverRadius: 7
          }]
        },
        options: {
          scales: {
            x: {
              type: 'linear',
              position: 'bottom',
              title: {
                display: true,
                text: 'Estación Base (%)'
              },
              min: 0,
              max: 100
            },
            y: {
              title: {
                display: true,
                text: 'Estación en Análisis (%)'
              },
              min: 0,
              max: 100
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
                    label += context.raw.year;
                  }
                  return label;
                }
              }
            },
            title: {
              display: true,
              text: 'Estaciones para el Relleno de Datos'
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
  }, [data, stationAnalysis, stationBase]);

  return (
    <div>
      <canvas ref={chartRef}></canvas>
    </div>
  );
};

export default DataFillingStationsGraph;