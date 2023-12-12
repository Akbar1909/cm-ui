import { useTranslation } from 'react-i18next';
import CardWrapper from './CardWrapper';
import { useQuery } from '@tanstack/react-query';
import { httpGetBugTicketsBySide } from 'data/ticket';
import Spinner from 'components/Spinner';
import PieChart from './PieChart';
import { useNavigate, createSearchParams } from 'react-router-dom';
import { getTaskTypeOptions } from 'utils/common';
import useUserStore from 'clientStore/useUserStore';

const SideBugsPie = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { project } = useUserStore();
  const projectId = project?.value;

  const { data, isLoading } = useQuery({
    queryKey: ['side-bug-count', { projectId }],
    queryFn: () => httpGetBugTicketsBySide({ projectId }),
    select: (response) => response.data.data
  });

  const validData = Array.isArray(data) ? data : [];

  const taskTypeOptions = getTaskTypeOptions(t);

  const series = validData.map((side) => side.count);
  const labels = validData.map((side) => side.name);
  const ids = validData.map((side) => side.id);

  const handleClick = (id) => {
    const index = ids.findIndex((idx) => idx === id);

    navigate({
      pathname: '/dashboard/tickets',
      search: `?${createSearchParams({
        sideId: id,
        sideName: labels[index],
        from: 'app',
        statusName: taskTypeOptions.bug_report,
        statusId: 'bug_report'
      })}`
    });
  };

  return (
    <CardWrapper title={t('Side Bugs')}>
      <Spinner loading={isLoading}>
        <PieChart series={series} labels={labels} ids={ids} handleClick={handleClick} />
      </Spinner>
    </CardWrapper>
  );
};

export default SideBugsPie;
