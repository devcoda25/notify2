import React from "react";
import MuiAccordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

const styles={
    accordionSummary: {
        fontSize: '12px',
        fontWeight: 700,
        color: 'black',
    },
    accordionDetails:{
        fontSize:'14px'
    }
}
const CustomAccordion = ({ label }) => {
    return (
        <>
            <MuiAccordion>
                <AccordionSummary sx={{ ...styles.accordionSummary }}
                    expandIcon={<ArrowForwardIosIcon sx={{ fontSize: '13px' }} />}>
                    {label}
                </AccordionSummary>
                <AccordionDetails sx={{...styles.accordionDetails}}>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse
                    malesuada lacus ex, sit amet blandit leo lobortis eget.
                </AccordionDetails>
            </MuiAccordion>
        </>
    )
}
export default CustomAccordion;
