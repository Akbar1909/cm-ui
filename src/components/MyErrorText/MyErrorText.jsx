import { useTranslation } from 'react-i18next';
import { Typography } from '@mui/material';
const MyErrorText = ({ message = null }) => {
  const { t } = useTranslation();

  return (
    <Typography variant="h5" sx={{ fontWeight: 600 }} component="span">
      {t(typeof message === 'string' ? message : 'Unexpected error occurred')}
    </Typography>
  );
};

export default MyErrorText;
