import React from "react";
import ChartComponent from "./ChartComponent";
import { SentimentSatisfiedAltIcon, SentimentSatisfiedIcon, SentimentVeryDissatisfiedIcon } from '../Icon'

const categories = ["Fri", "Sat", "Sun", "Mon", "Tue", "Wed", "Thu"];

const ticketReports = [
    {
        name: "Data",
        data: [0.01, 0.01, 0.01, 0.01, 0.01, 0.01, 4,],
        color: "green",
        borderRadius: 1,
        pointWidth: 40,
    },
];

const TicketReports = () => {
  
    return (
        <div className="reports_newtickets">

            <div className="main_container">
                <div className="new_tickets_graph">
                    <div>New Tickets</div>
                    <div>4</div>

                    <ChartComponent categories={categories} series={ticketReports} />

                    <div className="ticket_report_container">
                        <div className="ticket_report_content">
                            <div>Solved tickets</div>
                            <div className="report_percentage">0</div>
                        </div>
                        <div className="ticket_report_content">
                            <div>Closed tickets</div>
                            <div className="report_percentage">0</div>
                        </div>
                        <div className="ticket_report_content">
                            <div>Avg. response time</div>
                            <div className="report_percentage">0s</div>
                        </div>
                        <div className="ticket_report_content">
                            <div>Rated great</div>
                            <div className="report_percentage"><SentimentSatisfiedAltIcon style={{ color: 'green' }} />0%</div>
                        </div>
                        <div className="ticket_report_content">
                            <div>Rated Okay</div>
                            <div className="report_percentage"><SentimentSatisfiedIcon />0%</div>
                        </div>
                        <div className="ticket_report_content">
                            <div>Rated bad</div>
                            <div className="report_percentage"><SentimentVeryDissatisfiedIcon style={{ color: 'red' }} />0%</div>
                        </div>

                    </div>
                </div>


            </div>
        </div>
    )

}
export default TicketReports;