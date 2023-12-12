import { Box } from '@mui/material';
import { useTheme } from '@mui/material/styles';

const HorizontalWrapper = ({ sx, children }) => {
  const theme = useTheme();
  return (
    <Box
      sx={[
        { backgroundColor: theme.palette.grey[1000], borderRadius: '10px', py: '15px', px: '22px' },
        ...(Array.isArray(sx) ? sx : [sx])
      ]}>
      {children}
    </Box>
  );
};

export default HorizontalWrapper;
