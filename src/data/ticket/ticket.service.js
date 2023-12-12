import { formatTimeForApi, dayjs, formatTimeForUI, FULL_DATE_UI_FORMAT } from 'services/time';
import { formatRichTextForApi, formatRichTextForUI, joinArray } from 'utils/helpers';

export function prepareTicketDto(values, me) {
  return {
    name: values.name,
    organizationId: parseInt(values.organization?.value, 10),
    projectId: parseInt(values.project?.value, 10),
    status: values.status,
    regDate: formatTimeForApi(values.regDate),
    description: formatRichTextForApi(values.description),
    attachments: values.attachments.map((attachment) => attachment.id),
    telegramMessageId: 'test',
    ...(values.status === 'bug_report' && {
      bugFixDate: formatTimeForApi(values.bugFixDate),
      developerId: parseInt(values.developerId, 10),
      sideId: parseInt(values.sideId, 10),
      typeId: parseInt(values.typeId, 10)
    })
  };
}

export function prepareTicketDtoForEdit(ticket) {
  return {
    ...ticket,
    regDate: dayjs(ticket.regDate),
    description: formatRichTextForUI(ticket.description),
    bugFixDate: dayjs(ticket.bugFixDate),
    project: {
      label: ticket.project.projectName,
      value: ticket.project.projectId
    },
    organization: {
      label: ticket.organization.organizationName,
      value: ticket.organization.organizationId
    },
    developerId: ticket.developer?.id
  };
}

export function prepareTicketForView(ticket) {
  const { description, ...rest } = ticket;
  return {
    ...prepareTicketDtoForEdit(ticket),
    description
  };
}

export function prepareTicketRenderList(ticket) {
  return {
    ...ticket,
    id: ticket.id,
    i: ticket.i,
    name: ticket.name,
    regDate: formatTimeForUI(ticket.regDate, FULL_DATE_UI_FORMAT),
    type: ticket.status,
    side: ticket.side,
    module: ticket.type?.name,
    dev: joinArray([ticket.developer?.firstName, ticket.developer?.lastName]),
    bugFixDate: formatTimeForUI(ticket.bugFixDate, FULL_DATE_UI_FORMAT),
    createdByMe: ticket.createdByMe,
    hasAttachments: ticket.attachments.length > 0
  };
}
