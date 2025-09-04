import React from "react";
import ChartComponent from "./ChartComponent";
import AccordionTable from "./AccordionTable";

const categories = ["Feb 11", "Feb 12", "Feb 13", "Feb 14", "Feb 15", "Feb 16", "Feb 17"];
const ticketSatisfaction = [
    {
        name: "Rated great",
        data: [0.01, 0.01, 0.01, 0.01, 0.01, 0.01, 0.01],
        color: "green",
        borderRadius: 1,
        pointWidth: 15,
    },
    {
        name: "Rated okay",
        data: [0.01, 0.01, 0.01, 0.01, 0.01, 0.01, 0.01],
        color: "blue",
        borderRadius: 1,
        pointWidth: 15,
    },
    {
        name: "Rated bad",
        data: [0.01, 0.01, 0.01, 0.01, 0.01, 0.01, 0.01],
        color: "red",
        borderRadius: 1,
        pointWidth: 15,
    },
];
const satisfactionTableperTeam = [
    {
        title: "Ticket satisfaction per team",
        columns: [{ label: 'Name' },
        { label: 'Rated okay', color: '#3357FF' },
        { label: 'Rated bad', color: '#FF5733' },
        { label: 'Rated great', color: '#33FF57' }

        ],
        rows: [["Rating", "0%", "0%", "0%"]],
    },
]
const satisfactionTableperAgent = [
    {
        title: "Ticket satisfaction per agent",
        columns: [{ label: 'Name' },
        { label: 'Rated okay', color: '#3357FF' },
        { label: 'Rated bad', color: '#FF5733' },
        { label: 'Rated great', color: '#33FF57' }

        ],
        rows: [["Rating", "0%", "0%", "0%"]],
    },
]
const ticketSatisfactionBreakdown = [
    {
        title: "Ticket satisfaction breakdown",
        columns: ["Series", "Feb 11", "Feb 12", "Feb 13", "Feb 14", "Feb 15", "Feb 16", "Feb 17", "Total"],
        rows: [
            ["Rated great", "0", "0", "0", "0", "0", "0", "0", "0"],
            ["Rated okay", "0", "0", "0", "0", "0", "0", "0", "0"],
            ["Rated bad", "0", "0", "0", "0", "0", "0", "0", "0"],
        ],
    },
];

const TicketSatisfaction = () => {

    return (
        <div className="reports_newtickets">

            <div className="main_container">

                <div className="new_tickets_graph">
                    <div>Ticket satisfaction</div>
                    <div className="source_series_container">
                        <div className="series_content">
                            <div className="series_name">
                                <div className="series_color rated_greatseries"></div><span>Rated great</span>
                            </div>
                            <div>0 (0%)</div>
                        </div>
                        <div className="series_content">
                            <div className="series_name">
                                <div className="series_color _series rated_okseries"></div><span>Rated okay</span>
                            </div>
                            <div>0 (0%)</div>
                        </div>
                        <div className="series_content">
                            <div className="series_name">
                                <div className="series_color "></div><span>Rated bad</span>
                            </div>
                            <div>0 (0%)</div>
                        </div>
                    </div>

                    <ChartComponent categories={categories} series={ticketSatisfaction} />
                    <div className="new_tickets_breakdown">
                        {satisfactionTableperTeam.map((tableData, index) => (
                            <AccordionTable key={index} {...tableData} isColored={true} />
                        ))}
                    </div>
                    <div className="new_tickets_breakdown">
                        {satisfactionTableperAgent.map((tableData, index) => (
                            <AccordionTable key={index} {...tableData} isColored={true} />
                        ))}
                    </div>
                    <div className="new_tickets_breakdown">
                        {ticketSatisfactionBreakdown.map((tableData, index) => (
                            <AccordionTable key={index} {...tableData} />
                        ))}
                    </div>
                </div>


            </div>
        </div>
    )
}
export default TicketSatisfaction;
