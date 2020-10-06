import React, { useState } from 'react';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import { Formik, Form as FormikForm } from 'formik';
import { useHistory } from 'react-router-dom';

import { EmployeeFormSchema, Routes, ToastStatus } from '../../constants';
import { useToast } from '../../hooks';
import { scrollUp } from '../../utils';

import { Button } from '../generic';
import { Summary } from './Summary';
import { Fields } from './Fields';

export const Form = ({ initialValues, isDisabled }) => {
  const history = useHistory();
  const { openToast } = useToast();
  const [submitLoading, setSubmitLoading] = useState(false);

  const formValues = initialValues ? initialValues : {
    eligibility: '',
    firstName: '',
    lastName: '',
    phoneNumber: '',
    emailAddress: '',
    postalCode: '',
    preferredLocation: [],
    consent: '',
  };

  const handleSubmit = async (values) => {
    setSubmitLoading(true);

    const response = await fetch('/api/v1/form', {
      method: 'POST',
      headers: { 'Accept': 'application/json', 'Content-type': 'application/json' },
      body: JSON.stringify(values),
    });

    if (response.ok) {
      const { id, error } = await response.json();
      if (error) {
        openToast({ status: ToastStatus.Error, message: error.message || 'Failed to submit this form' });
      } else {
        history.push(Routes.EmployeeConfirmation, { formValues: values, id });
        return;
      }
    } else {
      openToast({ status: ToastStatus.Error, message: response.error || response.statusText || 'Server error' });
    }

    setSubmitLoading(false);
  };

  const handleSubmitButton = (submitForm) => {
    scrollUp();
    submitForm();
  };

  return (
    <Grid item xs={12} sm={isDisabled ? 12 : 11} md={isDisabled ? 12 : 10} lg={isDisabled ? 12 : 8} xl={isDisabled ? 12 : 6}>
      <Formik
        initialValues={formValues}
        validationSchema={EmployeeFormSchema}
        onSubmit={handleSubmit}
      >
        {({ errors, submitForm, setTouched, values }) => (
          <FormikForm>

            <Box pt={4} pb={4} pl={2} pr={2}>
              <Summary />
            </Box>

            <Box pt={2} pb={4} pl={2} pr={2}>
              <Fields isDisabled={isDisabled} />
            </Box>

            {!isDisabled && (
              <Box display="flex" justifyContent="center" pt={0} pb={4} pl={2} pr={2}>
                <Button
                  onClick={() => handleSubmitButton(submitForm)}
                  variant="contained"
                  color="primary"
                  fullWidth={false}
                  loading={submitLoading}
                  text="Submit"
                />
              </Box>)}
          </FormikForm>
        )}
      </Formik>
    </Grid>
  );
};
