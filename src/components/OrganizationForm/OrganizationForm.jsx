import { Grid, Stack } from '@mui/material';
import { useSearchParams } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { MyTextField, MyEditor } from 'components/form';
import { formErrorFactory } from 'utils/helpers';
import MyButton from 'components/MyButton';
import MyCropper from 'components/MyCropper';

const OrganizationForm = ({ handleSubmit, actionLoading = false, defaultValues = {}, close }) => {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const readOnly = Boolean(searchParams.get('readOnly'));
  const { control, errors, reset, ...rest } = useForm({
    defaultValues
  });

  const onSubmit = rest.handleSubmit(handleSubmit);

  const error = formErrorFactory(errors);

  return (
    <form onSubmit={onSubmit} autoComplete="off" style={{ marginTop: '16px' }}>
      <Grid container columnSpacing="24px" rowSpacing="24px">
        {/* <Grid item xs={12}>
          <MyCropper />
        </Grid> */}
        <Grid item xs={12}>
          <Controller
            name="organizationName"
            control={control}
            defaultValue=""
            disabled={readOnly}
            render={({ field }) => (
              <MyTextField
                fullWidth
                label={t('Organization')}
                {...field}
                {...error('organizationName')}
              />
            )}
          />
        </Grid>
        <Grid item xs={12}>
          <Controller
            name="organizationNameUz"
            control={control}
            defaultValue=""
            disabled={readOnly}
            render={({ field }) => (
              <MyTextField
                fullWidth
                label={t('Organization Uz')}
                {...field}
                {...error('organizationNameUz')}
              />
            )}
          />
        </Grid>
        <Grid item xs={12}>
          <Controller
            name="organizationNameRu"
            control={control}
            defaultValue=""
            disabled={readOnly}
            render={({ field }) => (
              <MyTextField
                fullWidth
                label={t('Organization Ru')}
                {...field}
                {...error('organizationNameRu')}
              />
            )}
          />
        </Grid>
        <Grid item xs={12}>
          <Controller
            name="organizationNotes"
            control={control}
            defaultValue=""
            render={({ field }) => (
              <MyEditor readOnly={readOnly} label={t('Notes')} {...field} {...error('notes')} />
            )}
          />
        </Grid>
        <Grid item xs={12}>
          <Stack direction="row" columnGap={'8px'} justifyContent="flex-end">
            <MyButton sx={{ minWidth: '120px' }} onClick={close} disabled={readOnly}>
              {t('Reset')}
            </MyButton>
            <MyButton
              sx={{ minWidth: '120px' }}
              variant="contained"
              type="submit"
              loading={actionLoading}
              disabled={readOnly}>
              {t('Save')}
            </MyButton>
          </Stack>
        </Grid>
      </Grid>
    </form>
  );
};

export default OrganizationForm;
