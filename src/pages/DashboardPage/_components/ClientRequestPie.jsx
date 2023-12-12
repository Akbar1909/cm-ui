import { useTranslation } from 'react-i18next';
import CardWrapper from './CardWrapper';
import { useQuery } from '@tanstack/react-query';
import { httpGetRequestTicketsByClient } from 'data/ticket';
import Spinner from 'components/Spinner';
import PieChart from './PieChart';
import { useNavigate, createSearchParams } from 'react-router-dom';
import useUserStore from 'clientStore/useUserStore';

const ClientRequestPie = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { project } = useUserStore();

  const projectId = project?.value;

  const { data, isLoading } = useQuery({
    queryKey: ['client-request-count', { projectId }],
    queryFn: () => httpGetRequestTicketsByClient({ projectId }),
    select: (response) => response.data.data
  });

  const validData = Array.isArray(data) ? data : [];
  const series = validData.map((item) => item.count);
  const labels = validData.map((item) => item.name);
  const ids = validData.map((item) => item.id);

  const handleClick = (id) => {
    const selectedItem = validData.find((item) => item.id === id);

    navigate({
      pathname: '/dashboard/tickets',
      search: `?${createSearchParams({
        clientId: selectedItem.id,
        clientName: selectedItem.name,
        statusId: 'request',
        statusName: 'Feature Request',
        from: 'app'
      })}`
    });
  };

  return (
    <CardWrapper title={t('Client Requests')}>
      <Spinner loading={isLoading}>
        <PieChart series={series} labels={labels} handleClick={handleClick} ids={ids} />
      </Spinner>
    </CardWrapper>
  );
};

export default ClientRequestPie;
