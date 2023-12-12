import { createPortal } from 'react-dom';
import { Box } from '@mui/material';

const MyOverlay = ({ open, handleClick }) => {
  if (!open) {
    return null;
  }

  return createPortal(
    <Box
      onClick={handleClick}
      aria-hidden
      data-testid="overlay"
      sx={{
        width: '100vw',
        height: '100vh',
        position: 'fixed',
        backgroundColor: 'common.black',
        opacity: '0.3',
        zIndex: 9999,
        top: 0,
        left: 0,
        right: 0,
        bottom: 0
      }}
    />,
    document.body,
    'overlay'
  );
};

export default MyOverlay;
