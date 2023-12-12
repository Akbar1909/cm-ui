import React from 'react';
import { useTranslation } from 'react-i18next';
import { Helmet } from 'react-helmet-async';
import get from 'lodash.get';
import { Typography, Stack } from '@mui/material';
import { useMutation, useQuery } from '@tanstack/react-query';
import MyAlert from 'components/MyAlert';
import { joinArray, scrollToTop } from 'utils/helpers';
import MyErrorText from 'components/MyErrorText';
import PageHeader from 'components/PageHeader';
import PageContentWrapper from 'components/PageContentWrapper';
import ProjectForm from 'components/ProjectForm';
import { httpGetProject, httpPatchProject } from 'data/project';
import { prepareProjectDto } from 'data/project/project.service';
import { useParams } from 'react-router-dom';
import Spinner from 'components/Spinner';

const styles = {
  alert: {
    mb: '16px',
    display: 'flex',
    alignItems: 'center'
  }
};

const EditProjectPage = () => {
  const { t } = useTranslation();
  const { id } = useParams();

  const projectState = useQuery({
    queryKey: ['project', id],
    queryFn: () => httpGetProject(id),
    select: (response) => get(response, 'data.data', {})
  });

  const { data, isSuccess, isError, error, mutateAsync } = useMutation(httpPatchProject, {
    onSuccess: () => {
      scrollToTop();
      projectState.refetch();
    },
    onError: scrollToTop
  });

  const handleSubmit = async (values, reset) => {
    const response = await mutateAsync({ ...prepareProjectDto(values), id });

    if (response?.status === 201) {
      reset();
    }
  };

  console.log(data);

  return (
    <>
      <Helmet>
        <title>{t('Edit Project')}</title>
      </Helmet>
      <PageContentWrapper>
        <PageHeader title={t('Edit Project')} />
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
        {projectState.isError ? (
          <MyErrorText />
        ) : (
          <Spinner loading={projectState.isLoading}>
            <ProjectForm
              defaultValues={{
                sides: [{ nameUz: '', nameRu: '', name: '' }],
                modules: [{ nameUz: '', nameRu: '', name: '' }],
                clientStatuses: [{ nameUz: '', nameRu: '', name: '' }],
                ...projectState.data
              }}
              createForm
              handleSubmit={handleSubmit}
            />
          </Spinner>
        )}
      </PageContentWrapper>
    </>
  );
};

export default EditProjectPage;
