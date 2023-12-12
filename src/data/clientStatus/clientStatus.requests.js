import request from 'services/axios';

export function httpGetManyClientStatus(params) {
  return request.get('/client-status', { params });
}

export function httpPostClientStatus(dto) {
  return request.post('/client-status', dto);
}

export function httpPutClientStatus({ id, ...dto }) {
  return request.put(`/client-status/${id}`, dto);
}

export function httpDeleteClientStatus(id) {
  return request.delete(`/client-status/${id}`);
}
