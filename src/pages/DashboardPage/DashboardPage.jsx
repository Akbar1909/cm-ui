import { Helmet } from 'react-helmet-async';
import { Grid, Container } from '@mui/material';
import MyAnimatedCardNumber from 'components/MyAnimatedNumberCard';
import { useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';
import Diversity2Icon from '@mui/icons-material/Diversity2';
import DesktopWindowsIcon from '@mui/icons-material/DesktopWindows';
import BusinessCenterIcon from '@mui/icons-material/BusinessCenter';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import EventBusyIcon from '@mui/icons-material/EventBusy';
import AddReactionIcon from '@mui/icons-material/AddReaction';
import BugReportIcon from '@mui/icons-material/BugReport';
import EmojiNatureIcon from '@mui/icons-material/EmojiNature';
import PestControlIcon from '@mui/icons-material/PestControl';
import { httpGetClientCounts, httpGetClientCountsByContractDate } from 'data/client';
import Spinner from 'components/Spinner';
import { httpGetBugTicketCount, httpGetBugTicketCountsBySide } from 'data/ticket';
import LineGraph from './_components/LineGraph';
import ClientBugsPie from './_components/ClientBugsPie';
import ModuleBugsPie from './_components/ModuleBugsPie';
import DevBugsPie from './_components/DevBugsPie';
import OperatorBugsPie from './_components/OperatorBugsPie';
import SideBugsPie from './_components/SideBugsPie';
import ClientRequestPie from './_components/ClientRequestPie';
import useUser from 'hooks/helpers/useUser';
import { makeItMap } from 'utils/helpers';
import PageContentWrapper from 'components/PageContentWrapper';
import useUserStore from 'clientStore/useUserStore';

const styles = {
  piechartContainer: {
    '&>div': {
      height: '100%'
    }
  }
};

export default function DashboardPage() {
  const { t } = useTranslation();
  const { isClient } = useUser();
  const { project } = useUserStore();

  const projectId = project?.value;

  const clientCountState = useQuery({
    queryKey: ['client-counts', { projectId }],
    queryFn: () => httpGetClientCounts({ projectId }),
    select: (response) => response.data?.data
  });

  const bugCountState = useQuery({
    queryKey: ['bug-tickets-counts', { projectId }],
    queryFn: () => httpGetBugTicketCount({ projectId }),
    select: (response) => response.data?.data
  });

  const sideCountState = useQuery({
    queryKey: ['side-tickets-counts'],
    queryFn: httpGetBugTicketCountsBySide,
    select: (response) => makeItMap(response.data?.data, 'name')
  });

  const clientContractState = useQuery({
    queryKey: ['clients-contract'],
    queryFn: httpGetClientCountsByContractDate,
    select: (response) => response.data.data,
    enabled: !isClient
  });

  const {
    totalClientCount = 0,
    totalDeviceCount = 0,
    activeClientCount = 0,
    activeDeviceCount = 0
  } = clientCountState.data || {};

  return (
    <>
      <Helmet>
        <title> Dashboard </title>
      </Helmet>

      <PageContentWrapper>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Grid container spacing={3}>
              {!isClient && (
                <Grid item xs={12} sm={6}>
                  <Spinner loading={clientCountState.isLoading}>
                    <MyAnimatedCardNumber
                      label={t('Total clients')}
                      end={totalClientCount}
                      icon={<Diversity2Icon />}
                    />
                  </Spinner>
                </Grid>
              )}

              {!isClient && (
                <Grid item xs={12} sm={6}>
                  <Spinner loading={clientCountState.isLoading}>
                    <MyAnimatedCardNumber
                      label={t('Total Device Count')}
                      end={totalDeviceCount}
                      icon={<DesktopWindowsIcon />}
                    />
                  </Spinner>
                </Grid>
              )}
            </Grid>
          </Grid>

          <Grid item xs={12}>
            <Grid container spacing={3}>
              {!isClient && (
                <Grid item xs={12} sm={6} md={3}>
                  <Spinner loading={clientCountState.isLoading}>
                    <MyAnimatedCardNumber
                      label={t('Active Client Count')}
                      end={activeClientCount}
                      icon={<BusinessCenterIcon />}
                    />
                  </Spinner>
                </Grid>
              )}

              {!isClient && (
                <Grid item xs={12} sm={6} md={3}>
                  <Spinner loading={clientCountState.isLoading}>
                    <MyAnimatedCardNumber
                      label={t('Active Device Count')}
                      end={activeDeviceCount}
                      icon={<DesktopWindowsIcon />}
                    />
                  </Spinner>
                </Grid>
              )}
              {!isClient && (
                <Grid item xs={12} sm={6} md={3}>
                  <Spinner loading={clientContractState.isLoading}>
                    <MyAnimatedCardNumber
                      label={t('Active Contracts')}
                      end={clientContractState.data?.active || 0}
                      icon={<EventAvailableIcon />}
                    />
                  </Spinner>
                </Grid>
              )}

              {!isClient && (
                <Grid item xs={12} sm={6} md={3}>
                  <Spinner loading={clientContractState.isLoading}>
                    <MyAnimatedCardNumber
                      label={t('Expired Contracts')}
                      end={clientContractState.data?.deActive || 0}
                      icon={<EventBusyIcon />}
                    />
                  </Spinner>
                </Grid>
              )}
            </Grid>
          </Grid>

          <Grid item xs={12}>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6} md={3}>
                <Spinner loading={bugCountState.isLoading}>
                  <MyAnimatedCardNumber
                    label={t('Feature Requests')}
                    end={bugCountState.data?.request}
                    icon={<AddReactionIcon />}
                  />
                </Spinner>
              </Grid>

              <Grid item xs={12} sm={6} md={3}>
                <Spinner loading={bugCountState.isLoading}>
                  <MyAnimatedCardNumber
                    label={t('Open Bug Tickets')}
                    end={bugCountState.data?.bug}
                    icon={<BugReportIcon />}
                  />
                </Spinner>
              </Grid>

              <Grid item xs={12} sm={6} md={3}>
                <Spinner loading={bugCountState.isLoading}>
                  <MyAnimatedCardNumber
                    label={t('Front Side Bugs')}
                    end={sideCountState.data?.get('front_side')?.count ?? 0}
                    icon={<EmojiNatureIcon />}
                  />
                </Spinner>
              </Grid>

              <Grid item xs={12} sm={6} md={3}>
                <Spinner loading={bugCountState.isLoading}>
                  <MyAnimatedCardNumber
                    label={t('Back Side Bugs')}
                    end={sideCountState.data?.get('back_side')?.count ?? 0}
                    icon={<PestControlIcon />}
                  />
                </Spinner>
              </Grid>
            </Grid>
          </Grid>

          <Grid item xs={12}>
            <LineGraph />
          </Grid>

          <Grid item xs={12}>
            <Grid container alignItems="stretch" spacing={3}>
              {!isClient && (
                <Grid item xs={12} md={6} sx={styles.piechartContainer}>
                  <ClientBugsPie />
                </Grid>
              )}
              <Grid item xs={12} md={6} sx={styles.piechartContainer}>
                <ModuleBugsPie />
              </Grid>
              {isClient && (
                <Grid item xs={12} md={6} sx={styles.piechartContainer}>
                  <OperatorBugsPie />
                </Grid>
              )}
            </Grid>
          </Grid>

          <Grid item xs={12}>
            <Grid container alignItems="stretch" spacing={3}>
              {!isClient && (
                <Grid item xs={12} md={6} sx={styles.piechartContainer}>
                  <DevBugsPie />
                </Grid>
              )}
              {!isClient && (
                <Grid item xs={12} md={6} sx={styles.piechartContainer}>
                  <OperatorBugsPie />
                </Grid>
              )}
            </Grid>
          </Grid>

          <Grid item xs={12}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6} sx={styles.piechartContainer}>
                <SideBugsPie />
              </Grid>
              {!isClient && (
                <Grid item xs={12} md={6} sx={styles.piechartContainer}>
                  <ClientRequestPie />
                </Grid>
              )}
            </Grid>
          </Grid>
        </Grid>
      </PageContentWrapper>
    </>
  );
}
