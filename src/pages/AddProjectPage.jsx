import React from 'react';
import { useTranslation } from 'react-i18next';
import { Helmet } from 'react-helmet-async';
import get from 'lodash.get';
import { Typography, Stack } from '@mui/material';
import { useMutation } from '@tanstack/react-query';
import { httpPostUser, prepareUser } from 'data/user';
import MyAlert from 'components/MyAlert';
import { joinArray, scrollToTop } from 'utils/helpers';
import MyErrorText from 'components/MyErrorText';
import PageHeader from 'components/PageHeader';
import PageContentWrapper from 'components/PageContentWrapper';
import ProjectForm from 'components/ProjectForm';
import { httpPostProject } from 'data/project';
import { prepareProjectDto } from 'data/project/project.service';

const styles = {
  alert: {
    mb: '16px',
    display: 'flex',
    alignItems: 'center'
  }
};

const AddProjectPage = () => {
  const { t } = useTranslation();

  const { data, isSuccess, isError, error, mutateAsync } = useMutation(httpPostProject, {
    onSuccess: scrollToTop,
    onError: scrollToTop
  });

  const handleSubmit = async (values, reset) => {
    const response = await mutateAsync(prepareProjectDto(values));

    if (response?.status === 201) {
      reset();
    }
  };

  console.log(data);

  return (
    <>
      <Helmet>
        <title>{t('Add Project')}</title>
      </Helmet>
      <PageContentWrapper>
        <PageHeader title={t('Add Project')} />
        <MyAlert
          sx={styles.alert}
          open={isSuccess}
          type="success"
          children={
            <Stack direction="row" alignItems="center" justifyContent="space-between">
              <Stack direction="row" alignItems="center">
                <Typography variant="h5" mr={'8px'}>
                  {get(data, 'data.data.projectName')}
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
        <ProjectForm defaultValues={{}} createForm handleSubmit={handleSubmit} />
      </PageContentWrapper>
    </>
  );
};

export default AddProjectPage;
