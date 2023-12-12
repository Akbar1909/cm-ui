import { useQuery } from '@tanstack/react-query';
import { httpGetOrganizations } from 'data/organization';
import { useMemo } from 'react';

const useOrganization = () => {
  const { data = [], ...rest } = useQuery({
    queryKey: ['organizations', { page: 1, size: 1000 }],
    queryFn: () => httpGetOrganizations({ select: 1, page: 1, size: 1000 }),
    select: (response) => {
      if (response.data?.status !== 'success') {
        return [];
      }

      return response.data.data?.list;
    }
  });

  const options = useMemo(
    () =>
      data.map((option) => ({
        label: option.organizationName,
        value: option.organizationId
      })),
    [data]
  );

  return {
    organizationStatus: rest.data,
    organizationLoading: rest.isLoading,
    organizationError: rest.isError,
    organizationOptions: options,
    ...rest
  };
};

export default useOrganization;
