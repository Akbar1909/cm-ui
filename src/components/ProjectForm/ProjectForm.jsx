import AddIcon from '@mui/icons-material/Add';
import { Grid, IconButton, Stack } from '@mui/material';
import MyButton from 'components/MyButton';
import { MyCheckbox, MyTextField } from 'components/form';
import useYupValidationResolver from 'hooks/useYupValidationResolver';
import { Controller, useFieldArray, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { formErrorFactory } from 'utils/helpers';
import { object, string, array } from 'yup';
import DeleteIcon from '@mui/icons-material/Delete';
import { Fragment } from 'react';
import { useSearchParams } from 'react-router-dom';

const ProjectForm = ({ defaultValues, handleSubmit }) => {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const readOnly = Boolean(searchParams.get('readOnly'));

  const makeOptionalField = ([relatedField], schema) => {
    if (!relatedField) {
      return schema;
    }
    return schema.of(
      object().shape({
        nameUz: string().required(t('Name Uz is required')),
        nameRu: string().required(t('Name Ru is required')),
        name: string().required(t('Name En is required'))
      })
    );
  };

  const validationSchema = object().shape({
    projectName: string().required(t('Project name is required')),
    sides: array().when('hasSide', makeOptionalField),
    modules: array().when('hasModule', makeOptionalField),
    clientStatuses: array().when('hasClientStatus', makeOptionalField)
  });

  const resolver = useYupValidationResolver(validationSchema);

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

  const sidesOptions = useFieldArray({ name: 'sides', control, keyName: 'id' });
  const moduleOptions = useFieldArray({ name: 'modules', control, keyName: 'id' });
  const clientStatusesOptions = useFieldArray({ name: 'clientStatuses', control, keyName: 'id' });

  const hasSide = watch('hasSide');
  const hasModule = watch('hasModule');
  const hasClientStatus = watch('hasClientStatus');

  const error = formErrorFactory(errors);

  const handleCancel = () => reset();

  const onSubmit = rest.handleSubmit((values) => {
    handleSubmit(values, reset);
  });

  const handleCheckbox = (e, arrayName) => {
    const { name, checked } = e.target;

    setValue(name, checked);

    if (!checked) {
      setValue(arrayName, []);
    } else {
      setValue(arrayName, [{ nameUz: '', nameRu: '', name: '' }]);
    }
  };

  const handleArrayFieldChange = (e, cb) => {
    cb(e);

    if (!isSubmitted) {
      return;
    }

    trigger();
  };

  return (
    <>
      <form onSubmit={onSubmit} style={{ marginTop: '16px' }}>
        <Grid container columnSpacing={'24px'} rowSpacing={'24px'}>
          <Grid width={'100%'} item sx={12}>
            <Controller
              name="projectName"
              control={control}
              defaultValue=""
              disabled={readOnly}
              render={({ field }) => (
                <MyTextField label={t('Project Name')} {...field} {...error('projectName')} />
              )}
            />
          </Grid>
          <Grid item xs={12}>
            <Controller
              name="hasSide"
              control={control}
              render={({ field }) => (
                <MyCheckbox
                  checked={field.value}
                  label={t('Has side')}
                  {...field}
                  onChange={(e) => handleCheckbox(e, 'sides')}
                />
              )}
            />
          </Grid>

          {hasSide && (
            <Grid item xs={12}>
              <Grid container rowSpacing={'24px'} columnSpacing={'24px'}>
                {sidesOptions.fields.map((side, index) => (
                  <Fragment key={side.id}>
                    <Grid item xs={12} sm={6} md={4}>
                      <Controller
                        name={`sides[${index}].nameUz`}
                        control={control}
                        render={({ field }) => (
                          <MyTextField
                            label={t('Name uz')}
                            size="small"
                            {...field}
                            onChange={(e) => handleArrayFieldChange(e, field.onChange)}
                            {...error(field.name, true)}
                          />
                        )}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6} md={4}>
                      <Controller
                        name={`sides[${index}].nameRu`}
                        control={control}
                        render={({ field }) => (
                          <MyTextField
                            label={t('Name Ru')}
                            size="small"
                            {...field}
                            onChange={(e) => handleArrayFieldChange(e, field.onChange)}
                            {...error(field.name, true)}
                          />
                        )}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                      <Controller
                        name={`sides[${index}].name`}
                        control={control}
                        render={({ field }) => (
                          <MyTextField
                            label={t('Name En')}
                            size="small"
                            {...field}
                            onChange={(e) => handleArrayFieldChange(e, field.onChange)}
                            {...error(field.name, true)}
                          />
                        )}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6} md={1}>
                      <IconButton
                        onClick={() => sidesOptions.append({})}
                        children={<AddIcon />}
                        size="small"
                      />
                      <IconButton
                        onClick={() => sidesOptions.remove(index)}
                        children={<DeleteIcon />}
                        size="small"
                      />
                    </Grid>
                  </Fragment>
                ))}
              </Grid>
            </Grid>
          )}

          <Grid item xs={12}>
            <Controller
              name="hasModule"
              control={control}
              render={({ field }) => (
                <MyCheckbox
                  checked={field.value}
                  label={t('Has module')}
                  {...field}
                  onChange={(e) => handleCheckbox(e, 'modules')}
                />
              )}
            />
          </Grid>

          {hasModule && (
            <Grid item xs={12}>
              <Grid container rowSpacing={'24px'} columnSpacing={'24px'}>
                {moduleOptions.fields.map((side, index) => (
                  <Fragment key={side.id}>
                    <Grid item xs={12} sm={6} md={4}>
                      <Controller
                        name={`modules[${index}].nameUz`}
                        control={control}
                        render={({ field }) => (
                          <MyTextField
                            label={t('Name uz')}
                            size="small"
                            {...field}
                            onChange={(e) => handleArrayFieldChange(e, field.onChange)}
                            {...error(field.name, true)}
                          />
                        )}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6} md={4}>
                      <Controller
                        name={`modules[${index}].nameRu`}
                        control={control}
                        render={({ field }) => (
                          <MyTextField
                            label={t('Name Ru')}
                            size="small"
                            {...field}
                            onChange={(e) => handleArrayFieldChange(e, field.onChange)}
                            {...error(field.name, true)}
                          />
                        )}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                      <Controller
                        name={`modules[${index}].name`}
                        control={control}
                        render={({ field }) => (
                          <MyTextField
                            label={t('Name En')}
                            size="small"
                            {...field}
                            onChange={(e) => handleArrayFieldChange(e, field.onChange)}
                            {...error(field.name, true)}
                          />
                        )}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6} md={1}>
                      <IconButton
                        onClick={() => moduleOptions.append({})}
                        children={<AddIcon />}
                        size="small"
                      />
                      <IconButton
                        onClick={() => moduleOptions.remove(index)}
                        children={<DeleteIcon />}
                        size="small"
                      />
                    </Grid>
                  </Fragment>
                ))}
              </Grid>
            </Grid>
          )}

          <Grid item xs={12}>
            <Controller
              name="hasClientStatus"
              control={control}
              render={({ field }) => (
                <MyCheckbox
                  checked={field.value}
                  label={t('Has Client Status')}
                  {...field}
                  onChange={(e) => handleCheckbox(e, 'clientStatuses')}
                />
              )}
            />
          </Grid>

          {hasClientStatus && (
            <Grid item xs={12}>
              <Grid container rowSpacing={'24px'} columnSpacing={'24px'}>
                {clientStatusesOptions.fields.map((clientStatus, index) => (
                  <Fragment key={clientStatus.id}>
                    <Grid item xs={12} sm={6} md={4}>
                      <Controller
                        name={`clientStatuses[${index}].nameUz`}
                        control={control}
                        render={({ field }) => (
                          <MyTextField
                            label={t('Name uz')}
                            size="small"
                            {...field}
                            onChange={(e) => handleArrayFieldChange(e, field.onChange)}
                            {...error(field.name, true)}
                          />
                        )}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6} md={4}>
                      <Controller
                        name={`clientStatuses[${index}].nameRu`}
                        control={control}
                        render={({ field }) => (
                          <MyTextField
                            label={t('Name Ru')}
                            size="small"
                            {...field}
                            onChange={(e) => handleArrayFieldChange(e, field.onChange)}
                            {...error(field.name, true)}
                          />
                        )}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                      <Controller
                        name={`clientStatuses[${index}].name`}
                        control={control}
                        render={({ field }) => (
                          <MyTextField
                            label={t('Name En')}
                            size="small"
                            {...field}
                            onChange={(e) => handleArrayFieldChange(e, field.onChange)}
                            {...error(field.name, true)}
                          />
                        )}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6} md={1}>
                      <IconButton
                        onClick={() => clientStatusesOptions.append({})}
                        children={<AddIcon />}
                        size="small"
                      />
                      <IconButton
                        onClick={() => clientStatusesOptions.remove(index)}
                        children={<DeleteIcon />}
                        size="small"
                      />
                    </Grid>
                  </Fragment>
                ))}
              </Grid>
            </Grid>
          )}

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

export default ProjectForm;
