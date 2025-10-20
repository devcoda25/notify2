import React from "react";
import Chart from 'react-apexcharts';
import zoomin from '../../Assets/img/zoomin.svg';
import zoomout from '../../Assets/img/zoomout.svg';
import zoom from '../../Assets/img/zoom.svg';
import pan from '../../Assets/img/pan.svg';
import reset from '../../Assets/img/reset.svg';
import menu from '../../Assets/img/menu.svg';

const Sendmessagebytype = () => {
  const options = {
    chart: {
      id: 'custom-graph',
      toolbar: {
        show: true,
        tools: {
          zoomin: `<img src="${zoomin}" />`,
          zoomout: `<img src="${zoomout}" />`,
          zoom: `<img src="${zoom}" />`,
          selection: true,
          pan: `<img src="${pan}"  />`,
          reset: `<img src="${reset}" />`,
          download: `<img src="${menu}" />`,
        },
      },
    },
    xaxis: {
      categories: ['27 Nov', '28 Nov', '29 Nov', '30 Nov', '1 Dec', '2 Dec', '3 Dec', ' '],
      labels: {
        style: {
          colors: '#333',
          fontSize: '12px',
        },
      },

    },
    yaxis: {
      min: 0,
      max: 1,
      tickAmount: 5,
      labels: {
        formatter: (val) => (val !== null && val !== undefined ? val.toFixed(1) : ''),
        style: {
          colors: '#333',
          fontSize: '12px',
        },
      },

      axisTicks: {
        show: true,
      },
      axisBorder: {
        show: false,
      },
    },


    grid: {
      show: true,
      borderColor: '#ddd',
      strokeDashArray: 4, // Dotted lines for grid
      xaxis: {
        lines: {
          show: false,
        },
      },
      yaxis: {
        lines: {
          show: true, // Show Y-axis grid lines
        },
      },
      row: {
        colors: undefined, // No background colors for rows
        opacity: 0.5,
      },
      padding: {
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
      },
    },
    annotations: {
      xaxis: [
        {
          x: '27 Nov',
          borderColor: '#ddd',
          strokeDashArray: 4,
        },
        {
          x: '28 Nov',
          borderColor: '#ddd',
          strokeDashArray: 4,
        },
        {
          x: '29 Nov',
          borderColor: '#ddd',
          strokeDashArray: 4,
        },
        {
          x: '30 Nov',
          borderColor: '#ddd',
          strokeDashArray: 4,
        },
        {
          x: '1 Dec',
          borderColor: '#ddd',
          strokeDashArray: 4,
        },
        {
          x: '2 Dec',
          borderColor: '#ddd',
          strokeDashArray: 4,
        },
        {
          x: '3 Dec',
          borderColor: '#ddd',
          strokeDashArray: 4,
        },
      ],

    },
    stroke: {

      width: 2,
    },
    colors: ['rgb(93, 165, 113)', 'rgb(243, 189, 28)', ' rgb(108, 176, 204)'],
    tooltip: {
      enabled: true,


    },
    legend: {
      position: "bottom",
      horizontalAlign: "center",
      fontSize: "12px",
      fontWeight: 600,

      labels: {
        colors: "#333",
      },

    },
  };

  const series = [
    {
      name: 'Session messages',
      data: [null, null, null, null, null, null, null, null]
    },
    {
      name: 'Broadcast messages',
      data: [0, 0, 0, 0, 0, 0, 1.0, 0],
    },
    {
      name: 'SMS',
      data: [0, 0, 0, 0, 0, 0, 0, 0],
    },

  ];
  return (
    <div className="sendmessagesbytype">
      <Chart options={options} series={series} type="line" height="350" />
    </div>
  );
};
export default Sendmessagebytype;