import React from "react";
import Chart from 'react-apexcharts';
import menu from '../../Assets/img/menu.svg';

const MessageDeliveryStatus = () => {
  const options = {
    chart: {
      id: 'custom-graph',
      toolbar: {
        show: true,
        tools: {
          zoomin: false,
          zoomout: false,
          zoom: false,
          selection: false,
          pan: false,
          reset: false,
          download: `<img src="${menu}" />`,
        },
      },
    },
    xaxis: {
      categories: [],
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
      tickAmount: 1,

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
          show: false,
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
    },

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
      name: 'Sent',
      data: [null]
    },
    {
      name: 'Delivered',
      data: [null]
    },
    {
      name: 'Failed',
      data: [null]
    },
    {
      name: 'Unread',
      data: [null]
    },
    {
      name: 'Read',
      data: [null]
    },

  ];
  return (
    <div className="messagedelivery">
      <Chart options={options} series={series} type="line" height="350" />
    </div>
  );
};
export default MessageDeliveryStatus;