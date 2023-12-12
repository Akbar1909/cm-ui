import { useQuery } from '@tanstack/react-query';
import { httpGetOrganizationsByProjectId } from 'data/organization';
import { useMemo } from 'react';

const useOrganizationByProjectId = (projectId) => {
  const { data = [], ...rest } = useQuery({
    queryKey: ['organizations-by-product', { projectId }],
    queryFn: () => httpGetOrganizationsByProjectId({ projectId }),
    select: (response) => {
      if (response.data?.status !== 'success') {
        return [];
      }

      return response.data?.data;
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

export default useOrganizationByProjectId;
