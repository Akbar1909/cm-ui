import { Stack } from '@mui/material';
import BugTicket from './BugTicket';
import CommonTicket from './CommonTicket';

const cards = {
  bug_report: BugTicket
};

const TicketList = ({ type, list, cardSx }) => {
  const Card = cards[type] || CommonTicket;

  return (
    <Stack rowGap={'10px'}>
      {list.map((ticket, i) => (
        <Card ticket={ticket} key={i} sx={cardSx} />
      ))}
    </Stack>
  );
};

export default TicketList;
