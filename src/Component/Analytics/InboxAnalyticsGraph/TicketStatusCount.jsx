import React from "react";
import Chart from 'react-apexcharts';
import menu from '../../Assets/img/menu.svg';

const TicketStatusCount = () => {
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
          show: false,
        },
        axisBorder: {
          show: false,
        },
      },
      yaxis: {
        min: 0,
        max: 2,
        tickAmount: 5,
        labels: {
          show: true,
          formatter: function (value) {
            return value.toFixed(1);
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
        name: 'Opened',
        data: [null, null, null, null, null, null, null, null],
      },
      {
        name: 'Pending',
        data: [null, null, null, null, null, null, null, null],
      },
      {
        name: 'Solved',
        data: [null, null, null, null, null, null, null, null],
      },
      {
        name: 'Solved by bot',
        data: [null, null, null, null, null, null, null, null],
      },
      {
        name: 'Solved by Operator',
        data: [null, null, null, null, null, null, null, null],
      },
      {
        name: 'Expired',
        data: [null, null, null, null, null, null, null, null],
      },
      {
        name: 'Missed chats',
        data: [null, null, null, null, null, null, null, null],
      },
    ];
    return (
      <div>
  
        <Chart options={options} series={series} type="line" height="350" />
      </div>
    );
  };
  export default TicketStatusCount;