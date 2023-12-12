import request from 'services/axios';

export function httpGetTickets(params) {
  return request.get('/tickets', { params });
}

export function httpGetTicketStatsByStatus(params) {
  return request.get('/tickets/stats/status', { params });
}

export function httpGetTicketStatsByDev(params) {
  return request.get('/tickets/stats/dev', { params });
}

export function httpGetTicketStatsByClient(params) {
  return request.get('/tickets/stats/client', { params });
}

export function httpGetTicketStatsBySide(params) {
  return request.get('/tickets/stats/side', { params });
}

export function httpGetTicketStatsByModule(params) {
  return request.get('/tickets/stats/module', { params });
}

export function httpGetTicketStatsByType(clientId) {
  return request.get('/tickets/stats/type', { params: { clientId } });
}

export function httpGetTicketById(id) {
  return request.get(`/tickets/${id}`);
}

export function httpPostTicket(body) {
  return request.post('/tickets', body);
}

export function httpPutTicket({ id, dto: body }) {
  return request.put(`/tickets/${id}`, body);
}

export function httpDeleteTicket(id) {
  return request.delete(`/tickets/${id}`);
}

export function httpGetBugTicketCountsBySide(params) {
  return request.get('/tickets/stats/bug_report/side/count', { params });
}

export function httpGetBugTicketCountsByOrganization(params) {
  return request.get('/tickets/stats/organization', { params });
}

export function httpGetBugTicketCount(params) {
  return request.get('/tickets/stats/bug_report/count', { params });
}

export function httpGetBugTicketsByDate(params) {
  return request.get('/tickets/stats/bug_report/date-interval/count', {
    params
  });
}

export function httpGetBugTicketsByClient(params) {
  return request.get('/tickets/stats/bug_report/client/count', { params });
}

export function httpGetBugTicketsByModule(params) {
  return request.get('/tickets/stats/bug_report/module/count', { params });
}

export function httpGetBugTicketsByDev(params) {
  return request.get('/tickets/stats/bug_report/dev/count', { params });
}

export function httpGetBugTicketsByOperator(params) {
  return request.get('/tickets/stats/bug_report/operator/count', { params });
}

export function httpGetBugTicketsBySide(params) {
  return request.get('/tickets/stats/bug_report/side/count', { params });
}

export function httpGetRequestTicketsByClient(params) {
  return request.get('/tickets/stats/request/client/count', { params });
}
