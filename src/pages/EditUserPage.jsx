import React from 'react';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Helmet } from 'react-helmet-async';
import get from 'lodash.get';
import UserForm from 'components/UserForm';
import { Typography, Stack } from '@mui/material';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { httpGetUser, httpPutUser, prepareUser } from 'data/user';
import MyAlert from 'components/MyAlert';
import { extractObjectPart, joinArray, scrollToTop } from 'utils/helpers';
import Spinner from 'components/Spinner';
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

const EditUserPage = () => {
  const { t } = useTranslation();
  const { id } = useParams();
  const queryClient = useQueryClient();
  const userState = useQuery({
    queryKey: ['users', id],
    queryFn: () => httpGetUser(id),
    select: (response) => {
      if (response.status !== 200) {
        return {};
      }

      const {
        data: { data }
      } = response;

      return {
        ...data,
        project: {
          label: data?.project?.projectName,
          value: data?.project?.projectId
        },
        organization: {
          label: data?.organization?.organizationName,
          value: data?.organization?.organizationId
        }
      };
    }
  });

  const handleSuccess = () => {
    scrollToTop();
    queryClient.invalidateQueries({ queryKey: ['users', id] });
    queryClient.invalidateQueries({ queryKey: ['projects'] });
  };

  const { mutate, data, isSuccess, isError, error } = useMutation(httpPutUser, {
    onSuccess: handleSuccess,
    onError: scrollToTop
  });

  const handleSubmit = (values) => {
    mutate({
      id,
      dto: prepareUser(
        extractObjectPart({
          obj: values,
          keys: ['password'],
          type: 'exclude'
        })
      )
    });
  };

  console.log(userState.data);

  return (
    <>
      <Helmet>
        <title>{t('Edit user')}</title>
      </Helmet>
      <PageContentWrapper>
        <PageHeader title={t('Edit User')} />
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
        {userState.isError ? (
          <Typography variant="h5" children={t('Error')} component="span" />
        ) : (
          <Spinner loading={userState.isLoading}>
            <UserForm handleSubmit={handleSubmit} defaultValues={userState.data} />
          </Spinner>
        )}
      </PageContentWrapper>
    </>
  );
};

export default EditUserPage;
