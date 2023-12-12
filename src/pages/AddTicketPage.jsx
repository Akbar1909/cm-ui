import React from 'react';
import { useTranslation } from 'react-i18next';
import { Helmet } from 'react-helmet-async';
import { EditorState } from 'draft-js';
import get from 'lodash.get';
import { Typography, Stack } from '@mui/material';
import { useMutation } from '@tanstack/react-query';
import MyAlert from 'components/MyAlert';
import MyErrorText from 'components/MyErrorText';
import { scrollToTop } from 'utils/helpers';
import TicketForm from 'components/TicketForm';
import { prepareTicketDto } from 'data/ticket/ticket.service';
import { httpPostTicket } from 'data/ticket';
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

const AddClientPage = () => {
  const { t } = useTranslation();
  const me = useUser();
  const { isClient } = me;

  const { data, isSuccess, isError, error, isLoading, mutateAsync } = useMutation(httpPostTicket, {
    onSuccess: scrollToTop,
    onError: scrollToTop
  });

  const handleSubmit = async (values, reset) => {
    const response = await mutateAsync(prepareTicketDto(values, me));

    if (response?.status === 201) {
      reset();
    }
  };

  return (
    <>
      <Helmet>
        <title>{t('Add Ticket')}</title>
      </Helmet>
      <PageContentWrapper>
        <PageHeader title={t('Add Ticket')} />
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
                  {t('has been added successfully')}
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
        <TicketForm
          actionLoading={isLoading}
          handleSubmit={handleSubmit}
          defaultValues={{
            attachments: [],
            description: EditorState.createEmpty(),
            ...(isClient && { clientId: { label: me.client.name, value: me.client.id } })
          }}
        />
      </PageContentWrapper>
    </>
  );
};

export default AddClientPage;
