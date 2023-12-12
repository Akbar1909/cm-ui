import { Container } from '@mui/material';

const PageContentWrapper = ({ children, sx }) => {
  return (
    <Container maxWidth="xl" sx={[...(Array.isArray(sx) ? sx : [sx])]}>
      {children}
    </Container>
  );
};

export default PageContentWrapper;
