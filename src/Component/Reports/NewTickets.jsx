import React, { useState } from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import ChartComponent from "./ChartComponent";
import AccordionTable from "./AccordionTable";

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
const NewTickets = () => {
    const categories = ["Feb 11", "Feb 12", "Feb 13", "Feb 14", "Feb 15", "Feb 16", "Feb 17"];


    const breakdownSeries = [
        {
            name: "Data",
            data: [0.01, 0.01, 0.01, 0.01, 0.01, 0.01, 0.01],
            color: "green",
            borderRadius: 2,
            pointWidth: 40,
        },
    ];
    const breakdownTable = [
        {
            title: "New tickets breakdown",
            columns: ["Series", "Feb 11", "Feb 12", "Feb 13", "Feb 14", "Feb 15", "Feb 16", "Feb 17", "Total"],
            rows: [["New Tickets", "0", "0", "0", "0", "0", "0", "0", "0"]],
        },
    ]

    const sourceSeries = [
        {
            name: "Source A",
            data: [0.01, 0.01, 0.01, 0.01, 0.01, 0.01, 0.01],
            color: "red",
            borderRadius: 2,
            pointWidth: 15,
        },
        {
            name: "Source B",
            data: [0.01, 0.01, 0.01, 0.01, 0.01, 0.01, 0.01],
            color: "yellow",
            borderRadius: 2,
            pointWidth: 15,
        },
        {
            name: "Source C",
            data: [0.01, 0.01, 0.01, 0.01, 0.01, 0.01, 0.01],
            color: "green",
            borderRadius: 2,
            pointWidth: 15,
        },
    ];
    const sourceTable = [
        {
            title: "Ticket source breakdown",
            columns: ["Source", "Feb 11", "Feb 12", "Feb 13", "Feb 14", "Feb 15", "Feb 16", "Feb 17", "Total"],
            rows: [
                ["Created manually", "0", "0", "0", "0", "0", "0", "0", "0"],
                ["From email", "0", "0", "0", "0", "0", "0", "0", "0"],
                ["From contact form", "0", "0", "0", "0", "0", "0", "0", "0"],
            ],
        },
    ];

 
    return (
        <div className="reports_newtickets">

            <div className="main_container">
                <div className="new_tickets_graph">
                    <div>New Tickets</div>
                    <div>0</div>

                    <ChartComponent categories={categories} series={breakdownSeries} />

                    <div className="new_tickets_breakdown">

                        {breakdownTable.map((tableData, index) => (
                            <AccordionTable key={index} {...tableData} />
                        ))}
                    </div>
                </div>
                <div className="new_tickets_graph">
                    <div>Ticket sources</div>
                    <div className="source_series_container">
                        <div className="series_content">
                            <div className="series_name">
                                <div className="series_color"></div><span>Created manually</span>
                            </div>
                            <div>0 (0%)</div>
                        </div>
                        <div className="series_content">
                            <div className="series_name">
                                <div className="series_color email_series"></div><span>Email</span>
                            </div>
                            <div>0 (0%)</div>
                        </div>
                        <div className="series_content">
                            <div className="series_name">
                                <div className="series_color contact_series"></div><span>Contact form</span>
                            </div>
                            <div>0 (0%)</div>
                        </div>
                    </div>

                    <ChartComponent categories={categories} series={sourceSeries} />
                    <div className="new_tickets_breakdown">
                        {sourceTable.map((tableData, index) => (
                            <AccordionTable key={index} {...tableData} />
                        ))}
                    </div>
                </div>
                <div className="new_tickets_graph">
                    <div>New tickets heatmap in last 7 days </div>
                    <TimeGridChart />
                </div>

            </div>
        </div>
    )
}
export default NewTickets;
