import Chart from 'chart.js/auto';
import 'chartjs-adapter-date-fns';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { AppContext } from '../page';

function TimeSeriesGraph({ station }) {
  const { data } = useContext(AppContext);
  const chartRef = useRef(null);
  const [chartInstance, setChartInstance] = useState(null);

  useEffect(() => {
    if (station && data[station]) {
      const stationData = data[station];
      const years = Object.keys(stationData.data);

      const allData = years.reduce((acc, year) => {
        const yearData = stationData.data[year];
        yearData.monthly.forEach((value, monthIndex) => {
          if (value !== -100.0) {
            acc.push({
              x: `${year}-${(monthIndex + 1).toString().padStart(2, '0')}-01`, // Ensure day is included for proper date parsing
              y: value
            });
          }
        });
        return acc;
      }, []);

      if (chartInstance) {
        chartInstance.destroy();
      }

      const ctx = chartRef.current.getContext('2d');
      const newChart = new Chart(ctx, {
        type: 'line',
        data: {
          datasets: [{
            label: 'Monthly Precipitation',
            data: allData,
            fill: false,
            borderColor: 'rgb(75, 192, 192)',
            tension: 0.1
          }]
        },
        options: {
          scales: {
            x: {
              type: 'time',
              time: {
                unit: 'month',
                displayFormats: {
                  month: 'yyyy-MM' // Use 'yyyy' instead of 'YYYY'
                },
                tooltipFormat: 'yyyy-MM-dd' // Match the format, use 'yyyy' instead of 'YYYY'
              },
              title: {
                display: true,
                text: 'Date'
              }
            },
            y: {
              beginAtZero: true,
              title: {
                display: true,
                text: 'Precipitation (mm)'
              }
            }
          },
          plugins: {
            title: {
              display: true,
              text: `Monthly Time Series for Station: ${station}`
            }
          }
        }
      });

      setChartInstance(newChart);
    } else {
      if (chartInstance) {
        chartInstance.destroy();
        setChartInstance(null);
      }
    }
  }, [station, data]);

  return <canvas id="timeSeries" ref={chartRef}></canvas>;
}

export default TimeSeriesGraph;