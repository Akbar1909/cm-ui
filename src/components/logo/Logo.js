import PropTypes from 'prop-types';
import { forwardRef } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Box, Link } from '@mui/material';
import useThemeStore from 'clientStore/useThemeStore';

// ----------------------------------------------------------------------

const Logo = forwardRef(({ disabledLink = false, sx }) => {
  const { mode } = useThemeStore();

  const logo = (
    <Box
      component="img"
      src={`/assets/logo_${mode}.svg`}
      sx={{ width: 200, height: 40, cursor: 'pointer', ...sx }}
    />
  );

  if (disabledLink) {
    return <>{logo}</>;
  }

  return (
    <Link to="/" component={RouterLink} sx={{ display: 'contents' }}>
      {logo}
    </Link>
  );
});

Logo.propTypes = {
  sx: PropTypes.object,
  disabledLink: PropTypes.bool
};

export default Logo;
