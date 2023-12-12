import { Typography, Box, Link } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { Link as NavLink } from 'react-router-dom';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { getTicketPrimaryColor } from 'utils/helpers';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import PestControlIcon from '@mui/icons-material/PestControl';
import styles from './Ticket.styles';
import { globalStyles } from 'theme/globalStyles';
import MyTooltip from 'components/MyTooltip';
import { FileTransferSvg, DialogSvg } from 'assets/svg';

const TicketHeader = ({ name, type, id }) => {
  const theme = useTheme();
  return (
    <Box sx={[styles.baseHeader]}>
      <Box display="flex" alignItems="center" justifyContent="center" mr="8px">
        {type === 'file_exchange' ? (
          <FileTransferSvg fill={theme.palette.primary.main} />
        ) : type === 'request' ? (
          <DialogSvg fill={theme.palette.primary.main} />
        ) : type === 'task_done' ? (
          <CheckBoxIcon sx={{ color: (theme) => theme.palette.primary.main }} />
        ) : (
          <PestControlIcon sx={{ color: (theme) => theme.palette.primary.main }} />
        )}
      </Box>
      <MyTooltip title={name}>
        <Typography
          children={name}
          sx={[
            globalStyles.ellipsis(1),
            { color: (theme) => theme.palette.common.treeCards.text.main }
          ]}
        />
      </MyTooltip>
    </Box>
  );
};

export default TicketHeader;
