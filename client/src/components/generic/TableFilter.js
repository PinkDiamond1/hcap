import React, { useState } from 'react';
import { MenuItem, TextField } from '@material-ui/core';

export const TableFilter = ({ onFilter, values, label, rows, filterField }) => {

  const [selectedValue, setValue] = useState();

  const handleFilter = (element) => {
    const { value } = element.target;
    setValue(value);
    const isValidOption = values.includes(value);
    if (isValidOption) {
      (value === "None")?
      onFilter(rows.filter(row => !(row[filterField])))
      :
      onFilter(rows.filter(row => row[filterField].includes(value)));
    } else {
      onFilter(rows);
    }
  };

  return (<TextField
    select
    fullWidth
    variant="filled"
    inputProps={{ displayEmpty: true }}
    value={selectedValue || ''}
    onChange={handleFilter}
  >
    <MenuItem value="">{label}</MenuItem>
    {values.map((option) => (
      <MenuItem key={option} value={option}>{option}</MenuItem>
    ))}
  </TextField>);
};
