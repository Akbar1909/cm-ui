import { useTranslation } from 'react-i18next';
import CardWrapper from './CardWrapper';
import { useQuery } from '@tanstack/react-query';
import { httpGetBugTicketsByModule } from 'data/ticket';
import Spinner from 'components/Spinner';
import PieChart from './PieChart';
import { useNavigate, createSearchParams } from 'react-router-dom';
import { getTaskTypeOptions } from 'utils/common';
import useUserStore from 'clientStore/useUserStore';

const ModuleBugsPie = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { project } = useUserStore();
  const { data, isLoading } = useQuery({
    queryKey: ['module-bug-count', { projectId: project?.value }],
    queryFn: () => httpGetBugTicketsByModule({ projectId: project?.value }),
    select: (response) => response.data.data
  });

  const taskTypeOptions = getTaskTypeOptions(t);

  const validData = Array.isArray(data) ? data : [];
  const series = validData.map((item) => item.count);
  const labels = validData.map((item) => item.name);
  const ids = validData.map((item) => item.id);

  const handleClick = (id) => {
    const selectedItem = validData.find((item) => item.id === id);

    navigate({
      pathname: '/dashboard/tickets',
      search: `?${createSearchParams({
        moduleId: id,
        moduleName: selectedItem.name,
        from: 'app',
        statusName: taskTypeOptions.bug_report,
        statusId: 'bug_report'
      })}`
    });
  };

  return (
    <CardWrapper title={t('Module Bugs')}>
      <Spinner loading={isLoading}>
        <PieChart series={series} labels={labels} handleClick={handleClick} ids={ids} />
      </Spinner>
    </CardWrapper>
  );
};

export default ModuleBugsPie;
