import { useQuery } from '@tanstack/react-query';
import { httpGetTicketTypes } from 'data/ticketType';
import { useMemo } from 'react';

const useTicketType = (projectId) => {
  const { data = [], ...rest } = useQuery({
    queryKey: ['ticket-types', { projectId }],
    queryFn: () => httpGetTicketTypes({ projectId }),
    select: (response) => {
      if (response.data?.status !== 'success') {
        return [];
      }

      return response.data.data;
    }
  });

  const options = useMemo(
    () => data.map((option) => ({ label: option.name, value: option.id })),
    [data]
  );

  return {
    ticketTypes: rest.data,
    ticketTypesLoading: rest.isLoading,
    ticketTypesError: rest.isError,
    ticketOptions: options,
    ...rest
  };
};

export default useTicketType;
