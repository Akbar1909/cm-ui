import { formatRichTextForApi, formatRichTextForUI } from 'utils/helpers';

export function prepareOrganizationDto(dto) {
  return {
    ...dto,
    organizationNotes: formatRichTextForApi(dto.organizationNotes)
  };
}

export function prepareOrganization(organization) {
  return {
    ...organization,
    organizationNotes: formatRichTextForUI(organization.organizationNotes)
  };
}
