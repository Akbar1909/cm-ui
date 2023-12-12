import { useQuery } from '@tanstack/react-query';
import { httpGetPartiallyUsers } from 'data/user';
import { useMemo } from 'react';

const useUsers = (projectId) => {
  const { data = [], ...rest } = useQuery({
    queryKey: ['partially-users', { projectId }],
    queryFn: httpGetPartiallyUsers,
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
        label: `${option.firstName} ${option.lastName}`,
        value: option.id
      })),
    [data]
  );

  return {
    usersStatus: rest.data,
    usersLoading: rest.isLoading,
    usersError: rest.isError,
    usersOptions: options,
    ...rest
  };
};

export default useUsers;
