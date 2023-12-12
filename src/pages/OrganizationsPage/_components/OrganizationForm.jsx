import { Grid, Stack } from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { MyTextField, MyEditor } from 'components/form';
import { formErrorFactory } from 'utils/helpers';
import MyButton from 'components/MyButton';

const OrganizationForm = ({
  handleSubmit,
  readOnly = false,
  actionLoading = false,
  defaultValues = {},
  close
}) => {
  const { t } = useTranslation();
  const { control, errors, reset, ...rest } = useForm({
    defaultValues
  });

  const onSubmit = rest.handleSubmit(handleSubmit);

  const error = formErrorFactory(errors);

  return (
    <form onSubmit={onSubmit}>
      <Grid container sx={{ maxWidth: 'max-content' }} columnSpacing="24px" rowSpacing="24px">
        <Grid item xs={12}>
          <Controller
            name="organizationName"
            control={control}
            defaultValue=""
            disabled={readOnly}
            render={({ field }) => (
              <MyTextField fullWidth label={t('Organization')} {...field} {...error('name')} />
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
