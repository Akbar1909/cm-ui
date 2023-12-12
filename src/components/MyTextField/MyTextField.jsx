import { forwardRef, useEffect, useState } from 'react';
import TextField from '@mui/material/TextField';
import ClearIcon from '@mui/icons-material/Clear';
import IconButton from '@mui/material/IconButton';

const MyTextField = forwardRef(
  (
    { size = 'medium', fullWidth = true, sx, clearable = false, InputProps, value, ...props },
    ref
  ) => {
    const [showClearIcon, setShowClearIcon] = useState(() => clearable && value);

    const handleFocus = (e) => {
      if (value) {
        setShowClearIcon(true);
      }

      props.onFocus && props.onFocus(e);
    };

    const handleChange = (e) => {
      if (e.target.value) {
        setShowClearIcon(true);
      } else {
        setShowClearIcon(false);
      }

      props.onChange && props.onChange(e);
    };

    const handleClear = () => {
      props.onClear && props.onClear();
    };

    useEffect(() => {
      if (!value) {
        setShowClearIcon(false);
      }
    }, [value]);

    return (
      <TextField
        sx={[fullWidth && { width: '100%', ...(Array.isArray(sx) ? sx : [sx]) }]}
        size={size}
        inputRef={ref}
        {...props}
        onFocus={handleFocus}
        onChange={handleChange}
        value={value}
        InputProps={{
          endAdornment: showClearIcon ? (
            <IconButton size="small" onClick={handleClear}>
              <ClearIcon />
            </IconButton>
          ) : null,
          ...InputProps
        }}
      />
    );
  }
);

export default MyTextField;
