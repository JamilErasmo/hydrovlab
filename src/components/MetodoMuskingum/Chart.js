import { Line } from 'react-chartjs-2';

const Chart = ({ data }) => {
  const chartConfig = {
    datasets: data.map((dataset, idx) => ({
      label: `X${idx + 1}`,
      data: dataset.data,
      borderColor: `rgba(75, 192, 192, ${0.5 + idx * 0.1})`,
      backgroundColor: `rgba(75, 192, 192, ${0.2 + idx * 0.1})`,
    })),
  };

  return (
    <div>
      <Line data={chartConfig} />
    </div>
  );
};

export default Chart;
