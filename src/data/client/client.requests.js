import request from 'services/axios';

export function httpGetClients(params) {
  return request.get('/clients', { params });
}

export function httpGetClient(id) {
  return request.get(`/clients/${id}`);
}

export function httpPostClient(dto) {
  return request.post('/clients', dto);
}

export function httpPutClient({ id, dto }) {
  return request.put(`/clients/${id}`, dto);
}

export function httpDeleteClient(id) {
  return request.delete(`/clients/${id}`);
}

export function httpGetClientCounts(params) {
  return request.get('/dashboard/client-counts', { params });
}

export function httpGetClientCountsByContractDate() {
  return request.get('/clients/contract-due-to/count');
}

export function httpGetGroupedStatusIdCount(params) {
  return request.get('/clients/stats/statusId/count', { params });
}
