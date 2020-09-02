import React, { Fragment } from 'react';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import classNames from 'classnames';
import { makeStyles } from '@material-ui/core/styles';
import { ErrorMessage, useField } from 'formik';

import { InputFieldError, Button } from '../generic';

const useStyles = makeStyles((theme) => ({
  button: {
    boxShadow: 'none',
  },
  buttonError: {
    borderColor: theme.palette.error.main,
    '&:hover': {
      borderColor: theme.palette.error.main,
    },
  },
}));

export const RenderButtonGroup = ({
  field,
  form,
  options,
  ...props
}) => {
  const classes = useStyles();
  const [, , helpers] = useField(field.name);
  const { setValue } = helpers;
  const error = form.errors[field.name];
  return (
    <Fragment>
      <ButtonGroup
        orientation="vertical"
        fullWidth
        {...props}
      >
        {options.map((option) => (
          <Button
            className={classNames(classes.button, { [classes.buttonError]: !!error })}
            key={option.value}
            onClick={() => setValue(option.value)}
            variant={(option.value === field.value) ? 'contained' : 'outlined'}
            color={(option.value === field.value) ? option.color : 'primary'}
            text={option.label}
          />
        ))}
      </ButtonGroup>
      <InputFieldError error={<ErrorMessage name={field.name} />} />
    </Fragment>
  );
};
