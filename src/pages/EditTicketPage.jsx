import React from 'react';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Helmet } from 'react-helmet-async';
import get from 'lodash.get';
import { Box, Typography, Stack } from '@mui/material';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import MyAlert from 'components/MyAlert';
import Spinner from 'components/Spinner';
import MyErrorText from 'components/MyErrorText';
import { scrollToTop } from 'utils/helpers';
import TicketForm from 'components/TicketForm';
import { httpGetTicketById, httpPutTicket } from 'data/ticket';
import { prepareTicketDto, prepareTicketDtoForEdit } from 'data/ticket/ticket.service';
import useUser from 'hooks/helpers/useUser';
import PageHeader from 'components/PageHeader';
import PageContentWrapper from 'components/PageContentWrapper';

const styles = {
  alert: {
    mb: '16px',
    display: 'flex',
    alignItems: 'center'
  }
};

const EditTicketPage = () => {
  const { t } = useTranslation();
  const { id } = useParams();
  const me = useUser();
  const queryClient = useQueryClient();

  const editState = useQuery({
    queryKey: ['tickets', id],
    queryFn: () => httpGetTicketById(id),
    select: (response) => prepareTicketDtoForEdit(response.data?.data)
  });

  const handleSuccess = () => {
    scrollToTop();
    queryClient.invalidateQueries(['tickets', id]);
  };

  const { mutate, data, isSuccess, isError, error, isLoading } = useMutation(httpPutTicket, {
    onSuccess: handleSuccess,
    onError: scrollToTop
  });

  const handleSubmit = (values) => {
    mutate({ id, dto: prepareTicketDto(values, me) });
  };

  console.log(editState.data);

  return (
    <>
      <Helmet>
        <title>{t('Edit Ticket')}</title>
      </Helmet>
      <PageContentWrapper>
        <PageHeader title={t('Edit Ticket')} />
        <MyAlert
          sx={styles.alert}
          open={isSuccess}
          type="success"
          children={
            <Stack direction="row" alignItems="center" justifyContent="space-between">
              <Stack direction="row" alignItems="center">
                <Typography variant="h5" mr={'8px'}>
                  {get(data, 'data.data.name')}
                </Typography>
                <Typography variant="h5" sx={{ fontWeight: 600 }} component="span">
                  {t('has been updated successfully')}
                </Typography>
              </Stack>
            </Stack>
          }
        />
        <MyAlert sx={styles.alert} type="error" open={isError}>
          <Stack direction="row" alignItems="center">
            <MyErrorText message={get(error, 'response.data.error.message')} />
          </Stack>
        </MyAlert>
        <Box>
          {editState.isError ? (
            <Typography variant="h5" component="span" children={t('Error')} />
          ) : (
            <Spinner loading={editState.isLoading}>
              <TicketForm
                handleSubmit={handleSubmit}
                defaultValues={editState.data}
                actionLoading={isLoading}
              />
            </Spinner>
          )}
        </Box>
      </PageContentWrapper>
    </>
  );
};

export default EditTicketPage;
