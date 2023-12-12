import { Stack, Box, Typography } from '@mui/material';
import styles from './Ticket.styles';
import TicketHeader from './TicketHeader';
import TicketContent from './TicketContent';

const { bug: commonStyles } = styles;

const CommonTicket = ({ ticket = {}, sx }) => {
  const { status: type, regDate, description, name, id } = ticket;

  return (
    <Stack sx={[styles.baseRoot, commonStyles.root, ...(Array.isArray(sx) ? sx : [sx])]}>
      <TicketHeader type={type} name={name} id={id} />
      <TicketContent description={description} />
      <Stack columnGap={'4px'} direction="row" alignItems="center" sx={styles.baseFooter}>
        <Typography
          variant="caption"
          sx={{ ml: 'auto', color: (theme) => theme.palette.common.treeCards.text.main }}
          className="subtitle1"
          children={regDate}
        />
      </Stack>
    </Stack>
  );
};

export default CommonTicket;
