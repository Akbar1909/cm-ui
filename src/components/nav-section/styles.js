// @mui
import { styled } from '@mui/material/styles';
import { ListItemButton } from '@mui/material';

export const StyledNavItem = styled((props) => <ListItemButton disableGutters {...props} />)(
  ({ theme }) => ({
    ...theme.typography.body2,
    height: 48,
    position: 'relative',
    textTransform: 'capitalize',
    color: theme.palette.text.secondary,
    borderRadius: theme.shape.borderRadius
  })
);

export const styles = {
  listItem: {
    width: 22,
    height: 22,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    '& svg': {
      color: (theme) => theme.palette.primary.main
    }
  }
};
