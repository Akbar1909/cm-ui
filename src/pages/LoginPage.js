import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { Navigate } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import { Container, Typography } from '@mui/material';
import useResponsive from '../hooks/useResponsive';
import Logo from '../components/logo';
import { LoginForm } from '../sections/auth/login';
import useAuth from 'hooks/helpers/useAuth';
// ----------------------------------------------------------------------

const StyledRoot = styled('div')(({ theme }) => ({
  [theme.breakpoints.up('md')]: {
    display: 'flex'
  }
}));

const StyledSection = styled('div')(({ theme }) => ({
  width: '100%',
  maxWidth: 480,
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  boxShadow: theme.customShadows.card,
  backgroundColor: theme.palette.background.default
}));

const StyledContent = styled('div')(({ theme }) => ({
  maxWidth: 480,
  margin: 'auto',
  minHeight: '100vh',
  display: 'flex',
  justifyContent: 'center',
  flexDirection: 'column',
  padding: theme.spacing(12, 0)
}));

// ----------------------------------------------------------------------

export default function LoginPage() {
  const isAuth = useAuth();
  const { t } = useTranslation();
  const mdUp = useResponsive('up', 'md');

  if (isAuth) {
    return <Navigate to="/dashboard" />;
  }

  return (
    <>
      <Helmet>
        <title> Login | Datagaze </title>
      </Helmet>

      <StyledRoot>
        <Logo
          sx={{
            position: 'fixed',
            top: { xs: 16, sm: 24, md: 40 },
            left: { xs: 16, sm: 24, md: 40 }
          }}
        />

        {mdUp && (
          <StyledSection>
            <Typography variant="h3" sx={{ px: 5, mt: 10, mb: 5 }}>
              Hi, Welcome Back
            </Typography>
            <img src="/assets/illustrations/illustration_login.png" alt="login" />
          </StyledSection>
        )}

        <Container maxWidth="sm">
          <StyledContent>
            <Typography variant="h4" gutterBottom>
              {t('Sign in to CM')}
            </Typography>
            <LoginForm />
          </StyledContent>
        </Container>
      </StyledRoot>
    </>
  );
}