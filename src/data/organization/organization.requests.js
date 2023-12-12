import request from 'services/axios';

export function httpGetOrganizations({ page, size }) {
  return request.get('/organizations', { params: { page, size } });
}

export function httpGetOrganization(id) {
  return request.get(`/organizations/${id}`);
}

export function httpPostOrganization(dto) {
  return request.post('/organizations', dto);
}

export function httpPatchOrganization({ id, ...dto }) {
  return request.patch(`/organizations/${id}`, dto);
}

export function httpDeleteOrganization(id) {
  return request.delete(`/organizations/${id}`);
}

export function httpGetOrganizationsByProjectId(params) {
  return request.get('/organizations/by-project', { params });
}
