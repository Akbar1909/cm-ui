import dayjs from './config';
import { DATE_UI_FORMAT } from './time.constants';

export function formatTimeForUI(date, format = DATE_UI_FORMAT) {
  if (!date) {
    return '';
  }

  return dayjs(date).format(format);
}

export function formatTimeForApi(date) {
  if (!date) {
    return;
  }

  return dayjs(date).utc(true);
}

export function getOffset() {
  return Math.abs(new Date().getTimezoneOffset());
}

export function formatDate(date, format = 'YYYY-MM-DD') {
  if (!date) {
    return;
  }

  return dayjs(date)
    .subtract(parseInt(getOffset() / 60, 10), 'hour')
    .format(format);
}
