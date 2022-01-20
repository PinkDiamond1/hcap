import React, { lazy, useState } from 'react';
import Grid from '@material-ui/core/Grid';
import { Page, CheckPermissions, CustomTab, CustomTabs } from '../../components/generic';
import { AuthContext, ParticipantsContext } from '../../providers';

const ParticipantTable = lazy(() => import('./ParticipantTable'));
const SiteTable = lazy(() => import('./SiteTable'));

export default () => {
  const [tabValue, setTabValue] = useState(0);
  const { auth } = AuthContext.useAuth();
  const sites = auth.user?.sites || [];
  const roles = auth.user?.roles || [];

  const handleTabChange = (event, newTabValue) => {
    setTabValue(newTabValue);
  };

  return (
    <Page>
      <CheckPermissions
        permittedRoles={['employer', 'health_authority', 'ministry_of_health']}
        renderErrorMessage={true}
      >
        <Grid container justify='flex-start' alignItems='flex-start' direction='row'>
          <CustomTabs value={tabValue} onChange={handleTabChange} aria-label='tabs'>
            <CustomTab label='Participants' id='participantsTab' key='participants' />
            {roles.includes('superuser') && (
              <CustomTab label='My Sites' id='sitesTab' key='sites' />
            )}
          </CustomTabs>
        </Grid>
        <Grid container alignItems='center' justify='flex-start' direction='column'>
          {tabValue === 0 && (
            <ParticipantsContext.ParticipantsProvider role={auth.permissionRole}>
              <ParticipantTable />
            </ParticipantsContext.ParticipantsProvider>
          )}

          {tabValue === 1 && <SiteTable sites={sites} />}
        </Grid>
      </CheckPermissions>
    </Page>
  );
};
