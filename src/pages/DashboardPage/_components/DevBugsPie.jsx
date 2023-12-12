import { useTranslation } from 'react-i18next';
import { createSearchParams, useNavigate } from 'react-router-dom';
import CardWrapper from './CardWrapper';
import { useQuery } from '@tanstack/react-query';
import { httpGetBugTicketsByDev } from 'data/ticket';
import Spinner from 'components/Spinner';
import PieChart from './PieChart';
import { joinArray } from 'utils/helpers';
import { getTaskTypeOptions } from 'utils/common';
import useUserStore from 'clientStore/useUserStore';

const DevBugsPie = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { project } = useUserStore();
  const projectId = project?.value;

  const { data, isLoading } = useQuery({
    queryKey: ['dev-bug-count', { projectId }],
    queryFn: () => httpGetBugTicketsByDev({ projectId }),
    select: (response) => response.data.data
  });

  const taskTypeOptions = getTaskTypeOptions(t);

  const validData = Array.isArray(data) ? data : [];
  const series = validData.map((item) => item.count);
  const labels = validData.map((item) => joinArray([item.firstName, item.lastName]));
  const ids = validData.map((item) => item.id);

  const handleClick = (id) => {
    const selectedItem = validData.find((item) => item.id === id);

    navigate({
      pathname: '/dashboard/tickets',
      search: `?${createSearchParams({
        devId: id,
        devName: joinArray([selectedItem.firstName, selectedItem.lastName]),
        from: 'app',
        statusId: 'bug_report',
        statusName: taskTypeOptions.bug_report
      })}`
    });
  };

  return (
    <CardWrapper title={t('Dev Bugs')}>
      <Spinner loading={isLoading}>
        <PieChart series={series} labels={labels} handleClick={handleClick} ids={ids} />
      </Spinner>
    </CardWrapper>
  );
};

export default DevBugsPie;
