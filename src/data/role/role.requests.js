import request from 'services/axios';

export function httpGetRoles() {
  return request.get('/roles');
}

export function httpPostRoles(body) {
  return request.post('/roles', body);
}

export function httpPutRoles({ id, ...rest }) {
  return request.put(`/roles/${id}`, rest);
}

export function httpDeleteRoles(id) {
  return request.delete(`/roles/${id}`);
}
