import { useTranslation } from 'react-i18next';

const useTicketTypeOptions = () => {
  const { t } = useTranslation();
  return [
    { label: t('Task Done'), value: 'task_done' },
    { label: t('Bug Report'), value: 'bug_report' },
    { label: t('File Exchange'), value: 'file_exchange' },
    { label: t('Feature Request'), value: 'request' }
  ];
};

export default useTicketTypeOptions;
