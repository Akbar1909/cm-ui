import * as React from 'react';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import FormHelperText from '@mui/material/FormHelperText';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { forwardRef } from 'react';

const MySelect = forwardRef(
  (
    {
      options,
      label,
      helperText = '',
      error = false,
      readOnly = false,
      customSize = '',
      textAlign = 'left',
      rootSx,
      ...props
    },
    ref
  ) => {
    return (
      <Box sx={[{ minWidth: 120 }, ...(Array.isArray(rootSx) ? rootSx : [rootSx])]}>
        <FormControl
          fullWidth
          sx={[
            customSize === 'small' && { height: '30px', '&>div': { height: '100%' } },
            { '& .MuiSelect-select': { textAlign } }
          ]}>
          {label && <InputLabel id="demo-simple-select-label">{label}</InputLabel>}
          <Select readOnly={readOnly} ref={ref} label={label} {...props} error={error}>
            {options.map((option, i) => (
              <MenuItem
                sx={[textAlign === 'right' && { display: 'flex', justifyContent: 'flex-end' }]}
                value={option.value}
                key={i}>
                {option.label}
              </MenuItem>
            ))}
          </Select>
          {helperText && <FormHelperText error={error}>{helperText}</FormHelperText>}
        </FormControl>
      </Box>
    );
  }
);

export default MySelect;
