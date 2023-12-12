import { Controller, useForm } from 'react-hook-form';
import { object, string } from 'yup';
import { useTranslation } from 'react-i18next';
import { Grid, Stack, Alert, Typography } from '@mui/material';
import { MyAutoComplete, MyPasswordField, MySelect, MyTextField } from 'components/form';
import MyButton from 'components/MyButton';
import useYupValidationResolver from 'hooks/useYupValidationResolver';
import { formErrorFactory } from 'utils/helpers';
import useRoles from 'hooks/api/useRoles';
import useProject from 'hooks/api/useProject';
import useOrganizationByProjectId from 'hooks/api/useOrganizationsByProjectId';
import { useSearchParams } from 'react-router-dom';

const UserForm = ({ defaultValues, handleSubmit, createForm = false }) => {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const readOnly = searchParams.get('readOnly');

  const { options } = useRoles();

  const validationSchema = object().shape({
    firstName: string().required(t('First name is required')),
    lastName: string().required(t('Last name is required')),
    phone: string().required(t('Phone number is required')),
    // password: string().required(t("Password is required")),
    username: string().required(t('Username is required')),
    roleId: string().required(t('Role is required'))
    // clientId: lazy((output) =>
    //   typeof output === 'object'
    //     ? object().shape({
    //         label: string().required(t('Client is required')),
    //         value: string().required(t('Client is required'))
    //       })
    //     : string().required(t('Client is required')).nullable()
    // )
  });
  const resolver = useYupValidationResolver(validationSchema);

  const {
    control,
    formState: { errors },
    reset,
    setValue,
    watch,
    ...rest
  } = useForm({
    defaultValues,
    resolver
  });

  const roleId = watch('roleId');
  const organization = watch('organization');
  const project = watch('project');

  const { organizationOptions } = useOrganizationByProjectId(project?.value);
  const { projectOptions } = useProject(organization?.value);
  const clientLabel = options.find((option) => option.value === roleId)?.label.toLowerCase();

  const error = formErrorFactory(errors);

  const handleCancel = () => reset();

  const onSubmit = rest.handleSubmit((values) => handleSubmit(values, handleCancel));

  return (
    <>
      <form onSubmit={onSubmit} style={{ marginTop: '16px' }}>
        <Grid container columnSpacing={'24px'} rowSpacing={'24px'}>
          {!readOnly && createForm && (
            <Grid item xs={12}>
              <Alert severity="warning" mb={'16px'}>
                <Typography
                  variant="subtitle2"
                  children={t('Please remember the password, it will not be visible')}
                />
              </Alert>
            </Grid>
          )}
          <Grid width={'100%'} item md={6}>
            <Stack rowGap={'16px'}>
              <Controller
                name="firstName"
                control={control}
                defaultValue=""
                disabled={readOnly}
                render={({ field }) => (
                  <MyTextField label={t('First Name')} {...field} {...error('firstName')} />
                )}
              />

              <Controller
                name="lastName"
                control={control}
                defaultValue=""
                disabled={readOnly}
                render={({ field }) => (
                  <MyTextField label={t('Last Name')} {...field} {...error('lastName')} />
                )}
              />

              <Controller
                name="phone"
                control={control}
                defaultValue=""
                disabled={readOnly}
                render={({ field }) => (
                  <MyTextField label={t('Phone Number')} {...field} {...error('phone')} />
                )}
              />

              {clientLabel === 'client' && (
                <Controller
                  control={control}
                  name="project"
                  defaultValue={''}
                  disabled={readOnly}
                  render={({ field }) => (
                    <MyAutoComplete
                      creatable={false}
                      {...field}
                      options={projectOptions}
                      label={t('Project')}
                      multiple={false}
                      enableOnBlur={false}
                      onChange={(e) => {
                        setValue('organization', '');
                        field.onChange(e);
                      }}
                      {...error('project')}
                    />
                  )}
                />
              )}

              {clientLabel === 'client' && (
                <Controller
                  control={control}
                  name="organization"
                  defaultValue={''}
                  disabled={readOnly}
                  render={({ field }) => (
                    <MyAutoComplete
                      creatable={false}
                      {...field}
                      options={organizationOptions}
                      label={t('Organization')}
                      multiple={false}
                      enableOnBlur={false}
                      {...error('organization')}
                    />
                  )}
                />
              )}

              {clientLabel && clientLabel !== 'client' && (
                <Controller
                  control={control}
                  name="projects"
                  disabled={readOnly}
                  render={({ field }) => (
                    <MyAutoComplete
                      creatable={false}
                      {...field}
                      options={projectOptions}
                      label={t('Project')}
                      enableOnBlur={false}
                      {...error('projects')}
                    />
                  )}
                />
              )}
            </Stack>
          </Grid>

          <Grid item md={6} width="100%">
            <Stack rowGap={'16px'}>
              <Controller
                name="username"
                control={control}
                defaultValue=""
                disabled={readOnly}
                render={({ field }) => (
                  <MyTextField label={t('Username')} {...field} {...error('username')} />
                )}
              />

              <Controller
                name="password"
                control={control}
                defaultValue=""
                disabled={readOnly}
                render={({ field }) => (
                  <MyPasswordField label={t('Password')} {...field} {...error('password')} />
                )}
              />

              <Controller
                control={control}
                name="roleId"
                defaultValue={''}
                disabled={readOnly}
                render={({ field }) => (
                  <MySelect {...field} options={options} label={t('Role')} {...error('roleId')} />
                )}
              />
            </Stack>
          </Grid>
          <Grid item xs={12}>
            <Stack direction="row" columnGap={'8px'} justifyContent="flex-end">
              <MyButton sx={{ minWidth: '120px' }} onClick={handleCancel} disabled={readOnly}>
                {t('Reset')}
              </MyButton>
              <MyButton
                sx={{ minWidth: '120px' }}
                variant="contained"
                type="submit"
                disabled={readOnly}>
                {t('Save')}
              </MyButton>
            </Stack>
          </Grid>
        </Grid>
      </form>
    </>
  );
};

export default UserForm;
