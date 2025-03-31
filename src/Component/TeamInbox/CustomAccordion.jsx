import React from "react";
import MuiAccordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import style from "../MuiStyles/muiStyle";
import {ArrowForwardIosIcon} from '../Icon';


const CustomAccordion = ({ label }) => {
    return (
        <>
            <MuiAccordion>
                <AccordionSummary sx={{ ...style.accordionSummary }}
                    expandIcon={<ArrowForwardIosIcon sx={{ fontSize: '13px' }} />}>
                    {label}
                </AccordionSummary>
                <AccordionDetails sx={{...style.accordionDetails}}>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse
                    malesuada lacus ex, sit amet blandit leo lobortis eget.
                </AccordionDetails>
            </MuiAccordion>
        </>
    )
}
export default CustomAccordion;
