import React from 'react';
import MuiTable from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import Skeleton from '@material-ui/lab/Skeleton';
import { withStyles } from '@material-ui/core/styles';

const StyledTableCell = withStyles((theme) => ({
  head: {
    ...theme.typography.body1,
    backgroundColor: theme.palette.common.white,
    color: '#333333',
  },
  body: {
    ...theme.typography.body1,
  }
}))(TableCell);

const StyledHeaderTableCell = withStyles((theme) => ({
  head: {
    ...theme.typography.body1,
    backgroundColor: theme.palette.common.white,
    borderBottom: `2px solid ${theme.palette.secondary.main}`,
  }
}))(TableCell);

const StyledTableRow = withStyles((theme) => ({
  root: {
    '&:nth-child(1)': {
      borderTop: `2px solid ${theme.palette.secondary.main}`
    },
    '&:nth-of-type(odd)': {
      backgroundColor: '#FAFAFA',
    },
    '&:nth-of-type(even)': {
      backgroundColor: '#FFFFFF',
    },
  },
  hover: {
    '&:hover': {
      backgroundColor: '#F0F7FF !important',
    },
  },
}))(TableRow);

export const Table = ({ order, orderBy, onRequestSort, columns, rows, isLoading }) => {

  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  return (
    <MuiTable
      stickyHeader>
      <TableHead>
        <TableRow>
          {columns.map((column, index) => (
            <StyledHeaderTableCell key={index}>
              <TableSortLabel
                active={orderBy === column.id}
                direction={orderBy === column.id ? order : 'asc'}
                onClick={createSortHandler(column.id)}>
                {column.name}
              </TableSortLabel>
            </StyledHeaderTableCell>
          ))}
        </TableRow>
      </TableHead>
      <TableBody>
        {isLoading ? [...Array(8)].map((_, i) => (
          <StyledTableRow key={i}>
            {[...Array(columns.length)].map((_, i) => (
              <StyledTableCell key={i}><Skeleton animation="wave" /></StyledTableCell>
            ))}
          </StyledTableRow>
        )) : rows.map((row, index) => (
          <StyledTableRow hover key={index}>
            {Object.keys(row).map((key) => (
              <StyledTableCell key={key}>{row[key]}</StyledTableCell>
            ))}
          </StyledTableRow>
        ))}
      </TableBody>
    </MuiTable>
  );
};
