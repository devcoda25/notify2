import React, { useState } from "react";
import { Accordion, AccordionSummary, AccordionDetails, Typography, Table, TableHead, TableRow, TableCell, TableBody } from '@mui/material';
import ArrowForwardIosSharpIcon from '@mui/icons-material/ArrowForwardIosSharp';

const AccordionTable = ({ title, columns, rows, isColored = false }) => {
    return (
        <div className="reports_table">
            <Accordion defaultExpanded>
                <AccordionSummary>
                    <ArrowForwardIosSharpIcon style={{ color: "blue", marginRight: 8 }} />
                    <Typography style={{ color: "black", fontWeight: "600", fontSize: "15px" }}>
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

                                                        <div
                                                            style={{
                                                                width: "15px",
                                                                height: "15px",
                                                                backgroundColor: columnColor,
                                                                marginRight: "8px",
                                                                borderRadius: "3px",
                                                            }}
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