import { useQuery } from '@tanstack/react-query';
import { httpGetRoles } from 'data/role';
import { useMemo } from 'react';

const useRoles = () => {
  const { data = [], ...rest } = useQuery({
    queryKey: ['roles'],
    queryFn: httpGetRoles,
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
    roles: rest.data,
    rolesLoading: rest.isLoading,
    rolesError: rest.isError,
    options,
    ...rest
  };
};

export default useRoles;
