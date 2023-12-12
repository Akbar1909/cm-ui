import React from 'react';
import { useTranslation } from 'react-i18next';
import { Helmet } from 'react-helmet-async';
import get from 'lodash.get';
import UserForm from 'components/UserForm';
import { Typography, Stack } from '@mui/material';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { httpPostUser, prepareUser } from 'data/user';
import MyAlert from 'components/MyAlert';
import { joinArray, scrollToTop } from 'utils/helpers';
import MyErrorText from 'components/MyErrorText';
import PageHeader from 'components/PageHeader';
import PageContentWrapper from 'components/PageContentWrapper';

const styles = {
  alert: {
    mb: '16px',
    display: 'flex',
    alignItems: 'center'
  }
};

const AddUserPage = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();

  const { data, isSuccess, isError, error, mutateAsync } = useMutation(httpPostUser, {
    onSuccess: () => {
      scrollToTop();
      queryClient.invalidateQueries({ queryKey: ['projects'] });
    },
    onError: scrollToTop
  });

  const handleSubmit = async (values, reset) => {
    const response = await mutateAsync(prepareUser(values));

    if (response?.status === 201) {
      reset();
    }
  };

  return (
    <>
      <Helmet>
        <title>{t('Add user')}</title>
      </Helmet>
      <PageContentWrapper>
        <PageHeader title={t('Add User')} />
        <MyAlert
          sx={styles.alert}
          open={isSuccess}
          type="success"
          children={
            <Stack direction="row" alignItems="center" justifyContent="space-between">
              <Stack direction="row" alignItems="center">
                <Typography variant="h5" mr={'8px'}>
                  {joinArray(
                    [get(data, 'data.data.firstName'), get(data, 'data.data.lastName')],
                    ' '
                  )}
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
        <UserForm createForm handleSubmit={handleSubmit} />
      </PageContentWrapper>
    </>
  );
};

export default AddUserPage;
