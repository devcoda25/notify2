import React from "react";
import ChartComponent from "./ChartComponent";
import AccordionTable from "./AccordionTable";

const categories = ["Feb 11", "Feb 12", "Feb 13", "Feb 14", "Feb 15", "Feb 16", "Feb 17"];
const solvedandClosed = [
    {
        name: "Solved",
        data: [0.01, 0.01, 0.01, 0.01, 0.01, 0.01, 0.01],
        color: "green",
        borderRadius: 2,
        pointWidth: 20,
    },
    {
        name: "Closed",
        data: [0.01, 0.01, 0.01, 0.01, 0.01, 0.01, 0.01],
        color: "rgb(118, 118, 128)",
        borderRadius: 2,
        pointWidth: 20,
    }

];
const solvedandClosedPerTeam = [
    {
        title: "Solved and closed per team",
        columns: [{ label: 'Name' },
        { label: 'Solved', color: 'green' },
        { label: 'Closed', color: 'rgb(118, 118, 128)' },
        { label: 'Overall' }
        ],
        rows: [["Average", "0", "0", "0"]],
    },
];
const solvedandClosedPerAgent = [
    {
        title: "Solved and closed per agent",
        columns: [{ label: 'Name' },
        { label: 'Solved', color: 'green' },
        { label: 'Closed', color: 'rgb(118, 118, 128)' },
        { label: 'Overall' }
        ],
        rows: [["Average", "0", "0", "0"]],
    },
];
const solvedandClosedBreakdown = [
    {
        title: "Solved and closed breakdown",
        columns: ["Status", "Feb 11", "Feb 12", "Feb 13", "Feb 14", "Feb 15", "Feb 16", "Feb 17", "Total"],
        rows: [
            ["Solved", "0", "0", "0", "0", "0", "0", "0", "0"],
            ["Closed", "0", "0", "0", "0", "0", "0", "0", "0"]
        ],
    },
];


const SolvedandClosed = () => {
  
    return (
        <div className="reports_newtickets">

            <div className="main_container">
                <div className="new_tickets_graph">
                    <div>Solved and Closed</div>
                    <div className="source_series_container">
                        <div className="series_content">
                            <div className="series_name">
                                <div className="series_color average_color"></div><span>Overall</span>
                            </div>
                            <div>0</div>
                        </div>
                        <div className="series_content">
                            <div className="series_name">
                                <div className="series_color rated_greatseries"></div><span>Solved</span>
                            </div>
                            <div>(0%)</div>
                        </div>
                        <div className="series_content">
                            <div className="series_name">
                                <div className="series_color pending_status"></div><span>Closed</span>
                            </div>
                            <div>0(0%)</div>
                        </div>
                    </div>

                    <ChartComponent categories={categories} series={solvedandClosed} />
                    <div className="new_tickets_breakdown">
                        {solvedandClosedPerTeam.map((tableData, index) => (
                            <AccordionTable key={index} {...tableData} isColored={true} />
                        ))}
                    </div>
                    <div className="new_tickets_breakdown">
                        {solvedandClosedPerAgent.map((tableData, index) => (
                            <AccordionTable key={index} {...tableData} isColored={true} />
                        ))}
                    </div>
                    <div className="new_tickets_breakdown">
                        {solvedandClosedBreakdown.map((tableData, index) => (
                            <AccordionTable key={index} {...tableData} />
                        ))}
                    </div>
                </div>


            </div>
        </div>
    )
}
export default SolvedandClosed;
