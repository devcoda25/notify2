import React, { useState } from "react";
import ChartComponent from "./ChartComponent";
import AccordionTable from "./AccordionTable";
import TimeGridChart from "./TimeGridChart";

const categories = ["Feb 11", "Feb 12", "Feb 13", "Feb 14", "Feb 15", "Feb 16", "Feb 17"];


const breakdownSeries = [
    {
        name: "Data",
        data: [0.01, 0.01, 0.01, 0.01, 0.01, 0.01, 0.01],
        color: "green",
        borderRadius: 1,
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
        borderRadius: 1,
        pointWidth: 15,
    },
    {
        name: "Source B",
        data: [0.01, 0.01, 0.01, 0.01, 0.01, 0.01, 0.01],
        color: "yellow",
        borderRadius: 1,
        pointWidth: 15,
    },
    {
        name: "Source C",
        data: [0.01, 0.01, 0.01, 0.01, 0.01, 0.01, 0.01],
        color: "green",
        borderRadius: 1,
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



const NewTickets = () => {
  
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
