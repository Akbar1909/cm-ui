import { Box } from '@mui/material';
import styles from './UserProfileWidget.styles';
import MyTooltip from 'components/MyTooltip';

const UserProfileWidget = ({ firstName = '', lastName = '', sx, size = 30 }) => {
  const content = `${firstName[0]}${lastName[0]}`.toUpperCase();

  return (
    <MyTooltip title={`${firstName} ${lastName}`}>
      <Box
        sx={[
          styles.root,
          {
            width: size,
            height: size
          },
          ...(Array.isArray(sx) ? sx : [sx])
        ]}>
        {content}
      </Box>
    </MyTooltip>
  );
};

export default UserProfileWidget;
