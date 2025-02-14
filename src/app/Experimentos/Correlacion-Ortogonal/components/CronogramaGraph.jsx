import Chart from 'chart.js/auto';
import React, { useContext, useEffect, useRef } from 'react';
import { AppContext } from '../page';

function CronogramaGraph({ stations }) {
  const { data } = useContext(AppContext);
  const chartRef = useRef(null);
  const chartInstance = useRef(null); // Use ref instead of state for better performance

  useEffect(() => {
    if (stations.length > 0 && chartRef.current) {
      const ctx = chartRef.current.getContext('2d');

      // Destroy the existing chart if it exists
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }

      // Collect all years from all stations
      const allYears = new Set();
      stations.forEach(station => {
        Object.keys(data[station]?.data || {}).forEach(year => allYears.add(year));
      });
      const years = Array.from(allYears).sort();

      const datasets = stations.map((station, index) => {
        const stationData = data[station] || {};
        const cronogramaData = years.map(year => {
          const yearData = stationData.data[year];
          // Check if all months are 0 or below including -100.0
          if (yearData && yearData.monthly.every(val => val <= 0)) {
            return { x: year, y: null }; // Gap for years where all data is 0 or below
          } else if (yearData) {
            return {
              x: year,
              y: index + 1 // Use index + 1 as y position, from 1 to stations.length
            };
          } else {
            return { x: year, y: null }; // Gap for entirely missing year data
          }
        });

        return {
          label: station,
          data: cronogramaData,
          borderColor: `hsl(${index * (360 / stations.length)}, 70%, 50%)`,
          borderWidth: 2,
          fill: false,
          pointRadius: 0,
          type: 'line',
          showLine: true,
          spanGaps: false
        };
      });

      // Create the new chart instance
      const newChart = new Chart(ctx, {
        type: 'line',
        data: {
          datasets: datasets
        },
        options: {
          scales: {
            x: {
              type: 'category',
              labels: years,
              title: {
                display: true,
                text: 'Años'
              }
            },
            y: {
              type: 'linear',
              min: 0,
              max: stations.length,
              ticks: {
                callback: function (value) {
                  if (value > 0 && value <= stations.length) {
                    return stations[value - 1];
                  }
                  return '';
                }
              },
              title: {
                display: true,
                text: 'Estaciones'
              }
            }
          },
          plugins: {
            legend: {
              display: true
            },
            title: {
              display: true,
              text: 'Cronograma de Precipitación'
            }
          },
          elements: {
            line: {
              tension: 0,
              stepped: 'middle'
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
  }, [data, stations]);

  return <canvas ref={chartRef}></canvas>; // Removed static id to prevent conflicts
}

export default CronogramaGraph;