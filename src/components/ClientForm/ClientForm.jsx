import { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { object, string, array, number } from 'yup';
import { isIP } from 'is-ip';
import { useTranslation } from 'react-i18next';
import { Grid, Stack } from '@mui/material';
import { yupResolver } from '@hookform/resolvers/yup';
import { MyAutoComplete, MyDatePicker, MySelect, MyTextField, MyEditor } from 'components/form';
import MyButton from 'components/MyButton';
import { formErrorFactory, formatUzbekPhoneNumber, validUzbPhonePattern } from 'utils/helpers';
import useClientStatus from 'hooks/api/useClientStatus';
import useOrganization from 'hooks/api/useOrganization';
import useProject from 'hooks/api/useProject';
import useUserStore from 'clientStore/useUserStore';
import useUser from 'hooks/helpers/useUser';
import { useSearchParams } from 'react-router-dom';

const CLIENT_STATUS = {
  TESTING: 2,
  ROLLING: 4
};

const isSalesStatus = (statusId) => Object.values(CLIENT_STATUS).includes(statusId);

const ClientForm = ({ defaultValues, handleSubmit, actionLoading = false }) => {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const readOnly = searchParams.get('readOnly');
  const { organizationOptions } = useOrganization();
  const { projectOptions } = useProject();
  const { project } = useUserStore();
  const { isClient } = useUser();

  const makeOptionalField = ([statusId], schema) => {
    return (message) => {
      const temp = statusId == CLIENT_STATUS.ROLLING || statusId == CLIENT_STATUS.TESTING;
      if (temp) {
        return schema;
      }

      return schema.required(message);
    };
  };

  const validationSchema = object().shape({
    contactName: string().required(t('ContactName is required')),
    contactPhone: array()
      .test({
        message: t('You need to enter at least one phone number'),
        test: (arr) => arr.length >= 1
      })
      .test({
        message: t('You need to enter valid phone number'),
        test: (value) => value.every(validUzbPhonePattern)
      }),
    deviceCount: number()
      .typeError(t('The field is required'))
      .required(t('The field is required'))
      .min(0, t('Must be greater than 0'))
      .nullable(),
    serverIp: array()
      .test({
        message: 'You need to enter at least one server ip',
        test: function (value) {
          return isSalesStatus(this.parent.statusId) ? true : value.length > 0;
        }
      })
      .test({
        message: t('You need to enter valid ip address'),
        test: function (value) {
          return isSalesStatus(this.parent.statusId)
            ? true
            : value.length >= 1
            ? value.every(isIP)
            : true;
        }
      }),
    statusId: number()
      .transform((value) => (Number.isNaN(value) ? null : value))
      .nullable()
      .required(t('The field is required')),
    contractDueTo: string()
      .when('statusId', (...args) => makeOptionalField(...args)(t('The field is required')))
      .nullable(),
    tgGroupId: string().when('statusId', (...args) =>
      makeOptionalField(...args)(t('The field is required'))
    )
  });

  useEffect(() => {
    if ('project' in defaultValues || !isClient) {
      return;
    }

    setValue('project', project);
  }, [project, isClient]);

  const resolver = yupResolver(validationSchema);

  const {
    control,
    formState: { errors, isSubmitted },
    reset,
    setValue,
    watch,
    trigger,
    ...rest
  } = useForm({
    defaultValues,
    resolver
  });

  const projectId = watch('project')?.value || project?.value;

  const { clientStatusOptions } = useClientStatus({ projectId });

  const error = formErrorFactory(errors);

  const handleCancel = () => reset();

  const onSubmit = rest.handleSubmit((values) => handleSubmit(values, handleCancel));

  return (
    <form onSubmit={onSubmit} style={{ marginTop: '16px' }} autoComplete="off">
      <Grid container columnSpacing={'24px'} rowSpacing={'24px'}>
        <Grid item xs={12} md={6}>
          <Controller
            name="organization"
            control={control}
            defaultValue=""
            disabled={readOnly}
            render={({ field }) => (
              <MyAutoComplete
                creatable={false}
                multiple={false}
                enableOnBlur={false}
                options={organizationOptions}
                fullWidth
                label={t('Organization')}
                {...field}
                {...error('organization')}
              />
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
                multiple={false}
                enableOnBlur={false}
                fullWidth
                options={projectOptions}
                label={t('Project')}
                {...field}
                {...error('project')}
              />
            )}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <Controller
            name="contactName"
            control={control}
            defaultValue=""
            disabled={readOnly}
            render={({ field }) => (
              <MyTextField label={t('Contact name')} {...field} {...error('contactName')} />
            )}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <Controller
            name="contactPhone"
            control={control}
            defaultValue=""
            disabled={readOnly}
            render={({ field }) => (
              <MyAutoComplete
                label={t('Contact phone')}
                {...field}
                inputProps={error('contactPhone')}
                preMutateValue={formatUzbekPhoneNumber}
              />
            )}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <Controller
            name="serverIp"
            control={control}
            defaultValue=""
            disabled={readOnly}
            render={({ field }) => (
              <MyAutoComplete label={t('Server Ip')} {...field} inputProps={error('serverIp')} />
            )}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <Controller
            name="statusId"
            control={control}
            defaultValue=""
            disabled={readOnly}
            render={({ field }) => (
              <MySelect
                options={clientStatusOptions}
                label={t('Status')}
                {...field}
                onChange={(e) => {
                  field.onChange(e);
                  if (isSubmitted) {
                    trigger();
                  }
                }}
                {...error('statusId')}
              />
            )}
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <Controller
            name="contractDueTo"
            control={control}
            defaultValue={null}
            disabled={readOnly}
            render={({ field }) => (
              <MyDatePicker label={t('Contract Due to')} {...field} {...error('contractDueTo')} />
            )}
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <Controller
            name="tgGroupId"
            control={control}
            defaultValue=""
            disabled={readOnly}
            render={({ field }) => (
              <MyTextField label={t('Telegram Group Link')} {...field} {...error('tgGroupId')} />
            )}
          />
        </Grid>

        <Grid item xs={12} md={4}>
          <Controller
            name="deviceCount"
            control={control}
            defaultValue=""
            disabled={readOnly}
            render={({ field }) => (
              <MyTextField
                label={t('Device count')}
                {...field}
                {...error('deviceCount')}
                type="number"
              />
            )}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <Controller
            name="notes"
            control={control}
            defaultValue=""
            render={({ field }) => (
              <MyEditor readOnly={readOnly} label={t('Notes')} {...field} {...error('notes')} />
            )}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <Controller
            name="encryptedNotes"
            control={control}
            defaultValue=""
            render={({ field }) => (
              <MyEditor readOnly={readOnly} label={t('Encrypted notes')} {...field} />
            )}
          />
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

export default ClientForm;
