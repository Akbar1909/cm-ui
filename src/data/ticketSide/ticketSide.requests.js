import request from 'services/axios';

export function httpGetManyTicketSide({ projectId }) {
  return request.get('/ticket-side', { params: { projectId } });
}

export function httpPostTicketSide(dto) {
  return request.post('/ticket-side', dto);
}

export function httpPatchTicketSide({ id, ...dto }) {
  return request.patch(`/ticket-side/${id}`, dto);
}

export function httpDeleteTicketSide(id) {
  return request.delete(`/ticket-side/${id}`);
}
