import {
  faSquareCheck,
  faBug,
  faFileLines,
  faCommentDots
} from '@fortawesome/free-solid-svg-icons';

const getTaskTypeOptions = (t) => {
  return {
    request: t('Feature Request'),
    task_done: t('Task Done'),
    bug_report: t('Bug Report'),
    file_exchange: t('File Exchange')
  };
};

const getTaskSideLabels = (t) => {
  return {
    front_side: t('Front Side'),
    back_side: t('Back Side'),
    agent_side: t('Agent Side')
  };
};

const TICKET_TYPE_ICONS = {
  task_done: faSquareCheck,
  bug_report: faBug,
  file_exchange: faFileLines,
  request: faCommentDots
};

export { getTaskTypeOptions, getTaskSideLabels, TICKET_TYPE_ICONS };
