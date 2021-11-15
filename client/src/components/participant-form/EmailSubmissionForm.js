import React from 'react';
import { Field, Formik, Form as FormikForm } from 'formik';

import { Box, Icon, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import NotificationsActiveIcon from '@material-ui/icons/NotificationsActive';

import { RenderTextField } from '../fields';
import { Button } from '../generic';
import { EmailSubmissionSchema } from '../../constants';

const useStyles = makeStyles((theme) => ({
  submissionInputContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    flexGrow: '1',
    width: '20rem',
    [theme.breakpoints.down('sm')]: {
      width: '100%',
    },
  },
  submissionForm: {
    display: 'flex',
    gap: '1rem',
    alignItems: 'flex-start',
    [theme.breakpoints.down('sm')]: {
      width: 'auto',
      margin: '1rem',
      flexDirection: 'column',
      gap: '0',
    },
  },
  submissionButton: {
    marginTop: '1rem',
    minWidth: '8.5rem',
    whiteSpace: 'nowrap',
    [theme.breakpoints.down('sm')]: {
      width: '100%',
    },
  },
  submissionHeader: {
    color: '#1a5a96',
    marginBottom: '1rem',
    textAlign: 'center',
    [theme.breakpoints.down('sm')]: {
      margin: '0 1rem 1rem 1rem',
      fontSize: '1.5rem',
      lineHeight: '1.75rem',
    },
  },
}));

export const EmailSubmissionForm = () => {
  const classes = useStyles();

  const handleSubmit = async (values, { setSubmitting }) => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    setSubmitting(false);
  };
  return (
    <Formik
      initialValues={{ email: '' }}
      validationSchema={EmailSubmissionSchema}
      onSubmit={handleSubmit}
    >
      {({ isSubmitting }) => (
        <FormikForm className={classes.submissionForm}>
          <Box className={classes.submissionInputContainer}>
            <Field
              name='email'
              component={RenderTextField}
              label='Email'
              placeholder='Type your email here'
            />
          </Box>
          <Button
            type='submit'
            variant='contained'
            color='primary'
            loading={isSubmitting}
            className={classes.submissionButton}
            text={
              <Box display='flex' alignItems='center'>
                <Icon component={NotificationsActiveIcon} style={{ marginRight: '.5rem' }} />
                Notify me
              </Box>
            }
            fullWidth={false}
          />
        </FormikForm>
      )}
    </Formik>
  );
};

export const EmailSubmissionHeader = () => {
  const classes = useStyles();

  return (
    <Typography variant='subtitle1' className={classes.submissionHeader}>
      Get notified when the submissions are open
    </Typography>
  );
};
