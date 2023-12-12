import request from 'services/axios';

export function httpGetUsers(params) {
  return request.get('/users', { params });
}

export function httpGetPartiallyUsers(params) {
  return request.get('/users/options', { params });
}

export function httpGetUser(id) {
  return request.get(`/users/${id}`);
}

export function httpGetMe() {
  return request.get('/users/me');
}

export function httpPostUser(dto) {
  return request.post('/users', dto);
}

export function httpPutUser({ id, dto }) {
  return request({ method: 'PUT', data: dto, url: `/users/${id}` });
}

export function httpPatchUserRole(id, role) {
  return request.patch(`/users/${id}`, { role });
}

export function httpDeleteUser(id) {
  return request.delete(`/users/${id}`);
}
