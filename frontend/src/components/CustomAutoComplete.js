import React from 'react'
import { Autocomplete, InputAdornment, TextField } from '@mui/material';
import { styled } from '@mui/system';

const StyledAutocomplete = styled(Autocomplete)`
  .MuiInputBase-root {
    border-radius: 12px;
  }
`;

const CustomAutoComplete = ({ label, valueState = ["", (e) => { }], options, width, icon }) => {
  const [value, setValue] = valueState;

  return (
    <StyledAutocomplete
      value={value}
      onChange={(event, newValue) => {
        setValue(newValue);
      }}
      options={options}
      sx={{ width: width }}
      renderInput={(params) => <TextField
        {...params}
        label={label}
        variant="outlined"
        margin="normal"
        InputProps={{
          ...params.InputProps,
          startAdornment: (
            <InputAdornment position="start">
              {icon}
            </InputAdornment>
          ),
        }}
      />
      }
    />
  );
};
export default CustomAutoComplete