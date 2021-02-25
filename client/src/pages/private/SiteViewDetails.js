import React, { useEffect, useState } from 'react';
import { Button, Card, Dialog, Divider, Page, CheckPermissions } from '../../components/generic';
import { Box, Grid, Link, Typography } from '@material-ui/core';
import { scrollUp } from '../../utils';
import store from 'store';
import routes from '../../constants/routes';
import { EditSiteForm } from '../../components/modal-forms';
import { useToast } from '../../hooks';
import {
  ToastStatus,
  EditSiteSchema,
} from '../../constants';

export default ({ match }) => {

  const { openToast } = useToast();
  const [roles, setRoles] = useState([]);
  const [site, setSite] = useState([]);
  const [isLoadingUser, setLoadingUser] = useState(false);
  const [activeModalForm, setActiveModalForm] = useState(null);
  const id = match.params.id;

  const fetchUserInfo = async () => {
    setLoadingUser(true);
    const response = await fetch('/api/v1/user', {
      headers: {
        'Authorization': `Bearer ${store.get('TOKEN')}`,
      },
      method: 'GET',
    });

    if (response.ok) {
      const { roles } = await response.json();
      setLoadingUser(false);
      setRoles(roles);
    }
  }

  const handleSiteEdit = async (site) => {
    const response = await fetch(`/api/v1/employer-sites/${id}`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${store.get('TOKEN')}`,
        'Accept': 'application/json',
        'Content-type': 'application/json',
      },
      body: JSON.stringify(site),
    });

    if (response.ok) {
      const { error } = await response.json();
      if (error) {
        openToast({ status: ToastStatus.Error, message: error.message || 'Failed to submit this form' });
      } else {
        setActiveModalForm(null);
        fetchDetails(id)
      }
    } else {
      openToast({ status: ToastStatus.Error, message: response.error || response.statusText || 'Server error' });
    }
  };

  useEffect(() => {
    fetchUserInfo();
  }, []);

  const fetchDetails = async (id) => {
    const response = await fetch(`/api/v1/employer-sites/${id}`, {
      headers: {
        'Authorization': `Bearer ${store.get('TOKEN')}`,
      },
      method: 'GET',
    });

    if (response.ok) {
      setSite(await response.json());
    }
  }

  useEffect(() => {
    fetchDetails(id);
  }, [id]);

  const fieldsLabelMap = {
    'Site Contact': {
      'First Name': 'siteContactFirstName',
      'Last Name': 'siteContactLastName',
      'Phone Number': 'siteContactPhone',
      'Email Address': 'siteContactEmail',
    },
    'Site Info': {
      'Site Name': 'siteName',
      'Business Name': 'registeredBusinessName',
      'Address': 'address',
      'Postal Code': 'postalCode',
      'City': 'city',
      'Phase 1 Allocation': 'phaseOneAllocation',
      'Region': 'healthAuthority',
    },
    'Operator Contact Info': {
      'First Name': 'operatorContactFirstName',
      'Last Name': 'operatorContactLastName',
      'Phone Number': 'operatorPhone',
      'Email Address': 'operatorEmail',
    },
  };

  const defaultOnClose = () => {
    setActiveModalForm(null);
  };

  scrollUp();
  return (
    <>
      <Dialog
        title={`Edit Site (${site.siteName})`}
        open={activeModalForm != null}
        onClose={defaultOnClose}
      >
        {activeModalForm === 'edit-site' && <EditSiteForm
          initialValues={{
            siteContactFirstName: site.siteContactFirstName,
            siteContactLastName: site.siteContactLastName,
            siteName: site.siteName,
            registeredBusinessName: site.registeredBusinessName,
            address: site.address,
            postalCode: site.postalCode,
            phaseOneAllocation: site.phaseOneAllocation,
            operatorContactFirstName: site.operatorContactFirstName,
            operatorContactLastName: site.operatorContactLastName,
            operatorPhone: site.operatorPhone,
            operatorEmail: site.operatorEmail,
          }}
          validationSchema={EditSiteSchema}
          onSubmit={(values) => {
            const history = {
              timestamp: new Date(),
              changes: [],
            };
            Object.keys(values).forEach(key => {
              if (values[key] !== site[key]) {
                history.changes.push({
                  field: key,
                  from: site[key],
                  to: values[key],
                });
              }
            });
            handleSiteEdit({
              siteContactFirstName: values.siteContactFirstName,
              siteContactLastName: values.siteContactLastName,
              siteName: values.siteName,
              registeredBusinessName: values.registeredBusinessName,
              address: values.address,
              postalCode: values.postalCode,
              phaseOneAllocation: values.phaseOneAllocation,
              operatorContactFirstName: values.operatorContactFirstName,
              operatorContactLastName: values.operatorContactLastName,
              operatorPhone: values.operatorPhone,
              operatorEmail: values.operatorEmail,
              history: (site.history) ? [history, ...site.history] : [history],
            });
          }}
          onClose={defaultOnClose}
        />}
      </Dialog>
      <Page>
        <CheckPermissions isLoading={isLoadingUser} roles={roles} permittedRoles={['health_authority', 'ministry_of_health']} renderErrorMessage={true}>
          <Card>
            <Box pt={4} pb={2} pl={4} pr={4}>
              <Box pb={4}>
                <Box pb={2}>
                  <Typography variant="body1">
                    <Link to={routes.SiteView}>Sites</Link> / {site.siteName}
                  </Typography>
                </Box>
                <Grid container>
                  <Typography variant="h2">
                    <b>Site Details</b>
                  </Typography>
                  <Divider />
                  <Box pl={2} pt={0.5}>
                    <Button
                      onClick={async () => {
                        setActiveModalForm('edit-site');
                      }}
                      variant="outlined"
                      fullWidth={false}
                      size="small"
                      text="Edit"
                    />
                  </Box>
                </Grid>
              </Box>
              <Grid container>
                {
                  Object.keys(fieldsLabelMap).map(title =>
                    <Grid key={title} item>
                      <Box pr={12}>
                        <Box pb={2}>
                          <Typography variant="subtitle1">
                            <b>{title}</b>
                          </Typography>
                        </Box>
                        {
                          Object.keys(fieldsLabelMap[title]).map(subTitle =>
                            <Grid key={subTitle}
                              justify="space-between"
                              container>
                              <Grid item>
                                <Box pr={4} pb={1}>
                                  <Typography variant="body1">
                                    <b>{subTitle}</b>
                                  </Typography>
                                </Box>
                              </Grid>
                              <Grid item>
                                <Typography variant="body1">
                                  {site[fieldsLabelMap[title][subTitle]]}
                                </Typography>
                              </Grid>
                            </Grid>)
                        }
                      </Box>
                    </Grid>)
                }
              </Grid>
            </Box>
          </Card>
        </CheckPermissions>
      </Page>
    </>
  );
};
