
import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
} from "@mui/material";
import { EditIcon, DeleteOutlineIcon,ContentCopyIcon } from "./Icon";
import style from "./MuiStyles/muiStyle";

const TableComponent = ({ columns, data,onCopy, onEdit, onDelete, showActions = true,showCopy=false, customRenderCell, customStyle = {}, actionHeaderLabel = "Edit/Delete", }) => {
  return (
    <TableContainer
      component={Paper} sx={style.tablecontainer}
    >
      <Table sx={{ borderCollapse: "separate", borderSpacing: 0 }}>
        <TableHead>
          <TableRow
            sx={style.table}
          >
            {columns.map((column) => (
              <TableCell key={column.id} sx={{
                ...style.tableheaderCell,
                ...(customStyle.headerCell || {}),
                ...(column.width ? { width: column.width, maxWidth: column.width } : {}),
              }}>{column.label}</TableCell>
            ))}
            {showActions && (
              <TableCell sx={{
                ...style.tableheaderCell,
                ...(customStyle.headerCell || {}),
              }}>{actionHeaderLabel}</TableCell>
            )}
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((row, index) => (
            <TableRow
              key={index}

            >
              {columns.map((column) => (
                <TableCell key={column.id} sx={{ ...style.tablebodyCell, ...(column.width ? { width: column.width, maxWidth: column.width } : {}), }}>
                  {customRenderCell
                    ? customRenderCell(row, column)
                    : row[column.id]}
                </TableCell>

              ))}
              {showActions && (

                <TableCell sx={{ ...style.tablebodyCell, ...style.tableiconBodyStyle }}>
                  <IconButton
                    onClick={() => onCopy(row.id)}
                    sx={[style.tableIconBtn, style.tableeditHover]}
                  >
                    <ContentCopyIcon />
                  </IconButton>
                  <IconButton
                    onClick={() => onEdit(row.id)}
                    sx={[style.tableIconBtn, style.tableeditHover]} >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    onClick={() => onDelete(row.id)}
                    sx={[style.tableIconBtn, style.tabledeleteHover]} >
                    <DeleteOutlineIcon />
                  </IconButton>
                </TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default TableComponent;
