import React from "react";
import ChartComponent from "./ChartComponent";
import AccordionTable from "./AccordionTable";

const categories = ["Feb 11", "Feb 12", "Feb 13", "Feb 14", "Feb 15", "Feb 16", "Feb 17"];
const handlingTimebyStatus = [
    {
        name: "Open status median",
        data: [0.01, 0.01, 0.01, 0.01, 0.01, 0.01, 0.01],
        color: "blue",
        borderRadius: 2,
        pointWidth: 15,
    },
    {
        name: "Pending status median",
        data: [0.01, 0.01, 0.01, 0.01, 0.01, 0.01, 0.01],
        color: "rgb(118, 118, 128)",
        borderRadius: 2,
        pointWidth: 15,
    },
    {
        name: "Onhold status median",
        data: [0.01, 0.01, 0.01, 0.01, 0.01, 0.01, 0.01],
        color: "rgb(145, 70, 255)",
        borderRadius: 2,
        pointWidth: 15,
    },

];
const handlingTimePerTeam = [
    {
        title: "Handling Time Per Team",
        columns: [{ label: 'Name' },
        { label: 'Open', color: 'blue' },
        { label: 'Pending', color: 'rgb(118, 118, 128)' },
        { label: 'onHold', color: 'rgb(145, 70, 255)' },
        { label: 'Resolution time' }
        ],
        rows: [["Median", "0s", "0s", "0s", "0s"]],
    },
]
const handlingTimePerAgent = [
    {
        title: "Handling Time Per Agent",
        columns: [{ label: 'Name' },
        { label: 'Open', color: 'blue' },
        { label: 'Pending', color: 'rgb(118, 118, 128)' },
        { label: 'onHold', color: 'rgb(145, 70, 255)' },
        { label: 'Resolution time' }
        ],
        rows: [["Median", "0s", "0s", "0s", "0s"]],
    },
]
const handlingTimeBreakdown = [
    {
        title: "Daily handling time breakdown",
        columns: ["Status", "Feb 11", "Feb 12", "Feb 13", "Feb 14", "Feb 15", "Feb 16", "Feb 17", "Total"],
        rows: [
            ["Open", "-", "-", "-", "-", "-", "-", "-", "-"],
            ["Pending", "-", "-", "-", "-", "-", "-", "-", "-"],
            ["On hold", "-", "-", "-", "-", "-", "-", "-", "-"],

        ],
    },
];

const HandlingTimebyStatus = () => {
 
    return (
        <div className="reports_newtickets">

            <div className="main_container">
                <p className="handlingtime_text">Data shown below is based on either solved and/or closed tickets from the selected period</p>
                <div className="new_tickets_graph">
                    <div>Handling time by status</div>
                    <div className="source_series_container">
                        <div className="series_content">
                            <div className="series_name">
                                <div className="series_color rated_okseries"></div><span>Open status median</span>
                            </div>
                            <div>0S</div>
                        </div>
                        <div className="series_content">
                            <div className="series_name">
                                <div className="series_color pending_status"></div><span>Pending status median</span>
                            </div>
                            <div>0S</div>
                        </div>
                        <div className="series_content">
                            <div className="series_name">
                                <div className="series_color onhold_status"></div><span>On hold status median</span>
                            </div>
                            <div>0S</div>
                        </div>
                    </div>

                    <ChartComponent categories={categories} series={handlingTimebyStatus} />
                    <div className="new_tickets_breakdown">
                        {handlingTimePerTeam.map((tableData, index) => (
                            <AccordionTable key={index} {...tableData} isColored={true} />
                        ))}
                    </div>
                    <div className="new_tickets_breakdown">
                        {handlingTimePerAgent.map((tableData, index) => (
                            <AccordionTable key={index} {...tableData} isColored={true} />
                        ))}
                    </div>
                    <div className="new_tickets_breakdown">
                        {handlingTimeBreakdown.map((tableData, index) => (
                            <AccordionTable key={index} {...tableData} />
                        ))}
                    </div>
                </div>


            </div>
        </div>
    )
}
export default HandlingTimebyStatus;
