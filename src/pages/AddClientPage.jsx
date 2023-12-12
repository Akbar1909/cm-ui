import React from 'react';
import { EditorState } from 'draft-js';
import { useTranslation } from 'react-i18next';
import { Helmet } from 'react-helmet-async';
import get from 'lodash.get';
import { Typography, Stack } from '@mui/material';
import { useMutation } from '@tanstack/react-query';
import { httpPostClient, prepareClientDto } from 'data/client';
import MyAlert from 'components/MyAlert';
import ClientForm from 'components/ClientForm';
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

const AddClientPage = () => {
  const { t } = useTranslation();

  const { data, isSuccess, isError, error, isLoading, mutateAsync } = useMutation(httpPostClient, {
    onSuccess: scrollToTop,
    onError: scrollToTop
  });

  const handleSubmit = async (values, reset) => {
    const response = await mutateAsync(prepareClientDto(values));

    if (response?.status === 201) {
      reset();
    }
  };

  return (
    <>
      <Helmet>
        <title>{t('Add Client')}</title>
      </Helmet>
      <PageContentWrapper>
        <PageHeader title={t('Add Client')} />
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
                  {t('New client has been added successfully')}
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
        <ClientForm
          handleSubmit={handleSubmit}
          defaultValues={{
            contactPhone: [],
            serverIp: [],
            notes: EditorState.createEmpty(),
            encryptedNotes: EditorState.createEmpty()
          }}
          actionLoading={isLoading}
        />
      </PageContentWrapper>
    </>
  );
};

export default AddClientPage;
