import { forwardRef, useState } from 'react';
import MyTextField from './MyTextField';
import { IconButton, InputAdornment, TextField } from '@mui/material';
import Iconify from 'components/iconify';

const MyPasswordField = forwardRef((props, ref) => {
  const [showPassword, setShowPassword] = useState(false);
  return (
    <MyTextField
      type={showPassword ? 'text' : 'password'}
      InputProps={{
        endAdornment: (
          <InputAdornment position="end">
            <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
              <Iconify icon={showPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
            </IconButton>
          </InputAdornment>
        )
      }}
      ref={ref}
      {...props}
    />
  );
});

export default MyPasswordField;
