import { getTicketPrimaryColor } from 'utils/helpers';

const badgeStyles = {
  root: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    px: '6px',
    py: '4px',
    minWidth: '30px',
    minHeight: '20px',
    borderRadius: '4px',
    color: (theme) => theme.palette.common.white
  },
  success: {
    backgroundColor: getTicketPrimaryColor('task_done')
  },
  error: {
    backgroundColor: getTicketPrimaryColor('bug_report')
  },
  warning: {
    backgroundColor: getTicketPrimaryColor('request')
  },
  idle: {
    backgroundColor: getTicketPrimaryColor('file_exchange')
  }
};

export default badgeStyles;
