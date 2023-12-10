import React from 'react';
import { InputAdornment, TextField } from '@mui/material';

const CustomTextField = ({ label, className, type = 'text', valueState = ["", (e) => { }], icon }) => {
  const [val, setVal] = valueState;

  return (
    <TextField
      label={label}
      variant="outlined"
      margin="normal"
      // size='small'
      type={type}
      value={val}
      onChange={(e) => { setVal(e.target.value) }}
      className={className}
      InputProps={{
        sx: { borderRadius: 3, },
        startAdornment: (
          <InputAdornment position="start">
            {icon}
          </InputAdornment>
        ),
      }}
    />
  )
}

export default CustomTextField;