import React, { useState } from "react";
import NewTickets from "../Component/Reports/NewTickets";
import TicketSatisfaction from "../Component/Reports/TicketSatisfaction";
import AuditLog from '../Component/Reports/AuditLog';
import FirstResponseTime from '../Component/Reports/FirstResponseTime';
import GenerateReport from '../Component/Reports/GenerateReport';
import HandlingTimebyStatus from '../Component/Reports/HandlingTimebyStatus';
import ResolutionTime from '../Component/Reports/ResolutionTime';
import SolvedandClosed from '../Component/Reports/SolvedandClosed';
import StraightIcon from '@mui/icons-material/Straight';
import LocalOfferOutlinedIcon from '@mui/icons-material/LocalOfferOutlined';
import WorkspacesOutlinedIcon from '@mui/icons-material/WorkspacesOutlined';
import TranslateOutlinedIcon from '@mui/icons-material/TranslateOutlined';


const Reports = () => {
    const [activeContent, setActiveContent] = useState('new tickets');
    const handleNavigationClick = (e, content) => {
        e.preventDefault();
        setActiveContent(content);
    };

    const renderContent = () => {
        switch (activeContent) {
            case 'new tickets':
                return <NewTickets />
            case 'tickets satisfsction':
                return <TicketSatisfaction />
            case 'first response time':
                return <FirstResponseTime />
            case 'resolution time':
                return <ResolutionTime />
            case 'handling time by status':
                return <HandlingTimebyStatus />
            case 'solved and closed':
                return <SolvedandClosed />
            case 'generate report':
                return <GenerateReport />
            case 'audit log':
                return <AuditLog />
            default:
                return <NewTickets />
        }
    }
    const [isAddFilter, setIsAddFilter] = useState(false);
    const handleAddFilter = () => {
        setIsAddFilter(!isAddFilter)
    }
    return (
        <div className='maincontent'>


            <div className='msgCont'>

                <div className='msgContL analytics__left__content'>
                    <li className='solo'><a href='#' onClick={(e) => handleNavigationClick(e, 'new tickets')}><span className='leftbar__item__title' >New Tickets</span></a></li>
                    <li ><a href='#' onClick={(e) => handleNavigationClick(e, 'tickets satisfsction')}><span className='leftbar__item__title'>Ticket satisfaction</span></a></li>
                    <li ><a href='#' onClick={(e) => handleNavigationClick(e, 'first response time')}><span className='leftbar__item__title'>First response time</span></a></li>
                    <li ><a href='#' onClick={(e) => handleNavigationClick(e, 'resolution time')}><span className='leftbar__item__title'>Resolution time</span></a></li>
                    <li ><a href='#' onClick={(e) => handleNavigationClick(e, 'handling time by status')}><span className='leftbar__item__title'>Handling time by status</span></a></li>
                    <li ><a href='#' onClick={(e) => handleNavigationClick(e, 'solved and closed')}><span className='leftbar__item__title'>Solved and closed</span></a></li>
                    <li ><a href='#' onClick={(e) => handleNavigationClick(e, 'generate report')}><span className='leftbar__item__title'>Generate report</span></a></li>
                    <li ><a href='#' onClick={(e) => handleNavigationClick(e, 'audit log')}><span className='leftbar__item__title'>Audit log</span></a></li>
                </div>
                <div className='msgContR'>
                    <div className="reports_style">
                        <div className="header">
                            <div className="header_left">
                                <label>Filters:</label>
                                <button className="add_filter_btn" onClick={handleAddFilter}>+ Add filter</button>
                                {
                                    isAddFilter && (
                                        <div className="popup_container">
                                            <ul>
                                                <li><StraightIcon />Priority</li>
                                                <li><LocalOfferOutlinedIcon />Tag</li>
                                                <li><WorkspacesOutlinedIcon />Team</li>
                                                <li><TranslateOutlinedIcon />Language</li>
                                            </ul>
                                        </div>
                                    )
                                }
                            </div>
                        </div>
                    </div>
                    {renderContent()}
                </div>
            </div>

        </div>
    )
}
export default Reports;