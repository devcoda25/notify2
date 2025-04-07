import React, { useState } from "react";
import { Accordion, AccordionSummary, AccordionDetails, Typography, Table, TableHead, TableRow, TableCell, TableBody } from '@mui/material';
import { ArrowForwardIosSharpIcon } from '../Icon';

const AccordionTable = ({ title, columns, rows, isColored = false }) => {
    return (
        <div className="reports_table">
            <Accordion defaultExpanded>
                <AccordionSummary>
                    <ArrowForwardIosSharpIcon className="accordion_icon" />
                    <Typography className='accordion_title'>
                        {title}
                    </Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <div style={{ overflowX: "auto" }}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    {columns.map((col, index) => {

                                        const columnLabel = typeof col === "string" ? col : col.label;
                                        const columnColor = typeof col === "object" && col.color ? col.color : null;
                                        return (
                                            <TableCell
                                                key={col}
                                                className={`tickets_breakdown_table_heading ${index % 2 !== 0 ? "" : "table_even_heading"
                                                    }`}

                                            >  <div style={{ display: 'flex' }}>
                                                    {isColored && col.color && (

                                                        <div className="table_header_column"
                                                            style={{ backgroundColor: columnColor }}
                                                        ></div>
                                                    )}
                                                    {columnLabel}
                                                </div>
                                            </TableCell>
                                        )
                                    })}
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {rows.map((row, rowIndex) => (
                                    <TableRow key={rowIndex}>
                                        {row.map((cell, cellIndex) => (
                                            <TableCell
                                                key={cellIndex}
                                                className={cellIndex % 2 === 0 ? "" : "breakdown_table_bodycell"}
                                            >
                                                {cell}
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </AccordionDetails>
            </Accordion>
        </div>
    )

}
export default AccordionTable;