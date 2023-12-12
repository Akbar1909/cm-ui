import { Stack, Typography } from '@mui/material';
import MyBackButton from 'components/MyBackButton';

const PageHeader = ({ title, sx, right }) => {
  return (
    <Stack
      sx={[{ mb: '20px' }, ...(Array.isArray(sx) ? sx : [sx])]}
      direction="row"
      alignItems="center"
      justifyContent="space-between">
      <Typography variant="h4" gutterBottom children={title} />
      {right || <MyBackButton />}
    </Stack>
  );
};

export default PageHeader;
