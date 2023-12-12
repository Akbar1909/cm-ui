import React from 'react';
import { Stack, Typography } from '@mui/material';
import OrganizationForm from 'components/OrganizationForm';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { httpPostOrganization } from 'data/organization';
import { prepareOrganizationDto } from 'data/organization/organization.service';
import { EditorState } from 'draft-js';
import { useTranslation } from 'react-i18next';
import { Helmet } from 'react-helmet-async';
import PageContentWrapper from 'components/PageContentWrapper';
import PageHeader from 'components/PageHeader';
import get from 'lodash.get';
import MyAlert from 'components/MyAlert';
import MyErrorText from 'components/MyErrorText';

const styles = {
  alert: {
    mb: '16px',
    display: 'flex',
    alignItems: 'center'
  }
};

const AddOrganizationForm = ({ handleClose }) => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();

  const { isSuccess, mutate, data, error, isLoading, isError } = useMutation(httpPostOrganization, {
    onSuccess: (_) => {
      queryClient.invalidateQueries(['organizations']);
    }
  });

  const handleSubmit = (values) => mutate(prepareOrganizationDto(values));

  return (
    <>
      <Helmet>
        <title>{t('Add organization')}</title>
      </Helmet>
      <PageContentWrapper>
        <PageHeader title={t('Add organization')} />
        <MyAlert
          sx={styles.alert}
          open={isSuccess}
          type="success"
          children={
            <Stack direction="row" alignItems="center" justifyContent="space-between">
              <Stack direction="row" alignItems="center">
                <Typography variant="h5" mr={'8px'}>
                  {get(data, 'data.data.organizationName')}
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
        <OrganizationForm
          defaultValues={{ organizationNotes: EditorState.createEmpty() }}
          handleSubmit={handleSubmit}
          actionLoading={isLoading}
          close={handleClose}
        />
      </PageContentWrapper>
    </>
  );
};

export default AddOrganizationForm;
