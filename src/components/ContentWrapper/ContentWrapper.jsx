import { Card } from '@mui/material';

const ContentWrapper = ({ children, sx }) => {
  return (
    <Card
      sx={[
        { boxShadow: 'none', py: 4, backgroundColor: 'background.default' },
        ...(Array.isArray(sx) ? sx : [sx])
      ]}>
      {children}
    </Card>
  );
};

export default ContentWrapper;
