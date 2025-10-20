import React from "react";
import Chart from 'react-apexcharts';



const CountofTags = () => {
  const options = {
    chart: {
      id: 'custom-graph',
      toolbar: {
        show: false,

      },
    },
    xaxis: {
      categories: [],
      labels: {
        show: false,
      },
      axisBorder: {
        show: false,
      },
    },
    yaxis: {
      min: 0,
      max: 5,
      tickAmount: 5,
      labels: {
        formatter: (val) => val.toFixed(0), // Ensures integer formatting
      },
    },
    grid: {
      show: true,
      borderColor: '#ddd',
      strokeDashArray: 4,
      xaxis: {
        lines: {
          show: false,
        },
      },
      yaxis: {
        lines: {
          show: true,
        },
      },
      row: {
        colors: undefined,
        opacity: 0.5,
      },
      padding: {
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
      },
    },

    stroke: {
      width: 2,
      dashArray: 4,
    },
    tooltip: {
      enabled: false,


    },

  };

  return (
    <div>

      <Chart options={options} series={[]} type="line" height="350" />
    </div>
  );
};
export default CountofTags;