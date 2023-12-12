import React from 'react';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Helmet } from 'react-helmet-async';
import get from 'lodash.get';
import { Container, Typography, Stack } from '@mui/material';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { httpGetClient, httpPutClient, prepareClientDto, prepareClientForEdit } from 'data/client';
import MyAlert from 'components/MyAlert';
import ClientForm from 'components/ClientForm';
import Spinner from 'components/Spinner';
import MyErrorText from 'components/MyErrorText';
import { scrollToTop } from 'utils/helpers';
import PageHeader from 'components/PageHeader';
import PageContentWrapper from 'components/PageContentWrapper';
const styles = {
  alert: {
    mb: '16px',
    display: 'flex',
    alignItems: 'center'
  }
};

const EditClientPage = () => {
  const { t } = useTranslation();
  const { id } = useParams();
  const queryClient = useQueryClient();

  const clientState = useQuery({
    queryKey: ['clients', id],
    queryFn: () => httpGetClient(id),
    select: (response) => prepareClientForEdit(response.data?.data)
  });

  const handleSuccess = () => {
    scrollToTop();
    queryClient.invalidateQueries({ queryKey: ['clients', id] });
  };

  const { data, isSuccess, isError, error, isLoading, mutate } = useMutation(httpPutClient, {
    onSuccess: handleSuccess,
    onError: scrollToTop
  });

  const handleSubmit = async (values) => {
    mutate({ id, dto: prepareClientDto(values) });
  };

  return (
    <>
      <Helmet>
        <title>{t('Edit Client')}</title>
      </Helmet>
      <PageContentWrapper>
        <PageHeader title={t('Edit Client')} />
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
        {clientState.isError ? (
          <Typography variant="h5" component="span" children={t('Error')} />
        ) : (
          <Spinner loading={clientState.isLoading}>
            <ClientForm
              handleSubmit={handleSubmit}
              defaultValues={clientState.data}
              actionLoading={isLoading}
            />
          </Spinner>
        )}
      </PageContentWrapper>
    </>
  );
};

export default EditClientPage;
