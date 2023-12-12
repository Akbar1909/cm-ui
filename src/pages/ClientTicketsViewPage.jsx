import { useState, useEffect } from 'react';
import { Typography, Box, Grid, Hidden, useMediaQuery, Stack } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import MySelect from 'components/MySelect';
import Spinner from 'components/Spinner';
import TicketList from 'components/Ticket';
import { httpGetClient, prepareClientForView } from 'data/client';
import useTicketTypeOptions from 'hooks/useTicketTypeOptions';
import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { globalStyles } from 'theme/globalStyles';
import { getTicketPrimaryColor, makeItMap, scrollToTop } from 'utils/helpers';
import { httpGetTicketStatsByType } from 'data/ticket';
import MyBadge from 'components/MyBadge';
import MyBackButton from 'components/MyBackButton';
import PageContentWrapper from 'components/PageContentWrapper';
import TicketsTreeView from 'components/TicketsTreeView';
// done,  bug, file_exchange, feature_request

const ticketTypeOrders = ['task_done', 'bug_report', 'file_exchange', 'request'];

const styles = {
  headerBox: {
    p: '6px',
    backgroundColor: (theme) => theme.palette.background.neutral,
    borderTopRightRadius: '6px',
    borderTopLeftRadius: '6px'
  }
};

const ClientTicketsViewPage = () => {
  const { id } = useParams();
  const { t } = useTranslation();
  const mdUp = useMediaQuery((theme) => theme.breakpoints.up('md'));
  const [selectedType, setSelectedType] = useState('task_done');

  const { data, isLoading } = useQuery({
    queryFn: () => httpGetClient(id),
    queryKey: ['client', { id }],
    select: (response) => prepareClientForView(response.data?.data)
  });

  const { data: typeStatistics, isLoading: typeStatisticsIsLoading } = useQuery({
    queryFn: () => httpGetTicketStatsByType(id),
    queryKey: ['client-tickets', id],
    select: ({ data }) => makeItMap(data.data, 'status')
  });

  const handleTypeChange = (e) => {
    setSelectedType(e.target.value);
  };

  useEffect(() => scrollToTop(), []);

  const typeOptions = useTicketTypeOptions();

  console.log(data);

  return (
    <>
      <Helmet>
        <title>{t('Client')}</title>
      </Helmet>
      <PageContentWrapper>
        <Stack direction="row" display="flex" justifyContent="space-between" mb={'24px'}>
          <Typography
            sx={[globalStyles.ellipsis(1), { mb: 0, textAlign: 'center', flex: 1 }]}
            variant="h4"
            gutterBottom
            children={data?.name}
          />

          <MyBackButton />
        </Stack>

        <Hidden mdUp>
          <Box mb="10px">
            <MySelect value={selectedType} onChange={handleTypeChange} options={typeOptions} />
          </Box>
        </Hidden>

        <Hidden mdDown>
          <Spinner loading={isLoading}>
            <TicketsTreeView {...data?.tickets} clientName={data?.organization?.organizationName} />
          </Spinner>
        </Hidden>
      </PageContentWrapper>
    </>
  );
};

export default ClientTicketsViewPage;
