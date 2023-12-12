import { useRef } from 'react';
import { Box, Typography } from '@mui/material';
import styles from './Ticket.styles';
import { extractTextFromHTML } from 'utils/helpers';

const TicketContent = ({ description }) => {
  const rootRef = useRef();

  const handleClick = () => {
    const overflow = window.getComputedStyle(rootRef.current).getPropertyValue('overflow');

    if (overflow === 'hidden') {
      rootRef.current.style.overflow = 'visible';
      rootRef.current.style.flex = 1;
    } else {
      rootRef.current.style.overflow = 'hidden';
      rootRef.current.style.flex = '0 1 auto';
    }
  };

  return (
    <Box onClick={handleClick} ref={rootRef} sx={[styles.baseContent, { overflow: 'hidden' }]}>
      <Typography sx={{ textAlign: 'left' }} children={extractTextFromHTML(description)} />
    </Box>
  );
};

export default TicketContent;
