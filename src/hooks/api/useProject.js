import { useQuery } from '@tanstack/react-query';
import { httpGetProjects } from 'data/project';
import { useMemo } from 'react';

const useProject = (organizationId) => {
  const { data = [], ...rest } = useQuery({
    queryKey: ['projects', { page: 1, size: 1000, organizationId }],
    queryFn: () => httpGetProjects({ select: 1, page: 1, size: 1000, organizationId }),
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
        label: option.projectName,
        value: option.projectId
      })),
    [data]
  );

  return {
    projectStatus: rest.data,
    projectLoading: rest.isLoading,
    projectError: rest.isError,
    projectOptions: options,
    ...rest
  };
};

export default useProject;
