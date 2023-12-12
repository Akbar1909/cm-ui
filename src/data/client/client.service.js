import { EditorState } from 'draft-js';
import { DATE_UI_FORMAT_WITH_SLASH, dayjs, formatTimeForUI } from 'services/time';
import { formatRichTextForUI, formatRichTextForApi } from 'utils/helpers';

export function extractInputValue(arr) {
  const validArr = Array.isArray(arr) ? arr : [];

  return validArr.map((item) => {
    if (typeof item === 'object') {
      return item.label;
    }

    if (typeof item === 'string') {
      return item;
    }

    return item;
  });
}

export function prepareClientDto(dto) {
  return {
    name: dto.name,
    projectId: parseInt(dto.project.value, 10),
    organizationId: parseInt(dto.organization.value, 10),
    deviceCount: parseInt(dto.deviceCount, 10),
    contactPhone: extractInputValue(dto.contactPhone),
    contactName: dto.contactName,
    serverAddress: extractInputValue(dto.serverIp),
    notes: formatRichTextForApi(dto.notes),
    encryptedNotes: formatRichTextForApi(dto.encryptedNotes),
    statusId: dto.statusId,
    contractDueTo: dayjs(dto.contractDueTo),
    tgGroupId: dto.tgGroupId
  };
}

export function prepareClientForList(clients) {
  return clients.map((client) => ({
    ...client,
    id: client.id,
    name: client.name,
    contactName: client.contactName,
    phone: (Array.isArray(client.contactPhone) ? client.contactPhone : []).join(', '),
    deviceCount: client.deviceCount,
    contractDueTo: formatTimeForUI(client.contractDueTo, DATE_UI_FORMAT_WITH_SLASH),
    updatedAt: formatTimeForUI(client.updatedAt, DATE_UI_FORMAT_WITH_SLASH),
    status: client.status,
    createdByMe: client.createdByMe,
    totalTickets: client.totalTickets
  }));
}

export function prepareClientForEdit(client) {
  const { project, organization } = client;
  return {
    ...client,
    organization: {
      label: organization.organizationName,
      value: organization.organizationId
    },
    project: {
      label: project.projectName,
      value: project.projectId
    },
    serverIp: client.serverAddress,
    contractDueTo: dayjs(client.contractDueTo),
    notes: formatRichTextForUI(client.notes || formatRichTextForApi(EditorState.createEmpty())),
    encryptedNotes: formatRichTextForUI(
      client.encryptedNotes || formatRichTextForApi(EditorState.createEmpty())
    )
  };
}

export function prepareClientForView(client) {
  if (!client) {
    return {};
  }

  return {
    ...client,
    regDate: formatTimeForUI(client.regDate),
    tickets: client.tickets.reduce(
      (acc, cur) => ({
        ...acc,
        [cur.status]: [
          ...(acc?.[cur.status] || []),
          {
            ...cur,
            bugFixDate: formatTimeForUI(cur.bugFixDate),
            regDate: formatTimeForUI(cur.regDate)
          }
        ]
      }),
      {}
    )
  };
}
