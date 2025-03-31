import React from "react";
import ChartComponent from "./ChartComponent";
import AccordionTable from "./AccordionTable";

const categories = ["Feb 11", "Feb 12", "Feb 13", "Feb 14", "Feb 15", "Feb 16", "Feb 17"];
const resolutionTime = [
    {
        name: "Ticket creation",
        data: [0.01, 0.01, 0.01, 0.01, 0.01, 0.01, 0.01],
        color: "blue",
        borderRadius: 2,
        pointWidth: 20,
    },
    {
        name: "Assignment to agent",
        data: [0.01, 0.01, 0.01, 0.01, 0.01, 0.01, 0.01],
        color: "green",
        borderRadius: 2,
        pointWidth: 20,
    },

];
const resolutionTimePerTeam = [
    {
        title: "Resolution time per team",
        columns: [{ label: 'Name' },
        { label: 'Avg.time from assignment to team', color: 'green' },
        { label: 'Avg.time from ticket creation', color: '#3357FF' }
        ],
        rows: [["Average", "0s", "0s"]],
    },
]
const resolutionTimePerAgent = [
    {
        title: "Resolution time per agent",
        columns: [{ label: 'Name' },
        { label: 'Avg.time from assignment to agent', color: 'green' },
        { label: 'Avg.time from ticket creation', color: '#3357FF' }
        ],
        rows: [["Average", "0s", "0s"]],
    },
]
const resolutionTimeBreakdown = [
    {
        title: "Resolution time breakdown",
        columns: ["Series", "Feb 11", "Feb 12", "Feb 13", "Feb 14", "Feb 15", "Feb 16", "Feb 17", "Total"],
        rows: [
            ["Avg. time from ticket creation", "-", "-", "-", "-", "-", "-", "-", "-"],
            ["Avg. time from assignment to agent", "-", "-", "-", "-", "-", "-", "-", "-"],

        ],
    },
];

const ResolutionTime = () => {
  
    return (
        <div className="reports_newtickets">

            <div className="main_container">

                <div className="new_tickets_graph">
                    <div>Resolution time</div>
                    <div className="source_series_container">
                        <div className="series_content">
                            <div className="series_name">
                                <div className="series_color rated_okseries"></div><span>Avg.time from ticket creation</span>
                            </div>
                            <div>0S</div>
                        </div>
                        <div className="series_content">
                            <div className="series_name">
                                <div className="series_color _series rated_greatseries"></div><span>Avg. time from assignment to agent</span>
                            </div>
                            <div>0S</div>
                        </div>

                    </div>

                    <ChartComponent categories={categories} series={resolutionTime} />
                    <div className="new_tickets_breakdown">
                        {resolutionTimePerTeam.map((tableData, index) => (
                            <AccordionTable key={index} {...tableData} isColored={true} />
                        ))}
                    </div>
                    <div className="new_tickets_breakdown">
                        {resolutionTimePerAgent.map((tableData, index) => (
                            <AccordionTable key={index} {...tableData} isColored={true} />
                        ))}
                    </div>
                    <div className="new_tickets_breakdown">
                        {resolutionTimeBreakdown.map((tableData, index) => (
                            <AccordionTable key={index} {...tableData} />
                        ))}
                    </div>
                </div>


            </div>
        </div>
    )
}
export default ResolutionTime;
