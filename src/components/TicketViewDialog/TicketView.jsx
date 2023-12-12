import { Stack, Typography, Box, Grid } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useQuery } from '@tanstack/react-query';
import PestControlIcon from '@mui/icons-material/PestControl';
import styles from './TicketView.styles';
import { useTranslation } from 'react-i18next';
import ImageView from 'components/ImageView';
import { httpGetTicketById } from 'data/ticket';
import { prepareTicketForView } from 'data/ticket/ticket.service';
import Spinner from 'components/Spinner';
import { joinArray } from 'utils/helpers';
import { DATE_UI_FORMAT_WITH_SLASH, TIME_AM_PM, formatTimeForUI } from 'services/time';
import FileWidget from 'components/MyFileUploader/FileWidget';
import {
  faUserTie,
  faCalendarPlus,
  faCalendarCheck,
  faBug
} from '@fortawesome/free-solid-svg-icons';
import { TICKET_TYPE_ICONS } from 'utils/common';

const InfoCard = ({ title, subtitle, role, icon, photoUrl }) => {
  return (
    <Stack>
      <Stack direction="row">
        <Box mr="5px">{icon}</Box>
        <Typography
          sx={{ color: 'common.text.main' }}
          display="flex"
          alignItems="center"
          mb={'10px'}>
          {title}:
        </Typography>
      </Stack>

      <Stack direction="row">
        {photoUrl && <ImageView />}
        <Stack ml={photoUrl ? '9px' : 0}>
          <Typography variant="h6" children={subtitle} />
          <Typography sx={{ color: 'common.text.main' }} children={role} />
        </Stack>
      </Stack>
    </Stack>
  );
};

const TicketView = ({ id }) => {
  const { t } = useTranslation();
  const theme = useTheme();

  const ticketState = useQuery({
    queryKey: ['tickets', id],
    queryFn: () => httpGetTicketById(id),
    select: (response) => prepareTicketForView(response.data?.data)
  });

  const { data, isLoading } = ticketState;

  const [regDate, regTime, ampm] = formatTimeForUI(
    data?.regDate,
    `${DATE_UI_FORMAT_WITH_SLASH} ${TIME_AM_PM}`
  ).split(' ');

  const [bugFixDate, bugFixTime, bugFixAmpm] = formatTimeForUI(
    data?.bugFixDate,
    `${DATE_UI_FORMAT_WITH_SLASH} ${TIME_AM_PM}`
  ).split(' ');

  const info = [
    {
      id: 1,
      title: t(`Mas'ul shaxs`),
      subtitle: joinArray([
        data?.developer?.firstName || data?.operator?.firstName,
        data?.developer?.lastName || data?.operator?.lastName
      ]),
      role: data?.developer?.role?.name || data?.operator?.role?.name,
      icon: <FontAwesomeIcon icon={faUserTie} color={theme.palette.common.icon.main} />
    },
    {
      id: 2,
      title: t('Reg date'),
      subtitle: regDate,
      role: `${regTime} ${ampm}`,
      icon: <FontAwesomeIcon icon={faCalendarPlus} color={theme.palette.common.icon.main} />
    },
    ...(data?.status === 'bug_report'
      ? [
          {
            id: 3,
            title: t('Fixed date'),
            subtitle: bugFixDate,
            role: `${bugFixTime} ${bugFixAmpm}`,
            icon: <FontAwesomeIcon icon={faCalendarCheck} color={theme.palette.common.icon.main} />
          }
        ]
      : [])
  ];

  if (isLoading) {
    return <Spinner loading />;
  }

  return (
    <Stack direction="column" sx={styles.root}>
      <Typography mb={'32px'} display="flex" alignItems="center" variant="h4">
        <FontAwesomeIcon
          icon={TICKET_TYPE_ICONS[data.status]}
          style={{ fontSize: '30px', marginRight: '5px' }}
          color={theme.palette.primary.main}
        />{' '}
        {data.name}
      </Typography>

      <Grid container sx={styles.content}>
        {info.map((item, i) => (
          <Grid item xs={4} key={i}>
            <InfoCard {...item} />
          </Grid>
        ))}

        <Grid item xs={12} sx={{ mt: '30px', mb: '10px' }}>
          <div
            style={{
              minHeight: '250px',
              borderRadius: '10px',
              backgroundColor: '#282830',
              paddingLeft: '16px'
            }}
            dangerouslySetInnerHTML={{ __html: data?.description }}></div>
        </Grid>
        <Grid item xs={12}>
          {data.attachments.map((attachment, index) => (
            <FileWidget readOnly key={index} {...attachment} sx={{ px: 1, mb: 1 }} />
          ))}
        </Grid>
      </Grid>
    </Stack>
  );
};

export default TicketView;
