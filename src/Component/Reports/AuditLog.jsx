import React from "react";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography } from "@mui/material";
import { Business, Person } from "@mui/icons-material";

const AuditLog =()=>{
    const data = [
        { change: "Report generator delete", madeBy: "System (by HelpDesk)", date: "Feb 20, 2025, 11:19:23 AM", icon: <Business /> },
        { change: "Report generator update", madeBy: "System (by HelpDesk)", date: "Feb 20, 2025, 11:19:23 AM", icon: <Business /> },
        { change: "Report generator update", madeBy: "System (by HelpDesk)", date: "Feb 20, 2025, 11:19:23 AM", icon: <Business /> },
       
        {
            change: "Report generator create",
            madeBy: "Team1",
            email: "Team1@gmail.com",
            device: "Chrome on Windows",
            date: "Feb 20, 2025, 11:19:14 AM",
            icon: <Business />,
          },
        {
          change: "Agent update",
          madeBy: "Team1",
          email: "Team1@gmail.com",
          device: "Chrome on Windows",
          date: "Feb 20, 2025, 10:05:53 AM",
          icon: <Person />,
        },
        {
            change: "Agent update",
            madeBy: "Team1",
            email: "Team1@gmail.com",
            device: "Chrome on Windows",
            date: "Feb 20, 2025, 10:05:53 AM",
            icon: <Person />,
          },
      ];
    return(
        <TableContainer >
      <Table className="audit_table">
        <TableHead>
          <TableRow>
            <TableCell><strong>Change</strong></TableCell>
            <TableCell><strong>Made by</strong></TableCell>
            <TableCell><strong>Date</strong></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((row, index) => (
            <TableRow key={index} className="audit_body_row">
              <TableCell>
                {row.icon} {row.change}
              </TableCell>
              <TableCell>
                <Typography variant="body1">{row.madeBy}</Typography>
                {row.email && (
                  <>
                    <Typography >{row.email}</Typography>
                    <Typography>{row.device}</Typography>
                    <Typography>IP: {row.ip}</Typography>
                  </>
                )}
              </TableCell>
              <TableCell>{row.date}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default AuditLog;
