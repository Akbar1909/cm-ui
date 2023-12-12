import { useQuery } from '@tanstack/react-query';
import useUserStore from 'clientStore/useUserStore';
import { httpGetClients } from 'data/client';
import { useMemo } from 'react';

const useClient = ({ enabled = true, ...args }) => {
  const { project } = useUserStore();

  const { data = [], ...rest } = useQuery({
    queryKey: ['clients'],
    queryFn: () =>
      httpGetClients({
        select: 1,
        page: 1,
        size: 1000,
        projectId: args?.projectId || project?.value
      }),
    select: (response) => {
      if (response.data?.status !== 'success') {
        return [];
      }

      return response.data.data?.list;
    },
    enabled
  });

  const options = useMemo(
    () =>
      data.map((option) => ({
        label: option.name,
        value: option.id,
        ...option
      })),
    [data]
  );

  return {
    clientStatus: rest.data,
    clientLoading: rest.isLoading,
    clientStatusError: rest.isError,
    clientOptions: options,
    ...rest
  };
};

export default useClient;
