// Participant Details Page
// Dependency
import pick from 'lodash/pick';
import React, { useEffect, useState, useMemo } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { Box, Card, Grid, Link, Typography, Button } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';

// Libs
import { useToast } from '../../hooks';
import { AuthContext } from '../../providers';
import { Page, CheckPermissions, Alert, Dialog } from '../../components/generic';
import { EditParticipantFormSchema, ToastStatus, Routes } from '../../constants';
import { EditParticipantForm } from '../../components/modal-forms';
import {
  updateParticipant,
  fetchParticipant,
  psi,
  assignParticipantWithCohort,
} from '../../services';

import { addYearToDate, dayUtils } from '../../utils';

// Sub component
import { PSICohortView } from '../../components/participant-details';

// Key Map
const keyLabelMap = {
  fullName: 'Full Name',
  phoneNumber: 'Phone Number',
  emailAddress: 'Email Address',
  interested: 'Program Interest',
  preferredLocation: 'Preferred Location',
  postalCodeFsa: 'Postal Code FSA',
  cohortName: 'Cohort / PSI',
  postHireStatusLabel: 'Graduation Status',
};

const rOSKeyMap = {
  rosSite: 'Current Site',
  healthAuthority: 'Health Authority (current site)',
  date: 'RoS Start Date',
  endDate: 'RoS End Date',
};

// Map Ros Data
const mapRosData = ({ data = {}, rosSite = {} }) => {
  const { date } = data;
  const { siteName, healthAuthority } = rosSite;
  return {
    date: dayUtils(date).format('MMM DD, YYYY'),
    endDate: addYearToDate(date).format('MMM DD, YYYY'),
    rosSite: siteName,
    healthAuthority,
  };
};

// Display Data
const displayData = (inputData) => ({
  ...pick(inputData, Object.keys(keyLabelMap)),
  fullName: `${inputData.firstName} ${inputData.lastName}`,
  interested:
    inputData.interested === 'yes'
      ? 'Interested'
      : inputData.interested === 'no'
      ? 'Withdrawn'
      : inputData.interested,
  ros:
    inputData.rosStatus && Object.keys(inputData.rosStatus).length
      ? mapRosData(inputData.rosStatus)
      : null,
});

// Custom style
const customStyle = makeStyles({
  rootContainer: {
    flexGrow: 1,
  },
  cardRoot: {
    minWidth: '1020px',
  },
});

// Helper
const fetchData = ({
  setParticipant,
  setActualParticipant,
  setPSIList,
  id,
  setError,
  setDisableAssign,
}) => {
  fetchParticipant({ id })
    .then((resp) => {
      setParticipant(displayData(resp));
      setActualParticipant(resp);
      if (
        resp.interested?.toLowerCase() === 'withdrawn' ||
        resp.interested?.toLowerCase() === 'no'
      ) {
        setDisableAssign(true);
        return;
      }

      psi()
        .then((list) => {
          setPSIList(list);
        })
        .catch((err) => {
          setError(`${err}`);
        });
    })
    .catch((err) => {
      setError(`${err}`);
    });
};

// Get Cohort name
const cohortName = (cohort) => `${cohort.cohort_name} / ${cohort.psi?.institute_name}`;

export default () => {
  // History
  const history = useHistory();
  // State
  const [error, setError] = useState(null);
  const [participant, setParticipant] = useState(null);
  const [actualParticipant, setActualParticipant] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [psiList, setPSIList] = useState([]);
  const [disableAssign, setDisableAssign] = useState(false);
  const [selectedCohort, setSelectedCohort] = useState(null);
  // Hook: Toast
  const { openToast } = useToast();
  // Auth context
  const { auth } = AuthContext.useAuth();
  // Memo roles
  const roles = useMemo(() => auth.user?.roles || [], [auth.user?.roles]);
  // Style classes
  const classes = customStyle();
  // Get param
  const { id, page, pageId } = useParams();
  // Breadcrumb name
  const linkName = page === 'participant' ? 'Participant' : 'Site View';
  // Edit Button flag
  const enableEdit = roles.some((role) => ['ministry_of_health', 'superuser'].includes(role));

  // UI Actions
  // 1. Show edit
  const showEditInfoModal = async () => setShowEditModal(true);
  // 2. Update Info
  const onUpdateInfo = async (values) => {
    setShowEditModal(false);
    try {
      const [updatedParticipant] = await updateParticipant(values, { ...actualParticipant });
      const mergedParticipant = { ...actualParticipant, ...updatedParticipant };
      setParticipant(displayData(mergedParticipant));
      setActualParticipant(mergedParticipant);
      openToast({
        status: ToastStatus.Info,
        message: `${participant.fullName} is successfully updated`,
      });
    } catch (err) {
      setError(`${err}`);
    }
  };

  const callAssignCohort = async (cohort) => {
    try {
      await assignParticipantWithCohort({ participantId: id, cohortId: cohort.id });
      openToast({
        status: ToastStatus.Success,
        message: `Participant is assigned to ${cohort.cohort_name}.`,
      });
      fetchData({
        setParticipant,
        setPSIList,
        setActualParticipant,
        setError,
        setDisableAssign,
        id,
      });
    } catch (error) {
      openToast({
        status: ToastStatus.Error,
        message: `${error}`,
      });
    }
  };

  // Confirmation Close
  const onClose = () => {
    setSelectedCohort(null);
  };

  // Navigate on link
  const navigateBackOnLink = () => {
    switch (linkName) {
      case 'Participant':
        history.push(Routes.ParticipantView);
        break;
      case 'Site View':
        history.push(Routes.SiteView + `/${pageId}`);
        break;
      default:
        history.goBack();
    }
  };

  // Rendering Hook
  useEffect(() => {
    fetchData({ setParticipant, setPSIList, setActualParticipant, setDisableAssign, setError, id });
  }, [setParticipant, setPSIList, setActualParticipant, setError, setDisableAssign, id]);

  // Render
  return (
    <Page isAutoHeight={true}>
      <CheckPermissions
        permittedRoles={['employer', 'health_authority', 'ministry_of_health']}
        renderErrorMessage={true}
      >
        {error && <Alert severity='error'>{error}</Alert>}
        {!participant && !error && <Alert severity='info'>Loading participant details</Alert>}
        {participant && (
          <Card className={classes.cardRoot}>
            {selectedCohort !== null && (
              <Dialog
                showDivider={true}
                title='Assign Cohort'
                open={selectedCohort !== null}
                onClose={onClose}
              >
                <DialogContent>
                  <Grid container spacing={4}>
                    <Grid item xs={12}>
                      <Grid container spacing={1}>
                        <Grid item xs={4}>
                          <Typography variant='body1'>Participant Name</Typography>
                        </Grid>
                        <Grid item xs={4}>
                          <Typography variant='body2'>{participant.fullName}</Typography>
                        </Grid>
                      </Grid>
                    </Grid>
                    <Grid item xs={12}>
                      <Grid container spacing={1}>
                        <Grid item xs={4}>
                          <Typography variant='body1'>Assign Cohort</Typography>
                        </Grid>
                        <Grid item xs={4}>
                          <Typography variant='body2'>{cohortName(selectedCohort)}</Typography>
                        </Grid>
                      </Grid>
                    </Grid>
                  </Grid>
                  <br />
                  <Box>
                    <Typography variant='body2'>
                      Are you sure that you would like to assign this participant to{' '}
                      <b>{cohortName(selectedCohort)}</b>.? Please review the above information
                      before proceeding.
                    </Typography>
                  </Box>
                </DialogContent>
                <DialogActions>
                  <Button variant='outlined' onClick={onClose} color='primary'>
                    Cancel
                  </Button>
                  <Button
                    variant='contained'
                    onClick={() => {
                      callAssignCohort({ ...selectedCohort });
                      onClose();
                    }}
                    color='primary'
                  >
                    Assign
                  </Button>
                </DialogActions>
              </Dialog>
            )}

            {/* Participant Info */}
            <Box pt={4} pb={2} pl={4} pr={4}>
              <Box pb={1}>
                <Typography variant='body1'>
                  <Link onClick={navigateBackOnLink}>{linkName}</Link> /{participant.fullName}
                </Typography>
              </Box>
              <Typography variant='h2'>Participant Details</Typography>
            </Box>

            <Box py={2} px={4}>
              <Grid className={classes.rootContainer} container spacing={2}>
                {Object.keys(keyLabelMap).map((key) => (
                  <Grid key={key} item xs={12} sm={6} xl={3}>
                    <Grid item xs={6}>
                      <Typography variant='body1'>
                        <b>{keyLabelMap[key]}</b>
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography test-id={'participantDetailsView' + key} variant='body1'>
                        {participant[key]}
                      </Typography>
                    </Grid>
                  </Grid>
                ))}
              </Grid>
            </Box>

            {/* Participant RoS Info */}
            <CheckPermissions
              permittedRoles={['health_authority', 'employer', 'ministry_of_health']}
            >
              {participant.ros && (
                <>
                  <Box pt={4} pb={2} pl={4} pr={4}>
                    <Typography variant='h2'>Return of Service</Typography>
                  </Box>

                  <Box py={2} px={4}>
                    <Grid className={classes.rootContainer} container spacing={2}>
                      {Object.keys(rOSKeyMap).map((key) => (
                        <Grid key={key} item xs={12} sm={6} xl={3}>
                          <Grid item xs={6}>
                            <Typography variant='body1'>
                              <b>{rOSKeyMap[key]}</b>
                            </Typography>
                          </Grid>
                          <Grid item xs={6}>
                            <Typography test-id={'participantDetailsRosView' + key} variant='body1'>
                              {participant.ros[key]}
                            </Typography>
                          </Grid>
                        </Grid>
                      ))}
                    </Grid>
                  </Box>
                </>
              )}
            </CheckPermissions>

            <Box px={4}>
              <Button
                test-id='editInfoButton'
                variant='outlined'
                disabled={!enableEdit}
                onClick={showEditInfoModal}
              >
                Edit Info
              </Button>
            </Box>

            {!participant.ros && (
              <>
                <CheckPermissions permittedRoles={['health_authority']}>
                  {!disableAssign && (
                    <PSICohortView
                      psiList={psiList}
                      assignAction={(cohort) => setSelectedCohort(cohort)}
                      participant={actualParticipant}
                      fetchData={() =>
                        fetchData({
                          setParticipant,
                          setPSIList,
                          setActualParticipant,
                          setDisableAssign,
                          setError,
                          id,
                        })
                      }
                    />
                  )}
                </CheckPermissions>
              </>
            )}
          </Card>
        )}
      </CheckPermissions>
      <>
        {showEditModal && actualParticipant && (
          <Dialog
            title='Edit Participant Info'
            open={showEditModal}
            onClose={() => setShowEditModal(false)}
          >
            <EditParticipantForm
              initialValues={actualParticipant}
              validationSchema={EditParticipantFormSchema}
              onSubmit={onUpdateInfo}
              onClose={() => {
                setShowEditModal(false);
                fetchData({
                  setParticipant,
                  setPSIList,
                  setActualParticipant,
                  setDisableAssign,
                  setError,
                  id,
                });
              }}
            />
          </Dialog>
        )}
      </>
    </Page>
  );
};
