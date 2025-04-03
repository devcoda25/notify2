import React from "react";
import Chart from 'react-apexcharts';
import menu from '../../Assets/img/menu.svg';

const TicketConversationbyType = () => {
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
        max: 1,
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
  
      },
      tooltip: {
        enabled: false,
      },
      colors: ['rgb(108, 176, 204)'],
      legend: {
        position: "bottom",
        horizontalAlign: "center",
        fontSize: "12px",
        fontWeight: 600,
  
        labels: {
          colors: "#333",
        },
      },
      plotOptions: {
        bar: {
          borderRadius: 10,
          columnWidth: '100%',
        },
      },
    };
  
  
    const series = [
      {
        name: 'Service',
        data: [null, null, null, null, null, null, null, null],
      },
      {
        name: 'Marketing',
        type: 'bar',
        data: [0, 0, 1.0, 0, 0, 0, 0, 0],
      },
      {
        name: 'Utility',
        data: [null, null, null, null, null, null, null, null],
      },
      {
        name: 'Authentication',
        data: [null, null, null, null, null, null, null, null],
      },
      {
        name: 'Authentication international',
        data: [null, null, null, null, null, null, null, null],
      }
    ];
    return (
      <div className="ticketconversation">
  
        <Chart options={options} series={series} type="line" height="350" />
      </div>
    );
  };
  export default TicketConversationbyType;