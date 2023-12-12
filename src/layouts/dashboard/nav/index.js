import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Box,
  Drawer,
  Stack,
  IconButton,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  useTheme,
  Hidden,
  Icon
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import useResponsive from 'hooks/useResponsive';
import Logo from 'components/logo';
import Scrollbar from 'components/scrollbar';
import NavSection from 'components/nav-section';
import useNavConfig from './useNavConfig';
import { useQueryClient } from '@tanstack/react-query';
import LanguagePopover from '../header/LanguagePopover';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import useThemeStore from 'clientStore/useThemeStore';
import { joinArray } from 'utils/helpers';
import LogoutIcon from '@mui/icons-material/Logout';
import useAuthStore from 'clientStore/useAuthStore';
import { globalStyles } from 'theme/globalStyles';
import MySelect from 'components/MySelect';
import useOrganization from 'hooks/api/useOrganization';
import useProject from 'hooks/api/useProject';
import LanguageIcon from '@mui/icons-material/Language';
import useUserStore from 'clientStore/useUserStore';
import MyAutoComplete from 'components/MyAutoComplete';
import useUser from 'hooks/helpers/useUser';

const NAV_WIDTH = 280;

const styles = {
  iconButton: {
    width: '32px',
    height: '32px',
    minWidth: '32px',
    minHeight: '32px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: 'common.secondary',
    border: '0.7px solid'
  }
};

export default function Nav({ openNav, onCloseNav }) {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const navConfig = useNavConfig();
  const queryClient = useQueryClient();
  const { projects } = useUser();
  const { setAccessToken } = useAuthStore();
  const { setProject, project } = useUserStore();
  const theme = useTheme();
  const { data, status } = queryClient.getQueryState(['me']);

  const [expanded, setExpanded] = useState(false);

  const isDesktop = useResponsive('up', 'lg');

  const { setTheme, mode } = useThemeStore();

  const toggleTheme = () => {
    setTheme(mode === 'dark' ? 'light' : 'dark');
  };

  useEffect(() => {
    if (openNav) {
      onCloseNav();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  const { firstName = '', lastName = '', role } = data?.data?.data || {};

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  const logout = () => {
    setAccessToken(null);
    navigate('/', { replace: true });
  };

  const ProfileCollapse = (
    <Accordion expanded={expanded === 'user'} onChange={handleChange('user')}>
      <AccordionSummary>
        <Stack direction="row" columnGap={'12px'} width="100%">
          <Box
            display="flex"
            alignItems="center"
            justifyContent="center"
            sx={{
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              backgroundColor: theme.palette.background.default
            }}>
            {firstName[0]}
            {lastName[0]}
          </Box>
          <Stack direction="column">
            <Stack direction="row" alignItems="center" columnGap={'8px'}>
              <Typography
                variant="body1"
                color={theme.palette.grey[800]}
                sx={[globalStyles.ellipsis(1), { width: 130 }]}
                children={joinArray([firstName, lastName])}
              />
            </Stack>
            <Typography variant="caption" color={theme.palette.grey[600]} children={role?.name} />
          </Stack>
          <IconButton
            size="small"
            sx={[{ ml: 'auto' }, styles.iconButton]}
            children={!expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
          />
        </Stack>
      </AccordionSummary>
      <AccordionDetails>
        <MyAutoComplete
          creatable={false}
          multiple={false}
          enableOnBlur={false}
          fullWidth
          options={projects}
          onChange={setProject}
          value={project}
        />
        <Stack direction="row" alignItems="center" mt={2}>
          <LanguagePopover />
          <IconButton p={0} onClick={toggleTheme} color="inherit">
            {mode === 'dark' ? (
              <Brightness7Icon sx={{ color: (theme) => theme.palette.primary.main }} />
            ) : (
              <Brightness4Icon sx={{ color: (theme) => theme.palette.grey[900] }} />
            )}
          </IconButton>

          <IconButton
            size="small"
            sx={[
              {
                ml: 'auto',
                width: 26,
                heigh: 26,
                border: 'none',
                borderRadius: '3px',
                backgroundColor: (theme) => theme.palette.error.main,
                '&:hover': {
                  backgroundColor: (theme) => theme.palette.error.main
                }
              }
            ]}
            onClick={logout}
            children={
              <LogoutIcon
                sx={{ color: (theme) => theme.palette.background.paper }}
                fontSize="small"
              />
            }
          />
        </Stack>
      </AccordionDetails>
    </Accordion>
  );

  const renderContent = status === 'success' && (
    <Scrollbar
      sx={{
        height: 1,
        display: 'flex',
        flexDirection: 'column',
        '& .simplebar-content': {
          height: 1,
          display: 'flex',
          flexDirection: 'column'
        }
      }}>
      <Hidden lgDown>
        <Box sx={{ px: 2.5, py: 3, display: 'inline-flex' }}>
          <Logo />
        </Box>
      </Hidden>

      <NavSection data={navConfig} />

      <Box sx={{ flexGrow: 1, marginTop: 'auto' }} />
      {ProfileCollapse}
    </Scrollbar>
  );

  return (
    <Box
      component="nav"
      sx={{
        flexShrink: { lg: 0 },
        width: { lg: NAV_WIDTH }
      }}>
      {isDesktop ? (
        <Drawer
          open
          variant="permanent"
          PaperProps={{
            sx: {
              width: NAV_WIDTH,
              bgcolor: 'background.default',
              borderRightStyle: 'dashed'
            }
          }}>
          {renderContent}
        </Drawer>
      ) : (
        <Drawer
          open={openNav}
          onClose={onCloseNav}
          ModalProps={{
            keepMounted: true
          }}
          PaperProps={{
            sx: { width: NAV_WIDTH }
          }}>
          {renderContent}
        </Drawer>
      )}
    </Box>
  );
}
