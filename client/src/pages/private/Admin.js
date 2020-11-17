import React, { useEffect, useState } from 'react';
import Grid from '@material-ui/core/Grid';
import { Box, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { useHistory } from 'react-router-dom';
import { Page, Button } from '../../components/generic';
import { Routes } from '../../constants';
import store from 'store';

const useStyles = makeStyles((theme) => ({
  button: {
    marginTop: theme.spacing(3),
  },
}));

export default () => {

  const [roles, setRoles] = useState([]);
  const history = useHistory();
  const classes = useStyles();

  const fetchRoles = async () => {
    const response = await fetch('/api/v1/roles', {
      headers: {
        'Authorization': `Bearer ${store.get('TOKEN')}`,
      },
      method: 'GET',
    });

    if (response.ok) {
      const { roles } = await response.json();
      setRoles(roles);
    }
  }

  useEffect(() => {
    fetchRoles();
  }, []);

  const renderAdminButton = (key, route, label) => <Button
    key={key}
    className={classes.button}
    onClick={async () => {
      history.push(route);
    }}
    variant="contained"
    color="primary"
    fullWidth={false}
    text={label}
  />;

  return (
    <Page >
      <Grid container alignContent="center" justify="center" alignItems="center" direction="column">
        <Box pb={4} pl={4} pr={4} pt={2}>
          <Grid container direction="column">
            {
              roles.length === 0 ?
                <Typography variant="subtitle1" gutterBottom>
                  You don't have enough permissions.
              </Typography>
                :
                roles.includes('admin') ?
                  [
                    renderAdminButton(0, Routes.ApplicantUpload, 'Upload Applicants'),
                    renderAdminButton(1, Routes.EOIView, 'Expressions of Interest'),
                  ]
                  :
                  roles.map((item, index) => {
                    switch (item) {
                      case 'maximus':
                        return renderAdminButton(index, Routes.ApplicantUpload, 'Upload Applicants');
                      default:
                        return null
                    }
                  })
            }
          </Grid>
        </Box>
      </Grid>
    </Page>
  );
};
