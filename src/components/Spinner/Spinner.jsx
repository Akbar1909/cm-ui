import { useEffect, useRef } from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';

const Spinner = ({ loading, backgroundFetching = false, children }) => {
  const rootRef = useRef(null);

  useEffect(() => {
    if (!rootRef.current) {
      return;
    }
    const parent = rootRef.current.parentNode;

    parent.style.position = 'relative';
  }, []);

  if (!loading && !backgroundFetching) {
    return children;
  }

  return (
    <Box
      ref={rootRef}
      position="absolute"
      display="flex"
      alignItems="center"
      justifyContent="center"
      top="50%"
      left="50%"
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transform: 'translate(-50%,-50%)',
        backgroundColor: 'background.default',
        color: 'black',
        zIndex: 10,
        ...(backgroundFetching && { opacity: 0.5 })
      }}>
      <CircularProgress />
    </Box>
  );
};

export default Spinner;
