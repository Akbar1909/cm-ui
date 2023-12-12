import { Box, Stack, Typography } from '@mui/material';
import TicketList from 'components/Ticket/TicketList';
import styles from './TicketsTreeView.styles';
import { globalStyles } from 'theme/globalStyles';

const TreeHead = ({ clientName }) => (
  <Stack direction="column" sx={styles.head}>
    <Box className="logo" mb={1}></Box>
    <Typography
      children={clientName}
      sx={[
        globalStyles.ellipsis(1),
        { color: (theme) => theme.palette.common.treeCards.text.main }
      ]}
      variant="subtitle1"
    />
  </Stack>
);

const TicketsTreeView = ({
  bug_report = [],
  request = [],
  task_done = [],
  file_exchange = [],
  clientName = ''
}) => {
  return (
    <Box sx={styles.tree}>
      <ul style={{ position: 'absolute', top: '-50px' }}>
        <li style={{ width: '100%', paddingRight: '0px' }}>
          <TreeHead clientName={clientName} />
          <ul>
            <li style={styles.listItem}>
              <TicketList type="task_done" list={task_done || [{}]} cardSx={styles.cardSx} />
            </li>
            <li style={styles.listItem}>
              <TicketList type="bug_report" list={bug_report} cardSx={styles.cardSx} />
            </li>
            <li style={styles.listItem}>
              <TicketList type="file_exchange" list={file_exchange} cardSx={styles.cardSx} />
            </li>
            <li style={{ ...styles.listItem, paddingRight: '0px' }}>
              <TicketList type="request" list={request} cardSx={styles.cardSx} />
            </li>
          </ul>
        </li>
      </ul>
    </Box>
  );
};

export default TicketsTreeView;
