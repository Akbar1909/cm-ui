import React from 'react';
import OrganizationForm from './OrganizationForm';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { httpPatchOrganization } from 'data/organization';
import { prepareOrganizationDto } from 'data/organization/organization.service';
import notification from 'services/notification';
import { useTranslation } from 'react-i18next';
import { formatRichTextForUI } from 'utils/helpers';

const EditOrganizationForm = ({ handleClose, organizationName, organizationNotes, id }) => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();

  const editMutate = useMutation(httpPatchOrganization, {
    onSuccess: (_) => {
      queryClient.invalidateQueries(['organizations']);
      notification.setMode('success').setMessage(t('Organization successfully updated')).pop();
      handleClose();
    },
    onError: (_) => {
      notification.setMode('error').setMessage(t('Something went wrong')).pop();
    }
  });

  const handleSubmit = (values) => {
    editMutate.mutate({ ...prepareOrganizationDto(values), id });
  };

  const defaultValues = {
    organizationName,
    organizationNotes: formatRichTextForUI(organizationNotes)
  };

  return (
    <OrganizationForm
      defaultValues={defaultValues}
      handleSubmit={handleSubmit}
      actionLoading={editMutate.isLoading}
      close={handleClose}
    />
  );
};

export default EditOrganizationForm;
