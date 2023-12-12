import { useTheme, Box } from '@mui/material';
import { ClockLoader } from 'react-spinners';

const styles = {
  root: {
    width: '100vw',
    height: '100vh',
    backgroundColor: (theme) => theme.palette.background.white
  }
};

const PageSpinner = () => {
  const theme = useTheme();

  return (
    <Box sx={styles.root} display="flex" alignItems="center" justifyContent="center">
      <ClockLoader size={60} color={theme.palette.primary.dark} />
    </Box>
  );
};

export default PageSpinner;
