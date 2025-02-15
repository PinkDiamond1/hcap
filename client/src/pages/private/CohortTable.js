import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import _orderBy from 'lodash/orderBy';

import { Box, Grid, Link } from '@material-ui/core';
import { Table, Button } from '../../components/generic';
import { formatCohortDate, keyedString } from '../../utils';
import { Routes } from '../../constants';

const columns = [
  { id: 'cohort_name', name: 'Cohort Name' },
  { id: 'start_date', name: 'Start Date' },
  { id: 'end_date', name: 'End Date' },
  { id: 'cohort_size', name: 'Cohort Size' },
  { id: 'remaining_seats', name: 'Remaining Seats' },
  { id: 'edit', name: '' },
];

export default ({ cohorts, editCohortAction }) => {
  const history = useHistory();

  // States
  const [order, setOrder] = useState('asc');
  const [rows, setRows] = useState(cohorts);

  const [orderBy, setOrderBy] = useState('start_date');

  // Actions
  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleEdit = (cohort) => {
    editCohortAction(cohort);
  };

  const handleCohortNav = (row) => {
    const { id } = row;
    const cohortDetailsPath = keyedString(Routes.CohortDetails, { id });
    history.push(cohortDetailsPath);
  };

  // Helpers
  const sort = (array) => _orderBy(array, [orderBy, 'operatorName'], [order]);

  const renderCell = (columnId, row) => {
    switch (columnId) {
      case 'cohort_name':
        return (
          <Link component='button' variant='body2' onClick={() => handleCohortNav(row)}>
            {row[columnId]}
          </Link>
        );
      case 'edit':
        return (
          <Button onClick={() => handleEdit(row)} variant='outlined' size='small' text='Edit' />
        );
      case 'start_date':
      case 'end_date':
        return formatCohortDate(row[columnId]);
      case 'remaining_seats':
        return row['cohort_size'] - row['participants'].length;
      default:
        return row[columnId];
    }
  };

  // Life Cycle Hooks
  useEffect(() => {
    setRows(cohorts);
  }, [cohorts]);

  return (
    <Grid
      container
      alignContent='flex-start'
      justify='flex-start'
      alignItems='center'
      direction='column'
    >
      <Box pt={2} pb={2} pl={2} pr={2} width='100%'>
        <Table
          columns={columns}
          order={order}
          orderBy={orderBy}
          onRequestSort={handleRequestSort}
          rows={sort(rows)}
          isLoading={false}
          renderCell={renderCell}
        />
      </Box>
    </Grid>
  );
};
