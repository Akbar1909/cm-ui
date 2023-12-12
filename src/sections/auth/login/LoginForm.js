import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
// @mui
import { Stack, TextField } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { object, string } from 'yup';
import { httpPostLogin } from 'data/auth';
import useAuthStore from 'clientStore/useAuthStore';
import useYupValidationResolver from 'hooks/useYupValidationResolver';
import { formErrorFactory } from 'utils/helpers';
import notification from 'services/notification';
import { MyPasswordField } from 'components/MyTextField';
// ----------------------------------------------------------------------

export default function LoginForm() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const authStore = useAuthStore();
  const validationSchema = object().shape({
    username: string().required(t('Username is required')),
    password: string().required(t('Password is required'))
  });
  const resolver = useYupValidationResolver(validationSchema);

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({
    defaultValues: { username: '', password: '' },
    resolver
  });

  const error = formErrorFactory(errors);

  const handleSuccess = (response) => {
    if (response.data?.access_token) {
      const { access_token, refresh_token } = response.data;
      authStore.setAccessToken(access_token);
      authStore.setRefreshToken(refresh_token);
      navigate('/dashboard/app', { replace: true });
    }
  };

  const handleError = (error) => {
    notification.setMode('error').setMessage(t('Email or password incorrect')).pop();
  };

  const mutation = useMutation(httpPostLogin, {
    onSuccess: handleSuccess,
    onError: handleError
  });

  const onSubmit = handleSubmit((values) => mutation.mutate(values));

  return (
    <form onSubmit={onSubmit}>
      <Stack spacing={3}>
        <TextField
          name="username"
          label="Username"
          {...register('username')}
          {...error('username')}
        />

        <MyPasswordField
          name="password"
          label="Password"
          {...register('password')}
          {...error('password')}
        />

        <LoadingButton
          fullWidth
          size="large"
          type="submit"
          variant="contained"
          loading={mutation.isLoading}>
          {t('Login')}
        </LoadingButton>
      </Stack>
    </form>
  );
}
