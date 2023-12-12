import { Link } from 'react-router-dom';
import { LoadingButton } from '@mui/lab';
import styles from './MyButton.style';

const MyButton = ({ children, to = '', loading = false, ...props }) => {
  if (to) {
    return (
      <Link to={to}>
        <LoadingButton sx={styles.root} loading={loading} {...props}>
          {children}
        </LoadingButton>
      </Link>
    );
  }

  return (
    <LoadingButton sx={styles.root} loading={loading} {...props}>
      {children}
    </LoadingButton>
  );
};

export default MyButton;
