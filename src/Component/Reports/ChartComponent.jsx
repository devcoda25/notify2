import React from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
const ChartComponent = ({ categories, series }) => {
    const options = {
        chart: {
            type: "column",
            height: 300,
        },
        title: {
            text: "",
        },
        xAxis: {
            categories: categories,
            lineColor: "#000",
        },
        yAxis: {
            min: 0,
            max: 1,
            tickInterval: 1,
            labels: { enabled: true },
            title: { text: null },
        },
        tooltip: {
            enabled: true,
            borderColor: "gray",
            borderRadius: 5,
            formatter: function () {
                const categoryName = this.series.xAxis.categories[this.x];
                return `<span>${categoryName}</span><br>${this.y} new tickets`;
            },
        },
        credits: {
            enabled: false,
        },
        series: series,
        plotOptions: {
            column: {
                grouping: true,
                pointPadding: 0.3,
                borderWidth: 0,
            },
        },
        legend: {
            enabled: false,
        },
    };

    return <HighchartsReact highcharts={Highcharts} options={options} />;
};
export default ChartComponent;