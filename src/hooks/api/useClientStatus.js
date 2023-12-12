import { useQuery } from '@tanstack/react-query';
import { httpGetManyClientStatus } from 'data/clientStatus';
import { useMemo } from 'react';

const useClientStatus = ({ projectId }) => {
  const { data = [], ...rest } = useQuery({
    queryKey: ['client-status', { projectId }],
    queryFn: () => httpGetManyClientStatus({ projectId }),
    select: (response) => {
      if (response.data?.status !== 'success') {
        return [];
      }

      return response.data.data;
    }
  });

  const options = useMemo(
    () =>
      data.map((option) => ({
        label: option.name,
        value: option.id
      })),
    [data]
  );

  const getStatusName = (id) =>
    (options.find((option) => option.value === id).name || '').toLowercase();

  return {
    clientStatus: rest.data,
    clientStatusLoading: rest.isLoading,
    clientStatusError: rest.isError,
    clientStatusOptions: options,
    getStatusName,
    ...rest
  };
};

export default useClientStatus;
