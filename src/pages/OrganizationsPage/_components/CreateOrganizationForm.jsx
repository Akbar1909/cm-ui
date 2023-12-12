import React from 'react';
import OrganizationForm from './OrganizationForm';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { httpPostOrganization } from 'data/organization';
import { prepareOrganizationDto } from 'data/organization/organization.service';
import { EditorState } from 'draft-js';
import notification from 'services/notification';
import { useTranslation } from 'react-i18next';

const CreateOrganizationForm = ({ handleClose }) => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();

  const createMutate = useMutation(httpPostOrganization, {
    onSuccess: (response) => {
      queryClient.invalidateQueries(['organizations']);
      notification.setMode('success').setMessage(t('Organization successfully created')).pop();
      handleClose();
    },
    onError: (error) => {
      notification.setMode('error').setMessage(t('Something went wrong')).pop();
    }
  });

  const handleSubmit = (values) => {
    createMutate.mutate(prepareOrganizationDto(values));
  };

  return (
    <OrganizationForm
      defaultValues={{ organizationNotes: EditorState.createEmpty() }}
      handleSubmit={handleSubmit}
      actionLoading={createMutate.isLoading}
      close={handleClose}
    />
  );
};

export default CreateOrganizationForm;
