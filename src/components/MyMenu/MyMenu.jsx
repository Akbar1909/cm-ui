import { MenuItem, Popover, useTheme } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const MyMenu = ({ open, handleClose, items, onClick }) => {
  return (
    <Popover
      open={Boolean(open)}
      anchorEl={open}
      onClose={handleClose}
      anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
      transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      onClick={onClick && onClick}
      PaperProps={{
        sx: {
          boxShadow: 'none',
          p: 1,
          width: 140,
          '& .MuiMenuItem-root': {
            px: 1,
            typography: 'body2',
            borderRadius: 0.75
          }
        }
      }}>
      {items.map((item, i) => (
        <MenuItem key={i} onClick={item.onClick && item.onClick} sx={item.sx} {...item.args}>
          <FontAwesomeIcon icon={item.icon} style={{ marginRight: '5px' }} />
          {item.content}
        </MenuItem>
      ))}
    </Popover>
  );
};

export default MyMenu;
