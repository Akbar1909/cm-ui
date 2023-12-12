import { Alert } from '@mui/material';
import styles from './MyAlert.styles';

const MyAlert = ({ type, children, open = false, sx, ...props }) => {
  if (!open) {
    return null;
  }

  return (
    <Alert sx={[styles.root, ...(Array.isArray(sx) ? sx : [sx])]} severity={type} {...props}>
      {children}
    </Alert>
  );
};

export default MyAlert;
