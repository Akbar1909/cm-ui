import request from 'services/axios';

export function httpPostLogin(loginDto) {
  return request.post('/auth/signin', loginDto);
}
