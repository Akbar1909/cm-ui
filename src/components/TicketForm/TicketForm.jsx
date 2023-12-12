import { Controller, useFieldArray, useForm } from 'react-hook-form';
import { object, string, lazy } from 'yup';
import { useTranslation } from 'react-i18next';
import { yupResolver } from '@hookform/resolvers/yup';
import { Grid, Stack } from '@mui/material';
import {
  MyDatePicker,
  MySelect,
  MyTextField,
  MyEditor,
  MyFileUploader,
  MyAutoComplete
} from 'components/form';
import MyButton from 'components/MyButton';
import { formErrorFactory } from 'utils/helpers';
import useUsers from 'hooks/api/useUsers';
import useTicketType from 'hooks/api/useTicketType';
import useUser from 'hooks/helpers/useUser';
import useTicketTypeOptions from 'hooks/useTicketTypeOptions';
import { dayjs } from 'services/time/index';
import useTicketSide from 'hooks/api/useTicketSide';
import useProject from 'hooks/api/useProject';
import useOrganization from 'hooks/api/useOrganization';
import useOrganizationByProjectId from 'hooks/api/useOrganizationsByProjectId';
import { useSearchParams } from 'react-router-dom';

const makeOptionalField = ([status], schema) => {
  return (message) => {
    if (status !== 'bug_report') {
      return schema;
    }

    return schema.required(message);
  };
};

const TicketForm = ({ defaultValues, handleSubmit, actionLoading = false }) => {
  const [searchParams] = useSearchParams();
  const { t } = useTranslation();

  const readOnly = Boolean(searchParams.has('readOnly') && searchParams.get('readOnly'));

  const validationSchema = object().shape({
    name: string().required(t('Name is required')),
    project: lazy((output) =>
      typeof output === 'object'
        ? object().shape({
            label: string().required(t('Project is required')),
            value: string().required(t('Project is required'))
          })
        : string().required(t('Project is required')).nullable()
    ),
    organization: lazy((output) =>
      typeof output === 'object'
        ? object().shape({
            label: string().required(t('Organization is required')),
            value: string().required(t('Organization is required'))
          })
        : string().required(t('Organization is required')).nullable()
    ),
    status: string().required(t('Type is required')),
    regDate: string().required(t('RegDate is required')),
    sideId: string()
      .when('status', (...args) => makeOptionalField(...args)(t('Side is required')))
      .nullable(),
    typeId: string()
      .when('status', (...args) => makeOptionalField(...args)(t('Module is required')))
      .nullable(),
    developerId: string()
      .when('status', (...args) => makeOptionalField(...args)(t('DeveloperId is required')))
      .nullable(),
    bugFixDate: string()
      .when('status', (...args) => makeOptionalField(...args)(t('FixDate is required')))
      .nullable()
  });

  const resolver = yupResolver(validationSchema);

  const {
    control,
    formState: { errors },
    reset,
    setValue,
    watch,
    ...rest
  } = useForm({
    defaultValues: { regDate: dayjs(), ...defaultValues },
    resolver
  });

  const resetFiles = () => {
    setValue('attachments', []);
  };

  const { remove, append } = useFieldArray({ control, name: 'attachments' });

  const type = watch('status');
  const project = watch('project');
  const error = formErrorFactory(errors);

  const projectId = project?.value;

  const { projectOptions } = useProject();
  const { usersOptions } = useUsers(projectId);
  const { ticketOptions } = useTicketType(projectId);
  const { ticketSideOptions } = useTicketSide(projectId);
  const { organizationOptions } = useOrganizationByProjectId(projectId);
  const typeOptions = useTicketTypeOptions();

  const handleCancel = () => reset();
  const onSubmit = rest.handleSubmit((values) => handleSubmit(values, reset));

  return (
    <form onSubmit={onSubmit} style={{ marginTop: '16px' }} autoComplete="off">
      <Grid container columnSpacing={'24px'} rowSpacing={'24px'} sx={{}}>
        <Grid item xs={12}>
          <Controller
            name="name"
            control={control}
            defaultValue=""
            disabled={readOnly}
            render={({ field }) => (
              <MyTextField fullWidth label={t('Title')} {...field} {...error('name')} />
            )}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <Controller
            name="project"
            control={control}
            defaultValue=""
            disabled={readOnly}
            render={({ field }) => (
              <MyAutoComplete
                creatable={false}
                options={projectOptions}
                label={t('Project')}
                {...field}
                inputProps={error('project')}
                multiple={false}
                enableOnBlur={false}
                onChange={(e) => {
                  setValue('organization', '');
                  field.onChange(e);
                }}
              />
            )}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <Controller
            name="organization"
            control={control}
            defaultValue=""
            disabled={readOnly}
            render={({ field }) => (
              <MyAutoComplete
                creatable={false}
                options={organizationOptions}
                label={t('Organization')}
                {...field}
                inputProps={error('organization')}
                multiple={false}
                enableOnBlur={false}
              />
            )}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <Controller
            name="status"
            control={control}
            defaultValue=""
            render={({ field }) => (
              <MySelect
                readOnly={readOnly}
                options={typeOptions}
                label={t('Type')}
                {...field}
                {...error('status')}
              />
            )}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <Controller
            name="regDate"
            disabled={readOnly}
            control={control}
            render={({ field }) => (
              <MyDatePicker label={t('Report Date')} {...field} {...error('regDate')} />
            )}
          />
        </Grid>

        {type === 'bug_report' && (
          <Grid item xs={12} md={6}>
            <Controller
              name="sideId"
              control={control}
              defaultValue=""
              disabled={readOnly}
              render={({ field }) => (
                <MySelect
                  options={ticketSideOptions}
                  label={t('Side')}
                  {...field}
                  {...error('sideId')}
                />
              )}
            />
          </Grid>
        )}

        {type === 'bug_report' && (
          <Grid item xs={12} md={6}>
            <Controller
              name="typeId"
              control={control}
              defaultValue=""
              disabled={readOnly}
              render={({ field }) => (
                <MySelect
                  options={ticketOptions}
                  label={t('Module')}
                  {...field}
                  {...error('typeId')}
                />
              )}
            />
          </Grid>
        )}

        {type === 'bug_report' && (
          <Grid item xs={12} md={6}>
            <Controller
              name="developerId"
              control={control}
              defaultValue=""
              disabled={readOnly}
              render={({ field }) => (
                <MySelect
                  options={usersOptions}
                  label={t('Developer')}
                  {...field}
                  {...error('developerId')}
                />
              )}
            />
          </Grid>
        )}

        {type === 'bug_report' && (
          <Grid item xs={12} md={6}>
            <Controller
              name="bugFixDate"
              control={control}
              defaultValue={null}
              disabled={readOnly}
              render={({ field }) => (
                <MyDatePicker
                  label={t('Fix Date')}
                  disablePast
                  {...field}
                  {...error('bugFixDate')}
                />
              )}
            />
          </Grid>
        )}

        <Grid item xs={12} md={6}>
          <Controller
            name="description"
            control={control}
            defaultValue=""
            render={({ field }) => (
              <MyEditor
                readOnly={readOnly}
                label={t('Notes')}
                {...field}
                {...error('description')}
              />
            )}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <Controller
            name="attachments"
            control={control}
            disabled={readOnly}
            render={({ field }) => (
              <MyFileUploader
                reset={resetFiles}
                {...field}
                remove={remove}
                append={append}
                readOnly={readOnly}
              />
            )}
          />
        </Grid>

        <Grid item xs={12}>
          <Stack direction="row" columnGap={'8px'} justifyContent="flex-end">
            <MyButton disabled={readOnly} sx={{ minWidth: '120px' }} onClick={handleCancel}>
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

export default TicketForm;
