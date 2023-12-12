import { Card, CardHeader, CardContent } from '@mui/material';

const CardWrapper = ({
  title,
  rootSx,
  headerSx,
  contentSx = { display: 'flex', justifyContent: 'center' },
  children
}) => {
  return (
    <Card sx={[{ p: '24px', boxShadow: 'none' }, ...(Array.isArray(rootSx) ? rootSx : [rootSx])]}>
      <CardHeader
        sx={[{ p: '0px' }, ...(Array.isArray(headerSx) ? headerSx : [headerSx])]}
        title={title}
      />
      <CardContent sx={[{ p: 0 }, ...(Array.isArray(contentSx) ? contentSx : [contentSx])]}>
        {children}
      </CardContent>
    </Card>
  );
};

export default CardWrapper;
