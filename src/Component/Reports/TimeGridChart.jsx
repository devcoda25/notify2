import React from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";

const TimeGridChart = () => {
    const options = {
        chart: {
            type: "scatter",
            height: 400,
            backgroundColor: "white"
        },
        title: {
            text: ""
        },
        xAxis: {
            type: "datetime",
            min: Date.UTC(2024, 1, 11),
            max: Date.UTC(2024, 1, 17),
            tickInterval: 24 * 3600 * 1000,
            labels: {
                format: "{value:%b %e}",
                style: { fontSize: "12px" }
            },
            gridLineWidth: 1,
        },
        yAxis: {
            title: { text: "" },
            categories: [
                "12:00 AM", "3:00 AM", "6:00 AM", "9:00 AM",
                "12:00 PM", "3:00 PM", "6:00 PM", "9:00 PM"
            ],
            min: 0,
            max: 7,
            labels: { enabled: true },
            gridLineWidth: 1,
        },
        legend: {
            enabled: false
        },
        credits: {
            enabled: false,
        },
        plotOptions: {
            scatter: {
                marker: { enabled: false },
                enableMouseTracking: false
            },
            series: {
                states: { hover: { enabled: false } }
            }
        },
        series: [
            {
                name: "Grid Background",
                type: "scatter",
                data: [
                    [Date.UTC(2024, 1, 11), 0],
                    [Date.UTC(2024, 1, 12), 1],
                    [Date.UTC(2024, 1, 13), 2],
                    [Date.UTC(2024, 1, 14), 3],
                    [Date.UTC(2024, 1, 15), 4],
                    [Date.UTC(2024, 1, 16), 5],
                    [Date.UTC(2024, 1, 17), 6]

                ],
                color: "rgba(200, 200, 200, 0.1)",
                marker: { symbol: "square", radius: 0 }
            }
        ]
    };

    return <HighchartsReact highcharts={Highcharts} options={options} />;
};
export default TimeGridChart;