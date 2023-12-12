import { useTranslation } from 'react-i18next';
import CardWrapper from './CardWrapper';
import { useQuery } from '@tanstack/react-query';
import { httpGetBugTicketsByOperator } from 'data/ticket';
import Spinner from 'components/Spinner';
import PieChart from './PieChart';
import { joinArray } from 'utils/helpers';
import useUserStore from 'clientStore/useUserStore';

const OperatorBugsPie = () => {
  const { t } = useTranslation();
  const { project } = useUserStore();
  const projectId = project?.value;
  const { data, isLoading } = useQuery({
    queryKey: ['operator-bug-count', { projectId }],
    queryFn: () => httpGetBugTicketsByOperator({ projectId }),
    select: (response) => response.data.data
  });

  const validData = Array.isArray(data) ? data : [];
  const series = validData.map((item) => item.count);
  const labels = validData.map((item) => joinArray([item.firstName, item.lastName]));

  return (
    <CardWrapper title={t('Operator Bugs')}>
      <Spinner loading={isLoading}>
        <PieChart series={series} labels={labels} />
      </Spinner>
    </CardWrapper>
  );
};

export default OperatorBugsPie;
