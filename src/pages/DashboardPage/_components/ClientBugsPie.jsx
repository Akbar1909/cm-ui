import { useTranslation } from 'react-i18next';
import CardWrapper from './CardWrapper';
import { useQuery } from '@tanstack/react-query';
import { httpGetBugTicketsByClient } from 'data/ticket';
import Spinner from 'components/Spinner';
import PieChart from './PieChart';
import { createSearchParams, useNavigate } from 'react-router-dom';
import { getTaskTypeOptions } from 'utils/common';
import useUserStore from 'clientStore/useUserStore';

const ClientBugsPie = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { project } = useUserStore();

  const { data, isLoading } = useQuery({
    queryKey: ['clients-bug-count', { projectId: project?.value }],
    queryFn: () => httpGetBugTicketsByClient({ projectId: project?.value }),
    select: (response) => response.data.data
  });

  const taskTypeOptions = getTaskTypeOptions(t);

  const validData = Array.isArray(data) ? data : [];
  const series = validData.map((item) => item.count);
  const labels = validData.map((item) => item.name);
  const ids = validData.map((item) => item.organizationId);

  const handleClick = (id) => {
    const selectedItem = validData.find((item) => item.organizationId === id);
    navigate({
      pathname: '/dashboard/tickets',
      search: `?${createSearchParams({
        organizationId: id,
        organizationName: selectedItem.name,
        from: 'app',
        statusId: 'bug_report',
        statusName: taskTypeOptions.bug_report
      })}`
    });
  };

  return (
    <CardWrapper title={t('Client Bugs')}>
      <Spinner loading={isLoading}>
        <PieChart series={series} labels={labels} ids={ids} handleClick={handleClick} />
      </Spinner>
    </CardWrapper>
  );
};

export default ClientBugsPie;
