import React from "react";
import ChartComponent from "./ChartComponent";
import AccordionTable from "./AccordionTable";


const categories = ["Feb 11", "Feb 12", "Feb 13", "Feb 14", "Feb 15", "Feb 16", "Feb 17"];


const firstResponseTime = [
    {
        name: "Data",
        data: [0.01, 0.01, 0.01, 0.01, 0.01, 0.01, 0.01],
        color: "green",
        borderRadius: 2,
        pointWidth: 40,
    },
];
const firstResponsetimeperTeam = [
    {
        title: "First response time per team",
        columns: [{ label: 'Name' },
        { label: 'Time to assign', color: '#3357FF' },
        { label: 'Time to respond', color: '#33FF57' },
        { label: 'Average Time' }

        ],
        rows: [["Average", "0s", "0s", "0s"]],
    },
]
const firstResponsetimeperAgent = [
    {
        title: "First response time per agent",
        columns: [{ label: 'Name' },
        { label: 'Time to assign', color: '#3357FF' },
        { label: 'Time to respond', color: '#33FF57' },
        { label: 'Average Time' }

        ],
        rows: [["Average", "0s", "0s", "0s"]],
    },
]
const firstResponseBreakdown = [
    {
        title: "First response time breakdown",
        columns: ["Series", "Feb 11", "Feb 12", "Feb 13", "Feb 14", "Feb 15", "Feb 16", "Feb 17", "Total"],
        rows: [
            ["First response time", "-", "-", "-", "-", "-", "-", "-", "-"],

        ],
    },
];


const FirstResponseTime = () => {
 
    return (
        <div className="reports_newtickets">

            <div className="main_container">

                <div className="new_tickets_graph">
                    <div>First response Time</div>
                    <div className="source_series_container">
                        <div className="series_content">
                            <div className="series_name">
                                <div className="series_color average_color"></div><span>Average</span>
                            </div>
                            <div>0S</div>
                        </div>
                        <div className="series_content">
                            <div className="series_name">
                                <div className="series_color _series rated_okseries"></div><span>Time to assign to Agent</span>
                            </div>
                            <div>0S</div>
                        </div>
                        <div className="series_content">
                            <div className="series_name">
                                <div className="series_color rated_greatseries"></div><span>Time to respond</span>
                            </div>
                            <div>0S</div>
                        </div>
                    </div>

                    <ChartComponent categories={categories} series={firstResponseTime} />
                    <div className="new_tickets_breakdown">
                        {firstResponsetimeperTeam.map((tableData, index) => (
                            <AccordionTable key={index} {...tableData} isColored={true} />
                        ))}
                    </div>
                    <div className="new_tickets_breakdown">
                        {firstResponsetimeperAgent.map((tableData, index) => (
                            <AccordionTable key={index} {...tableData} isColored={true} />
                        ))}
                    </div>
                    <div className="new_tickets_breakdown">
                        {firstResponseBreakdown.map((tableData, index) => (
                            <AccordionTable key={index} {...tableData} />
                        ))}
                    </div>
                </div>


            </div>
        </div>
    )
}
export default FirstResponseTime;
