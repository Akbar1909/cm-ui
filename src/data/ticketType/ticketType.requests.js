import request from 'services/axios';

export function httpGetTicketTypes(params) {
  return request.get('/ticket-type', { params });
}

export function httpPostTicketType(dto) {
  return request.post('/ticket-type', dto);
}

export function httpPutTicketType({ id, ...dto }) {
  return request.put(`/ticket-type/${id}`, dto);
}

export function httpDeleteTicketType(id) {
  return request.delete(`/ticket-type/${id}`);
}
