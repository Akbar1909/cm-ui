import { useQuery } from '@tanstack/react-query';
import { httpGetManyTicketSide } from 'data/ticketSide';

const useTicketSide = (projectId) => {
  const { data } = useQuery({
    queryKey: ['ticket-side', { projectId }],
    queryFn: () => httpGetManyTicketSide({ projectId }),
    select: (response) => response.data?.data
  });

  const options = (Array.isArray(data) ? data : []).map((item) => ({
    label: item.name,
    value: item.id
  }));

  return {
    ticketSideOptions: options
  };
};

export default useTicketSide;
