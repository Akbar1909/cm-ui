import MyButton from 'components/MyButton';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const MyBackButton = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  return (
    <MyButton startIcon={<ArrowBackIcon />} variant="contained" onClick={() => navigate(-1)}>
      {t('Back')}
    </MyButton>
  );
};

export default MyBackButton;
