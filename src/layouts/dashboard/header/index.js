import PropTypes from 'prop-types';
import { styled, useTheme } from '@mui/material/styles';
import { AppBar, Toolbar, IconButton, Hidden, Box } from '@mui/material';
import { bgBlur } from '../../../utils/cssStyles';
import Iconify from '../../../components/iconify';
import Logo from 'components/logo';

const NAV_WIDTH = 280;

const HEADER_MOBILE = 64;

const HEADER_DESKTOP = 72;

const StyledRoot = styled(AppBar)(({ theme }) => ({
  ...bgBlur({ color: theme.palette.common.layout.secondary }),
  boxShadow: 'none',
  [theme.breakpoints.up('lg')]: {
    width: `calc(100% - ${NAV_WIDTH + 1}px)`
  },
  [theme.breakpoints.up('lg')]: {
    display: 'none'
  }
}));

const StyledToolbar = styled(Toolbar)(({ theme }) => ({
  minHeight: HEADER_MOBILE,
  display: 'flex',
  alignItems: 'center',
  [theme.breakpoints.up('lg')]: {
    minHeight: HEADER_DESKTOP,
    padding: theme.spacing(0, 5)
  },
  [theme.breakpoints.down('lg')]: {
    position: 'relative'
  }
}));

// ----------------------------------------------------------------------

Header.propTypes = {
  onOpenNav: PropTypes.func
};

export default function Header({ onOpenNav }) {
  const theme = useTheme();

  return (
    <StyledRoot>
      <StyledToolbar>
        <IconButton
          onClick={onOpenNav}
          sx={{
            mr: 1,
            color: 'text.primary',
            display: { lg: 'none' }
          }}>
          <Iconify icon="eva:menu-2-fill" />
        </IconButton>
        <Hidden lgUp>
          <Box sx={{ position: 'absolute', left: '50%', transform: 'translateX(-50%)' }}>
            <Logo />
          </Box>
        </Hidden>
      </StyledToolbar>
    </StyledRoot>
  );
}
