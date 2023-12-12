import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { NavLink as RouterLink } from 'react-router-dom';
// @mui
import { Box, List, ListItemIcon, ListItemText } from '@mui/material';
//
import { StyledNavItem, styles } from './styles';
import useUser from 'hooks/helpers/useUser';

// ----------------------------------------------------------------------

NavSection.propTypes = {
  data: PropTypes.array
};

export default function NavSection({ data = [], ...other }) {
  const { t } = useTranslation();
  const user = useUser();

  return (
    <Box {...other}>
      <List disablePadding sx={{ p: 1 }}>
        {data.map((item) => {
          if (!item.roles.includes(user?.role?.name)) {
            return null;
          }
          return <NavItem key={t(item.title)} item={item} />;
        })}
      </List>
    </Box>
  );
}

// ----------------------------------------------------------------------

NavItem.propTypes = {
  item: PropTypes.object
};

function NavItem({ item }) {
  const { title, path, icon, info } = item;

  return (
    <StyledNavItem
      component={RouterLink}
      to={path}
      sx={{
        '&.active': {
          color: 'text.primary',
          bgcolor: 'action.selected',
          fontWeight: 'fontWeightBold'
        }
      }}>
      <ListItemIcon sx={styles.listItem}>{icon && icon}</ListItemIcon>

      <ListItemText disableTypography primary={title} />

      {info && info}
    </StyledNavItem>
  );
}
