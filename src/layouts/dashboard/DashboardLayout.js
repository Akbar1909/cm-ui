import { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import Header from './header';
import Nav from './nav';
import { useQuery } from '@tanstack/react-query';
import { httpGetMe } from 'data/user';
import useUserStore from 'clientStore/useUserStore';
import AppErrorBoundary from 'components/AppErrorBoundary';
import { t } from 'i18next';

// ----------------------------------------------------------------------

const APP_BAR_MOBILE = 64;
const APP_BAR_DESKTOP = 54;

const StyledRoot = styled('div')({
  display: 'flex',
  minHeight: '100%',
  overflow: 'hidden'
});

const Main = styled('div')(({ theme }) => ({
  flexGrow: 1,
  overflow: 'auto',
  minHeight: '100%',
  paddingTop: APP_BAR_MOBILE + 24,
  paddingBottom: theme.spacing(10),
  [theme.breakpoints.up('lg')]: {
    paddingTop: '20px',
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2)
  }
}));

// ----------------------------------------------------------------------

export default function DashboardLayout() {
  const [open, setOpen] = useState(false);

  const { setUser, setProject } = useUserStore();

  const queryMeState = useQuery({
    queryKey: ['me'],
    queryFn: httpGetMe,
    select: (response) => response.data?.data
  });

  useEffect(() => {
    if (queryMeState.isSuccess) {
      const { data } = queryMeState;

      const { role } = data;

      const projects = [
        ...data.projects.map((project) => ({
          label: project.projectName,
          value: project.projectId
        })),
        ...(role.name === 'manager' ? [{ label: t('All'), value: '' }] : [])
      ];
      setUser({
        ...data,
        projects
      });

      setProject(role.name === 'manager' ? projects.at(-1) : projects[0]);
    }
  }, [queryMeState.isSuccess, queryMeState.data, setUser]);

  return (
    <StyledRoot>
      <Header onOpenNav={() => setOpen(true)} />

      <Nav openNav={open} onCloseNav={() => setOpen(false)} />

      <Main sx={{ backgroundColor: 'background.secondary' }}>
        <AppErrorBoundary>
          <Outlet />
        </AppErrorBoundary>
      </Main>
    </StyledRoot>
  );
}
