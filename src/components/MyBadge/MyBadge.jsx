import { Box } from '@mui/material';
import styles from './MyBadge.styles';

const MyBadge = ({ sx, children, mode = 'idle' }) => {
  return <Box sx={[styles.root, styles[mode], ...(Array.isArray(sx) ? sx : [sx])]}>{children}</Box>;
};

export default MyBadge;
