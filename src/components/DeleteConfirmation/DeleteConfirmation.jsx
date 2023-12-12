import { Stack, Typography } from '@mui/material';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import { useTranslation } from 'react-i18next';

const styles = {
  icon: {
    width: '70px',
    height: '70px',
    color: (theme) => theme.palette.error.main
  }
};

const DeleteConfirmation = () => {
  const { t } = useTranslation();
  return (
    <Stack alignItems="center" p="8px" rowGap={'20px'}>
      <HighlightOffIcon sx={styles.icon} />
      <Typography
        sx={{ color: (theme) => theme.palette.grey[900], fontSize: '2rem' }}
        variant="subtitle1"
        children={t('Are you sure ?')}
      />
      <Typography
        sx={{ textAlign: 'center', color: (theme) => theme.palette.grey[500] }}
        variant="subtitle1"
        children={t('Do you really want to delete this record? This process can not be undone')}
      />
    </Stack>
  );
};

export default DeleteConfirmation;
