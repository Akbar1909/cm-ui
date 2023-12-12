import request from 'services/axios';

export function httpGetProjects({ page, size }) {
  return request.get('/projects', { params: { page, size } });
}

export function httpGetProject(id) {
  return request.get(`/projects/${id}`);
}

export function httpPostProject(dto) {
  return request.post('/projects', dto);
}

export function httpPatchProject({ id, ...dto }) {
  return request.patch(`/projects/${id}`, dto);
}

export function httpDeleteProject(id) {
  return request.delete(`/projects/${id}`);
}
