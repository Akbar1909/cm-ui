import React from 'react';
import OrganizationForm from 'components/OrganizationForm';
import { Stack, Typography } from '@mui/material';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { httpGetOrganization, httpPatchOrganization } from 'data/organization';
import { prepareOrganizationDto } from 'data/organization/organization.service';
import notification from 'services/notification';
import { useTranslation } from 'react-i18next';
import { formatRichTextForUI } from 'utils/helpers';
import { useParams, useSearchParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import PageContentWrapper from 'components/PageContentWrapper';
import PageHeader from 'components/PageHeader';
import Spinner from 'components/Spinner';
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
const EditOrganizationPage = ({ handleClose }) => {
  const { t } = useTranslation();
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const readOnly = searchParams.get('readOnly');
  const queryClient = useQueryClient();

  const { data, isLoading, isError, isSuccess, error } = useQuery({
    queryKey: ['organizations', id],
    queryFn: () => httpGetOrganization(id),
    select: (res) => res.data
  });

  const editMutate = useMutation(httpPatchOrganization, {
    onSuccess: (_) => {
      queryClient.invalidateQueries(['organizations']);
    },
    onError: (_) => {
      notification.setMode('error').setMessage(t('Something went wrong')).pop();
    }
  });

  const handleSubmit = (values) => {
    editMutate.mutate({ ...prepareOrganizationDto(values), id });
  };

  const defaultValues = {
    ...data?.data,
    organizationNotes: formatRichTextForUI(data?.data?.organizationNotes || '')
  };

  return (
    <>
      <Helmet>
        <title>{t('Edit Organization')}</title>
      </Helmet>

      <PageContentWrapper>
        <PageHeader title={t('Edit Organization')} />
        <MyAlert
          sx={styles.alert}
          open={isSuccess && !readOnly}
          type="success"
          children={
            <Stack direction="row" alignItems="center" justifyContent="space-between">
              <Stack direction="row" alignItems="center">
                <Typography variant="h5" mr={'8px'}>
                  {get(data, 'data.data.organizationName')}
                </Typography>
                <Typography variant="h5" sx={{ fontWeight: 600 }} component="span">
                  {t('has been updated successfully')}
                </Typography>
              </Stack>
            </Stack>
          }
        />
        <MyAlert sx={styles.alert} type="error" open={isError && !readOnly}>
          <Stack direction="row" alignItems="center">
            <MyErrorText message={get(error, 'response.data.error.message')} />
          </Stack>
        </MyAlert>
        <Spinner loading={isLoading}>
          <OrganizationForm
            defaultValues={defaultValues}
            handleSubmit={handleSubmit}
            actionLoading={editMutate.isLoading}
            close={handleClose}
          />
        </Spinner>
      </PageContentWrapper>
    </>
  );
};

export default EditOrganizationPage;
